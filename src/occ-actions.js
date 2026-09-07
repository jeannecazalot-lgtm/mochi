// ═══════════════════════════════════════════════════════════════════
// Actions sur les occurrences RÉELLES (cache local + file Supabase).
// Utilisé par la sheet Mission (« Déplacer ») ; l'Accueil/Planning se
// re-rendent via occStore.bump().
// ═══════════════════════════════════════════════════════════════════
import { read, mutate } from './store';
import { occStore } from './demo-core';
import { rescheduleReminders } from './reminders';
import { getUid, getPartnerUid } from './identity';
import { uuid } from './store';
import { addDaysIso, localIso } from './dates';
import { logActivity } from './activity-actions';
import copy from './data/copy.json';

const dayLabelOf = iso => (iso === localIso() ? copy.mission.metaToday : copy.calendar.dowsLong[(new Date(iso + 'T12:00:00').getDay() + 6) % 7].toLowerCase());

// une occurrence « skipped » a été retirée par une règle (jours changés) : invisible partout,
// mais la ligne reste en base pour que l'autre appareil la voie disparaître (pas de delete)
export const isLive = o => o.status !== 'skipped';

// valide / dévalide une occurrence : statut + copie figée (minutes réelles,
// mental, qui) — c'est CETTE copie que la Balance réelle lit (SPECS §3)
export async function toggleOccurrence(occId, done, minutes) {
  const occs = await read('occurrences');
  const row = occs.find(o => o.id === occId);
  if (!row) return false; // occurrence de démo
  const tasks = await read('tasks');
  const tk = tasks.find(x => x.id === row.task_id);
  const pains = await read('task_pains');
  const mine = pains.find(p => p.task_id === row.task_id && p.user_id === getUid()); // MA pénibilité, pas celle du binôme
  await mutate('occurrences', done
    ? { ...row, status: 'done', done_at: new Date().toISOString(), done_by: getUid(), duration_min: minutes || tk?.duration_min || 15, pain: mine?.pain ?? 3, mental_load: !!tk?.mental_load }
    : { ...row, status: 'pending', done_at: null, done_by: null, duration_min: null, pain: null, mental_load: null });
  occStore.bump();
  return true;
}

// déplace une occurrence à une autre date ; refuse si la même tâche a déjà
// une occurrence ce jour-là (contrainte unique task/date/kind en base)
export async function moveOccurrence(occId, dueIso) {
  const occs = await read('occurrences');
  const row = occs.find(o => o.id === occId);
  if (!row) return { ok: false, reason: 'introuvable' }; // occurrence de démo : rien à déplacer
  if (occs.some(o => o.id !== occId && o.task_id === row.task_id && o.due_date === dueIso && o.kind === row.kind)) {
    return { ok: false, reason: 'doublon' };
  }
  // une tâche ratée qu'on décale redevient « à faire » (vu à l'écran 5 sept : elle
  // restait 'missed' à sa nouvelle date, donc jamais en retard ni re-balayée)
  await mutate('occurrences', { ...row, due_date: dueIso, status: row.status === 'missed' ? 'pending' : row.status });
  occStore.bump();
  rescheduleReminders(); // les rappels suivent la tâche déplacée (tâche de fond)
  return { ok: true };
}

// « Je m'en occupe » (retour Jeanne 7 sept 2026) : la tâche de l'autre passe sur moi, tout de suite
export async function takeOver(occId) {
  const occs = await read('occurrences');
  const row = occs.find(o => o.id === occId);
  const uid = getUid();
  if (!row || !uid) return false;
  await mutate('occurrences', { ...row, assignee_id: uid });
  const tasks = await read('tasks');
  const tk = tasks.find(x => x.id === row.task_id);
  logActivity({ type: 'ping', preset_key: 'tookOver', occurrence_id: row.id, payload: { task: (tk?.title || '…').toLowerCase(), day: dayLabelOf(row.due_date) } }).catch(() => {});
  occStore.bump();
  rescheduleReminders();
  return true;
}

// La règle s'applique aux PROCHAINES occurrences (retour Jeanne 7 sept 2026 : « elle devrait
// s'appliquer à toutes les prochaines récurrences »). Fenêtre : aujourd'hui → J+6.
//  · jours : si la règle fixe des jours, les occurrences à faire hors de ces jours sont
//    retirées (skipped) et les jours manquants créés ; sans jours, les dates ne bougent pas
//  · qui : me / partner → porteur ; alt → zigzag sur les dates ; auto → commun (null)
// Les occurrences déjà faites ne bougent jamais.
export async function applyRuleToOccurrences(task, rule) {
  const uid = getUid();
  const partnerUid = getPartnerUid() || null;
  const occs = await read('occurrences');
  const today = localIso();
  const last = addDaysIso(6);
  const future = occs.filter(o => o.task_id === task.id && o.due_date >= today && o.due_date <= last && o.status !== 'done' && isLive(o));
  const days = rule.window_days || [];
  const dowOf = iso => (new Date(iso + 'T12:00:00').getDay() + 6) % 7;
  let kept = future;
  if (days.length) {
    kept = [];
    for (const o of future) {
      if (days.includes(dowOf(o.due_date))) kept.push(o);
      else await mutate('occurrences', { ...o, status: 'skipped' });
    }
    for (let k = 0; k < 7; k++) {
      const iso = addDaysIso(k);
      if (!days.includes(dowOf(iso)) || kept.some(o => o.due_date === iso)) continue;
      const row = { id: uuid(), household_id: task.household_id, task_id: task.id, kind: task.mental_load ? 'plan' : 'exec', due_date: iso, assignee_id: null, status: 'pending' };
      kept.push(row);
    }
  }
  kept.sort((a, b) => a.due_date.localeCompare(b.due_date));
  for (let k = 0; k < kept.length; k++) {
    const o = kept[k];
    const assignee = rule.who === 'me' ? uid : rule.who === 'partner' ? partnerUid : rule.who === 'alt' ? (k % 2 === 0 ? uid : partnerUid) : null;
    if (o.assignee_id !== assignee || !occs.some(x => x.id === o.id)) await mutate('occurrences', { ...o, assignee_id: assignee });
  }
  occStore.bump();
  rescheduleReminders();
  return true;
}
