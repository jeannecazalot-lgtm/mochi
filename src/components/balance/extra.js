// ═══════════════════════════════════════════════════════════════════
// balance/extra.js — composants propres aux écrans Balance (21), Balance
// détail (22) et Point hebdo (23). Tout style passe par theme.js.
// Source : duo-embossed-pings-balance-malus.jsx (ScreenHeader, RoundBtn,
// barre scindée, barres verticales, card « offset » colorée, pill sombre).
// ═══════════════════════════════════════════════════════════════════
import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { Card } from '../ui';
import { prefersReducedMotion } from '../motion';
import { colors, font, radius, space, alpha, motion } from '../../theme';

// ─── en-tête des écrans poussés : bouton rond à gauche, titre micro centré ─
export function ScreenHeader({ title, onBack, right, sub }) {
  return (
    <View style={s.header}>
      <View style={s.headerRow}>
        {onBack ? <RoundBtn onPress={onBack}><BackIcon /></RoundBtn> : <View style={{ width: 38 }} />}
        <Text style={s.headerTitle}>{title}</Text>
        {right ?? <View style={{ width: 38 }} />}
      </View>
      {sub ? <Text style={s.headerSub}>{sub}</Text> : null}
    </View>
  );
}

// ─── bouton rond 38, crème + hairline ────────────────────────────────
export function RoundBtn({ children, onPress }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => [s.round, { opacity: pressed ? 0.7 : 1 }]}>
      {children}
    </Pressable>
  );
}

const BackIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5M11 18l-6-6 6-6" />
  </Svg>
);

// ─── barre scindée : N segments animés (600 ms ease-out depuis 0) ───
// parts = [{ ratio 0…1, color }] — la somme des ratios fait 1 (ou moins)
export function SplitBar({ parts = [], height = 8, track = colors.line, delay = 0, style }) {
  return (
    <View style={[{ height, borderRadius: height / 2, backgroundColor: track, overflow: 'hidden', flexDirection: 'row' }, style]}>
      {parts.map((p, i) => <Segment key={i} ratio={p.ratio} color={p.color} delay={delay} />)}
    </View>
  );
}
function Segment({ ratio, color, delay }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withDelay(delay, withTiming(Math.max(0, Math.min(1, ratio)), { duration: prefersReducedMotion() ? 0 : motion.progress, easing: Easing.out(Easing.cubic) }));
  }, [ratio]);
  const st = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return <Animated.View style={[{ height: '100%', backgroundColor: color }, st]} />;
}

// ─── barre verticale (chart 7 jours du détail) : hauteur animée ─────
export function VBar({ ratio = 0, color, width = 8, max = 70, delay = 0 }) {
  const h = useSharedValue(0);
  useEffect(() => {
    h.value = withDelay(delay, withTiming(Math.max(0, Math.min(1, ratio)), { duration: prefersReducedMotion() ? 0 : motion.progress, easing: Easing.out(Easing.cubic) }));
  }, [ratio]);
  const st = useAnimatedStyle(() => ({ height: h.value * max }));
  return <Animated.View style={[{ width, backgroundColor: color, borderTopLeftRadius: 3, borderTopRightRadius: 3 }, st]} />;
}

// ─── card crème posée sur un aplat coloré décalé (3,4) à 35 % ───────
export function OffsetCard({ accent, children, r = radius.row, padding, offset = { x: 3, y: 4 }, opacity = 0.35, style, onPress }) {
  const inner = (
    <View style={[{ marginBottom: 6 }, style]}>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: r, backgroundColor: accent, opacity, transform: [{ translateX: offset.x }, { translateY: offset.y }] }]} />
      <Card r={r} padding={padding}>{children}</Card>
    </View>
  );
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>{inner}</Pressable> : inner;
}

// ─── pill sombre : encre, texte crème 13.5/600 tabulaire (« +3 ») ───
export function DarkPill({ children }) {
  return (
    <View style={s.darkPill}><Text style={s.darkPillText}>{children}</Text></View>
  );
}

// ─── titre de section micro, aligné sur le padding header (23) ──────
export function SectionMicro({ children, style }) {
  return <Text style={[font.micro, s.sectionMicro, style]}>{children}</Text>;
}

// ─── rangée contributeur / malus : emoji · titre 15.5/500 + sous 12 · à droite ─
export function InfoRow({ emoji, title, sub, right }) {
  return (
    <View style={s.infoRow}>
      <Text style={{ fontSize: 19 }}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={s.infoTitle}>{title}</Text>
        {sub ? <Text style={s.infoSub}>{sub}</Text> : null}
      </View>
      {right}
    </View>
  );
}

// ─── puce « idée » : crème + hairline, 13/500 ; sélectionnée = encre ──
export function ChoiceChip({ label, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.chip, selected && s.chipOn, { opacity: pressed ? 0.8 : 1 }]}>
      <Text style={[s.chipText, selected && { color: colors.card }]}>{label}</Text>
    </Pressable>
  );
}

// ─── encart note (⚠️ + texte) sur fond coral 10 % ────────────────────
export function NoteBox({ emoji, lead, strong, tint = colors.coral }) {
  return (
    <View style={[s.note, { backgroundColor: alpha(tint, 0.10) }]}>
      <Text style={{ fontSize: 15 }}>{emoji}</Text>
      <Text style={s.noteText}>{lead}<Text style={{ fontWeight: '700' }}>{strong}</Text></Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 14, paddingHorizontal: space.screenX },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 11.5, letterSpacing: 1.6, fontWeight: '600', textTransform: 'uppercase', color: colors.ink },
  headerSub: { marginTop: 6, fontSize: 13, color: colors.muted, fontWeight: '400', textAlign: 'center' },
  round: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  darkPill: { backgroundColor: colors.ink, paddingVertical: 8, paddingHorizontal: 10, borderRadius: radius.pill },
  darkPillText: { color: colors.card, fontSize: 13.5, fontWeight: '600', fontVariant: ['tabular-nums'] },
  sectionMicro: { paddingHorizontal: space.headerX, paddingTop: 8, paddingBottom: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  infoTitle: { fontSize: 15.5, fontWeight: '500', color: colors.ink },
  infoSub: { fontSize: 12, fontWeight: '400', color: colors.muted, marginTop: 3 },
  chip: { backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, borderRadius: radius.pill, paddingVertical: 8, paddingHorizontal: 10 },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontSize: 13, fontWeight: '500', color: colors.ink },
  note: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 },
  noteText: { flex: 1, fontSize: 13.5, fontWeight: '500', color: colors.ink, lineHeight: 18 },
});
