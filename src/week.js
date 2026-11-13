// ═════════════════════════════════════════════════════════════════
// Semaine du foyer (13 nov 2026, Jeanne : « ok a ») — du lundi au dimanche, pour tout le monde.
//  · Gratuit : une semaine à la fois. Le dimanche à 20 h, récap puis « Préparez votre semaine ».
//    Planifier au-delà du dimanche (déplacer une tâche, un événement, un pense-bête) → Mochi+.
//  · Mochi+ : sans limite (la semaine suivante se remplit toute seule, on planifie plus loin).
//  · Semaine de rodage : foyer créé du lundi au jeudi → tâches jusqu'au dimanche, premier récap
//    ce dimanche-là ; créé du vendredi au dimanche → tâches jusqu'au dimanche suivant, premier
//    récap ce dimanche-là (trop peu de jours pour juger avant).
// ═════════════════════════════════════════════════════════════════
import { localIso, addDaysIso } from './dates';
import { isPremium } from './demo-premium';

const at = iso => new Date(iso + 'T12:00:00');
export const dowOf = (iso = localIso()) => (at(iso).getDay() + 6) % 7; // 0 = lundi … 6 = dimanche
export const mondayOf = (iso = localIso()) => addDaysIso(-dowOf(iso), at(iso));
export const sundayOf = (iso = localIso()) => addDaysIso(6 - dowOf(iso), at(iso));
export const daysBetween = (a, b) => Math.round((at(b) - at(a)) / 86400000);

// dernier jour qu'un foyer gratuit peut planifier : ce dimanche ; le dimanche, on prépare déjà la semaine suivante
export const planWeekEnd = (iso = localIso()) => (dowOf(iso) === 6 ? addDaysIso(7, at(iso)) : sundayOf(iso));
// fin de la semaine de rodage à la création du foyer
export const rodageEnd = (iso = localIso()) => (dowOf(iso) >= 4 ? addDaysIso(7, at(sundayOf(iso))) : sundayOf(iso));
// cette date est-elle planifiable ? (gratuit : jusqu'au dimanche de la semaine en cours, ou plus loin si déjà planifié)
export const canPlanOn = (iso, latestPlanned = null) => isPremium() || iso <= planWeekEnd() || (latestPlanned && iso <= latestPlanned);
