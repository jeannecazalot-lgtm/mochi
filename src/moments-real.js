// ═══════════════════════════════════════════════════════════════════
// moments-real.js — bilan du mois (26) et analyse de la charge mentale (36) sur les VRAIES
// occurrences du foyer (décision Jeanne 14 sept 2026 : « pour le reste, fais-le », bilan en V1).
// Même formule que la Balance (src/charge.js) ; les badges suivent le streak réel.
// ═══════════════════════════════════════════════════════════════════
import { me, partner } from './demo';
import { localIso } from './dates';
import { chargeOf, TASK_WEIGHT_MIN } from './charge';
import { thresholdsOf } from './setup-state';
import { badges } from './demo-moments';
import { computeRealBalance } from './balance-real';

const scoreOf = o => chargeOf(o.duration_min || 15, o.pain, o.mental_load);

// ─── Bilan du mois : part de chacun, jours équilibrés, badges, malus ─────
export function computeMonthReview(occs, malus, uid) {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const from = localIso(new Date(y, m, 1)), to = localIso(now);
  const dones = occs.filter(o => o.status === 'done' && o.due_date >= from && o.due_date <= to);
  const mine = dones.filter(o => o.done_by === uid), other = dones.filter(o => o.done_by && o.done_by !== uid);
  const distinct = l => new Set(l.map(o => o.task_id)).size;
  const sMe = mine.reduce((a, o) => a + scoreOf(o), 0) + distinct(mine) * TASK_WEIGHT_MIN;
  const sP = other.reduce((a, o) => a + scoreOf(o), 0) + distinct(other) * TASK_WEIGHT_MIN;
  const tot = sMe + sP;
  const mePct = tot ? Math.round((sMe / tot) * 100) : 50, partnerPct = tot ? 100 - mePct : 50;
  const th = thresholdsOf();
  const gap = tot ? Math.abs(sMe - sP) / tot * 100 : 0;
  const state = !tot ? 'empty' : gap < th.warn ? 'balanced' : gap <= th.alert ? 'leaning' : 'unbalanced';
  // jour équilibré = tout le dû du jour est fait
  const days = now.getDate();
  let balancedDays = 0;
  for (let d = 1; d <= days; d++) {
    const iso = localIso(new Date(y, m, d));
    const due = occs.filter(o => o.due_date === iso && o.status !== 'skipped');
    if (due.length && due.every(o => o.status === 'done')) balancedDays++;
  }
  const streak = computeRealBalance(occs, uid).streakDays;
  const badgeRows = badges.map(b => (streak >= b.days
    ? { badge_id: b.id, unlocked_on: new Date(Date.now() - (streak - b.days) * 86400000) }
    : { badge_id: b.id, unlocked_on: null, remaining: b.days - streak }));
  const monthMalus = (malus || []).filter(x => x.week_start >= from && x.week_start <= to);
  const malusTotal = monthMalus.reduce((a, x) => a + Number(x.points || 0), 0);
  const malusSettled = monthMalus.filter(x => x.review_id).reduce((a, x) => a + Number(x.points || 0), 0);
  return { month: new Date(y, m, 1), next_month: new Date(y, m + 1, 1), me_pct: mePct, partner_pct: partnerPct, days, balanced_days: balancedDays, state, badges: badgeRows, malus_total: Math.round(malusTotal * 10) / 10, malus_settled_points: Math.round(malusSettled * 10) / 10, top: sMe >= sP ? me : partner };
}

// ─── Analyse : qui porte l'invisible (tâches mentales) sur les 4 dernières semaines ─────
export function computeMentalLoad(occs, tasks, uid) {
  const from = localIso(new Date(Date.now() - 28 * 86400000)), to = localIso();
  const byTask = Object.fromEntries(tasks.map(t => [t.id, t]));
  const mental = occs.filter(o => o.status === 'done' && o.due_date >= from && o.due_date <= to && (o.mental_load || o.kind === 'plan' || byTask[o.task_id]?.mental_load));
  const score = o => chargeOf(o.duration_min || byTask[o.task_id]?.duration_min || 15, o.pain, true);
  let sMe = 0, sP = 0;
  const perTask = {};
  for (const o of mental) {
    const who = o.done_by === uid ? 'me' : 'partner';
    const s = score(o);
    if (who === 'me') sMe += s; else sP += s;
    const t = (perTask[o.task_id] ||= { me: 0, partner: 0 });
    t[who] += s;
  }
  const tot = sMe + sP;
  const shareMe = tot ? Math.round((sMe / tot) * 100) : 50, sharePartner = tot ? 100 - shareMe : 50;
  const categories = Object.entries(perTask).map(([id, t]) => {
    const tk = byTask[id] || {};
    const carrier = t.me >= t.partner ? 'me' : 'partner';
    return { id, emoji: tk.emoji || '🧠', title: tk.title || '…', carrier, pct: Math.round((Math.max(t.me, t.partner) / (t.me + t.partner || 1)) * 100), weight: t.me + t.partner, task: tk };
  }).sort((a, b) => b.weight - a.weight).slice(0, 6);
  // suggestion : la tâche du plus chargé qui, transférée, rapproche le plus de 50/50
  const heavy = sMe >= sP ? 'me' : 'partner';
  let best = null;
  for (const c of categories) {
    if (c.carrier !== heavy) continue;
    const nMe = heavy === 'me' ? sMe - c.weight : sMe + c.weight, nP = heavy === 'me' ? sP + c.weight : sP - c.weight;
    const gapAfter = Math.abs(nMe - nP);
    if (!best || gapAfter < best.gapAfter) best = { c, gapAfter, after: { me: Math.round((nMe / (nMe + nP || 1)) * 100), partner: Math.round((nP / (nMe + nP || 1)) * 100) } };
  }
  const suggestion = best && best.gapAfter < Math.abs(sMe - sP) ? { task: best.c.task, to: heavy === 'me' ? 'partner' : 'me', after: best.after } : null;
  return { shareMe, sharePartner, categories, suggestion, heavy: heavy === 'me' ? me : partner, empty: !tot };
}
