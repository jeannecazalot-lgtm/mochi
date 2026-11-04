// ═══════════════════════════════════════════════════════════════════
// moments/extra.js — composants + tokens propres aux moments gamifiés
// (24-25 Wrapped, 26 Bilan, 28 Célébration). Rien ici ne redéfinit ui.js.
// ═══════════════════════════════════════════════════════════════════
import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect, Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { colors, gradients, radius, alpha, motion } from '../../theme';
import { styles as v3Styles, currentTokens as tk } from '../../theme-v3';

// ─── tokens supplémentaires (fond sombre des stories, or du badge) ──
export const moments = {
  darkBg: tk().ink,                         // #1A1A1F
  cream: tk().bg,                          // #FFFCF5 = encre « claire » sur fond sombre
  cream90: alpha(tk().bg, 0.9),
  cream70: alpha(tk().bg, 0.7),
  cream60: alpha(tk().bg, 0.6),
  cream50: alpha(tk().bg, 0.5),
  cream40: alpha(tk().bg, 0.4),
  cream25: alpha(tk().bg, 0.25),
  cream10: alpha(tk().bg, 0.10),
  cream08: alpha(tk().bg, 0.08),
  heroPeach: gradients.mochi.colors[1],        // #FBC9A4 : substitut plein du texte en dégradé
  gold: '#8A6A1F',                             // micro-label « badge débloqué »
  lockedBg: alpha(tk().bg, 0.45),
  lockedBorder: tk().seg,
  glowCoral: alpha(gradients.mochi.colors[2], 0.25),   // rgba(245,168,154,.25)
  glowLavender: alpha('#E2D6F0', 0.22),
  glowButter: tk().scene.lamp,
  confetti: [gradients.mochi.colors[2], tk().scene.lamp, tk().ok, '#9A7BC8', '#7DB3D5'],
  storyDuration: 5000,
};

// ─── fond sombre des stories : encre + 3 halos à 50 % ──────────────
export function DarkBg() {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: moments.darkBg }]}>
      <Svg width="100%" height="100%" style={{ opacity: 0.5 }}>
        <Defs>
          <RadialGradient id="d1" cx="20%" cy="10%" rx="55%" ry="38%"><Stop offset="0" stopColor={moments.glowCoral} /><Stop offset="0.7" stopColor={moments.glowCoral} stopOpacity="0" /></RadialGradient>
          <RadialGradient id="d2" cx="85%" cy="88%" rx="60%" ry="42%"><Stop offset="0" stopColor={moments.glowLavender} /><Stop offset="0.72" stopColor={moments.glowLavender} stopOpacity="0" /></RadialGradient>
          <RadialGradient id="d3" cx="85%" cy="15%" rx="45%" ry="30%"><Stop offset="0" stopColor={moments.glowButter} /><Stop offset="0.7" stopColor={moments.glowButter} stopOpacity="0" /></RadialGradient>
        </Defs>
        {['d1', 'd2', 'd3'].map(id => <Rect key={id} width="100%" height="100%" fill={`url(#${id})`} />)}
      </Svg>
    </View>
  );
}

// ─── barre stories : n segments, le courant se remplit sur `duration` ─
export function StoryProgress({ count, index, duration = moments.storyDuration }) {
  return (
    <View style={s.storyRow}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[s.storySeg, { backgroundColor: i < index ? moments.cream : moments.cream25 }]}>
          {i === index ? <StoryFill key={`f${index}`} duration={duration} /> : null}
        </View>
      ))}
    </View>
  );
}
function StoryFill({ duration }) {
  const w = useSharedValue(0);
  useEffect(() => { w.value = withTiming(1, { duration, easing: Easing.linear }); }, []);
  const st = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return <Animated.View style={[{ height: '100%', borderRadius: 2, backgroundColor: moments.cream }, st]} />;
}

// ─── rangée sombre : icône · label · valeur ─────────────────────────
export function DarkRow({ icon, label, children }) {
  return (
    <View style={s.darkRow}>
      <Text style={{ fontSize: 19, color: moments.cream }}>{icon}</Text>
      <Text style={s.darkRowLabel}>{label}</Text>
      {children}
    </View>
  );
}
export const darkValue = { fontSize: 17, fontWeight: '700', letterSpacing: -0.4, color: moments.cream, fontVariant: ['tabular-nums'] };

// ─── barre scindée (bilan) : deux dégradés, largeurs animées 600 ms ──
export function SplitBar({ left = 0.5, height = 8, style }) {
  const p = useSharedValue(0);
  useEffect(() => { p.value = withTiming(1, { duration: motion.progress, easing: Easing.out(Easing.cubic) }); }, []);
  const l = useAnimatedStyle(() => ({ width: `${p.value * left * 100}%` }));
  const r = useAnimatedStyle(() => ({ width: `${p.value * (1 - left) * 100}%` }));
  return (
    <View style={[{ height, borderRadius: height / 2, backgroundColor: tk().line, overflow: 'hidden', flexDirection: 'row' }, style]}>
      <Animated.View style={l}><LinearGradient colors={['#7DB3D5', '#9A7BC8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} /></Animated.View>
      <Animated.View style={r}><LinearGradient colors={[gradients.mochi.colors[2], tk().accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} /></Animated.View>
    </View>
  );
}

// ─── bouton retour rond 36 (chevron ‹) ──────────────────────────────
export function BackButton({ onPress, style }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => [s.back, { opacity: pressed ? 0.7 : 1 }, style]}>
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={tk().ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M15 5l-7 7 7 7" />
      </Svg>
    </Pressable>
  );
}

// ─── remplace {clé} par la valeur ───────────────────────────────────
export const fill = (str, vars) => String(str).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));

const s = v3Styles(T => StyleSheet.create({
  storyRow: { flexDirection: 'row', gap: 5, paddingHorizontal: 18, paddingTop: 13 },
  storySeg: { flex: 1, height: 3, borderRadius: 2, overflow: 'hidden' },
  darkRow: { backgroundColor: moments.cream08, borderWidth: 0.5, borderColor: moments.cream10, borderRadius: radius.row, paddingVertical: 13, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 13 },
  darkRowLabel: { flex: 1, fontSize: 15.5, fontWeight: '500', color: moments.cream90 },
  back: { width: 36, height: 36, borderRadius: 18, backgroundColor: T.bg, borderWidth: StyleSheet.hairlineWidth, borderColor: T.line, alignItems: 'center', justifyContent: 'center' },
}));
