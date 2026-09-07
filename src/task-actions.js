// ═══════════════════════════════════════════════════════════════════
// Fiche tâche (14) branchée aux VRAIES tâches du foyer : chargement et
// « Enregistrer » qui persiste (store local + file Supabase).
// Les occurrences déjà générées ne sont pas redéplacées ici : le prochain
// « C'est parti » (ou la régénération hebdo à venir) applique la fenêtre.
// ═══════════════════════════════════════════════════════════════════
import { supabase } from './supabase';
import { read, mutate, uuid } from './store';
import { occStore } from './demo-core';
import { dayKeys } from './demo-task';
import { me, partner } from './demo';
import { loadSetup, setup } from './setup-state';
import { getUid, getPartnerUid } from './identity';
import { placeDays } from './dispatch';
import { addDaysIso } from './dates';
import { logActivity } from './activity-actions';
import { pushToPartner } from './push';

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
// Nouvelle tâche depuis le « + » (décision Jeanne 6 sept 2026 : elle apparaît tout de
// suite) : ligne `tasks`, pénibilité perso, et les occurrences de la semaine à venir —
// jours de la fenêtre si elle est fixée, sinon placement selon mes dispos (comme le 12).
// Porteur : Fixe → la personne choisie ; Alternance → zigzag ; Auto → commun (les deux).
// false sans foyer réel (démo) : la fiche se ferme simplement.
const PER_WEEK = { daily: 7, twiceWeek: 2, weekly: 1, monthly: 1, once: 1 };
export async function createRealTask(fiche) {
  await loadSetup();
  const householdId = setup.householdId;
  const uid = getUid();
  if (!householdId || !uid || !fiche.title?.trim()) return false;
  const id = uuid();
  await mutate('tasks', {
    id, household_id: householdId, title: fiche.title.trim(), emoji: fiche.emoji || '📝', catalog_key: null,
    frequency: FICHE_TO_DB[fiche.frequency] || 'weekly',
    window_days: (fiche.window_days || []).map(k => dayKeys.indexOf(k)).filter(i => i >= 0),
    window_end: deadlineToHour(fiche.deadline),
    duration_min: fiche.duration_min || 15, importance: fiche.importance || 3,
    assign_mode: fiche.assign_mode || 'auto', divisible: !!fiche.divisible,
    mental_load: !!fiche.mental_load, has_expense: !!fiche.has_expense,
    note: fiche.note || null, created_by: uid,
  });
  const pain = fiche.pains?.[me.id];
  if (pain) await mutate('task_pains', { task_id: id, user_id: uid, pain });
  // occurrences des 7 prochains jours
  const todayDow = (new Date().getDay() + 6) % 7;
  const wanted = (fiche.window_days || []).map(k => dayKeys.indexOf(k)).filter(i => i >= 0);
  let offsets;
  if (wanted.length) offsets = Array.from({ length: 7 }, (_, o) => o).filter(o => wanted.includes((todayDow + o) % 7));
  else offsets = placeDays(PER_WEEK[fiche.frequency] || 1, setup.availability, todayDow, Math.floor(Math.random() * 7));
  const partnerUid = getPartnerUid() || null;
  const fixedUid = fiche.fixed_assignee === partner.id ? partnerUid : uid;
  for (let k = 0; k < offsets.length; k++) {
    const assignee = fiche.assign_mode === 'fixed' ? fixedUid
      : fiche.assign_mode === 'alternate' ? (k % 2 === 0 ? uid : partnerUid)
      : null;
    await mutate('occurrences', {
      id: uuid(), household_id: householdId, task_id: id,
      kind: fiche.mental_load ? 'plan' : 'exec', due_date: addDaysIso(offsets[k]), assignee_id: assignee,
    });
  }
  logActivity({ type: 'ping', preset_key: 'taskCreated', payload: { task: fiche.title.trim().toLowerCase() } }).catch(() => {});
  pushToPartner('taskCreated', { task: fiche.title.trim().toLowerCase() }, '/(tabs)/planning');
  occStore.bump();
  return true;
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
