// ═══════════════════════════════════════════════════════════════════
// Actions sur les occurrences RÉELLES (cache local + file Supabase).
// Utilisé par la sheet Mission (« Déplacer ») ; l'Accueil/Planning se
// re-rendent via occStore.bump().
// ═══════════════════════════════════════════════════════════════════
import { read, mutate } from './store';
import { occStore } from './demo-core';
import { rescheduleReminders } from './reminders';
import { getUid } from './identity';

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
