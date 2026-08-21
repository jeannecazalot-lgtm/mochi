// ═══════════════════════════════════════════════════════════════════
// demo-balance.js — données de démo complémentaires pour Balance (21),
// Balance détail (22) et Point hebdo (23). Complète src/demo.js sans le
// modifier. Disparaît au branchement Supabase (tables occurrences/malus).
// Les chiffres ici ne sont PAS des chiffres publics.
// ═══════════════════════════════════════════════════════════════════
import { members, balance, malus, household, today, partner, me } from './demo';

// ─── charge de la semaine par membre (SPECS §3 : minutes équivalentes) ─
// cohérent avec balance.me / balance.partner (48 % / 52 %)
export const weekLoad = {
  'u-valentin': { minutes: 270, tasks: 12 },
  'u-jeanne': { minutes: 288, tasks: 14 },
};

// ─── minutes par jour et par membre, dérivées de balance.week (L→D) ──
// un jour « vide » (0/0) = jour à venir
const DAY_TOTAL = 90; // minutes partagées par jour (démo)
export const dayMinutes = balance.week.map(d => ({
  d: d.d,
  by: { [me.id]: Math.round((d.me / 100) * DAY_TOTAL), [partner.id]: Math.round((d.partner / 100) * DAY_TOTAL) },
}));

// ─── part de chaque membre (%) → liste ordonnée par slot ────────────
export const shares = () => {
  const total = members.reduce((s, m) => s + (weekLoad[m.id]?.minutes || 0), 0);
  // à 2 : le ratio vient de demo.balance (me/partner) ; au-delà, calculé depuis weekLoad
  const fromBalance = { [me.id]: balance.me, [partner.id]: balance.partner };
  return members.map(m => ({
    member: m, ...weekLoad[m.id],
    pct: members.length === 2 && fromBalance[m.id] != null ? fromBalance[m.id] : total ? Math.round(((weekLoad[m.id]?.minutes || 0) / total) * 100) : 0,
  }));
};

// ─── état de la balance : écart en points de % entre le plus chargé et le moins chargé ─
// SPECS §3 : équilibré < 10, légèrement penché 10-25, déséquilibré > 25
export const balanceState = () => {
  const s = shares();
  const pcts = s.map(x => x.pct);
  const gap = Math.max(...pcts) - Math.min(...pcts);
  const top = s.reduce((a, b) => (b.pct > a.pct ? b : a), s[0]);
  const state = gap < 10 ? 'balanced' : gap <= 25 ? 'leaning' : 'unbalanced';
  // lean (−1…1) : ne parle qu'à 2 membres — positif = penche vers le 2e (droite)
  const lean = s.length === 2 ? Math.max(-1, Math.min(1, (s[1].pct - s[0].pct) / 50)) : 0;
  return { gap, state, top: top.member, lean };
};

// ─── ce qui pèse (22) : contributeurs du déséquilibre, en minutes d'écart ─
export const contributors = [
  { id: 'c1', kind: 'mental', emoji: '🧠', task_ids: ['t-pediatre'], examples: ['RDV pédiatre', 'anniv belle-mère'], member_id: 'u-jeanne', delta_min: 58, accent: 'coral' },
  { id: 'c2', kind: 'cycles', emoji: '🧺', task_ids: ['t-lessive'], cycles: { 'u-jeanne': 3, 'u-valentin': 0 }, member_id: 'u-jeanne', delta_min: 45, accent: 'lavender' },
];

// ─── malus de la semaine (23) : complète demo.malus (SPECS §4) ──────
export const MALUS_THRESHOLD = 10; // seuil affiché sur la jauge (artboard 23)
export const malusItems = [
  ...malus.map(m => ({ id: m.id, task_id: m.task_id, kind: 'missed', times: 2, importance: 2, points: m.points, accent: 'butter' })),
  { id: 'm2', task_id: 't-courses', kind: 'swapped', times: 1, importance: 1, points: 2, accent: 'lavender' },
];
export const malusTotal = () => malusItems.reduce((s, m) => s + m.points, 0);

// proposition de geste faite par l'autre (texte libre saisi par lui : donnée, pas copy)
export const malusProposal = { id: 'p1', from_id: 'u-jeanne', text: 'Massage 10 min ce week-end…' };

// ─── dates : numéro de semaine, plage, prochain point hebdo ──────────
const monday = (d) => { const x = new Date(d); const day = (x.getDay() + 6) % 7; x.setDate(x.getDate() - day); x.setHours(0, 0, 0, 0); return x; };
const isoWeek = (d) => { const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = x.getUTCDay() || 7; x.setUTCDate(x.getUTCDate() + 4 - day); const y0 = new Date(Date.UTC(x.getUTCFullYear(), 0, 1)); return Math.ceil(((x - y0) / 86400000 + 1) / 7); };
const shortMonth = (d) => new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(d).replace('.', '');
const shortDay = (d) => new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(d).replace('.', '');

export const weekInfo = (d = today) => {
  const start = monday(d); const end = new Date(start); end.setDate(start.getDate() + 6);
  const range = start.getMonth() === end.getMonth()
    ? `${start.getDate()}-${end.getDate()} ${shortMonth(end)}`
    : `${start.getDate()} ${shortMonth(start)}-${end.getDate()} ${shortMonth(end)}`;
  return { num: isoWeek(d), range };
};

// prochain jour de point hebdo (household.review_weekday, 0 = dimanche) → « dim. 12 »
export const nextReview = (d = today) => {
  const x = new Date(d); const diff = (household.review_weekday - x.getDay() + 7) % 7; x.setDate(x.getDate() + diff);
  return { date: x, label: `${shortDay(x)} ${x.getDate()}` };
};
