// ═══════════════════════════════════════════════════════════════════
// Algo de dispatch Mochi — SPECS §2. Fonction PURE : aucune dépendance
// app/réseau, testée par scripts/test-dispatch.js (node).
//
// Inputs
//   members : [{ id, weekly_minutes }]            ← 07 (temps/semaine)
//   tasks   : [{ id, duration_min, per_week, pain (1-3), mental_load, divisible }] ← 10 + catalogue
//   pains   : { [task_id]: { [member_id]: 'like' | 'hate' } }          ← 08
//
// Règle (SPECS §2)
//   1. effort = durée × fréquence/sem × (1 + pénibilité × 0,2)
//      — pénibilité PERSO : celle du catalogue ± 1 selon aimée/détestée (bornée 1-4)
//   2. cible 50/50 sur l'effort total
//   3. allocation du plus gros effort au plus petit, au membre le moins
//      chargé qui a encore de la dispo (budget minutes du 07) ; à charge
//      égale, celui qui déteste le moins la tâche
//   4. si déséquilibre final > 15 % : une tâche divisible du plus chargé
//      passe en 'both' (splitable) tant que ça améliore
//   5. toujours > 15 % malgré tout → state 'review' (« Setup à revoir »)
//
// Output : { items: [{ task_id, assignee_id | 'both', weekly_min, effort }],
//            loads: { [member_id]: effort }, state: 'ok' | 'review' }
// ═══════════════════════════════════════════════════════════════════

const painFor = (task, memberId, pains) => {
  const p = pains?.[task.id]?.[memberId];
  const base = task.pain ?? 2;
  return Math.min(5, Math.max(1, base + (p === 'hate' ? 1 : p === 'like' ? -1 : 0))); // pénibilité catalogue 1-5
};

const effortFor = (task, memberId, pains) =>
  task.duration_min * task.per_week * (1 + painFor(task, memberId, pains) * 0.2);

export function computeDispatch({ members, tasks, pains = {} }) {
  if (!members?.length || !tasks?.length) return { items: [], loads: {}, state: 'ok' };

  const loads = Object.fromEntries(members.map(m => [m.id, 0]));      // effort accumulé
  const minutes = Object.fromEntries(members.map(m => [m.id, 0]));    // minutes accumulées (budget 07)
  const budget = Object.fromEntries(members.map(m => [m.id, m.weekly_minutes ?? Infinity]));

  // du plus gros effort (neutre) au plus petit — départage stable par id
  const ordered = [...tasks].sort((a, b) =>
    (b.duration_min * b.per_week * (1 + (b.pain ?? 2) * 0.2)) -
    (a.duration_min * a.per_week * (1 + (a.pain ?? 2) * 0.2)) || String(a.id).localeCompare(String(b.id)));

  const items = ordered.map(task => {
    const weekly_min = task.duration_min * task.per_week;
    // candidats : ceux qui ont encore du budget minutes ; sinon tout le monde
    const fits = members.filter(m => minutes[m.id] + weekly_min <= budget[m.id]);
    const pool = fits.length ? fits : members;
    // le moins chargé ; à égalité, la pénibilité perso la plus basse
    const chosen = [...pool].sort((a, b) =>
      loads[a.id] - loads[b.id] || painFor(task, a.id, pains) - painFor(task, b.id, pains) || String(a.id).localeCompare(String(b.id)))[0];
    const effort = effortFor(task, chosen.id, pains);
    loads[chosen.id] += effort;
    minutes[chosen.id] += weekly_min;
    return { task_id: task.id, assignee_id: chosen.id, weekly_min, effort, divisible: !!task.divisible };
  });

  // rééquilibrage : tâches divisibles du plus chargé → 'both' tant que ça améliore
  const gap = () => {
    const vals = members.map(m => loads[m.id]);
    const tot = vals.reduce((a, b) => a + b, 0) || 1;
    return (Math.max(...vals) - Math.min(...vals)) / tot;
  };
  if (members.length === 2) {
    let guard = items.length;
    while (gap() > 0.15 && guard--) {
      const heavy = members.reduce((a, b) => (loads[a.id] >= loads[b.id] ? a : b));
      const light = members.find(m => m.id !== heavy.id);
      const candidate = items
        .filter(it => it.divisible && it.assignee_id === heavy.id)
        .sort((a, b) => b.effort - a.effort)[0];
      if (!candidate) break;
      const before = gap();
      loads[heavy.id] -= candidate.effort / 2;
      loads[light.id] += candidate.effort / 2;
      if (gap() >= before) { // n'améliore pas → on annule et on arrête
        loads[heavy.id] += candidate.effort / 2;
        loads[light.id] -= candidate.effort / 2;
        break;
      }
      candidate.assignee_id = 'both';
    }
  }

  return { items, loads, state: gap() > 0.15 ? 'review' : 'ok' };
}

// n occurrences/semaine → décalages de jours étalés uniformément (repli sans grille)
export const spreadDays = perWeek => {
  const n = Math.min(7, Math.max(1, Math.round(perWeek || 1)));
  return Array.from({ length: n }, (_, i) => Math.round((i * 7) / n));
};

// Jours privilégiés selon la grille du 07 (indices 0-6 = L-D) : matin + soir
// additionnés, « à fond » (2) pèse double. Vide si la grille n'a pas été remplie.
export const preferredDays = availability => {
  const g = availability || {};
  const score = i => (g.morning?.[i] || 0) + (g.evening?.[i] || 0);
  return Array.from({ length: 7 }, (_, i) => ({ i, s: score(i) }))
    .filter(d => d.s > 0)
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .map(d => d.i);
};

// Place n occurrences sur les 7 prochains jours : d'abord les jours cochés au 07
// (« courses le jeudi »), puis étalement uniforme pour le reste. Un même jour ne
// reçoit jamais deux occurrences de la même tâche (contrainte unique en base).
// `seed` (index de la tâche) décale l'étalement de repli : sans grille, deux tâches
// hebdo ne tombent plus toutes « aujourd'hui » (retour Jeanne, 5 sept 2026).
export const placeDays = (perWeek, availability, todayDow, seed = 0) => {
  const n = Math.min(7, Math.max(1, Math.round(perWeek || 1)));
  const toOffset = dayIdx => (dayIdx - todayDow + 7) % 7;
  const preferred = preferredDays(availability).map(toOffset);
  const chosen = [];
  for (const off of preferred) { if (chosen.length >= n) break; if (!chosen.includes(off)) chosen.push(off); }
  for (const off of spreadDays(n).map(o => (o + seed) % 7)) { if (chosen.length >= n) break; if (!chosen.includes(off)) chosen.push(off); }
  for (let off = 0; chosen.length < n && off < 7; off++) if (!chosen.includes(off)) chosen.push(off);
  return chosen.sort((a, b) => a - b);
};
