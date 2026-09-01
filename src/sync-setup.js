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
import { uuid, mutate, drain, resetLocal } from './store';
import { setup, saveRealTaskIds } from './setup-state';
import { placeDays } from './dispatch';
import { localIso, addDaysIso } from './dates';
import { me } from './demo';

const DAY = 86400000;


export async function syncSetup(result) {
  const session = await ensureSession();
  const uid = session.user.id;

  // un seul foyer par personne : on retrouve le sien, sinon on le crée
  const { data: mine } = await supabase.from('household_members').select('household_id').eq('user_id', uid).maybeSingle();
  const householdId = mine?.household_id || uuid();
  if (!mine) await mutate('households', { id: householdId, created_by: uid });
  await mutate('household_members', {
    household_id: householdId, user_id: uid, slot: 1,
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
  for (const it of result?.items || []) {
    const t = (setup.tasks || []).find(x => x.id === it.task_id);
    if (!t) continue;
    const perWeek = t.per_week ? Math.round(it.weekly_min / (t.duration_min || 15)) : 1;
    const offsets = placeDays(perWeek, setup.availability, todayDow);
    for (let k = 0; k < offsets.length; k++) {
      // moi → uid réel ; binôme simulé / 'both' → null (commun) ;
      // 'alt' → zigzag : une occurrence sur deux à moi, l'autre au binôme
      const assignee = it.assignee_id === me.id ? uid
        : it.assignee_id === 'alt' ? (k % 2 === 0 ? uid : null)
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
