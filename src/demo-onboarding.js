// ═══════════════════════════════════════════════════════════════════
// CHIFFRES DE PITCH DE L'ONBOARDING (slides 01-05) — à sourcer.
// Ce ne sont PAS des chiffres calculés depuis la base : ce sont des
// constantes d'argumentaire (Insee · Enquête emploi du temps, et un calcul
// maison 1h26/jour ÷ 2 × 365). Chaque valeur est à valider/sourcer par Jeanne
// avant toute capture ASC. Les libellés associés sont dans data/copy.json.
// ═══════════════════════════════════════════════════════════════════
import { fmtMin } from './demo';

// 01 · le constat : écart hebdo porté par la personne en charge du foyer
export const weeklyGapHours = 10;       // « 10h /sem. »  — chiffre de pitch à sourcer
export const dailyGapMin = 86;          // « +1h26/jour » — chiffre de pitch à sourcer
export const gapShare = 0.7;            // part remplie de la barre héros (70 %) — illustratif

// 03 · à un an : heures à se réapproprier et équivalences
export const yearlyHours = 260;         // « 260h /an » — chiffre de pitch à sourcer (1h26 ÷ 2 × 365)
export const yearlyFullDays = 11;       // « 11 jours pleins » — chiffre de pitch à sourcer
export const yearlyAlternatives = [100, 26, 1]; // ×100 dîners, ×26 week-ends, ×1 voyage — chiffres de pitch à sourcer

// 04 · au-delà du temps : registre « évité ~ / an » (officieux, assumé)
export const avoidedPerYear = [
  { value: 47, accent: true },   // disputes pour rien
  { value: 12, accent: true },   // bouquets d'excuses
  { value: 156, accent: true },  // « j'avais oublié »
  { value: 0, accent: false },   // enquêtes sur le lave-vaisselle
  { value: 0, accent: false },   // œufs sur lesquels marcher
];
export const coupleBreathing = 1;       // « +1 couple qui respire »

export const fmtHours = h => `${Math.round(h)}h`;
export const dailyGapLabel = () => fmtMin(dailyGapMin); // « 1h26 »
