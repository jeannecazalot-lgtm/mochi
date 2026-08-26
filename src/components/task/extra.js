// ═══════════════════════════════════════════════════════════════════
// extra.js — composants propres aux écrans tâche (14/15/16).
// Tokens locaux dérivés de theme.js (alpha) ; aucune couleur hex ici.
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { colors, alpha, radius, gradients, shadows, font } from '../../theme';
import { Card, Micro } from '../ui';

export const taskTokens = {
  chipBg: alpha(colors.ink, 0.05),
  circleBg: alpha(colors.ink, 0.06),
  toggleOff: alpha(colors.ink, 0.12),
  linkLine: alpha(colors.ink, 0.15),
  coralChipBg: alpha(colors.coral, 0.12),
  coralChipSoft: alpha(colors.coral, 0.10),
  contentX: 22,
  headerX: 16,
};

// ─── icônes outline (paths de l'artboard) ───────────────────────────
export const ChevronLeft = ({ size = 18, color = colors.ink }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d="M15 5l-7 7 7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></Svg>
);
export const ChevronRight = ({ color = colors.muted }) => <Text style={{ fontSize: 16, color }}>›</Text>;
export const CheckMark = ({ size = 9 }) => (
  <Svg width={size} height={size} viewBox="0 0 12 12"><Path d="M2 6l3 3 5-6" stroke={colors.white} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg>
);

// ─── bouton rond 36 crème + hairline ────────────────────────────────
export function RoundButton({ onPress, children, label }) {
  return (
    <Pressable onPress={onPress} accessibilityLabel={label} hitSlop={8} style={({ pressed }) => [s.round, { opacity: pressed ? 0.7 : 1 }]}>
      {children}
    </Pressable>
  );
}

// ─── header des écrans tâche : retour · titre micro · slot droit ────
export function TaskHeader({ title, right, backLabel }) {
  return (
    <View style={s.header}>
      <RoundButton onPress={() => router.back()} label={backLabel}><ChevronLeft /></RoundButton>
      <Text style={s.headerTitle}>{title}</Text>
      {right || <View style={{ width: 36 }} />}
    </View>
  );
}

// ─── micro-label de section ─────────────────────────────────────────
export const Section = ({ label, children, gap = 7 }) => (
  <View>
    <Micro style={{ marginBottom: gap }}>{label}</Micro>
    {children}
  </View>
);

// ─── toggle 40×24 (sage / encre 12 %) ───────────────────────────────
export function Toggle({ on, onChange }) {
  return (
    <Pressable onPress={() => onChange && onChange(!on)} accessibilityRole="switch" accessibilityState={{ checked: !!on }} hitSlop={6}
      style={[s.toggle, { backgroundColor: on ? colors.sage : taskTokens.toggleOff }]}>
      <View style={[s.knob, { left: on ? 18 : 2 }]} />
    </Pressable>
  );
}

// ─── chip valeur (fréquence, fenêtre, tags) ─────────────────────────
export function Chip({ children, tone = 'ink', onPress, small, selected }) {
  const coral = tone === 'coral' || tone === 'coralSoft';
  const bg = tone === 'coral' ? taskTokens.coralChipBg : tone === 'coralSoft' ? taskTokens.coralChipSoft : selected ? colors.ink : taskTokens.chipBg;
  const color = coral ? colors.coralDeep : tone === 'muted' ? colors.muted : selected ? colors.card : colors.ink;
  const inner = (
    <View style={[s.chip, small && s.chipSmall, { backgroundColor: bg }]}>
      <Text style={[small ? s.chipTextSmall : s.chipText, { color }, font.tabular]}>{children}</Text>
    </View>
  );
  return onPress ? <Pressable onPress={onPress} hitSlop={4}>{inner}</Pressable> : inner;
}

// ─── tuile de stat (DURÉE / PÉNIB. / IMPORT.) ───────────────────────
export function StatTile({ label, value, hint, onPress, active }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.8 : 1 }]}>
      <Card r={13} padding={0} style={[s.tile, active && { borderColor: colors.ink }]}>
        <Text style={s.tileLabel}>{label}</Text>
        <Text style={[s.tileValue, font.tabular]}>{value}</Text>
        {hint ? <Text style={s.tileHint}>{hint}</Text> : null}
      </Card>
    </Pressable>
  );
}

// ─── rangée de points 1→5 (pénibilité) — points pleins, plus d'étoiles ─
export function Stars({ value, onChange, color = colors.ink }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Pressable key={n} onPress={() => onChange(n)} hitSlop={4}>
          <Text style={{ fontSize: 18, color: n <= value ? color : taskTokens.toggleOff }}>●</Text>
        </Pressable>
      ))}
    </View>
  );
}

// ─── segment 3 options (assignation) ────────────────────────────────
export function Segmented({ options, value, onChange }) {
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {options.map(o => {
        const on = o.k === value;
        return (
          <Pressable key={o.k} onPress={() => onChange(o.k)} style={[s.seg, on && { backgroundColor: colors.ink }]}>
            <Text style={[s.segTitle, { color: on ? colors.card : colors.ink }]}>{o.l}</Text>
            <Text style={[s.segSub, { color: on ? colors.card : colors.ink }]}>{o.s}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── rangée d'option : titre + sous-texte + contrôle ────────────────
export function OptionRow({ title, sub, first, control, onPress }) {
  const inner = (
    <View style={[s.optRow, !first && s.optRowLine]}>
      <View style={{ flex: 1 }}>
        <Text style={s.optTitle}>{title}</Text>
        {sub ? <Text style={s.optSub}>{sub}</Text> : null}
      </View>
      {control}
    </View>
  );
  return onPress ? <Pressable onPress={onPress}>{inner}</Pressable> : inner;
}

// ─── CTA des écrans tâche : gradient Mochi, padding 11, texte 16/600 ─
export function TaskCTA({ label, onPress, disabled }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => ({ opacity: disabled ? 0.5 : pressed ? 0.85 : 1, alignSelf: 'stretch' })}>
      <LinearGradient {...gradients.mochi} style={[s.cta, shadows.cta]}>
        <Text style={s.ctaText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

// ─── footer blanc compact (artboard : 9 14 19) ──────────────────────
export function TaskFooter({ children, bottom = 19 }) {
  return <View style={[s.footer, { paddingBottom: bottom }]}>{children}</View>;
}

const s = StyleSheet.create({
  round: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  header: { paddingTop: 10, paddingHorizontal: taskTokens.headerX, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 11.5, letterSpacing: 1.6, fontWeight: '600', color: colors.ink, textTransform: 'uppercase' },
  toggle: { width: 40, height: 24, borderRadius: radius.pill },
  knob: { position: 'absolute', top: 2, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.card, shadowColor: colors.ink, shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
  chip: { paddingVertical: 6, paddingHorizontal: 9, borderRadius: radius.pill, alignSelf: 'flex-start' },
  chipSmall: { paddingHorizontal: 8 },
  chipText: { fontSize: 14.5, fontWeight: '600' },
  chipTextSmall: { fontSize: 11, fontWeight: '600' },
  tile: { paddingVertical: 6, paddingHorizontal: 10 },
  tileLabel: { fontSize: 9.5, letterSpacing: 1, color: colors.muted, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase' },
  tileValue: { fontSize: 19, fontWeight: '700', letterSpacing: -0.4, color: colors.ink },
  tileHint: { fontSize: 9.5, color: colors.lavenderDeep, fontWeight: '500', marginTop: 2 },
  seg: { flex: 1, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 8, alignItems: 'center' },
  segTitle: { fontSize: 14.5, fontWeight: '600' },
  segSub: { fontSize: 10.5, fontWeight: '400', opacity: 0.6, marginTop: 2 },
  optRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  optRowLine: { borderTopWidth: 1, borderTopColor: colors.line },
  optTitle: { fontSize: 15, fontWeight: '500', color: colors.ink },
  optSub: { fontSize: 12, color: colors.muted, fontWeight: '400', marginTop: 2 },
  cta: { borderRadius: radius.row, paddingVertical: 11, paddingHorizontal: 16, alignItems: 'center' },
  ctaText: { fontSize: 16, fontWeight: '600', color: colors.ink },
  footer: { backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.footerLine, paddingTop: 9, paddingHorizontal: 14 },
});
