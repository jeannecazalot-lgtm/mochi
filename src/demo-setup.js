// ═══════════════════════════════════════════════════════════════════
// DONNÉES DE DÉMO — setup 07 → 13 (complète src/demo.js sans le modifier).
// Tout ce fichier disparaît au profit de Supabase ; rien ici n'est un chiffre public.
// ═══════════════════════════════════════════════════════════════════
import { me, partner, tasks, taskById } from './demo';

// 07 · grille matin/soir : 0 = rien, 1 = léger, 2 = à fond (lundi → dimanche)
// disposDefault n'est plus utilisé par aucun écran (11 n'affiche plus les compteurs
// depuis les retours Jeanne du 22 août 2026) ; gardé comme exemple de grille remplie.
// L'écran 07 démarre VIDE (retour Jeanne, 22 août 2026 : aucune valeur pré-remplie).
export const disposDefault = { morning: [0, 1, 0, 1, 0, 2, 2], evening: [2, 1, 2, 0, 1, 2, 1] };
export const disposEmpty = { morning: [0, 0, 0, 0, 0, 0, 0], evening: [0, 0, 0, 0, 0, 0, 0] };
export const cycleSlot = v => (v + 1) % 3;
export const countSlots = g => [...g.morning, ...g.evening].filter(v => v > 0).length;

// 07 · temps dispo par semaine (heures) ; `sub` = clé copy.setup.
// Aucune option par défaut : rien n'est sélectionné d'avance (retour Jeanne, 22 août 2026).
export const weeklyTimeOptions = [
  { hours: 2, label: '2 h', sub: 'timeMin' },
  { hours: 5, label: '5 h', sub: 'timeMid' },
  { hours: 8, label: '8 h+', sub: 'timeMax' },
];

// 08 · chips de préférences (3 max par liste) — aucun pré-coché (retour Jeanne, 22 août 2026)
export const prefsMax = 3;
export const likeChips = [
  { id: 'cuisiner', emoji: '🍳', label: 'Cuisiner' },
  { id: 'courses', emoji: '🛒', label: 'Courses' },
  { id: 'chien', emoji: '🐕', label: 'Le chien' },
  { id: 'lessive', emoji: '🧺', label: 'Lessive' },
  { id: 'plantes', emoji: '🪴', label: 'Plantes' },
];
export const hateChips = [
  { id: 'repasser', emoji: '👔', label: 'Le repassage' },
  { id: 'sdb', emoji: '🚽', label: 'Salle de bain' },
  { id: 'admin', emoji: '📞', label: 'Appels admin' },
  { id: 'vaisselle', emoji: '🍽', label: 'Vaisselle' },
  { id: 'poubelles', emoji: '🗑', label: 'Poubelles' },
];
// 08 · heures de rappel proposées (tap = suivante)
export const reminderTimes = ['19:30', '20:00', '08:00', '12:30'];

// 09 · lien d'invitation (généré côté base plus tard)
export const inviteCode = 'VL-7K2P';
export const inviteLink = `mentalfree.app/j/${inviteCode}`;

// 10 · catalogue proposé — révision « retours Jeanne 22 août 2026 » : ~12 tâches
// LARGES qui parlent à tous les foyers ; les spécifiques (chien, plantes) restent
// disponibles en fin de liste sous l'intertitre « Selon ton foyer » (specific: true).
// fréquence = { daily } | { perWeek: n } | { perDay: n } ; mins = durée d'une
// occurrence ; pain = pénibilité moyenne 1-5 ; mental = charge mentale.
export const catalogue = [
  { id: 't-vaisselle', emoji: '🍽', label: 'Vaisselle', freq: { daily: true }, mins: 15, pain: 2, on: true },
  { id: 't-cuisiner', emoji: '🍳', label: 'Cuisine', freq: { daily: true }, mins: 40, pain: 2, on: true },
  { id: 't-courses', emoji: '🛒', label: 'Courses', freq: { perWeek: 1 }, mins: 45, pain: 2, on: true },
  { id: 't-lessive', emoji: '🧺', label: 'Lessive', freq: { perWeek: 2 }, mins: 30, pain: 2, on: true },
  { id: 't-menage', emoji: '🧹', label: 'Ménage', freq: { perWeek: 1 }, mins: 60, pain: 3, on: true },
  { id: 't-sdb', emoji: '🚿', label: 'Salle de bain', freq: { perWeek: 1 }, mins: 30, pain: 4, on: true },
  { id: 't-poubelles', emoji: '🗑', label: 'Poubelles', freq: { perWeek: 2 }, mins: 5, pain: 1, on: true },
  { id: 't-rangement', emoji: '🧸', label: 'Rangement', freq: { perWeek: 2 }, mins: 15, pain: 2, on: false },
  { id: 't-admin', emoji: '📄', label: 'Administratif & factures', freq: { perWeek: 1 }, mins: 20, pain: 4, mental: true, on: false },
  { id: 't-courrier', emoji: '📬', label: 'Courrier & colis', freq: { perWeek: 2 }, mins: 10, pain: 1, on: false },
  { id: 't-rdv', emoji: '📅', label: 'Rendez-vous à prendre', freq: { perWeek: 1 }, mins: 15, pain: 3, mental: true, on: false },
  { id: 't-repas', emoji: '📝', label: 'Planification des repas', freq: { perWeek: 1 }, mins: 20, pain: 3, mental: true, on: true },
  // spécifiques « Selon ton foyer » — en fin de liste, décochées par défaut
  { id: 't-chien-matin', emoji: '🐕', label: 'Sortie chien', freq: { perDay: 3 }, mins: 20, pain: 1, specific: true, on: false },
  { id: 't-plantes', emoji: '🪴', label: 'Plantes', freq: { perWeek: 1 }, mins: 10, pain: 1, specific: true, on: false },
];

// 12 · proposition de dispatch (fusion 12+13, retours Jeanne 22 août 2026) :
// minutes hebdo par tâche ; chaque tâche a TOUJOURS un assigné (tap = bascule
// vers l'autre membre, plus d'état « partagé » depuis la fusion avec l'écran 13).
// Reflète les tâches cochées par défaut du catalogue ci-dessus.
export const dispatch = [
  { task_id: 't-vaisselle', label: 'Vaisselle', tag: 'tagEvening', mins: 15, weekly_min: 105, assignee_id: partner.id },
  { task_id: 't-cuisiner', label: 'Cuisine', tag: 'tagEvening', mins: 40, weekly_min: 280, assignee_id: me.id },
  { task_id: 't-courses', label: 'Courses', tag: 'tagWednesday', mins: 45, weekly_min: 45, assignee_id: partner.id },
  { task_id: 't-lessive', label: 'Lessive', tag: 'freqPerWeek', tagN: 2, mins: 30, weekly_min: 60, assignee_id: partner.id },
  { task_id: 't-menage', label: 'Ménage', tag: 'tagSaturday', mins: 60, weekly_min: 60, assignee_id: partner.id },
  { task_id: 't-sdb', label: 'Salle de bain', tag: 'tagSaturday', mins: 30, weekly_min: 30, assignee_id: partner.id },
  { task_id: 't-poubelles', label: 'Poubelles', tag: 'tagTueFri', mins: 5, weekly_min: 10, assignee_id: me.id },
  { task_id: 't-repas', label: 'Planification des repas', tag: 'tagSunday', mins: 20, weekly_min: 20, assignee_id: me.id },
];
export const dispatchEmoji = it => catalogue.find(c => c.id === it.task_id)?.emoji || taskById(it.task_id)?.emoji || '•';

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

// 13 · OBSOLÈTE depuis la fusion 12+13 (retours Jeanne 22 août 2026) : l'écran 13
// redirige vers 12 et la réattribution se fait par tap sur les rangées de 12.
export const reassignInitial = () => dispatch.map(it => ({ ...it, assignee_id: it.assignee_id || me.id, dragging: !it.assignee_id }));

export const allTasks = tasks;
