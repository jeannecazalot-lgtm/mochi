// ═══════════════════════════════════════════════════════════════════
// extra.js — primitives propres à l'onboarding (01-05). Recette :
// docs/recettes/01-05-onboarding.md. Tout style dérive de theme.js.
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, PillLabel } from '../ui';
import { colors, gradients, radius, space, font, alpha, shadows } from '../../theme';

// tokens dérivés (pas de nouvel hex : le « rose saumon » est le 3e stop du gradient Mochi)
export const onb = {
  salmon: gradients.mochi.colors[2],
  barOff: alpha(colors.ink, 0.10),
  heroShadowAlpha: 0.55,
  rowShadowAlpha: 0.4,
  total: 5,
};

// ─── en-tête fixe : 5 barres 18×4 + « Passer » (slides 1-4) ─────────
export function OnbHeader({ step, total = onb.total, skipLabel, onSkip, showSkip }) {
  return (
    <View style={s.header} pointerEvents="box-none">
      <View style={{ flexDirection: 'row', gap: 5 }}>
        {Array.from({ length: total }, (_, i) => i + 1).map(i => (
          <View key={i} style={[s.bar, { backgroundColor: i <= step ? colors.ink : onb.barOff }]} />
        ))}
      </View>
      {showSkip ? (
        <Pressable onPress={onSkip} hitSlop={12} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <Text style={s.skip}>{skipLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// ─── pastille d'étape coral ─────────────────────────────────────────
export const StepPill = ({ children }) => (
  <View style={{ marginBottom: 14, alignItems: 'flex-start' }}><PillLabel color={colors.coral}>{children}</PillLabel></View>
);

// ─── kicker 10,5/600 uppercase tracking 1,5 (au-dessus des gros chiffres) ─
export const Kicker = ({ children, style }) => <Text style={[s.kicker, style]}>{children}</Text>;

// ─── ligne de source : tiret + texte 11 uppercase ───────────────────
export function SourceLine({ children }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <View style={{ width: 14, height: 1, backgroundColor: alpha(colors.muted, 0.5) }} />
      <Text style={s.source}>{children}</Text>
    </View>
  );
}

// ─── card crème avec « ombre d'accent » pleine décalée (signature embossed) ─
export function AccentCard({ children, accent, dx = 6, dy = 8, opacity = onb.heroShadowAlpha, r = radius.cardLg, padding, style }) {
  return (
    <View style={style}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: r, backgroundColor: accent, opacity, transform: [{ translateX: dx }, { translateY: dy }] }]} />
      <Card r={r} padding={padding}>{children}</Card>
    </View>
  );
}

// ─── CTA onboarding : gradient Mochi, 17 de padding, texte 16/600 ───
export function CtaOnb({ label, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      <LinearGradient {...gradients.mochi} style={[s.cta, shadows.cta]}>
        <Text style={[font.cta, { fontSize: 16 }]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export const onbStyles = StyleSheet.create({
  page: { paddingHorizontal: space.headerX },
  h22: { fontSize: 22, fontWeight: '600', letterSpacing: -1, lineHeight: 23, color: colors.ink },
  coral: { color: colors.coral },
  body: { fontSize: 14.5, fontWeight: '400', lineHeight: 22, color: colors.inkSoft },
  unit: { fontWeight: '500', color: colors.coral, fontStyle: 'italic' },
  micro: { ...font.micro, marginBottom: 10 },
});

const s = StyleSheet.create({
  header: { paddingTop: 14, paddingHorizontal: space.headerX, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bar: { width: 18, height: 4, borderRadius: 2 },
  skip: { fontSize: 13, fontWeight: '500', color: colors.muted },
  kicker: { fontSize: 10.5, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', color: colors.muted, marginBottom: 6 },
  source: { fontSize: 11, fontWeight: '500', letterSpacing: 1.2, textTransform: 'uppercase', color: colors.muted },
  cta: { borderRadius: radius.row, paddingVertical: 17, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
});
