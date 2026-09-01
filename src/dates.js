// ═══════════════════════════════════════════════════════════════════
// Dates LOCALES. Ne jamais utiliser toISOString() pour une date-jour :
// il renvoie la date UTC — en France le soir, c'est encore « hier »
// (bug constaté le 2 sept 2026 à 00h09 : le Planning marquait le 1er
// « aujourd'hui »). Les due_date de la base sont des jours locaux.
// ═══════════════════════════════════════════════════════════════════
export const localIso = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const addDaysIso = (n, from = new Date()) => {
  const d = new Date(from);
  d.setDate(d.getDate() + n);
  return localIso(d);
};
