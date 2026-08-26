// ═══════════════════════════════════════════════════════════════════
// extra.js — composants partagés des PLANCHES DE PROPOSITIONS (app/props/*).
// Maquettes STATIQUES jetables pour que Jeanne arbitre : rien d'interactif
// à part le retour. Textes en dur assumés ici (hors règle copy.json).
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { ScreenTitle, Secondary, PillLabel } from '../ui';
import { colors, space } from '../../theme';

// ─── en-tête de planche : bouton retour rond + titre + sous-titre ───
export function PropsHeader({ title, sub }) {
  return (
    <View style={{ paddingHorizontal: space.headerX, paddingTop: 8 }}>
      <Pressable onPress={() => router.back()} hitSlop={12} style={s.back} accessibilityLabel="Retour">
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Path d="M15 5l-7 7 7 7" stroke={colors.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>
      <ScreenTitle style={{ marginTop: 14, letterSpacing: -1.1, lineHeight: 24 }}>{title}</ScreenTitle>
      {sub ? <Secondary style={{ marginTop: 6, lineHeight: 20 }}>{sub}</Secondary> : null}
    </View>
  );
}

// ─── bloc d'une proposition : pill « PROPOSITION X » + justification ─
export function PropBlock({ letter, color = colors.coralDeep, why, children }) {
  return (
    <View style={{ marginTop: 24 }}>
      <PillLabel color={color}>{`PROPOSITION ${letter}`}</PillLabel>
      <Secondary style={{ marginTop: 8, marginBottom: 10, lineHeight: 19 }}>{why}</Secondary>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  back: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
});
