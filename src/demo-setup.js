// ═══════════════════════════════════════════════════════════════════
// DONNÉES DE DÉMO — setup 07 → 13 (complète src/demo.js sans le modifier).
// Tout ce fichier disparaît au profit de Supabase ; rien ici n'est un chiffre public.
// ═══════════════════════════════════════════════════════════════════
import { me, partner, tasks, taskById } from './demo';

// 07 · grille matin/soir : 0 = rien, 1 = léger, 2 = à fond (lundi → dimanche)
export const disposDefault = { morning: [0, 1, 0, 1, 0, 2, 2], evening: [2, 1, 2, 0, 1, 2, 1] };
export const cycleSlot = v => (v + 1) % 3;
export const countSlots = g => [...g.morning, ...g.evening].filter(v => v > 0).length;

// 07 · temps dispo par semaine (heures) ; `sub` = clé copy.setup
export const weeklyTimeOptions = [
  { hours: 2, label: '2 h', sub: 'timeMin' },
  { hours: 5, label: '5 h', sub: 'timeMid', default: true },
  { hours: 8, label: '8 h+', sub: 'timeMax' },
];

// 08 · chips de préférences (3 max par liste)
export const prefsMax = 3;
export const likeChips = [
  { id: 'cuisiner', emoji: '🍳', label: 'Cuisiner', on: true },
  { id: 'courses', emoji: '🛒', label: 'Courses', on: true },
  { id: 'chien', emoji: '🐕', label: 'Le chien', on: true },
  { id: 'lessive', emoji: '🧺', label: 'Lessive' },
  { id: 'plantes', emoji: '🪴', label: 'Plantes' },
];
export const hateChips = [
  { id: 'repasser', emoji: '👔', label: 'Repasser', on: true },
  { id: 'sdb', emoji: '🚽', label: 'Salle de bain', on: true },
  { id: 'admin', emoji: '📞', label: 'Appels admin', on: true },
  { id: 'vaisselle', emoji: '🍽', label: 'Vaisselle' },
  { id: 'poubelles', emoji: '🗑', label: 'Poubelles' },
];
// 08 · heures de rappel proposées (tap = suivante)
export const reminderTimes = ['19:30', '20:00', '08:00', '12:30'];

// 09 · lien d'invitation (généré côté base plus tard)
export const inviteCode = 'VL-7K2P';
export const inviteLink = `mentalfree.app/j/${inviteCode}`;

// 10 · catalogue proposé : fréquence = { daily } | { perWeek: n } | { perDay: n }
export const catalogue = [
  { id: 't-vaisselle', emoji: '🍽', label: 'Vaisselle', freq: { daily: true }, on: true },
  { id: 't-menage', emoji: '🧹', label: 'Ménage', freq: { perWeek: 1 }, on: true },
  { id: 't-courses', emoji: '🛒', label: 'Courses', freq: { perWeek: 1 }, on: true },
  { id: 't-chien-matin', emoji: '🐕', label: 'Sortie chien', freq: { perDay: 3 }, on: true },
  { id: 't-lessive', emoji: '🧺', label: 'Lessive', freq: { perWeek: 2 }, on: true },
  { id: 't-cuisiner', emoji: '👨‍🍳', label: 'Cuisiner', freq: { daily: true }, on: false },
  { id: 't-plantes', emoji: '🌱', label: 'Plantes', freq: { perWeek: 1 }, on: false },
  { id: 't-poubelles', emoji: '🗑', label: 'Poubelles', freq: { perWeek: 2 }, on: true },
];

// 12 · proposition de dispatch : minutes hebdo par tâche, assignee_id null = partagée
export const dispatch = [
  { task_id: 't-vaisselle', label: 'Vaisselle', tag: 'tagEvening', mins: 15, weekly_min: 105, assignee_id: me.id },
  { task_id: 't-menage', label: 'Ménage', tag: 'tagSaturday', mins: 60, weekly_min: 60, assignee_id: partner.id },
  { task_id: 't-courses', label: 'Courses', tag: 'tagWednesday', mins: 45, weekly_min: 45, assignee_id: me.id },
  { task_id: 't-chien-matin', label: 'Sortie chien', tag: 'tagMorningEvening', mins: 20, weekly_min: 140, assignee_id: null },
  { task_id: 't-lessive', label: 'Lessive', tag: 'freqPerWeek', tagN: 2, mins: 30, weekly_min: 60, assignee_id: partner.id },
  { task_id: 't-poubelles', label: 'Poubelles', tag: 'tagTueFri', mins: 5, weekly_min: 10, assignee_id: me.id },
];
export const dispatchEmoji = it => taskById(it.task_id)?.emoji || '•';

// charge hebdo (min) par membre ; une tâche partagée compte moitié-moitié
export const weeklyLoad = (items = dispatch) => {
  const load = { [me.id]: 0, [partner.id]: 0 };
  items.forEach(it => {
    if (it.assignee_id) load[it.assignee_id] += it.weekly_min;
    else { load[me.id] += it.weekly_min / 2; load[partner.id] += it.weekly_min / 2; }
  });
  return load;
};
// seuil commun SPECS §3 : < 10 % d'écart = équilibré
export const balanceState = (load) => {
  const a = load[me.id], b = load[partner.id], tot = a + b || 1;
  return Math.abs(a - b) / tot < 0.10 ? 'balanced' : 'leaning';
};

// 13 · colonnes initiales de réattribution (la tâche partagée part chez `me`, « en cours de drag »)
export const reassignInitial = () => dispatch.map(it => ({ ...it, assignee_id: it.assignee_id || me.id, dragging: !it.assignee_id }));

export const allTasks = tasks;
