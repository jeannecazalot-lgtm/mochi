// ═══════════════════════════════════════════════════════════════════
// extra.js — composants + tokens propres aux écrans premium (35-38).
// Ne redéfinit rien de ui.js ; styles depuis theme.js.
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { colors, radius, font } from '../../theme';
import { Card, CTAPrimary } from '../ui';

// tokens manquants dans theme.js (append interdit ici → locaux à premium)
export const premiumTokens = {
  checkDot: '#C9E0C5',                     // pastille ✓ des avantages (artboard 37)
  todayShadow: { shadowColor: colors.ink, shadowOpacity: 0.28, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 6 }, // case « aujourd'hui » (artboard 35)
};

// liens légaux du paywall — EULA Apple standard ; privacy À HÉBERGER (legal/privacy.html) puis renseigner ici
export const LEGAL_URLS = {
  eula: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  privacy: '',
};

// ─── bouton rond 34 crème + hairline : retour (←), fermer (×), chevrons ‹ › ─
const ICON = {
  back: 'M15 5l-7 7 7 7',
  close: 'M6 6l12 12M18 6L6 18',
  prev: 'M14 6l-6 6 6 6',
  next: 'M10 6l6 6-6 6',
};
export function RoundButton({ icon = 'back', onPress, size = 34, label }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={8} style={({ pressed }) => [s.round, { width: size, height: size, borderRadius: size / 2, opacity: pressed ? 0.7 : 1 }]}>
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <Path d={ICON[icon]} />
      </Svg>
    </Pressable>
  );
}
export const BackButton = ({ label }) => <RoundButton icon="back" onPress={() => router.back()} label={label} />;

// ─── bandeau gating Duo+ : card accent butter + CTA vers /paywall ───
export function PremiumGate({ title, sub, cta, style }) {
  return (
    <Card accent={colors.butter} r={radius.card} padding={0} style={[{ marginHorizontal: 22 }, style]}>
      <View style={s.gateRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.gateTitle}>{title}</Text>
          <Text style={s.gateSub}>{sub}</Text>
        </View>
        <CTAPrimary label={cta} onPress={() => router.push('/paywall')} style={{ alignSelf: 'center' }} />
      </View>
    </Card>
  );
}

// ─── micro-titre de section (11,5/600 tracking 1,5 uppercase) ──────
export const SectionMicro = ({ children, style }) => <Text style={[font.micro, { letterSpacing: 1.5, marginBottom: 9 }, style]}>{children}</Text>;

// ─── pastille ✓ 20 (liste d'avantages, 37) ──────────────────────────
export function CheckDot() {
  return (
    <View style={s.checkDot}>
      <Svg width={10} height={10} viewBox="0 0 12 12" fill="none" stroke={colors.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><Path d="M2 6l3 3 5-6" /></Svg>
    </View>
  );
}

// ─── rangée de réglage (38) : emoji + titre 15,5/500 + sous-titre 12 + chevron ou élément droit ─
export function SettingRow({ emoji, title, sub, onPress, right, disabled }) {
  const inner = (
    <View style={s.setting}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={s.settingTitle}>{title}</Text>
        {sub ? <Text style={s.settingSub}>{sub}</Text> : null}
      </View>
      {right !== undefined ? right : (onPress ? <Text style={{ fontSize: 16, color: colors.muted }}>›</Text> : null)}
    </View>
  );
  if (!onPress || disabled) return inner;
  return <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}>{inner}</Pressable>;
}

const s = StyleSheet.create({
  round: { backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  gateRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  gateTitle: { fontSize: 14.5, fontWeight: '600', color: colors.ink },
  gateSub: { fontSize: 12.5, fontWeight: '400', color: colors.muted, marginTop: 2, lineHeight: 17 },
  checkDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: premiumTokens.checkDot, alignItems: 'center', justifyContent: 'center' },
  setting: { backgroundColor: colors.glass, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: radius.row, paddingVertical: 11, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 13 },
  settingTitle: { fontSize: 15.5, fontWeight: '500', color: colors.ink },
  settingSub: { fontSize: 12, fontWeight: '400', color: colors.muted, marginTop: 3 },
});

