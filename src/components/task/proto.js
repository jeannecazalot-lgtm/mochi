// ═══════════════════════════════════════════════════════════════════
// proto.js — briques de la sheet Tâche v2 (proto statique, 5 sept 2026).
// Recette : docs/recettes/17c-sheet-tache-v2.md. Zéro émoji. Aucune couleur hex.
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Card, Micro, Avatar, PillLabel } from '../ui';
import { CheckCircle, Chevron } from '../social/extra';
import { Animated, useCheckPop } from '../motion';
import { colors, alpha, radius, font } from '../../theme';

// ─── rangée générique : label · (sous-texte) · contrôle à droite ────
export function Row({ label, sub, right, first, onPress, strong, left }) {
  const inner = (
    <View style={[s.row, !first && s.rowLine]}>
      {left}
      <View style={{ flex: 1 }}>
        <Text style={strong ? s.rowStrong : s.rowLabel}>{label}</Text>
        {sub ? <Text style={s.rowSub}>{sub}</Text> : null}
      </View>
      {right}
    </View>
  );
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}>{inner}</Pressable> : inner;
}

// ─── stepper − valeur + (ronds 26 encre 6 %) ────────────────────────
export function Stepper({ value, onMinus, onPlus }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Pressable onPress={onMinus} hitSlop={8} style={s.stepBtn}><Text style={s.stepTxt}>−</Text></Pressable>
      <Text style={s.stepVal}>{value}</Text>
      <Pressable onPress={onPlus} hitSlop={8} style={s.stepBtn}><Text style={s.stepTxt}>+</Text></Pressable>
    </View>
  );
}

// ─── chip pill : sélection = fond encre / texte crème ───────────────
export function PillChip({ label, selected, onPress, avatar, flex, dim }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.chip, flex && { flex: 1, paddingHorizontal: 4 }, selected && s.chipOn, dim && { opacity: 0.35 }, pressed && { opacity: 0.7 }]}>
      {avatar ? <Avatar initial={avatar.initial} color={avatar.color} photo={avatar.avatar_url} size={18} /> : null}
      {/* 7 chips jours en ligne : « sam » passait sur deux lignes et sortait du rond (retour Jeanne 9 sept 2026) */}
      <Text numberOfLines={1} style={[s.chipTxt, selected && { color: colors.card }]}>{label}</Text>
    </Pressable>
  );
}

// ─── groupe de réglage de la règle : titre + chips qui wrap ─────────
export function RuleGroup({ label, children, first, row }) {
  return (
    <View style={[s.group, !first && s.rowLine]}>
      <Text style={s.rowLabel}>{label}</Text>
      <View style={[s.chips, row && { flexWrap: 'nowrap' }]}>{children}</View>
    </View>
  );
}

// ─── ligne de confirmation (variante B, choisie par Jeanne le 10 sept 2026) : la sheet garde
// sa forme, la première carte devient une ligne d'état — avatar de l'autre ou coche à gauche,
// pastille à droite. Sert à toutes les confirmations (proposé, rendu, déplacé, rappel, fait).
export function ConfirmRow({ kind, title, sub, pill, who }) {
  return (
    <Row first strong label={title} sub={sub}
      left={kind === 'swap' && who ? <Avatar initial={who.initial} color={who.color} photo={who.avatar_url} size={22} /> : <CheckCircle done size={22} />}
      right={pill ? <PillLabel color={colors.lavenderDeep}>{pill}</PillLabel> : null} />
  );
}

// ─── bloc de confirmation (variante A, gardée pour le proto) ─────────
export function ConfirmBlock({ kind, title, sub, pill, who }) {
  const pop = useCheckPop(true);
  return (
    <View style={s.confirm}>
      <Animated.View style={pop}>
        {kind === 'swap' && who
          ? <Avatar initial={who.initial} color={who.color} size={48} />
          : <CheckCircle done size={48} />}
      </Animated.View>
      <Text style={s.confirmTitle}>{title}</Text>
      <Text style={s.confirmSub}>{sub}</Text>
      {pill ? <View style={{ marginTop: 10 }}><PillLabel color={colors.lavenderDeep}>{pill}</PillLabel></View> : null}
    </View>
  );
}

export const DoneCircle = ({ done, size = 22 }) => <CheckCircle done={done} size={size} />;
export const Arrow = () => <Chevron />;
export const Caption = ({ children, style }) => <Text style={[s.caption, style]}>{children}</Text>;

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  rowLine: { borderTopWidth: 1, borderTopColor: colors.line },
  rowLabel: { fontSize: 15, fontWeight: '500', color: colors.ink },
  rowStrong: { fontSize: 15.5, fontWeight: '600', color: colors.ink },
  rowSub: { ...font.caption, marginTop: 2 },
  stepBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: alpha(colors.ink, 0.06), alignItems: 'center', justifyContent: 'center' },
  stepTxt: { fontSize: 15, fontWeight: '600', color: colors.ink, lineHeight: 17 },
  stepVal: { fontSize: 15, fontWeight: '600', color: colors.ink, fontVariant: ['tabular-nums'], minWidth: 52, textAlign: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 30, paddingHorizontal: 11, borderRadius: radius.pill, backgroundColor: alpha(colors.ink, 0.05), borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipTxt: { fontSize: 13, fontWeight: '600', color: colors.ink },
  group: { paddingVertical: 11, paddingHorizontal: 14, gap: 9 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  confirm: { alignItems: 'center', paddingTop: 22, paddingBottom: 10, gap: 6 },
  confirmTitle: { fontSize: 20, fontWeight: '600', letterSpacing: -0.6, color: colors.ink, marginTop: 8 },
  confirmSub: { ...font.secondary, textAlign: 'center' },
  caption: { ...font.caption, textAlign: 'center' },
});
