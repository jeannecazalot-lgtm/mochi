// ═══════════════════════════════════════════════════════════════════
// horizon.js — les tâches se RECONDUISENT toutes seules (retour Ketley 12 sept 2026 :
// « vérifier que la tâche sera automatiquement ajoutée la semaine suivante »). Jusqu'ici les
// occurrences n'étaient posées que pour 7 jours au setup ou à la création ; passé ce cap, le
// Planning se vidait. Ici, à chaque changement de jour et à chaque retour au premier plan,
// chaque tâche vivante reçoit ses occurrences manquantes jusqu'à J+6 :
//   · jours cochés (window_days) → ces jours-là ; sinon quotidienne → tous les jours ;
//     sinon on reprend le motif des 14 derniers jours (mêmes jours de semaine) ; mensuelle →
//     28 jours après la dernière ;
//   · porteur : règle fixée → cette personne ; alternance → l'inverse de la dernière ;
//     « Mochi décide » → la personne la moins chargée sur la semaine (jamais « à deux » :
//     retour Ketley, « ça devrait être assigné à une personne »).
// Idempotent : jamais deux occurrences (tâche, jour, kind) — et la base a la même contrainte.
// ═══════════════════════════════════════════════════════════════════
import { read, mutate, uuid } from './store';
import { getUid, getPartnerUid } from './identity';
import { localIso, addDaysIso } from './dates';
import { occStore } from './demo-core';
import { rescheduleReminders } from './reminders';
import { isPremium } from './demo-premium';

const PER_WEEK = { daily: 7, twiceWeek: 2, weekly: 1, monthly: 1, once: 0 };
import { dowOf, daysBetween, planWeekEnd } from './week';

// la personne la moins chargée sur la fenêtre (minutes des occurrences à faire)
export function lighterMember(occs, tasks, uid, puid, from = localIso(), to = addDaysIso(6)) {
  if (!puid) return uid;
  const byTask = Object.fromEntries(tasks.map(t => [t.id, t]));
  const load = { [uid]: 0, [puid]: 0 };
  for (const o of occs) {
    if (o.status === 'skipped' || o.due_date < from || o.due_date > to || !o.assignee_id || !(o.assignee_id in load)) continue;
    load[o.assignee_id] += byTask[o.task_id]?.duration_min || 15;
  }
  return load[puid] < load[uid] ? puid : uid;
}

let lastRun = 0;
// Mochi+ (Jeanne, 10 nov 2026) : « en gratuit on repart de zéro chaque semaine, en payant tout est pré-rempli ».
// Sans Mochi+, rien ne se reconduit tout seul : le foyer relance sa semaine depuis l'écran Semaine (`manual`, `only`).
// `from` / `to` : fenêtre en jours depuis aujourd'hui (par défaut J+1 → J+7, Mochi+ en continu) ; le gratuit
// relance une semaine calendaire (src/week.js : lundi → dimanche), la création du foyer pose sa semaine de rodage.
export async function extendHorizon({ force = false, manual = false, only = null, from = 1, to = null } = {}) {
  const uid = getUid();
  if (!uid) return 0;
  if (!manual && !isPremium()) return 0;
  if (!force && !manual && Date.now() - lastRun < 30 * 60 * 1000) return 0; // au plus toutes les 30 min
  lastRun = Date.now();
  const puid = getPartnerUid() || null;
  const [tasks, occs] = await Promise.all([read('tasks'), read('occurrences')]);
  const today = localIso();
  const last = Math.max(from, to ? daysBetween(today, to) : 7);
  const ks = []; for (let k = from; k <= last; k++) ks.push(k);
  let created = 0;
  for (const task of tasks) {
    if (task.deleted_at || task.archived_at || task.active === false || !task.household_id) continue;
    if (only && !only.includes(task.id)) continue;
    const mine = occs.filter(o => o.task_id === task.id && o.status !== 'skipped').sort((a, b) => a.due_date.localeCompare(b.due_date));
    const kind = task.mental_load ? 'plan' : 'exec';
    const has = iso => mine.some(o => o.due_date === iso && o.kind === kind);
    const days = task.window_days || [];
    const freq = task.frequency || 'weekly';
    if (freq === 'once') continue;
    // jours voulus sur la fenêtre J+1 → J+7 : jamais aujourd'hui (9 nov 2026 : juste après la répartition, Cuisiner /
    // Vaisselle / Lessive apparaissaient pour le jour même, donc « en retard » le soir — l'occurrence du jour existe déjà
    // puisque la passe de la veille couvrait jusqu'à J+7)
    const wanted = [];
    if (days.length) {
      for (const k of ks) { const iso = addDaysIso(k); if (days.includes(dowOf(iso))) wanted.push(iso); }
    } else if (freq === 'daily') {
      for (const k of ks) wanted.push(addDaysIso(k));
    } else if (freq === 'monthly') {
      const last = mine.filter(o => o.due_date < today).slice(-1)[0];
      if (last) { const next = addDaysIso(28, new Date(last.due_date + 'T12:00:00')); if (next >= addDaysIso(from) && next <= addDaysIso(last)) wanted.push(next); }
    } else {
      // motif des 14 derniers jours (jours de semaine) ; sans historique, on garde l'espacement des dernières occurrences
      const recent = mine.filter(o => o.due_date >= addDaysIso(-14) && o.due_date < today);
      const dows = [...new Set(recent.map(o => dowOf(o.due_date)))];
      const perWeek = PER_WEEK[freq] || 1;
      const pattern = dows.length ? dows.slice(-perWeek) : [...new Set(mine.slice(-perWeek).map(o => dowOf(o.due_date)))];
      if (!pattern.length) continue; // tâche sans aucune occurrence : rien à reconduire
      for (const k of ks) { const iso = addDaysIso(k); if (pattern.includes(dowOf(iso))) wanted.push(iso); }
    }
    for (const iso of wanted) {
      if (has(iso)) continue;
      // porteur
      let assignee = null;
      if (task.assign_mode === 'fixed') assignee = task.fixed_assignee || uid;
      else if (task.assign_mode === 'alternate') {
        const prev = [...mine, ...occs.filter(o => o.task_id === task.id && o.due_date < iso && !mine.includes(o))].filter(o => o.due_date < iso && o.assignee_id).sort((a, b) => a.due_date.localeCompare(b.due_date)).slice(-1)[0];
        assignee = prev ? (prev.assignee_id === uid ? puid || uid : uid) : uid;
      } else assignee = lighterMember([...occs, ...mine], tasks, uid, puid);
      const row = { id: uuid(), household_id: task.household_id, task_id: task.id, kind, due_date: iso, assignee_id: assignee, status: 'pending' };
      await mutate('occurrences', row);
      mine.push(row); occs.push(row); created++;
    }
  }
  if (created) { occStore.bump(); rescheduleReminders(); }
  return created;
}

// semaine à relancer ? (gratuit) : le dimanche, rien n'est prévu pour la semaine qui vient ; les autres jours,
// plus rien n'est prévu à partir de demain (dimanche manqué)
export async function weekNeedsRestart() {
  const occs = await read('occurrences'); const live = o => o.status !== 'skipped';
  if (dowOf(localIso()) === 6) { const a = addDaysIso(1), b = addDaysIso(7); return !occs.some(o => live(o) && o.due_date >= a && o.due_date <= b); }
  const tomorrow = addDaysIso(1);
  return !occs.some(o => live(o) && o.due_date >= tomorrow);
}
// la fenêtre de la relance gratuite : le dimanche → toute la semaine suivante ; sinon → d'aujourd'hui à dimanche
export const restartWindow = () => ({ from: dowOf(localIso()) === 6 ? 1 : 0, to: planWeekEnd() });
// les missions qu'on peut relancer : tâches vivantes du foyer (hors « une fois »)
export async function restartableTasks() {
  const tasks = await read('tasks');
  return tasks.filter(t => !t.deleted_at && !t.archived_at && t.active !== false && t.household_id && t.frequency !== 'once');
}
