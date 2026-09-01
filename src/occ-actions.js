// ═══════════════════════════════════════════════════════════════════
// Actions sur les occurrences RÉELLES (cache local + file Supabase).
// Utilisé par la sheet Mission (« Déplacer ») ; l'Accueil/Planning se
// re-rendent via occStore.bump().
// ═══════════════════════════════════════════════════════════════════
import { read, mutate } from './store';
import { occStore } from './demo-core';

// déplace une occurrence à une autre date ; refuse si la même tâche a déjà
// une occurrence ce jour-là (contrainte unique task/date/kind en base)
export async function moveOccurrence(occId, dueIso) {
  const occs = await read('occurrences');
  const row = occs.find(o => o.id === occId);
  if (!row) return { ok: false, reason: 'introuvable' }; // occurrence de démo : rien à déplacer
  if (occs.some(o => o.id !== occId && o.task_id === row.task_id && o.due_date === dueIso && o.kind === row.kind)) {
    return { ok: false, reason: 'doublon' };
  }
  await mutate('occurrences', { ...row, due_date: dueIso });
  occStore.bump();
  return { ok: true };
}
