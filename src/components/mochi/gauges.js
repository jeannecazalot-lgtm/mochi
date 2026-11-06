// Jauges de l'instrument (DA v3 §6) : étiquettes en phrase normale, hairlines, vu-mètre à 20 segments,
// 5 points pour la forme, chiffres tabulaires. Aucune carte.
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withSequence, withTiming } from 'react-native-reanimated';
import { type, layout } from '../../theme-v3';

export const Label = ({ T, children, style }) => <Text style={[type.label, { color: T.muted }, style]}>{children}</Text>;
export const Num = ({ T, children, style }) => <Text style={[type.num, { color: T.ink }, style]}>{children}</Text>;
export const Hair = ({ T, style }) => <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: T.line }, style]} />;

function Seg({ T, on, i, prevLit }) {
  // un cran s'allume en fondu, en cascade (28 ms par cran) — sans pulsation (retour Jeanne 4 nov 2026)
  const op = useSharedValue(on ? 1 : 0);
  useEffect(() => { op.value = on ? withDelay(i >= prevLit ? (i - prevLit) * 28 : 0, withTiming(1, { duration: 180 })) : withTiming(0, { duration: 160 }); }, [on]);
  const st = useAnimatedStyle(() => ({ opacity: op.value }));
  return <View style={{ flex: 1, height: 10, borderRadius: 2, backgroundColor: T.seg }}><Animated.View style={[{ flex: 1, borderRadius: 2, backgroundColor: T.ink }, st]} /></View>;
}
export function Meter({ T, n, of, segs = 20 }) {
  const lit = of ? Math.round((n / of) * segs) : 0;
  const prev = useRef(lit); useEffect(() => { prev.current = lit; }, [lit]);
  return <View style={{ flexDirection: 'row', gap: 3, flex: 1 }}>{Array.from({ length: segs }).map((_, i) => <Seg key={i} T={T} on={i < lit} i={i} prevLit={Math.min(prev.current, lit)} />)}</View>;
}
function Heart({ T, on }) {
  const op = useSharedValue(on ? 1 : 0);
  useEffect(() => { op.value = withTiming(on ? 1 : 0, { duration: 220 }); }, [on]);
  const st = useAnimatedStyle(() => ({ opacity: op.value }));
  return <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: T.seg }}><Animated.View style={[{ flex: 1, borderRadius: 5, backgroundColor: T.accent }, st]} /></View>;
}
export function Hearts({ T, n }) {
  const prev = useRef(n); useEffect(() => { prev.current = n; }, [n]);
  return <View style={{ flexDirection: 'row', gap: 8, flex: 1 }}>{[1, 2, 3, 4, 5].map(i => <Heart key={i} T={T} on={i <= n} />)}</View>;
}
// deux lignes : énergie du jour, forme
export function Gauges({ T, t, energy, hearts, formLabel, hint }) {
  const A = layout.air;
  return (
    <View style={{ marginHorizontal: layout.x, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
      <View style={[s.row, { paddingVertical: 12 * A, borderColor: T.line }]}>
        <Label T={T} style={{ width: 60 }}>{t.energy}</Label>
        <Meter T={T} n={energy.done} of={energy.total} />
        <Num T={T}>{energy.done}<Text style={{ color: T.muted, fontWeight: '500' }}> / {energy.total}</Text></Num>
      </View>
      {hint ? <Label T={T} style={{ marginTop: -10 * A, paddingBottom: 12 * A }}>{hint}</Label> : null}
      <View style={[s.row, { paddingVertical: 12 * A, borderColor: T.line }]}>
        <Label T={T} style={{ width: 60 }}>{t.form}</Label>
        <Hearts T={T} n={hearts} />
        <Label T={T} style={{ color: T.ink }}>{formLabel}</Label>
      </View>
    </View>
  );
}
const s = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 18, borderBottomWidth: StyleSheet.hairlineWidth } });

// coche de l'instrument : rond hairline, plein encre quand c'est fait (même ressort que la coche v1)
import Svg, { Path } from 'react-native-svg';
import { useCheckFill } from '../motion';
export function Check({ T, done, size = 22 }) {
  const { fillStyle, checkStyle } = useCheckFill(done);
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1.5, borderColor: done ? T.ink : T.muted, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[{ position: 'absolute', left: -1.5, top: -1.5, width: size, height: size, borderRadius: size / 2, backgroundColor: T.ink }, fillStyle]} />
      <Animated.View style={checkStyle}><Svg width={11} height={11} viewBox="0 0 12 12"><Path d="M2.5 6.5l2.5 2.5 4.5-5" stroke={T.bg} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg></Animated.View>
    </View>
  );
}
