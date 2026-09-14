// Proto animations (14 sept 2026) · corps de Mochi piloté depuis l'extérieur : inclinaison,
// déplacement, compression de la base, pop. Ne touche pas à mochi-v2.js (LiveMochiGalet garde ses ressorts).
import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming, withDelay, runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { MochiGalet } from '../mochi-v2';

// ≈ interactiveSpring(response 0,35 s, damping 0,82) de la proposition ChatGPT n°2
export const SPRING_BALANCE = { stiffness: 320, damping: 29 };
// spring douce, 350–450 ms (propositions 8 et 9)
export const SPRING_SOFT = { stiffness: 140, damping: 20 };
// pop avec léger overshoot (célébrations)
export const SPRING_POP = { stiffness: 260, damping: 11 };

export const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

export function useMochiBody(lean0 = 0) {
  const skew = useSharedValue(-lean0 * 10), rot = useSharedValue(lean0 * 4), tx = useSharedValue(lean0 * 6);
  const sx = useSharedValue(1), sy = useSharedValue(1), scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transformOrigin: '50% 100%',
    transform: [
      { translateX: tx.value }, { skewX: `${skew.value}deg` }, { rotate: `${rot.value}deg` },
      { scaleX: sx.value * scale.value }, { scaleY: sy.value * scale.value },
    ],
  }));
  // Incline vers `lean` (−1 Lea … +1 Kima) en partant de la valeur courante, jamais de zéro.
  const leanTo = (lean, cfg = SPRING_BALANCE, delay = 0, onEnd) => {
    const go = (v, cb) => {
      const anim = withSpring(v, cfg, cb ? (f) => { 'worklet'; if (f) runOnJS(cb)(); } : undefined);
      return delay ? withDelay(delay, anim) : anim;
    };
    skew.value = go(-lean * 10, onEnd); rot.value = go(lean * 4); tx.value = go(lean * 6);
  };
  // La base se comprime légèrement puis revient.
  const compress = (amount = 0.05, cfg = SPRING_BALANCE) => {
    sy.value = withSequence(withTiming(1 - amount, { duration: 90 }), withSpring(1, cfg));
    sx.value = withSequence(withTiming(1 + amount * 0.7, { duration: 90 }), withSpring(1, cfg));
  };
  const pop = () => { scale.value = withSequence(withTiming(0.5, { duration: 0 }), withSpring(1, SPRING_POP)); };
  const reset = () => { skew.value = 0; rot.value = 0; tx.value = 0; sx.value = 1; sy.value = 1; scale.value = 1; };
  return { style, leanTo, compress, pop, reset };
}

export function MochiBody({ body, size = 140, mood = 'happy' }) {
  return <Animated.View style={body.style}><MochiGalet size={size} mood={mood} lean={0} /></Animated.View>;
}
