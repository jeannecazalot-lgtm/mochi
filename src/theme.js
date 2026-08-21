// ═══════════════════════════════════════════════════════════════════
// theme.js — LES tokens de mochi (source : design/handoff/README.md §Tokens)
// Aucune couleur, taille ou rayon n'est écrit ailleurs que ici.
// DNA « Embossed Crème » : cards crème + hairline plat, AUCUNE ombre portée.
// ═══════════════════════════════════════════════════════════════════

export const colors = {
  // fond & surfaces
  bg: '#FAFAF7',
  card: '#FFFCF5',
  white: '#FFFFFF',
  glass: 'rgba(255,255,255,0.55)',
  footerLine: '#EBEBEB',

  // encre
  ink: '#1A1A1F',
  inkSoft: '#3A3A42',
  muted: '#8A857C',
  tabInactive: '#717171',
  line: 'rgba(26,26,31,0.06)',
  hairline: 'rgba(26,26,31,0.05)',
  sheetLine: 'rgba(26,26,31,0.08)',
  checkRing: 'rgba(26,26,31,0.22)',
  darkPill: '#332F2D',

  // accents
  coral: '#E97A6A',
  coralDeep: '#C75744',
  sage: '#9FC9A8',
  sageDeep: '#4F7A57',
  butter: '#F5C76E',
  butterLight: '#FBE49A',
  lavender: '#B8A5D9',
  lavenderDeep: '#9A7BC8',
  sky: '#7DB3D5',
  skyDeep: '#4C7FA3',
};

// halos radiaux des 4 coins (GlowBg) — alpha déjà inclus
export const glow = {
  coral: 'rgba(245,168,154,0.48)',
  butter: 'rgba(251,228,154,0.52)',
  sage: 'rgba(201,224,197,0.52)',
  lavender: 'rgba(226,214,240,0.55)',
  opacity: { soft: 0.5, normal: 0.7, strong: 0.9 },
};

// gradient Mochi (CTA primaire + FAB) — 135deg
export const gradients = {
  mochi: { colors: ['#FFF1E0', '#FBC9A4', '#F5A89A'], locations: [0, 0.4, 1], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  iridescent: { colors: ['#FBE49A', '#F5A89A', '#E2D6F0', '#C9DFEA'], locations: [0, 0.4, 0.75, 1], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
};

// couleur par slot d'arrivée (1→10), jamais choisie : 1 sky, 2 lavender (= le design à 2), puis la palette
export const slotColors = [
  null,
  { main: colors.sky, deep: colors.skyDeep },
  { main: colors.lavender, deep: colors.lavenderDeep },
  { main: colors.sage, deep: colors.sageDeep },
  { main: colors.coral, deep: colors.coralDeep },
  { main: colors.butter, deep: '#B98A2E' },
  { main: '#E8A5C4', deep: '#B5587F' },   // rose
  { main: '#F2B08A', deep: '#B9652F' },   // pêche
  { main: '#8FCFD0', deep: '#3F8A8C' },   // menthe
  { main: '#C9B38A', deep: '#7F6A3E' },   // sable
  { main: '#A9B7D9', deep: '#5A6BA0' },   // pervenche
];

// alpha 16 % pour les PillLabel (« couleur28 » en hex)
export const alpha = (hex, a) => {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export const radius = { sm: 8, row: 14, card: 16, cardLg: 20, sheet: 26, pill: 999 };

// densité : écrans listes compacts, écrans héros aérés
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 23, screenX: 18, headerX: 23, footerTop: 12, footerBottom: 26 };

// typo façon app Météo iOS : SF Pro système, chiffres tabulaires
export const font = {
  hero: { fontSize: 24, fontWeight: '700', letterSpacing: -1.2, color: colors.ink, fontVariant: ['tabular-nums'] },
  screenTitle: { fontSize: 22, fontWeight: '600', letterSpacing: -1, color: colors.ink },
  cardTitle: { fontSize: 20, fontWeight: '600', letterSpacing: -0.6, color: colors.ink },
  sectionTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3, color: colors.ink },
  body: { fontSize: 16, fontWeight: '500', color: colors.ink },
  row: { fontSize: 15, fontWeight: '500', color: colors.ink },
  secondary: { fontSize: 13.5, fontWeight: '400', color: colors.muted },
  caption: { fontSize: 12, fontWeight: '400', color: colors.muted },
  micro: { fontSize: 11.5, fontWeight: '600', letterSpacing: 1.4, textTransform: 'uppercase', color: colors.muted },
  cta: { fontSize: 14, fontWeight: '600', color: colors.ink },
  ctaSecondary: { fontSize: 14, fontWeight: '500', color: colors.ink },
  tabLabel: { fontSize: 11 },
  pill: { fontSize: 9.5, fontWeight: '600', letterSpacing: 1.4, textTransform: 'uppercase' },
  tabular: { fontVariant: ['tabular-nums'] },
};

// durées d'animation (README §Animations v1)
export const motion = {
  micro: 200, check: 350, screen: 320, progress: 600, countUp: 500, celebrate: 1500,
  mochiFloat: 3200, spring: { damping: 14 },
};

// ombres : quasi inexistantes — seule le CTA et le FAB en ont une
export const shadows = {
  none: {},
  cta: { shadowColor: colors.ink, shadowOpacity: 0.06, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  fab: { shadowColor: colors.ink, shadowOpacity: 0.10, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
};

export const tabBar = { height: 56 + 24, fabSize: 54, fabRing: 4, fabLift: -34, iconSize: 22 };

export default { colors, glow, gradients, slotColors, alpha, radius, space, font, motion, shadows, tabBar };
