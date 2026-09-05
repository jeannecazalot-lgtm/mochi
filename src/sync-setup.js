// ═══════════════════════════════════════════════════════════════════
// Synchro du setup vers Supabase — appelée au « C'est parti » du 12.
// Crée (ou retrouve) le foyer, pousse dispos, tâches, pénibilités perso
// et occurrences de la semaine via la file offline-first de store.js
// (rien ne bloque le parcours si le réseau manque : rejoué au retour).
//
// Le binôme SIMULÉ (Julian de la démo) n'est jamais envoyé : en ligne le
// foyer reste à 1 membre en attendant la vraie invitation (écran 09) ;
// ses tâches partent avec assignee_id null (= commun / non tranché).
//
// Fréquence : l'enum `frequency` de la table ne connaît pas « n×/sem »
// — la cadence réelle vit dans les occurrences générées (≥5/sem → daily,
// sinon weekly, question de modèle ouverte dans TODO.md).
// ═══════════════════════════════════════════════════════════════════
import { supabase } from './supabase';
import { ensureSession } from './profile';
import { uuid, mutate, drain, resetLocal, read } from './store';
import { setup, saveRealTaskIds, saveHouseholdId } from './setup-state';
import { placeDays } from './dispatch';
import { localIso, addDaysIso } from './dates';
import { me, partner } from './demo';
import { getPartnerUid } from './identity';

const DAY = 86400000;

// grille de dispos du binôme (household_members) — null si inconnu / hors ligne
async function partnerAvailability(householdId, uid) {
  try {
    const { data } = await supabase.from('household_members').select('availability').eq('household_id', householdId).neq('user_id', uid).maybeSingle();
    return data?.availability || null;
  } catch (e) { return null; }
}
// deux grilles additionnées (tâches en alternance / en commun)
const mergeAvail = (a, b) => {
  if (!a) return b; if (!b) return a;
  const sum = (x = [], y = []) => Array.from({ length: 7 }, (_, i) => (x[i] || 0) + (y[i] || 0));
  return { morning: sum(a.morning, b.morning), evening: sum(a.evening, b.evening) };
};

// Celui qui a REJOINT le foyer (décision Jeanne 5 sept 2026) : après 06 → 07 → 08,
// ses dispos/temps partent sur sa ligne membre et ses préférences (aimées/détestées)
// deviennent des pénibilités perso sur les tâches EXISTANTES du foyer (par catalog_key).
export async function syncJoinerPrefs() {
  const session = await ensureSession();
  const uid = session.user.id;
  const householdId = setup.householdId;
  if (!householdId) return false;
  await mutate('household_members', {
    household_id: householdId, user_id: uid,
    availability: setup.availability || {}, weekly_minutes: setup.weekly_minutes || 300,
  });
  const tasks = await read('tasks');
  for (const tk of tasks) {
    const pref = tk.catalog_key ? setup.prefs?.[tk.catalog_key] : null;
    if (!pref) continue;
    const base = (setup.tasks || []).find(x => x.id === tk.catalog_key)?.pain ?? 2;
    const pain = Math.min(5, Math.max(1, base + (pref === 'hate' ? 1 : -1)));
    await mutate('task_pains', { task_id: tk.id, user_id: uid, pain });
  }
  return drain();
}


export async function syncSetup(result) {
  const session = await ensureSession();
  const uid = session.user.id;

  // un seul foyer par personne : on retrouve le sien, sinon on le crée
  const { data: mine } = await supabase.from('household_members').select('household_id').eq('user_id', uid).maybeSingle();
  const householdId = mine?.household_id || uuid();
  saveHouseholdId(householdId);
  if (!mine) await mutate('households', { id: householdId, created_by: uid });
  // déjà membre (foyer rejoint) : on met à jour dispos/temps SANS toucher au slot —
  // forcer slot 1 entrait en conflit avec le créateur et bloquait toute la file
  // (bot + simulateur, 5 sept 2026 : « C'est parti » du rejoignant n'écrivait rien)
  await mutate('household_members', {
    household_id: householdId, user_id: uid, ...(mine ? {} : { slot: 1 }),
    availability: setup.availability || {}, weekly_minutes: setup.weekly_minutes || 300,
  });

  // tâches du foyer + pénibilité perso (08 : aimée = pain − 1, détestée = pain + 1)
  // ids stables entre deux synchros : rejouer « C'est parti » met à jour au lieu de dupliquer
  const realId = { ...(setup.realTaskIds || {}) };
  for (const t of setup.tasks || []) {
    const id = realId[t.id] || uuid();
    realId[t.id] = id;
    await mutate('tasks', {
      id, household_id: householdId, title: t.label, emoji: t.emoji || '•',
      catalog_key: String(t.id).startsWith('custom-') ? null : t.id,
      frequency: t.per_week >= 5 ? 'daily' : 'weekly',
      duration_min: t.duration_min || 15, mental_load: !!t.mental_load,
      divisible: !!t.divisible, created_by: uid,
    });
    const pref = setup.prefs?.[t.id];
    if (pref) {
      const pain = Math.min(5, Math.max(1, (t.pain ?? 2) + (pref === 'hate' ? 1 : -1)));
      await mutate('task_pains', { task_id: id, user_id: uid, pain });
    }
  }

  saveRealTaskIds(realId);

  // occurrences de la semaine à venir : jours choisis selon la grille dispos du 07
  // (retour Jeanne, 1er sept 2026 — « courses le jeudi, pas aujourd'hui »), porteur
  // 'alt' = alternance stricte en zigzag. Cache local remis à zéro d'abord :
  // rejouer « C'est parti » régénère la semaine au lieu d'empiler (côté serveur,
  // unique(task_id, due_date, kind) dédoublonne).
  const todayDow = (new Date().getDay() + 6) % 7; // lundi = 0
  await resetLocal('occurrences');
  // les tâches du binôme suivent SES dispos, celles en alternance/commun les deux
  // grilles additionnées ; sans grille, un décalage par tâche évite que tout tombe
  // aujourd'hui (retour Jeanne 5 sept, « il faudrait créer les dispos en amont »)
  const pAvail = getPartnerUid() ? await partnerAvailability(householdId, uid) : null;
  let seed = 0;
  for (const it of result?.items || []) {
    const t = (setup.tasks || []).find(x => x.id === it.task_id);
    if (!t) continue;
    const perWeek = t.per_week ? Math.round(it.weekly_min / (t.duration_min || 15)) : 1;
    const avail = it.assignee_id === partner.id ? (pAvail || setup.availability)
      : it.assignee_id === me.id ? setup.availability
      : mergeAvail(setup.availability, pAvail);
    const offsets = placeDays(perWeek, avail, todayDow, seed++);
    for (let k = 0; k < offsets.length; k++) {
      // moi → uid réel ; binôme → son uid RÉEL s'il a rejoint (bot couple, 4 sept
      // 2026 : ses tâches partaient en « commun ») sinon null ; 'both' → null ;
      // 'alt' → zigzag : une occurrence sur deux à moi, l'autre au binôme
      const partnerUid = getPartnerUid() || null;
      const assignee = it.assignee_id === me.id ? uid
        : it.assignee_id === partner.id ? partnerUid
        : it.assignee_id === 'alt' ? (k % 2 === 0 ? uid : partnerUid)
        : null;
      await mutate('occurrences', {
        id: uuid(), household_id: householdId, task_id: realId[t.id],
        kind: t.mental_load ? 'plan' : 'exec', due_date: addDaysIso(offsets[k]),
        assignee_id: assignee,
      });
    }
  }

  const ok = await drain();
  if (!ok) console.warn('[sync] file non vidée — rejouée au retour réseau');
  return householdId;
}
