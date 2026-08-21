// ═══════════════════════════════════════════════════════════════════
// core/extra.js — composants supplémentaires des onglets (Accueil, Planning,
// Budget, FAB sheet, dépense). Tout style via theme.js. Aucune ombre hors artboard.
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Avatar } from '../ui';
import { colors, radius, alpha, font } from '../../theme';

// ─── icône outline à partir d'un path de l'artboard ─────────────────
export function Icon({ d, size = 21, color = colors.ink, sw = 1.8 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={d} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
export const ICON = {
  bubble: 'M4 5h16v11H8l-4 4V5z',
  grip: 'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01',
  check: 'M2 6l3 3 5-6',
  close: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  task: 'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11',
  event: 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z',
  expense: 'M3 8a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8zM3 10h18M16 15h2',
  note: 'M4 4h12l4 4v12H4V4zM16 4v4h4M8 12h8M8 16h5',
};

// ─── badge de mission : 11/700 tracking 0,6 uppercase, padding 8 10 ──
export function BadgePill({ children, color, tint = color, a = 0.16, size = 11 }) {
  return (
    <View style={[s.badge, { backgroundColor: alpha(tint, a) }]}>
      <Text style={{ fontSize: size, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase', color }}>{children}</Text>
    </View>
  );
}

// ─── cercle de check 24 : anneau 2 encre 22 % → rempli sage + ✓ blanc ─
export function CheckCircle({ done, size = 24 }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: done ? 0 : 2, borderColor: colors.checkRing, backgroundColor: done ? colors.sage : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
      {done ? <Svg width={11} height={11} viewBox="0 0 12 12"><Path d={ICON.check} stroke={colors.white} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg> : null}
    </View>
  );
}

// ─── segment pill (Semaine / Mois) : crème + hairline, actif = encre ──
export function Segment({ options, value, onChange }) {
  return (
    <View style={s.segment}>
      {options.map(o => {
        const on = o.value === value;
        return (
          <Pressable key={o.value} onPress={() => onChange(o.value)} style={[s.segmentOpt, on && { backgroundColor: colors.ink }]}>
            <Text style={{ fontSize: 13, fontWeight: on ? '600' : '500', color: on ? colors.card : colors.muted }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── boutons pill : dark (encre) / ghost (encre 5 %) ────────────────
export function PillButton({ label, onPress, dark, style }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.pillBtn, dark ? { backgroundColor: colors.ink } : { backgroundColor: alpha(colors.ink, 0.05) }, { opacity: pressed ? 0.85 : 1 }, style]}>
      <Text style={{ fontSize: 14.5, fontWeight: dark ? '600' : '500', color: dark ? colors.card : colors.ink }}>{label}</Text>
    </Pressable>
  );
}

// ─── chip de formulaire : crème + hairline, actif = encre ───────────
export function Chip({ label, on, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, on && { backgroundColor: colors.ink, borderColor: colors.ink }, style]}>
      <Text style={{ fontSize: 13.5, fontWeight: '500', color: on ? colors.card : colors.ink }}>{label}</Text>
    </Pressable>
  );
}

// ─── paire d'avatars chevauchés (tâche non assignée / divisible) ────
export function AvatarPair({ members, size = 24 }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {members.map((m, i) => (
        <View key={m.id} style={{ marginLeft: i ? -7 : 0 }}><Avatar initial={m.initial} color={m.color} size={size} ring /></View>
      ))}
    </View>
  );
}

// ─── bouton rond 36 crème + hairline (bulle activité, fermer) ───────
export function RoundButton({ children, onPress, size = 36, style, accessibilityLabel }) {
  return (
    <Pressable onPress={onPress} accessibilityLabel={accessibilityLabel} style={({ pressed }) => [s.round, { width: size, height: size, borderRadius: size / 2, opacity: pressed ? 0.7 : 1 }, style]}>
      {children}
    </Pressable>
  );
}

// ─── poignée de sheet ───────────────────────────────────────────────
export const SheetHandle = () => <View style={s.handle} />;

// ─── indice centré sous une liste ───────────────────────────────────
export const Hint = ({ children, size = 11.5, style }) => <Text style={[font.caption, { fontSize: size, textAlign: 'center' }, style]}>{children}</Text>;

const s = StyleSheet.create({
  badge: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: radius.pill },
  segment: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.pill, padding: 11, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  segmentOpt: { paddingVertical: 8, paddingHorizontal: 13, borderRadius: radius.pill },
  pillBtn: { flex: 1, borderRadius: radius.pill, paddingVertical: 11, paddingHorizontal: 14, alignItems: 'center' },
  chip: { backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, borderRadius: radius.pill, paddingVertical: 9, paddingHorizontal: 13 },
  round: { backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  handle: { width: 36, height: 5, borderRadius: radius.pill, backgroundColor: alpha(colors.ink, 0.15), alignSelf: 'center', marginBottom: 14 },
});
