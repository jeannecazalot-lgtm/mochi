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
  const sc = useSharedValue(1);
  useEffect(() => { if (on && i >= prevLit) sc.value = withDelay((i - prevLit) * 28, withSequence(withTiming(1.35, { duration: 90 }), withSpring(1, { damping: 12, stiffness: 260 }))); }, [on]);
  const st = useAnimatedStyle(() => ({ transform: [{ scaleY: sc.value }] }));
  return <Animated.View style={[{ flex: 1, height: 14, borderRadius: 2, backgroundColor: on ? T.ink : T.seg }, st]} />;
}
export function Meter({ T, n, of, segs = 20 }) {
  const lit = of ? Math.round((n / of) * segs) : 0;
  const prev = useRef(lit); useEffect(() => { prev.current = lit; }, [lit]);
  return <View style={{ flexDirection: 'row', gap: 3, flex: 1 }}>{Array.from({ length: segs }).map((_, i) => <Seg key={i} T={T} on={i < lit} i={i} prevLit={Math.min(prev.current, lit)} />)}</View>;
}
function Heart({ T, on, changed }) {
  const sc = useSharedValue(1);
  useEffect(() => { if (changed) sc.value = withSequence(withTiming(1.8, { duration: 120 }), withSpring(1, { damping: 10, stiffness: 220 })); }, [on]);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return <Animated.View style={[{ width: 10, height: 10, borderRadius: 5, backgroundColor: on ? T.accent : T.seg }, st]} />;
}
export function Hearts({ T, n }) {
  const prev = useRef(n); useEffect(() => { prev.current = n; }, [n]);
  return <View style={{ flexDirection: 'row', gap: 8, flex: 1 }}>{[1, 2, 3, 4, 5].map(i => <Heart key={i} T={T} on={i <= n} changed={(i <= n) !== (i <= prev.current)} />)}</View>;
}
// deux lignes : énergie du jour, forme
export function Gauges({ T, t, energy, hearts, formLabel }) {
  const A = layout.air;
  return (
    <View style={{ marginHorizontal: layout.x, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
      <View style={[s.row, { paddingVertical: 18 * A, borderColor: T.line }]}>
        <Label T={T} style={{ width: 66 }}>{t.energy}</Label>
        <Meter T={T} n={energy.done} of={energy.total} />
        <Num T={T}>{energy.done}<Text style={{ color: T.muted, fontWeight: '500' }}> / {energy.total}</Text></Num>
      </View>
      <View style={[s.row, { paddingVertical: 18 * A, borderColor: T.line }]}>
        <Label T={T} style={{ width: 66 }}>{t.form}</Label>
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
