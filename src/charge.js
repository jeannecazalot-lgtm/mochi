// ═══════════════════════════════════════════════════════════════════
// charge.js — LA formule de charge de mochi, partagée par l'écran 12 (prévision,
// minutes estimées) et l'onglet Balance (réel, minutes faites). Décision Jeanne
// des 7-8 sept 2026 : minutes pondérées + un poids fixe par tâche distincte,
// parce que « y penser » est une charge même quand la tâche est courte.
// Fonction pure, sans import : testable en node.
// ═══════════════════════════════════════════════════════════════════
export const PAIN_FACTOR = 0.15;     // +15 % de charge par point de pénibilité perso (1-5)
export const MENTAL_FACTOR = 1.5;    // tâche de charge mentale : ×1,5
export const TASK_WEIGHT_MIN = 15;   // 15 min « pour y penser » par tâche distincte portée dans la semaine

// charge d'une occurrence (ou d'une tâche sur une semaine si minutes = durée × fréquence)
export const chargeOf = (minutes, pain = 3, mental = false) =>
  (minutes || 0) * (1 + (pain ?? 3) * PAIN_FACTOR) * (mental ? MENTAL_FACTOR : 1);
