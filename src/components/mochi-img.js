// Mochi en images (décision Jeanne 14 sept 2026, 22 h 40) : le personnage rendu par ChatGPT,
// découpé en 7 inclinaisons (assets/mochi/leanm3 … leanp3, même canevas 236 × 136, base alignée).
// lean ∈ [−1, 1] → cadre le plus proche. Les humeurs ne sont pas encore dessinées (tous les cadres
// sourient) : à demander à ChatGPT (neutre, triste, endormi, clin d'œil) puis à brancher ici.
import React, { useEffect, useState } from 'react';
import { Image, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSpring, withSequence, Easing } from 'react-native-reanimated';

export const MOCHI_RATIO = 167 / 232; // hauteur / largeur du canevas
const FRAMES = { // pas de « + » ni de « - » dans les noms : Metro ne résout pas ces fichiers
  '-3': require('../../assets/mochi/leanm3.png'), '-2': require('../../assets/mochi/leanm2.png'), '-1': require('../../assets/mochi/leanm1.png'),
  '0': require('../../assets/mochi/leanp0.png'),
  '1': require('../../assets/mochi/leanp1.png'), '2': require('../../assets/mochi/leanp2.png'), '3': require('../../assets/mochi/leanp3.png'),
};
export const frameFor = lean => FRAMES[String(Math.max(-3, Math.min(3, Math.round((lean || 0) * 3))))];

// statique : `size` = largeur ; la hauteur suit le canevas
export function MochiImage({ size = 140, lean = 0, mood, style }) {
  return <Image source={frameFor(lean)} style={[{ width: size, height: size * MOCHI_RATIO }, style]} resizeMode="contain" accessibilityIgnoresInvertColors />;
}

// réaction partagée : une coche n'importe où → secousse
const listeners = new Set();
export const mochiReact = () => listeners.forEach(f => f());

// vivant : respiration depuis la base, changement de cadre quand la balance bouge (avec une petite secousse), secousse au toucher
export function LiveMochiImage({ size = 140, lean = 0, mood, breathe = true }) {
  const [frameLean, setFrameLean] = useState(lean);
  const sx = useSharedValue(1), sy = useSharedValue(1);
  useEffect(() => {
    if (!breathe) return;
    sx.value = withRepeat(withTiming(1.02, { duration: 1700, easing: Easing.inOut(Easing.ease) }), -1, true);
    sy.value = withRepeat(withTiming(0.965, { duration: 1700, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [breathe]);
  const wobble = () => {
    const s = { damping: 7, stiffness: 240 };
    sx.value = withSequence(withTiming(1.12, { duration: 90 }), withSpring(1, s));
    sy.value = withSequence(withTiming(0.88, { duration: 90 }), withSpring(1, s));
  };
  useEffect(() => { if (frameFor(lean) !== frameFor(frameLean)) { setFrameLean(lean); wobble(); } }, [lean]);
  useEffect(() => { listeners.add(wobble); return () => listeners.delete(wobble); }, []);
  const style = useAnimatedStyle(() => ({ transformOrigin: '50% 100%', transform: [{ scaleX: sx.value }, { scaleY: sy.value }] }));
  return (
    <Pressable onPress={wobble}>
      <Animated.View style={style}><MochiImage size={size} lean={frameLean} mood={mood} /></Animated.View>
    </Pressable>
  );
}
