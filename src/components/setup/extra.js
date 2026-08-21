// ═══════════════════════════════════════════════════════════════════
// extra.js — composants partagés des écrans setup 07 → 13 (DNA Embossed).
// Complète ui.js sans le modifier. Tout style passe par theme.js.
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { PillLabel, CTAPrimary, CTASecondary } from '../ui';
import { colors, radius, space, font, alpha } from '../../theme';
import copy from '../../data/copy.json';

export const fill = (s, vars = {}) => Object.keys(vars).reduce((acc, k) => acc.split(`{${k}}`).join(String(vars[k])), s);

// ─── en-tête embossed : pastille « ÉTAPE n/4 » + « Passer » (09, 10, 13) ─
export function StepPillHeader({ step, total = 4, onSkip, pill }) {
  const label = pill ?? fill(copy.setup.stepOf, { n: step, total });
  return (
    <View style={s.pillHeader}>
      <PillLabel color={colors.coral}>{label}</PillLabel>
      {onSkip ? <Pressable onPress={onSkip} hitSlop={10}><Text style={s.skip}>{copy.setup.skip}</Text></Pressable> : <View />}
    </View>
  );
}

// ─── titre d'étape 22/600 + sous-titre 14/400 (padding 14 23 0) ────
export function StepTitle({ title, sub }) {
  return (
    <View style={{ paddingHorizontal: space.headerX, paddingTop: 14 }}>
      <Text style={[font.screenTitle, { letterSpacing: -1.1, lineHeight: 23 }]}>{title}</Text>
      {sub ? <Text style={[font.secondary, { fontSize: 14, marginTop: 6, lineHeight: 20 }]}>{sub}</Text> : null}
    </View>
  );
}

// ─── bloc CTA posé sur le fond (bottom 24–26, marges 18), 1 ou 2 boutons ─
export function BottomCTA({ primary, onPrimary, secondary, onSecondary, bottom = 24, disabled }) {
  if (secondary) {
    return (
      <View style={[s.bottom, { bottom, flexDirection: 'row', gap: 8 }]}>
        <CTASecondary label={secondary} onPress={onSecondary} style={{ flex: 1, paddingVertical: 14 }} />
        <CTAPrimary label={primary} onPress={onPrimary} disabled={disabled} style={{ flex: 1.6 }} />
      </View>
    );
  }
  return <View style={[s.bottom, { bottom }]}><CTAPrimary label={primary} onPress={onPrimary} disabled={disabled} big /></View>;
}

// ─── interrupteur 42×24 (10) ────────────────────────────────────────
export function Toggle({ on, onPress }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={[s.toggle, { backgroundColor: on ? colors.darkPill : alpha(colors.ink, 0.10) }]}>
      <View style={[s.knob, { left: on ? 20 : 2 }]} />
    </Pressable>
  );
}

// ─── place vide en pointillés « ? » (09) ────────────────────────────
export function AvatarPlaceholder({ size = 54 }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderStyle: 'dashed', borderColor: alpha(colors.ink, 0.25), backgroundColor: alpha(colors.ink, 0.03), alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.muted, fontSize: size * 0.39, fontWeight: '600' }}>?</Text>
    </View>
  );
}

// ─── micro-label de section avec couleur optionnelle ────────────────
export const SectionLabel = ({ children, color = colors.muted, style }) => (
  <Text style={[font.micro, { color, marginBottom: 9 }, style]}>{children}</Text>
);

const s = StyleSheet.create({
  pillHeader: { paddingHorizontal: space.headerX, paddingTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skip: { fontSize: 13, fontWeight: '500', color: colors.muted },
  bottom: { position: 'absolute', left: space.screenX, right: space.screenX },
  toggle: { width: 42, height: 24, borderRadius: 12 },
  knob: { position: 'absolute', top: 2, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.card, shadowColor: colors.ink, shadowOpacity: 0.18, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
});

// ─── tokens manquants dans theme.js (à y déplacer par l'intégrateur) ─
// teintes « on » des chips de préférences (08) : sage clair / pêche de l'artboard
export const setupTokens = { chipLike: '#C9E0C5', chipHate: '#F5A89A' };
