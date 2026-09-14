// Mochi en images (décision Jeanne 14 sept 2026, 22 h 40) : le personnage rendu par ChatGPT,
// découpé en 7 inclinaisons (assets/mochi/leanm3 … leanp3, même canevas 236 × 136, base alignée).
// lean ∈ [−1, 1] → cadre le plus proche (visage content) ; les autres humeurs ont leur cadre de face (mood-*.png).
import React, { useEffect, useState } from 'react';
import { Image, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSpring, withSequence, withDelay, Easing } from 'react-native-reanimated';

export const MOCHI_RATIO = 191 / 235; // hauteur / largeur du canevas
const FRAMES = { // pas de « + » ni de « - » dans les noms : Metro ne résout pas ces fichiers
  '-3': require('../../assets/mochi/leanm3.png'), '-2': require('../../assets/mochi/leanm2.png'), '-1': require('../../assets/mochi/leanm1.png'),
  '0': require('../../assets/mochi/leanp0.png'),
  '1': require('../../assets/mochi/leanp1.png'), '2': require('../../assets/mochi/leanp2.png'), '3': require('../../assets/mochi/leanp3.png'),
};
const MOODS = { // planche des humeurs (ChatGPT, 14 sept 2026, 23 h), même corps de face
  neutral: require('../../assets/mochi/mood-neutral.png'), sad: require('../../assets/mochi/mood-sad.png'),
  sleeping: require('../../assets/mochi/mood-sleeping.png'), wink: require('../../assets/mochi/mood-wink.png'),
};
export const frameFor = (lean, mood) => (mood && MOODS[mood]) || FRAMES[String(Math.max(-3, Math.min(3, Math.round((lean || 0) * 3))))];

// statique : `size` = largeur ; la hauteur suit le canevas
export function MochiImage({ size = 140, lean = 0, mood, style }) {
  // humeur ≠ content : le cadre de face, incliné par rotation (les inclinaisons dessinées n'existent qu'avec le sourire)
  const tilt = mood && MOODS[mood] ? [{ rotate: `${(lean || 0) * 8}deg` }] : [];
  return <Image source={frameFor(lean, mood)} style={[{ width: size, height: size * MOCHI_RATIO, transform: tilt }, style]} resizeMode="contain" accessibilityIgnoresInvertColors />;
}

// réaction partagée : une coche n'importe où → secousse
const listeners = new Set();
export const mochiReact = () => listeners.forEach(f => f());

// vivant : respiration depuis la base, changement de cadre quand la balance bouge (avec une petite secousse), secousse au toucher
export function LiveMochiImage({ size = 140, lean = 0, mood, breathe = true }) {
  const [frameLean, setFrameLean] = useState(lean);
  const [shownMood, setShownMood] = useState(mood);
  const sx = useSharedValue(1), sy = useSharedValue(1), tx = useSharedValue(lean * 6);
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
  // ChatGPT n°2 + n°8 (validées 14 sept 2026) : quand la balance change, le corps glisse de quelques px du côté
  // chargé en ressort (≈ response 0,35 s, damping 0,82), 70 ms après la barre ; la base se comprime puis revient ;
  // le cadre incliné (le visage) ne change qu'à la fin du mouvement, jamais d'un coup.
  const compress = () => {
    const s = { stiffness: 320, damping: 29 };
    sy.value = withSequence(withTiming(0.95, { duration: 90 }), withSpring(1, s));
    sx.value = withSequence(withTiming(1.035, { duration: 90 }), withSpring(1, s));
  };
  useEffect(() => {
    tx.value = withDelay(70, withSpring(lean * 6, { stiffness: 320, damping: 29 }));
    if (frameFor(lean, mood) === frameFor(frameLean, mood)) return;
    compress();
    const t = setTimeout(() => setFrameLean(lean), 240);
    return () => clearTimeout(t);
  }, [lean]);
  useEffect(() => { const t = setTimeout(() => setShownMood(mood), 300); return () => clearTimeout(t); }, [mood]);
  useEffect(() => { listeners.add(wobble); return () => listeners.delete(wobble); }, []);
  const style = useAnimatedStyle(() => ({ transformOrigin: '50% 100%', transform: [{ translateX: tx.value }, { scaleX: sx.value }, { scaleY: sy.value }] }));
  return (
    <Pressable onPress={wobble}>
      <Animated.View style={style}><MochiImage size={size} lean={frameLean} mood={shownMood} /></Animated.View>
    </Pressable>
  );
}
