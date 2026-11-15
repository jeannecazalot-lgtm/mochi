// ═════════════════════════════════════════════════════════════════
// « En tête » — les pensées du foyer (table `thoughts`, migration 0021, modèle validé par Jeanne le 15 nov 2026).
// Ajouter, cocher (efface chez les deux), lier à une tâche (« en faire une tâche », efface aussi),
// compter par personne sur la semaine (Balance, ligne à part).
// ═════════════════════════════════════════════════════════════════
import { read, mutate, uuid } from './store';
import { setup } from './setup-state';
import { getUid } from './identity';
import { occStore } from './demo-core';
import { mondayOf } from './week';
import { track } from './track';

const nowIso = () => new Date().toISOString();
const mine = r => r.household_id === setup.householdId;

// pensées ouvertes (ni cochées ni transformées), les plus récentes d'abord
export async function openThoughts() {
  const rows = await read('thoughts').catch(() => []);
  return rows.filter(r => mine(r) && !r.done_at && !r.task_id).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

export async function addThought(text) {
  const v = String(text || '').trim().slice(0, 140);
  if (!v || !setup.householdId) return null;
  const row = { id: uuid(), household_id: setup.householdId, created_by: getUid(), text: v, created_at: nowIso() };
  await mutate('thoughts', row);
  occStore.bump(); track('thought_added');
  return row;
}

async function patchThought(id, changes) {
  const row = (await read('thoughts').catch(() => [])).find(r => r.id === id);
  if (!row) return;
  await mutate('thoughts', { ...row, ...changes });
  occStore.bump();
}

export const checkThought = id => { track('thought_done'); return patchThought(id, { done_at: nowIso(), done_by: getUid() }); };
export const linkThoughtTask = (id, taskId) => { track('thought_to_task'); return patchThought(id, { task_id: taskId }); };

// semaine en cours (lundi → dimanche) : pensées par personne
export async function thoughtCounts(uid, puid) {
  const rows = (await read('thoughts').catch(() => [])).filter(mine);
  const from = mondayOf();
  const week = rows.filter(r => String(r.created_at).slice(0, 10) >= from);
  return { me: week.filter(r => r.created_by === uid).length, partner: week.filter(r => r.created_by === puid).length };
}
