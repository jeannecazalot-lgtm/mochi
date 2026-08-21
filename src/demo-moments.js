// ═══════════════════════════════════════════════════════════════════
// DONNÉES DE DÉMO — moments gamifiés (24 Wrapped solo, 25 Wrapped couple,
// 26 Bilan mensuel, 28 Célébration streak). Complète src/demo.js sans le
// modifier. Disparaîtra au profit de Supabase (vues agrégées semaine/mois).
// Les chiffres ne sont PAS des chiffres publics.
// ═══════════════════════════════════════════════════════════════════
import { me, partner, streak, balance, tasks, today } from './demo';

// catalogue des badges (SPECS §streak) : seuil en jours équilibrés d'affilée
export const badges = [
  { id: 'b-semaine', days: 7, emoji: '🥇', title: 'Première semaine fluide' },
  { id: 'b-duo', days: 14, emoji: '🏅', title: 'Duo huilé' },
];
export const badgeById = id => badges.find(b => b.id === id);
export const nextBadge = days => badges.find(b => b.days > days) || null;

// n° ISO de la semaine courante (pour la pastille « Sem. 17 »)
export const weekNumber = (d = today) => {
  const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = x.getUTCDay() || 7; x.setUTCDate(x.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(x.getUTCFullYear(), 0, 1));
  return Math.ceil(((x - y0) / 86400000 + 1) / 7);
};

// ─── Wrapped solo (24) : ma semaine ─────────────────────────────────
export const wrappedSolo = {
  minutes: 270,                                   // 4h30 portées pour le foyer
  highlight: { task_id: 't-vaisselle', count: 5 }, // « Roi de la vaisselle »
  tasks_done: 12,
  mental_absorbed: 2,
  swaps_accepted: 1,
};

// ─── Wrapped couple (25) : notre semaine à deux ─────────────────────
const leader = balance.me >= balance.partner ? me : partner;
export const wrappedCouple = {
  me_pct: balance.me, partner_pct: balance.partner,
  leader,                                          // chez qui ça penche
  gap_min: 18,                                     // écart en minutes
  streak_days: streak.days, record: streak.record, next: nextBadge(streak.days),
  laundry: { task_id: 't-lessive', who: partner, count: 3 },
  forgotten: { task_id: 't-poubelles', short: 'Poubelle', day: 'mardi', points: -1 },   // short = libellé court dans la rangée
  coordination_min: 120,                           // temps de coordination épargné
};

// ─── Bilan mensuel (26) : clôture du mois précédent ─────────────────
const monthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
export const bilan = {
  month: monthStart,
  next_month: new Date(today.getFullYear(), today.getMonth(), 1),
  me_pct: 51, partner_pct: 49,
  days: new Date(today.getFullYear(), today.getMonth(), 0).getDate(),
  balanced_days: 21,
  state: 'balanced',
  badges: [
    { badge_id: 'b-semaine', unlocked_on: new Date(today.getFullYear(), today.getMonth() - 1, 8) },
    { badge_id: 'b-duo', unlocked_on: null, remaining: 2 },
  ],
  malus_settled_points: 2,
};

// ─── Célébration (28) : le moment où un badge se débloque ───────────
export const celebration = { badge_id: 'b-duo', days: badgeById('b-duo').days, is_record: true };

// formats
export const fmtMonth = d => { const m = d.toLocaleDateString('fr-FR', { month: 'long' }); return m.charAt(0).toUpperCase() + m.slice(1); };
export const fmtDay = d => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
export const taskTitle = id => (tasks.find(t => t.id === id) || {}).title || '';
