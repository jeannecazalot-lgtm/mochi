// ═══════════════════════════════════════════════════════════════════
// motion.js — primitives d'animation (README handoff §Animations v1),
// react-native-reanimated 4. Respecte « réduire les animations » d'iOS.
// ═══════════════════════════════════════════════════════════════════
import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSpring, withSequence, withDelay, Easing, FadeIn, FadeInDown, FadeInUp, SlideInDown, SlideOutDown, ZoomIn } from 'react-native-reanimated';
import { LiveMochiImage } from './mochi-img';
import { motion, colors } from '../theme';

export { FadeIn, FadeInDown, FadeInUp, SlideInDown, SlideOutDown, ZoomIn, Animated };

let reduceMotion = false;
AccessibilityInfo.isReduceMotionEnabled().then(v => { reduceMotion = v; }).catch(() => {});
export const prefersReducedMotion = () => reduceMotion;

// 1+2 · Mochi vivant (images ChatGPT, 14 sept 2026) : respiration, cadre d'inclinaison, secousse à la coche et au toucher
export function LiveMochi({ size = 140, mood = 'happy', lean = 0, float = true }) {
  return <LiveMochiImage size={size} lean={lean} mood={mood} breathe={float && !reduceMotion} />;
}

// 5 · gros chiffre héros en count-up 500 ms
export function CountUp({ value, format = v => String(Math.round(v)), style, duration = motion.countUp }) {
  const [v, setV] = useState(reduceMotion ? value : 0);
  useEffect(() => {
    if (reduceMotion) { setV(value); return; }
    const start = Date.now(); let raf;
    const tick = () => { const p = Math.min(1, (Date.now() - start) / duration); const e = 1 - Math.pow(1 - p, 3); setV(value * e); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [value]);
  return <Text style={style}>{format(v)}</Text>;
}

// 4 · barre de progression : largeur animée 600 ms ease-out depuis 0
export function ProgressBar({ ratio = 0, color, track, height = 8, radius = 999, delay = 0, style }) {
  const w = useSharedValue(0);
  useEffect(() => { w.value = withDelay(delay, withTiming(Math.max(0, Math.min(1, ratio)), { duration: reduceMotion ? 0 : motion.progress, easing: Easing.out(Easing.cubic) })); }, [ratio]);
  const fill = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <View style={[{ height, borderRadius: radius, backgroundColor: track, overflow: 'hidden' }, style]}>
      <Animated.View style={[{ height: '100%', borderRadius: radius, backgroundColor: color }, fill]} />
    </View>
  );
}

// 3bis · coche (proposition ChatGPT n°1, validée par Jeanne le 14 sept 2026) : le disque se remplit
// en 160 ms easeOut, le ✓ arrive 70 ms après en ressort avec un léger dépassement. Utilisé par les deux CheckCircle.
export function useCheckFill(done) {
  const fill = useSharedValue(done ? 1 : 0), check = useSharedValue(done ? 1 : 0);
  useEffect(() => {
    if (reduceMotion) { fill.value = done ? 1 : 0; check.value = done ? 1 : 0; return; }
    if (done) {
      fill.value = withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic) });
      check.value = withDelay(70, withSpring(1, { stiffness: 420, damping: 26 }));
    } else { fill.value = withTiming(0, { duration: 120 }); check.value = withTiming(0, { duration: 80 }); }
  }, [done]);
  const fillStyle = useAnimatedStyle(() => ({ opacity: fill.value, transform: [{ scale: 0.55 + 0.45 * fill.value }] }));
  const checkStyle = useAnimatedStyle(() => ({ opacity: check.value > 0.05 ? 1 : 0, transform: [{ scale: check.value }] }));
  return { fillStyle, checkStyle };
}

// 10 · célébration rare (Duo formé) : halo qui s'ouvre + particules radiales, ~1 s, jamais en boucle
// (proposition ChatGPT n°10, retour Jeanne 14 sept : « plus grosse » que la première version).
export function Burst({ count = 16, colors: palette, dist = 120, delay = 0 }) {
  if (reduceMotion) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
      <Halo delay={delay} />
      {Array.from({ length: count }).map((_, i) => <Spark key={i} i={i} n={count} palette={palette} dist={dist} delay={delay} />)}
    </View>
  );
}
function Halo({ delay }) {
  const p = useSharedValue(0);
  useEffect(() => { p.value = withDelay(delay + 120, withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) })); }, []);
  const st = useAnimatedStyle(() => ({ opacity: (1 - p.value) * 0.55, transform: [{ scale: 0.3 + p.value * 2.2 }] }));
  return <Animated.View style={[{ position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: colors.butterLight }, st]} />;
}
function Spark({ i, n, palette, dist, delay }) {
  const p = useSharedValue(0);
  const a = (i / n) * Math.PI * 2 - Math.PI / 2 + (i % 2) * 0.18, d = dist + (i % 4) * 22;
  useEffect(() => { p.value = withDelay(delay + 260 + (i % 4) * 40, withTiming(1, { duration: 720, easing: Easing.out(Easing.cubic) })); }, []);
  const st = useAnimatedStyle(() => ({ opacity: 1 - p.value * p.value, transform: [{ translateX: Math.cos(a) * d * p.value }, { translateY: Math.sin(a) * d * p.value + 30 * p.value * p.value }, { rotate: `${p.value * 240 * (i % 2 ? 1 : -1)}deg` }, { scale: 0.7 + 0.5 * p.value }] }));
  const round = i % 3 === 0;
  return <Animated.View style={[{ position: 'absolute', width: round ? 12 : 8, height: round ? 12 : 18, borderRadius: round ? 6 : 3, backgroundColor: palette[i % palette.length] }, st]} />;
}

// 3 · check de tâche : scale 0.8 → 1.1 → 1 (~350 ms)
export function useCheckPop(done) {
  const s = useSharedValue(1);
  useEffect(() => { if (done && !reduceMotion) s.value = withSequence(withTiming(0.94, { duration: 80 }), withSpring(1.04, { damping: 16 }), withSpring(1, motion.spring)); }, [done]);
  return useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
}

// 6 · rotation du FAB (+ → ×) 45°
export function useFabRotation(open) {
  const r = useSharedValue(0);
  useEffect(() => { r.value = withSpring(open ? 45 : 0, motion.spring); }, [open]);
  return useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value}deg` }] }));
}

// 9 · confetti 1,5 s aux couleurs de la palette
export function Confetti({ count = 28, colors: palette, size = 8, duration = motion.celebrate }) {
  if (reduceMotion) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
      {Array.from({ length: count }).map((_, i) => <Particle key={i} i={i} palette={palette} size={size} duration={duration} />)}
    </View>
  );
}
function Particle({ i, palette, size, duration }) {
  const p = useSharedValue(0);
  const x0 = (i * 37) % 100, drift = ((i * 53) % 60) - 30, delay = (i * 23) % 300;
  useEffect(() => { p.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.quad) })); }, []);
  const st = useAnimatedStyle(() => ({ opacity: 1 - p.value, transform: [{ translateY: p.value * 520 }, { translateX: p.value * drift }, { rotate: `${p.value * 540}deg` }] }));
  return <Animated.View style={[{ position: 'absolute', top: -10, left: `${x0}%`, width: size, height: size * 1.6, borderRadius: 2, backgroundColor: palette[i % palette.length] }, st]} />;
}

// 6bis · sheet modale (routes transparentModal) : scrim 0→1 (200 ms) + feuille qui monte (spring).
// Les animations `entering` de reanimated ne se déclenchent pas de façon fiable sur un écran
// présenté en modale transparente : on anime explicitement au montage.
export function useSheetIn({ travel = 420 } = {}) {
  const scrim = useSharedValue(0);
  const y = useSharedValue(reduceMotion ? 0 : travel);
  useEffect(() => {
    scrim.value = withTiming(1, { duration: motion.micro });
    y.value = withSpring(0, { damping: 18, stiffness: 180, mass: 0.9 });
  }, []);
  const scrimStyle = useAnimatedStyle(() => ({ opacity: scrim.value }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return { scrimStyle, sheetStyle };
}
