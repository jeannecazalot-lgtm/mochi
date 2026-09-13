// ═══════════════════════════════════════════════════════════════════
// notes-actions.js — pense-bête RÉEL (table `notes`, migration 0010) : titre, détail (body),
// date facultative → rangée dans le Planning ce jour-là, rappel → récap du jour.
// ═══════════════════════════════════════════════════════════════════
import { read, mutate, uuid } from './store';
import { loadSetup, setup } from './setup-state';
import { getUid } from './identity';
import { occStore } from './demo-core';
import { rescheduleReminders } from './reminders';
import { logActivity } from './activity-actions';
import { pushToPartner } from './push';

export const liveNotes = rows => rows.filter(n => !n.deleted_at).sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

export async function loadNotes() { return liveNotes(await read('notes')); }

export async function saveNote({ id, title, body, due_date, remind, tone }) {
  await loadSetup();
  const hid = setup.householdId; const uid = getUid();
  if (!hid || !uid || !title?.trim()) return null;
  const rows = await read('notes');
  const prev = id ? rows.find(n => n.id === id) : null;
  const row = { ...(prev || { id: uuid(), household_id: hid, created_by: uid, done: false, created_at: new Date().toISOString(), tone: rows.length % 5 }),
    title: title.trim(), body: (body || '').trim(), due_date: due_date || null, remind: !!remind, ...(tone != null ? { tone } : {}) };
  await mutate('notes', row);
  if (!prev) { const vars = { title: row.title }; logActivity({ type: 'ping', preset_key: 'noteCreated', payload: vars }).catch(() => {}); pushToPartner('noteCreated', vars, '/pense-bete'); }
  occStore.bump();
  if (row.due_date) rescheduleReminders();
  return row;
}
export async function toggleNote(id) {
  const rows = await read('notes'); const n = rows.find(x => x.id === id); if (!n) return;
  await mutate('notes', { ...n, done: !n.done }); occStore.bump();
}
export async function deleteNote(id) {
  const rows = await read('notes'); const n = rows.find(x => x.id === id); if (!n) return;
  await mutate('notes', { ...n, deleted_at: new Date().toISOString() }); occStore.bump(); rescheduleReminders();
}
