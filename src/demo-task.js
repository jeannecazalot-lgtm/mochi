// ═══════════════════════════════════════════════════════════════════
// DONNÉES DE DÉMO — complément pour la fiche tâche (14/15/16).
// Complète src/demo.js sans le modifier. Disparaît au profit de Supabase.
// ═══════════════════════════════════════════════════════════════════
import { me, partner, byId, taskById, today, fmtMin } from './demo';

// options possibles dans la fiche (valeurs, pas des textes : les libellés sont dans copy.json › task.freq*)
export const frequencies = ['daily', 'twiceWeek', 'weekly', 'monthly', 'once'];
export const durations = [5, 10, 15, 20, 30, 45, 60, 90];
export const dayKeys = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];
export const deadlines = [null, 'morning', '14:00', '20:00'];
export const assignModes = ['auto', 'fixed', 'alternate'];
export const categories = { domestic: 'domestic', mental: 'mental' };

// compléments par tâche (fenêtre, note, checklist, scission mentale)
export const taskExtras = {
  't-poubelles': { frequency: 'twiceWeek', window_days: ['mar', 'ven'], deadline: '20:00', note: 'Sortir aussi le verre' },
  't-courses': {
    planned_day: 'jeu', checklist_by: 'u-jeanne',
    checklist: [
      { id: 'c1', label: 'Lessive (la verte, pas la bleue)', done: true },
      { id: 'c2', label: 'Croquettes Marcel · réf. senior', done: false },
      { id: 'c3', label: 'Cadeau anniv Zoé — voir note', done: false },
    ],
  },
  't-pediatre': {
    note: 'Dr Lemoine · carnet de santé dans le tiroir',
    mental: {
      plan: { desc: 'Y penser, appeler, choisir le créneau', who: 'u-jeanne', deadline_day: 'ven', deadline_num: 11 },
      exec: { desc: 'Emmener Zoé au rendez-vous', who: 'u-valentin', duration_min: 45 },
    },
  },
  't-veto': {
    note: 'Carnet de vaccination',
    mental: {
      plan: { desc: 'Prendre le rendez-vous', who: 'u-jeanne', deadline_day: 'mer', deadline_num: 9 },
      exec: { desc: 'Emmener Marcel', who: 'u-valentin', duration_min: 40 },
    },
  },
};
export const extrasOf = id => taskExtras[id] || {};

// fiche complète = tâche demo + compléments (ou fiche vierge)
export const blankTask = () => ({ id: null, title: '', emoji: '', frequency: 'weekly', duration_min: 15, importance: 3, mental_load: false, assign_mode: 'auto', fixed_assignee: me.id, divisible: false, has_expense: false, pains: { [me.id]: 3, [partner.id]: 3 }, window_days: [], deadline: null, note: '' });
export const loadTask = id => { const t = id ? taskById(id) : null; return t ? { ...blankTask(), ...t, ...extrasOf(id) } : blankTask(); };
export const categoryOf = t => (t && t.mental_load ? categories.mental : categories.domestic);

// historique : 5 dernières occurrences par tâche (date + qui l'a faite)
const d = (offset) => { const x = new Date(today); x.setDate(x.getDate() + offset); return x; };
export const history = {
  't-courses': [
    { who: 'u-jeanne', at: d(-25) }, { who: 'u-valentin', at: d(-18) }, { who: 'u-jeanne', at: d(-11) }, { who: 'u-valentin', at: d(-7) }, { who: 'u-jeanne', at: d(-4) },
  ],
  't-poubelles': [
    { who: 'u-valentin', at: d(-14) }, { who: 'u-valentin', at: d(-11) }, { who: 'u-valentin', at: d(-7) }, { who: 'u-valentin', at: d(-4) }, { who: 'u-valentin', at: d(-1) },
  ],
  't-vaisselle': [
    { who: 'u-jeanne', at: d(-5) }, { who: 'u-valentin', at: d(-4) }, { who: 'u-jeanne', at: d(-3) }, { who: 'u-valentin', at: d(-2) }, { who: 'u-jeanne', at: d(-1) },
  ],
};
// faute d'historique dédié : alternance simple, une fois par semaine
export const lastFive = id => history[id] || [4, 3, 2, 1, 0].map((k, i) => ({ who: i % 2 ? me.id : partner.id, at: d(-7 * k - 3) }));
export const historyCounts = id => lastFive(id).reduce((acc, h) => { acc[h.who === me.id ? 'me' : 'partner'] += 1; return acc; }, { me: 0, partner: 0 });

// la semaine en cours : qui a la tâche (première occurrence encore à faire)
export const currentAssignee = (occurrences, id) => { const o = occurrences.find(x => x.task_id === id && x.status === 'pending'); return o && o.assignee_id ? byId(o.assignee_id) : null; };
export const currentDay = (occurrences, id) => { const o = occurrences.find(x => x.task_id === id && x.status === 'pending'); return o ? o.due_date : null; };

// formats
export const fmtDay = date => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date).replace('.', '');
export const fmtWeekday = date => new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(date);
export const fmtMinShort = min => (min < 60 ? `${min}ʼ` : fmtMin(min));
export const fmtStars = n => `${n} ★`;
export const fmtHour = hhmm => (hhmm ? `${parseInt(hhmm, 10)}h` : '');
export { me, partner, byId };
