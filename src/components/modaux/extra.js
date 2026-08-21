// ═══════════════════════════════════════════════════════════════════
// extra.js — composants & tokens propres aux modaux (30/32/33/34).
// Ne redéfinit rien de ui.js ; les tokens manquants de theme.js vivent ici.
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';
import { colors, gradients, radius, font } from '../../theme';

// ─── tokens supplémentaires (absents de theme.js, source : artboards modaux) ─
export const extraColors = {
  peach: '#F5A89A',          // milieu du gradient Mochi, utilisé seul (humeur active, barre widget)
  lavenderLight: '#E2D6F0',
  skyLight: '#C9DFEA',
  sageLight: '#C9E0C5',
  notes: ['#FBE49A', '#C9DFEA', '#E2D6F0', '#F5A89A', '#C9E0C5'],   // sticky notes, en rotation
  cream: '#FFFCF5',
  lockDeep: '#0A0A0F',
  lockMid: '#1A1A1F',
  lockTop: '#3A3A42',
  scrim: 'rgba(26,26,31,0.35)',
  grabber: 'rgba(26,26,31,0.18)',
  ctaGlow: 'rgba(245,168,154,0.32)',
};
export const cream = (a) => `rgba(255,252,245,${a})`;
export const sageA = (a) => `rgba(159,201,168,${a})`;

// ─── sheet modale : scrim (tap = back) + sheet bas radius 26, séparation 0 -1 encre 8 % ─
// Présentée en formSheet natif par app/_layout.js : pas de scrim ni d'animation maison.
export function ModalSheet({ children }) {
  return (
    <View style={[x.sheet, { flex: 1 }]}>
      <View style={x.grabber} />
      {children}
    </View>
  );
}

// ─── micro-label des sections (11,5/600 tracking 1,4, marge 9) ─────
export const SectionLabel = ({ children, style }) => <Text style={[font.micro, { marginBottom: 9 }, style]}>{children}</Text>;

// ─── card « embossed » : ombre pleine couleur décalée sous la card crème ─
export function EmbossedCard({ children, tint, tintOpacity = 0.4, offset = [4, 5], r = radius.cardLg, padding, style }) {
  return (
    <View style={style}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: r, backgroundColor: tint, opacity: tintOpacity, transform: [{ translateX: offset[0] }, { translateY: offset[1] }] }]} />
      <View style={[x.card, { borderRadius: r, padding }]}>{children}</View>
    </View>
  );
}

// ─── CTA des modaux : pilule 999 gradient Mochi, 15,5/600, halo pêche ─
export function CtaModal({ label, onPress, disabled, style }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [{ opacity: disabled ? 0.5 : pressed ? 0.85 : 1 }, style]}>
      <LinearGradient {...gradients.mochi} style={x.cta}>
        <Text style={x.ctaText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

// ─── bouton rond encre « + » (pense-bête) / bouton retour « ‹ » ─────
export function RoundButton({ kind = 'plus', onPress, dark = kind === 'plus', size = 36, light }) {
  const stroke = dark ? extraColors.cream : light ? extraColors.cream : colors.ink;
  const path = kind === 'plus' ? 'M12 5v14M5 12h14' : 'M14.5 5.5L8 12l6.5 6.5';
  return (
    <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => [x.round, { width: size, height: size, borderRadius: size / 2 }, dark ? x.roundDark : light ? x.roundLight : x.roundCream, { opacity: pressed ? 0.8 : 1 }]}>
      <Svg width={kind === 'plus' ? 21 : 20} height={kind === 'plus' ? 21 : 20} viewBox="0 0 24 24" fill="none"><Path d={path} stroke={stroke} strokeWidth={kind === 'plus' ? 1.6 : 2} strokeLinecap="round" strokeLinejoin="round" /></Svg>
    </Pressable>
  );
}

// ─── chip sélectionnable (mood) : crème / encre si actif ───────────
export function Chip({ label, on, onPress }) {
  return (
    <Pressable onPress={onPress} style={[x.chip, on && { backgroundColor: colors.ink }]}>
      <Text style={[x.chipText, on && { color: extraColors.cream }]}>{label}</Text>
    </Pressable>
  );
}

// ─── icône app 18×18 radius 5 gradient Mochi (lockscreen) ───────────
export function AppGlyph({ letter, bg }) {
  const inner = <Text style={x.glyphText}>{letter}</Text>;
  return bg
    ? <View style={[x.glyph, { backgroundColor: bg }]}>{inner}</View>
    : <LinearGradient colors={[gradients.mochi.colors[0], extraColors.peach]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={x.glyph}>{inner}</LinearGradient>;
}

const x = StyleSheet.create({
  sheet: { backgroundColor: colors.bg, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingTop: 12, paddingBottom: 28, overflow: 'hidden' },
  sheetLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: colors.sheetLine },
  grabber: { width: 44, height: 5, borderRadius: 3, backgroundColor: extraColors.grabber, alignSelf: 'center', marginBottom: 12 },
  card: { backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, overflow: 'hidden' },
  cta: { borderRadius: radius.pill, paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center', shadowColor: extraColors.peach, shadowOpacity: 0.32, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  ctaText: { fontSize: 15.5, fontWeight: '600', color: colors.ink },
  round: { alignItems: 'center', justifyContent: 'center' },
  roundDark: { backgroundColor: colors.ink, shadowColor: colors.ink, shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  roundCream: { backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  roundLight: { backgroundColor: cream(0.10) },
  chip: { paddingVertical: 8, paddingHorizontal: 13, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  chipText: { fontSize: 13.5, fontWeight: '500', color: colors.ink },
  glyph: { width: 18, height: 18, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  glyphText: { fontSize: 13, fontWeight: '600', color: colors.ink, lineHeight: 15 },
});
