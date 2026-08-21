// ═══════════════════════════════════════════════════════════════════
// DONNÉES DE DÉMO — complément premium (écrans 35 Calendrier, 36 Analyse,
// 38 Profil). Même règle que demo.js : tout disparaît au profit de Supabase.
// Aucun de ces chiffres n'est public.
// ═══════════════════════════════════════════════════════════════════
import { me, partner, household, occurrences, taskById, today } from './demo';

// 38 · date de formation du duo (→ « depuis {n} jours »)
export const duoSince = new Date(2026, 3, 6); // lun 6 avr 2026
export const daysSince = (from, to = today) => Math.max(0, Math.round((to - from) / 86400000));

// 38 · compteurs cumulés du foyer (total historique, pas seulement la démo)
export const lifetime = { tasks_done: 148 };

// 38 · règles communes du duo (SPECS §3 : seuils communs, non modifiables écran par écran)
export const duoRules = { threshold_warn_pct: 10, threshold_alert_pct: 25, reminder_before_min: 30 };

// 38 · préférences locales (rappel croisé opt-in, off par défaut)
export const prefs = { cross_reminder: false };

// 36 · charge mentale (tâches mentales ×1,5) : parts en % et répartition par catégorie
export const mentalLoad = {
  weight_mental: 1.5,
  share: { [me.id]: 36, [partner.id]: 64 },
  categories: [
    { id: 'c-medical', emoji: '🩺', title: 'RDV médicaux', carrier_id: partner.id, pct: 80 },
    { id: 'c-gifts', emoji: '🎁', title: 'Cadeaux & anniversaires', carrier_id: partner.id, pct: 90 },
    { id: 'c-bills', emoji: '💳', title: 'Paiements & factures', carrier_id: me.id, pct: 70 },
    { id: 'c-school', emoji: '🏫', title: 'École & activités', carrier_id: partner.id, pct: 60 },
  ],
  suggestion: { category_id: 'c-medical', to_id: me.id, after: { [me.id]: 52, [partner.id]: 48 } },
};
export const heavier = () => (mentalLoad.share[me.id] > mentalLoad.share[partner.id] ? me : partner);

// 35 · occurrences d'un mois (année, mois 0-11) groupées par jour → { d: { assignees:Set, missed, items } }
export function monthOccurrences(year, month) {
  const map = {};
  occurrences.forEach(o => {
    const dt = o.due_date;
    if (dt.getFullYear() !== year || dt.getMonth() !== month) return;
    const d = dt.getDate();
    const cell = map[d] || (map[d] = { assignees: [], missed: false, items: [] });
    if (o.assignee_id && !cell.assignees.includes(o.assignee_id)) cell.assignees.push(o.assignee_id);
    if (o.status === 'missed') cell.missed = true;
    cell.items.push({ ...o, task: taskById(o.task_id) });
  });
  return map;
}

export const isPremium = () => Boolean(household.premium_until) && new Date(household.premium_until) > today;
