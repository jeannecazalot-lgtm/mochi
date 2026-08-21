// ═══════════════════════════════════════════════════════════════════
// extra.js — composants et tokens supplémentaires du volet social
// (Ping 18, À faire 20/21, Activité 22). Tout style passe par theme.js.
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, font, radius, alpha, shadows } from '../../theme';

// tokens dérivés (alphas d'encre de l'artboard)
export const social = {
  scrim: alpha(colors.ink, 0.35),
  chipBg: alpha(colors.ink, 0.05),
  attachBg: alpha(colors.ink, 0.04),
  handle: alpha(colors.ink, 0.15),
  checkRing: alpha(colors.ink, 0.28),
  rowBorder: alpha(colors.ink, 0.06),
  raisedShadow: { shadowColor: colors.ink, shadowOpacity: 0.35, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
  filterActiveShadow: { shadowColor: colors.ink, shadowOpacity: 0.10, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  swipeSwap: alpha(colors.lavender, 0.35),
  swipePostpone: alpha(colors.butter, 0.35),
};

// ─── bouton rond 36 crème + hairline (retour ←) ─────────────────────
export function BackButton({ onPress, size = 36 }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => [s.round, { width: size, height: size, borderRadius: size / 2, opacity: pressed ? 0.7 : 1 }]}>
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M19 12H5M12 19l-7-7 7-7" />
      </Svg>
    </Pressable>
  );
}

// ─── header centré : retour · TITRE micro 11,5/600 tracking 1,6 · spacer ──
export function CenterHeader({ title, onBack, paddingX = 20, size = 36 }) {
  return (
    <View style={[s.header, { paddingHorizontal: paddingX }]}>
      <BackButton onPress={onBack} size={size} />
      <Text style={s.headerTitle}>{title}</Text>
      <View style={{ width: size }} />
    </View>
  );
}

// ─── chip de réponse préformatée 13/500, fond encre 5 % ─────────────
export function ReplyChip({ label, selected, onPress, muted }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.chip, selected && s.chipOn, { opacity: pressed ? 0.7 : 1 }]}>
      <Text style={[s.chipText, selected && { color: colors.card }, muted && { color: colors.muted, fontSize: 11, fontWeight: '600' }]}>{label}</Text>
    </Pressable>
  );
}

// ─── poignée de sheet 40×4 ──────────────────────────────────────────
export const SheetHandle = () => <View style={s.handle} />;

// ─── cercle de check 22 (bordure 2 ; fait = sage + ✓ blanc) ─────────
export function CheckCircle({ done, size = 22 }) {
  return (
    <View style={[s.check, { width: size, height: size, borderRadius: size / 2 }, done && s.checkOn]}>
      {done ? (
        <Svg width={11} height={11} viewBox="0 0 12 12" fill="none" stroke={colors.white} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M2 6l3 3 5-6" />
        </Svg>
      ) : null}
    </View>
  );
}

// ─── chip de filtre 13/500 + compteur ───────────────────────────────
export function FilterChip({ label, count, active, alert, onPress }) {
  return (
    <Pressable onPress={onPress} style={[s.filter, active ? [s.filterOn, social.filterActiveShadow] : alert ? s.filterAlert : null]}>
      <Text style={[s.filterText, active && { color: colors.card }, !active && alert && { color: colors.coralDeep }]}>{label}</Text>
      <Text style={[s.filterCount, active && { color: colors.card }, !active && alert && { color: colors.coralDeep }]}>{count}</Text>
    </Pressable>
  );
}

// ─── chevron › 16 muted ─────────────────────────────────────────────
export const Chevron = ({ size = 16 }) => <Text style={{ fontSize: size, color: colors.muted }}>›</Text>;

const s = StyleSheet.create({
  round: { backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  header: { paddingTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  headerTitle: { fontSize: 11.5, fontWeight: '600', letterSpacing: 1.6, textTransform: 'uppercase', color: colors.ink },
  chip: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: radius.pill, backgroundColor: alpha(colors.ink, 0.05) },
  chipOn: { backgroundColor: colors.ink },
  chipText: { fontSize: 13, fontWeight: '500', color: colors.ink },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: alpha(colors.ink, 0.15), alignSelf: 'center', marginBottom: 14 },
  check: { borderWidth: 2, borderColor: alpha(colors.ink, 0.28), alignItems: 'center', justifyContent: 'center' },
  checkOn: { borderColor: colors.sage, backgroundColor: colors.sage },
  filter: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 10, borderRadius: radius.pill, backgroundColor: colors.glass, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  filterOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  filterAlert: { backgroundColor: colors.card },
  filterText: { fontSize: 13, fontWeight: '500', color: colors.ink },
  filterCount: { fontSize: 11.5, fontWeight: '500', color: colors.ink, opacity: 0.6, ...font.tabular },
});
