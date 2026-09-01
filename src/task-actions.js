// ═══════════════════════════════════════════════════════════════════
// Fiche tâche (14) branchée aux VRAIES tâches du foyer : chargement et
// « Enregistrer » qui persiste (store local + file Supabase).
// Les occurrences déjà générées ne sont pas redéplacées ici : le prochain
// « C'est parti » (ou la régénération hebdo à venir) applique la fenêtre.
// ═══════════════════════════════════════════════════════════════════
import { supabase } from './supabase';
import { read, mutate } from './store';
import { occStore } from './demo-core';
import { dayKeys } from './demo-task';
import { me, partner } from './demo';

// enum `frequency` de la base ↔ vocabulaire de la fiche (twiceWeek n'existe pas en base)
const DB_TO_FICHE = { daily: 'daily', weekly: 'weekly', biweekly: 'weekly', monthly: 'monthly', once: 'once' };
const FICHE_TO_DB = { daily: 'daily', twiceWeek: 'weekly', weekly: 'weekly', monthly: 'monthly', once: 'once' };

const hourToDeadline = end => {
  if (!end) return null;
  const h = parseInt(String(end).slice(0, 2), 10);
  return h <= 12 ? 'morning' : `${String(h).padStart(2, '0')}:00`;
};
const deadlineToHour = dl => (dl == null ? null : dl === 'morning' ? '12:00' : `${dl}`.slice(0, 5) + (String(dl).length === 5 ? '' : ':00'));

// charge une vraie tâche du store au format de la fiche ; null si inconnue (→ démo)
export async function loadRealTask(id) {
  if (!id) return null;
  const rows = await read('tasks');
  const row = rows.find(r => r.id === id);
  if (!row) return null;
  const pains = await read('task_pains');
  const mine = pains.find(p => p.task_id === id);
  return {
    real: true, id: row.id, household_id: row.household_id,
    title: row.title || '', frequency: DB_TO_FICHE[row.frequency] || 'weekly',
    window_days: (row.window_days || []).map(i => dayKeys[i]).filter(Boolean),
    deadline: hourToDeadline(row.window_end),
    duration_min: row.duration_min || 15, importance: row.importance || 3,
    pains: { [me.id]: mine?.pain ?? 3, [partner.id]: 3 }, // binôme simulé : pénibilité neutre
    assign_mode: row.assign_mode || 'auto', fixed_assignee: row.fixed_assignee || null,
    divisible: !!row.divisible, mental_load: !!row.mental_load,
    has_expense: !!row.has_expense, note: row.note || '',
  };
}
// persiste la fiche : ligne `tasks` + pénibilité perso `task_pains`
export async function saveRealTask(fiche) {
  const rows = await read('tasks');
  const row = rows.find(r => r.id === fiche.id);
  if (!row) return false;
  await mutate('tasks', {
    ...row,
    title: fiche.title.trim(), frequency: FICHE_TO_DB[fiche.frequency] || 'weekly',
    window_days: fiche.window_days.map(k => dayKeys.indexOf(k)).filter(i => i >= 0),
    window_end: deadlineToHour(fiche.deadline),
    duration_min: fiche.duration_min, importance: fiche.importance,
    assign_mode: fiche.assign_mode, divisible: !!fiche.divisible,
    mental_load: !!fiche.mental_load, has_expense: !!fiche.has_expense,
    note: fiche.note || null,
  });
  try {
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user?.id;
    const pain = fiche.pains?.[me.id];
    if (uid && pain) await mutate('task_pains', { task_id: fiche.id, user_id: uid, pain });
  } catch (e) { /* hors ligne : la file rejouera le reste */ }
  occStore.bump();
  return true;
}
