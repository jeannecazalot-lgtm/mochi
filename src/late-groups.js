// Retards groupés (décision Jeanne 14 sept 2026) : une ligne par tâche et par personne,
// « Vaisselle · En retard · 5 jours » au lieu de cinq lignes. Partagé par Accueil, Planning, À faire.
import copy from './data/copy.json';
const fill = (str, vars) => String(str).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

// occs : occurrences en retard (toute date < aujourd'hui, pas faites), n'importe quel ordre
export function groupLate(occs) {
  const map = new Map();
  for (const o of [...occs].sort((a, b) => String(a.due_date).localeCompare(String(b.due_date)))) {
    const k = `${o.task_id}|${o.assignee_id || ''}`;
    if (!map.has(k)) map.set(k, { key: k, task_id: o.task_id, assignee_id: o.assignee_id, occs: [] });
    map.get(k).occs.push(o);
  }
  return [...map.values()].map(g => ({ ...g, oldest: g.occs[0], latest: g.occs[g.occs.length - 1], n: g.occs.length, ids: g.occs.map(o => o.id) }));
}

// légende unique du retard (le seul signal rouge d'une rangée) : « En retard · 5 jours » ou « En retard depuis 2 j »
export function lateCaption(n, daysSinceOldest, points) {
  const t = copy.late;
  const base = n > 1 ? fill(t.days, { n }) : daysSinceOldest <= 1 ? t.sinceYesterday : fill(t.since, { n: daysSinceOldest });
  return points ? `${base} · ${fill(t.points, { pts: String(Math.round(points * 10) / 10).replace('.', ',') })}` : base;
}

export const daysBetweenIso = (fromIso, toIso) => Math.max(0, Math.round((new Date(`${toIso}T12:00:00`) - new Date(`${fromIso}T12:00:00`)) / 86400000));
