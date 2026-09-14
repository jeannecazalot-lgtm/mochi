// Proto animations (14 sept 2026) · corps de Mochi piloté depuis l'extérieur : inclinaison,
// déplacement, compression de la base, pop. Ne touche pas à mochi-v2.js (LiveMochiGalet garde ses ressorts).
import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming, withDelay, runOnJS, Easing } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MochiImage } from '../mochi-img';

// ≈ interactiveSpring(response 0,35 s, damping 0,82) de la proposition ChatGPT n°2
export const SPRING_BALANCE = { stiffness: 320, damping: 29 };
// spring douce, 350–450 ms (propositions 8 et 9)
export const SPRING_SOFT = { stiffness: 140, damping: 20 };
// pop avec léger overshoot (célébrations)
export const SPRING_POP = { stiffness: 260, damping: 11 };

export const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

export function useMochiBody(lean0 = 0) {
  const skew = useSharedValue(-lean0 * 10), rot = useSharedValue(lean0 * 4), tx = useSharedValue(lean0 * 6);
  const sx = useSharedValue(1), sy = useSharedValue(1), scale = useSharedValue(1), spin = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transformOrigin: '50% 100%',
    transform: [
      { translateX: tx.value }, { rotate: `${rot.value + spin.value}deg` },
      { scaleX: sx.value * scale.value }, { scaleY: sy.value * scale.value },
    ],
  }));
  // Incline vers `lean` (−1 Lea … +1 Kima) en partant de la valeur courante, jamais de zéro.
  const leanTo = (lean, cfg = SPRING_BALANCE, delay = 0, onEnd) => {
    const go = (v, cb) => {
      const anim = withSpring(v, cfg, cb ? (f) => { 'worklet'; if (f) runOnJS(cb)(); } : undefined);
      return delay ? withDelay(delay, anim) : anim;
    };
    skew.value = go(-lean * 10); rot.value = go(lean * 6, onEnd); tx.value = go(lean * 6);
  };
  // La base se comprime légèrement puis revient.
  const compress = (amount = 0.05, cfg = SPRING_BALANCE) => {
    sy.value = withSequence(withTiming(1 - amount, { duration: 90 }), withSpring(1, cfg));
    sx.value = withSequence(withTiming(1 + amount * 0.7, { duration: 90 }), withSpring(1, cfg));
  };
  const pop = (from = 0.5) => { scale.value = withSequence(withTiming(from, { duration: 0 }), withSpring(1, SPRING_POP)); };
  // Un tour complet sur lui-même (demande Jeanne, 14 sept : « le mochi qui tourne » pendant le calcul)
  const turn = (duration = 800, onEnd) => {
    spin.value = 0;
    spin.value = withTiming(360, { duration, easing: Easing.inOut(Easing.cubic) }, (f) => { 'worklet'; if (f) { spin.value = 0; if (onEnd) runOnJS(onEnd)(); } });
  };
  const reset = () => { skew.value = 0; rot.value = 0; tx.value = 0; sx.value = 1; sy.value = 1; scale.value = 1; spin.value = 0; };
  return { style, leanTo, compress, pop, turn, reset };
}

// Le vrai Mochi (images ChatGPT, comme l'Accueil) : le cadre suit `lean`, le corps est animé par-dessus.
export function MochiBody({ body, size = 140, mood = 'happy', lean = 0 }) {
  return <Animated.View style={body.style}><MochiImage size={size} lean={lean} mood={mood === 'happy' ? undefined : mood} /></Animated.View>;
}
