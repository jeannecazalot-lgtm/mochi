// ═══════════════════════════════════════════════════════════════════
// DONNÉES DE DÉMO — pour naviguer dans l'app avant le branchement base.
// Tout ce fichier disparaît écran par écran au profit de Supabase.
// Les chiffres affichés à partir d'ici ne sont PAS des chiffres publics.
// ═══════════════════════════════════════════════════════════════════
import { slotColors } from './theme';

export const me = { id: 'u-valentin', first_name: 'Ketley', slot: 1, color: slotColors[1].main, initial: 'K' };
export const partner = { id: 'u-jeanne', first_name: 'Julian', slot: 2, color: slotColors[2].main, initial: 'J' };
export const members = [me, partner];
export const byId = id => members.find(m => m.id === id);

export const household = { id: 'h-demo', name: 'Maison', currency: 'EUR', plan_weekday: 0, review_weekday: 0, premium_until: null };

export const today = new Date(2026, 6, 7); // mar 7 juil (comme le canvas)

export const tasks = [
  { id: 't-vaisselle', title: 'Vaisselle du soir', emoji: '🍽', frequency: 'daily', duration_min: 15, importance: 2, mental_load: false, assign_mode: 'alternate', pains: { 'u-valentin': 2, 'u-jeanne': 3 } },
  { id: 't-poubelles', title: 'Sortir les poubelles', emoji: '🗑', frequency: 'weekly', duration_min: 5, importance: 1, mental_load: false, assign_mode: 'fixed', fixed_assignee: 'u-valentin', window_end: '20:00', pains: { 'u-valentin': 1, 'u-jeanne': 2 } },
  { id: 't-pediatre', title: 'Penser au RDV pédiatre', emoji: '📅', frequency: 'monthly', duration_min: 10, importance: 5, mental_load: true, assign_mode: 'auto', pains: { 'u-valentin': 4, 'u-jeanne': 3 } },
  { id: 't-lessive', title: 'Lessive blanc', emoji: '🧺', frequency: 'weekly', duration_min: 30, importance: 2, mental_load: false, assign_mode: 'auto', pains: { 'u-valentin': 3, 'u-jeanne': 2 } },
  { id: 't-courses', title: 'Courses de la semaine', emoji: '🛒', frequency: 'weekly', duration_min: 45, importance: 3, mental_load: false, assign_mode: 'auto', divisible: true, has_expense: true, pains: { 'u-valentin': 3, 'u-jeanne': 3 } },
  { id: 't-menage', title: 'Ménage salon', emoji: '🧹', frequency: 'weekly', duration_min: 60, importance: 3, mental_load: false, assign_mode: 'auto', pains: { 'u-valentin': 3, 'u-jeanne': 4 } },
  { id: 't-veto', title: 'Véto Marcel', emoji: '🐕', frequency: 'once', duration_min: 40, importance: 4, mental_load: true, assign_mode: 'auto', has_expense: true, pains: { 'u-valentin': 2, 'u-jeanne': 2 } },
  { id: 't-chien-matin', title: 'Sortie chien matin', emoji: '🐕', frequency: 'daily', duration_min: 20, importance: 2, mental_load: false, assign_mode: 'alternate', pains: { 'u-valentin': 1, 'u-jeanne': 2 } },
];
export const taskById = id => tasks.find(t => t.id === id);

const d = (offset) => { const x = new Date(today); x.setDate(x.getDate() + offset); return x; };
export const occurrences = [
  { id: 'o1', task_id: 't-vaisselle', due_date: d(0), assignee_id: 'u-valentin', status: 'done', done_at: d(0) },
  { id: 'o2', task_id: 't-poubelles', due_date: d(0), assignee_id: 'u-valentin', status: 'pending', badge: 'avant 20h', urgent: true },
  { id: 'o3', task_id: 't-pediatre', due_date: d(0), assignee_id: 'u-valentin', status: 'pending', kind: 'plan' },
  { id: 'o4', task_id: 't-chien-matin', due_date: d(0), assignee_id: 'u-jeanne', status: 'done' },
  { id: 'o5', task_id: 't-menage', due_date: d(0), assignee_id: 'u-jeanne', status: 'pending' },
  { id: 'o6', task_id: 't-lessive', due_date: d(1), assignee_id: 'u-jeanne', status: 'pending', time: '18h' },
  { id: 'o7', task_id: 't-vaisselle', due_date: d(1), assignee_id: 'u-jeanne', status: 'pending', time: '20h' },
  { id: 'o8', task_id: 't-courses', due_date: d(2), assignee_id: null, status: 'pending' },
  { id: 'o9', task_id: 't-lessive', due_date: d(-2), assignee_id: 'u-valentin', status: 'missed' },
  { id: 'o10', task_id: 't-veto', due_date: d(-4), assignee_id: 'u-valentin', status: 'done', expense_id: 'e3' },
];
export const myToday = () => occurrences.filter(o => o.assignee_id === me.id && o.due_date.getTime() === today.getTime());
export const partnerToday = () => occurrences.filter(o => o.assignee_id === partner.id && o.due_date.getTime() === today.getTime());

export const balance = { me: 48, partner: 52, state: 'leaning', week: [ { d: 'L', me: 40, partner: 60 }, { d: 'M', me: 55, partner: 45 }, { d: 'M', me: 48, partner: 52 }, { d: 'J', me: 0, partner: 0 }, { d: 'V', me: 0, partner: 0 }, { d: 'S', me: 0, partner: 0 }, { d: 'D', me: 0, partner: 0 } ] };
export const streak = { days: 6, next: { at: 7, label: 'Première semaine fluide' }, record: 12 };
export const malus = [ { id: 'm1', user_id: 'u-valentin', task_id: 't-lessive', points: 3, week_start: d(-2) } ];

export const expenses = [
  { id: 'e1', title: 'Monoprix', emoji: '🛒', amount_cents: 6420, paid_by: 'u-valentin', spent_on: d(-1), via_task: 't-courses', category: 'courses' },
  { id: 'e2', title: 'Pizzas vendredi', emoji: '🍕', amount_cents: 3100, paid_by: 'u-jeanne', spent_on: d(-3), category: 'sorties' },
  { id: 'e3', title: 'Véto Marcel', emoji: '🐕', amount_cents: 4760, paid_by: 'u-valentin', spent_on: d(-4), via_task: 't-veto', category: 'autre' },
];
export const budget = { owes: { who: 'u-jeanne', to: 'u-valentin', cents: 2350 }, total_cents: 14280 };

export const activity = [
  { id: 'a1', type: 'ping', actor_id: 'u-jeanne', target_id: 'u-valentin', task_id: 't-poubelles', preset_key: 'reminder', at: d(0), read_at: null },
  { id: 'a2', type: 'task_done', actor_id: 'u-valentin', task_id: 't-vaisselle', at: d(0) },
  { id: 'a3', type: 'mochi_moment', preset_key: 'rebalance', at: d(-1) },
  { id: 'a4', type: 'swap_accepted', actor_id: 'u-jeanne', task_id: 't-lessive', at: d(-2) },
];

export const fmtMoney = (cents, currency = household.currency) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(cents / 100);
export const fmtMin = (min) => min >= 60 ? `${Math.floor(min / 60)}h${min % 60 ? String(min % 60).padStart(2, '0') : ''}` : `${min} min`;
