// ═══════════════════════════════════════════════════════════════════
// motion.js — primitives d'animation (README handoff §Animations v1),
// react-native-reanimated 4. Respecte « réduire les animations » d'iOS.
// ═══════════════════════════════════════════════════════════════════
import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSpring, withSequence, withDelay, Easing, FadeIn, FadeInDown, FadeInUp, SlideInDown, SlideOutDown, ZoomIn } from 'react-native-reanimated';
import { Mochi } from './ui';
import { motion } from '../theme';

export { FadeIn, FadeInDown, FadeInUp, SlideInDown, SlideOutDown, ZoomIn, Animated };

let reduceMotion = false;
AccessibilityInfo.isReduceMotionEnabled().then(v => { reduceMotion = v; }).catch(() => {});
export const prefersReducedMotion = () => reduceMotion;

// 1+2 · Mochi vivant : float ±5px 3,2 s + blink 4-6 s + lean (−1…1 → ±12°) en spring damping 14
export function LiveMochi({ size = 140, mood = 'happy', lean = 0, float = true }) {
  const y = useSharedValue(0);
  const rot = useSharedValue(lean * 12);
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    if (float && !reduceMotion) y.value = withRepeat(withTiming(-5, { duration: motion.mochiFloat / 2, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [float]);
  useEffect(() => { rot.value = withSpring(lean * 12, motion.spring); }, [lean]);
  useEffect(() => {
    if (reduceMotion) return;
    let t; const loop = () => { t = setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 120); loop(); }, 4000 + Math.random() * 2000); };
    loop(); return () => clearTimeout(t);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }, { rotate: `${rot.value}deg` }] }));
  return <Animated.View style={style}><Mochi size={size} mood={blink ? 'wink' : mood} /></Animated.View>;
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

// 3 · check de tâche : scale 0.8 → 1.1 → 1 (~350 ms)
export function useCheckPop(done) {
  const s = useSharedValue(1);
  useEffect(() => { if (done && !reduceMotion) s.value = withSequence(withTiming(0.8, { duration: 80 }), withSpring(1.1, { damping: 10 }), withSpring(1, motion.spring)); }, [done]);
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
