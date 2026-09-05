// ═══════════════════════════════════════════════════════════════════
// Malus RÉELS (SPECS §4) — écrits par l'app, jamais par une personne.
//  · sweepMissed() : balaye les occurrences échues non faites → status
//    'missed' + ligne malus (points = importance × (1 + retard_j × 0,5)),
//    rattachée au lundi de la semaine. Appelé à l'ouverture des onglets
//    et à chaque rafraîchissement d'occurrences.
//  · postponeMalus() : +1 point quand on décale une tâche déjà en retard
//    (« Décaler à demain · +1 malus mais ça passe », sheet 21).
// Un malus par occurrence : occurrence_id sert de garde anti-doublon.
// ═══════════════════════════════════════════════════════════════════
import { read, mutate, uuid, resetTable, pull } from './store';
import { supabase } from './supabase';
import { loadSetup, setup } from './setup-state';
import { occStore } from './demo-core';
import { getUid } from './identity';
import { localIso } from './dates';

// lundi de la semaine d'une date-jour
export const weekStartIso = (iso = localIso()) => {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return localIso(d);
};

const daysLate = dueIso => Math.max(1, Math.round((new Date(localIso()) - new Date(dueIso)) / 86400000));

export const malusPoints = (importance, late) => Math.round((importance || 3) * (1 + late * 0.5) * 100) / 100;

async function existingMalusFor(occId) {
  const malus = await read('malus');
  return malus.some(m => m.occurrence_id === occId);
}

// occurrences échues (avant aujourd'hui) et toujours pending → missed + malus
export async function sweepMissed() {
  const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]);
  const byTask = Object.fromEntries(tasks.map(t => [t.id, t]));
  const todayI = localIso();
  let changed = false;
  for (const o of occs) {
    if ((o.status || 'pending') !== 'pending' || o.due_date >= todayI) continue;
    const late = daysLate(o.due_date);
    const t = byTask[o.task_id] || {};
    await mutate('occurrences', { ...o, status: 'missed' });
    // malus seulement pour une tâche ASSIGNÉE (une commune ratée n'accuse personne)
    if (o.assignee_id && !(await existingMalusFor(o.id))) {
      await mutate('malus', {
        id: uuid(), household_id: o.household_id, user_id: o.assignee_id,
        occurrence_id: o.id, points: malusPoints(t.importance, late), week_start: weekStartIso(),
      });
    }
    changed = true;
  }
  if (changed) occStore.bump();
  return changed;
}

// décalage d'une tâche en retard : +1 point (sheet 21)
export async function postponeMalus(occId) {
  const occs = await read('occurrences');
  const o = occs.find(x => x.id === occId);
  if (!o || !o.assignee_id) return false;
  await mutate('malus', {
    id: uuid(), household_id: o.household_id, user_id: o.assignee_id,
    occurrence_id: null, // le malus de décalage n'empêche pas un futur malus de raté
    points: 1, week_start: weekStartIso(),
  });
  occStore.bump();
  return true;
}

// malus de la semaine courante, enrichis du titre de tâche (pour Balance / 23)
export async function weekMalus() {
  const [malus, occs, tasks] = await Promise.all([read('malus'), read('occurrences'), read('tasks')]);
  const byTask = Object.fromEntries(tasks.map(t => [t.id, t]));
  const byOcc = Object.fromEntries(occs.map(o => [o.id, o]));
  const ws = weekStartIso();
  return malus
    .filter(m => m.week_start === ws && !m.review_id)
    .map(m => {
      const t = m.occurrence_id ? byTask[byOcc[m.occurrence_id]?.task_id] : null;
      return { ...m, task_title: t?.title || null, task_emoji: t?.emoji || '⏰', importance: t?.importance || 3 };
    });
}

// tâche ratée finalement faite (sheet 21 « Je le fais maintenant », 5 sept 2026) :
// son malus s'efface — les malus de décalage (occurrence_id null) restent
export async function clearMalusFor(occId) {
  await loadSetup();
  try { await supabase.from('malus').delete().eq('occurrence_id', occId); } catch (e) { /* hors ligne : repris au prochain balayage */ }
  await resetTable('malus');
  if (setup.householdId) await pull('malus', setup.householdId);
  occStore.bump();
}
