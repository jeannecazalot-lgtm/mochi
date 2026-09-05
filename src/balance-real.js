// ═══════════════════════════════════════════════════════════════════
// Balance RÉELLE (SPECS §3) sur les occurrences cochées : score =
// durée réelle × (1 + pénibilité × 0,15), tâches mentales ×1,5.
// Partagée par l'onglet Balance, le détail 22 et le profil (5 sept 2026).
// ═══════════════════════════════════════════════════════════════════
import { me, partner } from './demo';
import { weekDays } from './demo-core';
import { localIso } from './dates';
import copy from './data/copy.json';

// numéro de semaine ISO
export const isoWeek = d => {
  const x = new Date(d); x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() + 3 - ((x.getDay() + 6) % 7));
  const w1 = new Date(x.getFullYear(), 0, 4);
  return 1 + Math.round(((x - w1) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7);
};

export const scoreOf = o => (o.duration_min || 0) * (1 + (o.pain ?? 3) * 0.15) * (o.mental_load ? 1.5 : 1);

export function computeRealBalance(occs, uid) {
  const dones = occs.filter(o => o.status === 'done');
  const mine = dones.filter(o => o.done_by === uid);
  const other = dones.filter(o => o.done_by && o.done_by !== uid);
  const sMe = mine.reduce((a, o) => a + scoreOf(o), 0);
  const sP = other.reduce((a, o) => a + scoreOf(o), 0);
  const tot = sMe + sP || 1;
  const gap = Math.abs(sMe - sP) / tot;
  const state = gap < 0.10 ? 'balanced' : gap <= 0.25 ? 'leaning' : 'unbalanced';
  const parts = [
    { member: me, minutes: mine.reduce((a, o) => a + (o.duration_min || 0), 0), pct: Math.round((sMe / tot) * 100), tasks: mine.length },
    { member: partner, minutes: other.reduce((a, o) => a + (o.duration_min || 0), 0), pct: Math.round((sP / tot) * 100), tasks: other.length },
  ];
  // chart : 7 jours de la semaine courante, minutes faites par membre
  const dows = copy.calendar.dows;
  const days = weekDays(new Date()).map(d => {
    const iso = localIso(d);
    const by = { [me.id]: 0, [partner.id]: 0 };
    dones.filter(o => o.due_date === iso).forEach(o => { by[o.done_by === uid ? me.id : partner.id] += o.duration_min || 0; });
    return { d: dows[(d.getDay() + 6) % 7], by };
  });
  // streak réel : jours consécutifs (en remontant depuis hier/aujourd'hui) où tout le dû est fait
  let streakDays = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const iso = localIso(d);
    const due = occs.filter(o => o.due_date === iso);
    if (!due.length) { if (i === 0) continue; break; }
    if (due.every(o => o.status === 'done')) streakDays++;
    else { if (i === 0) continue; break; } // aujourd'hui pas fini ≠ streak cassé
  }
  const wk = weekDays(new Date());
  const week = { num: isoWeek(new Date()), range: `${wk[0].getDate()} au ${wk[6].getDate()}` };
  return { parts, state, top: sMe >= sP ? me : partner, lean: Math.max(-1, Math.min(1, (sMe - sP) / tot)), days, streakDays, week, gap: Math.round(gap * 100) };
}

// « ce qui pèse » (détail 22) : par tâche, écart de minutes faites entre les deux —
// les 3 plus gros écarts, portés par celui qui en fait le plus
export function realContributors(occs, tasks, uid) {
  const byTask = Object.fromEntries(tasks.map(t => [t.id, t]));
  const acc = {};
  for (const o of occs) {
    if (o.status !== 'done' || !o.done_by) continue;
    const a = (acc[o.task_id] ||= { me: 0, other: 0, task: byTask[o.task_id] });
    a[o.done_by === uid ? 'me' : 'other'] += o.duration_min || 0;
  }
  return Object.entries(acc)
    .map(([task_id, a]) => ({ task_id, task: a.task, delta_min: Math.abs(a.me - a.other), who: a.me >= a.other ? me : partner, mine: a.me, other: a.other }))
    .filter(c => c.delta_min > 0 && c.task)
    .sort((x, y) => y.delta_min - x.delta_min)
    .slice(0, 3);
}
