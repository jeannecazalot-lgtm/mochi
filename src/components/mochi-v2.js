// Mochi v2 — personnage galet (recette : docs/recettes/mochi-v2.md). Proto, pas encore branché.
// variant : 'A' galet corail mat · 'B' perle crème · 'C' élastique plat
import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, RadialGradient, LinearGradient, Stop, Ellipse, Path, G, Circle } from 'react-native-svg';
import { colors } from '../theme';

const BODY = 'M110 42 C150 42 184 76 190 126 C195 164 160 190 110 190 C60 190 25 164 30 126 C36 76 70 42 110 42 Z';
const BASE = { x: 110, y: 190 };

const MOUTH = {
  happy: 'M94 142 Q110 155 126 142',
  neutral: 'M96 144 L124 144',
  sad: 'M94 151 Q110 138 126 151',
  sleeping: 'M104 146 L116 146',
  wink: 'M94 142 Q110 155 126 142',
};

function Face({ mood, dx }) {
  const closed = (cx) => <Path d={`M${cx - 8} 118 Q${cx} 125 ${cx + 8} 118`} stroke={colors.ink} strokeWidth="3" fill="none" strokeLinecap="round" />;
  const open = (cx) => <Circle cx={cx} cy="118" r="4.6" fill={colors.ink} />;
  return (
    <G x={dx}>
      {mood === 'sleeping' ? closed(90) : open(90)}
      {mood === 'sleeping' || mood === 'wink' ? closed(130) : open(130)}
      <Path d={MOUTH[mood] || MOUTH.happy} stroke={colors.ink} strokeWidth="3.4" fill="none" strokeLinecap="round" />
    </G>
  );
}

export function MochiV2({ variant = 'A', size = 140, mood = 'happy', lean = 0 }) {
  const id = `m2${variant}`;
  const elastic = variant === 'C';
  const bodyTransform = elastic
    ? { skewX: -lean * 10, rotation: lean * 4, originX: BASE.x, originY: BASE.y }
    : { rotation: lean * 10, originX: BASE.x, originY: BASE.y };
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 220 220">
        <Defs>
          <LinearGradient id={`${id}A`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#F4B59F" /><Stop offset="0.55" stopColor="#E89B85" /><Stop offset="1" stopColor="#DC8B75" />
          </LinearGradient>
          <LinearGradient id={`${id}B`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFBF4" /><Stop offset="1" stopColor="#F3E5D8" />
          </LinearGradient>
          <RadialGradient id={`${id}hi`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.22" /><Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id={`${id}tint`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#E89B85" stopOpacity="0.18" /><Stop offset="1" stopColor="#E89B85" stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id={`${id}foot`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#DC8B75" stopOpacity="0" /><Stop offset="1" stopColor="#DC8B75" stopOpacity="0.35" />
          </LinearGradient>
        </Defs>
        <G {...bodyTransform}>
          {variant === 'A' && (
            <>
              <Path d={BODY} fill={`url(#${id}A)`} />
              <Ellipse cx="86" cy="88" rx="42" ry="32" fill={`url(#${id}hi)`} />
            </>
          )}
          {variant === 'B' && (
            <>
              <Path d={BODY} fill={`url(#${id}B)`} stroke="rgba(26,26,31,0.10)" strokeWidth="1.5" />
              <Ellipse cx="150" cy="128" rx="46" ry="52" fill={`url(#${id}tint)`} />
            </>
          )}
          {variant === 'C' && (
            <>
              <Path d={BODY} fill="#EFA28C" />
              <Path d="M34 140 C40 178 70 190 110 190 C150 190 180 178 186 140 Z" fill={`url(#${id}foot)`} />
            </>
          )}
          <Face mood={mood} dx={lean * 4} />
        </G>
      </Svg>
    </View>
  );
}

// ─── D · le visage et la matière actuels (v1) sur un corps galet qui bouge ─────────────────────
// Demande Jeanne 14 sept : « garder le visage qu'on a déjà, pas rond, et que la forme bouge ».
import { Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSpring, withSequence, Easing } from 'react-native-reanimated';
import { useEffect, useState } from 'react';

const FACE_DY = 8; // le visage v1 descend de 8 unités pour se poser dans la masse du galet
const MOUTH_V1 = {
  happy: 'M88 136 Q110 150 132 136', wink: 'M88 136 Q110 150 132 136',
  neutral: 'M92 140 L128 140', sad: 'M88 146 Q110 132 132 146', sleeping: 'M100 142 L120 142',
};

export function MochiGalet({ size = 140, mood = 'happy', lean = 0 }) {
  const id = 'mg';
  const eye = (cx) => <Circle cx={cx} cy={110 + FACE_DY} r="4" fill={colors.ink} />;
  const shut = (cx) => <Path d={`M${cx - 6} ${110 + FACE_DY} Q${cx} ${106 + FACE_DY} ${cx + 6} ${110 + FACE_DY}`} stroke={colors.ink} strokeWidth="2.8" fill="none" strokeLinecap="round" />;
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 220 220">
        <Defs>
          <RadialGradient id={`${id}Main`} cx="38%" cy="28%" r="78%">
            <Stop offset="0" stopColor="#FFF1E0" /><Stop offset="0.2" stopColor="#FBC9A4" /><Stop offset="0.4" stopColor="#F5A89A" /><Stop offset="0.65" stopColor={colors.coral} /><Stop offset="1" stopColor={colors.coralDeep} />
          </RadialGradient>
          <RadialGradient id={`${id}Gloss`} cx="32%" cy="22%" r="28%">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" /><Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.4" /><Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id={`${id}Rim`} x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0" stopColor={colors.sage} stopOpacity="0.5" /><Stop offset="0.5" stopColor={colors.butterLight} stopOpacity="0.7" /><Stop offset="1" stopColor="#F5A89A" stopOpacity="0.5" />
          </LinearGradient>
        </Defs>
        <G skewX={-lean * 10} rotation={lean * 4} originX={BASE.x} originY={BASE.y}>
          <Path d={BODY} fill={`url(#${id}Main)`} />
          <Path d={BODY} fill="none" stroke={`url(#${id}Rim)`} strokeWidth="6" />
          <Ellipse cx="84" cy="80" rx="32" ry="24" fill={`url(#${id}Gloss)`} />
          <Circle cx="76" cy="72" r="4" fill="#FFFFFF" />
          <Circle cx="148" cy="96" r="2" fill="#FFFFFF" opacity="0.7" />
          <G x={lean * 4}>
            {mood === 'sleeping' ? shut(92) : eye(92)}
            {mood === 'sleeping' || mood === 'wink' ? shut(128) : eye(128)}
            <Path d={(MOUTH_V1[mood] || MOUTH_V1.happy).replace(/(\d+) (\d+)/g, (m, x, y) => `${x} ${Number(y) + FACE_DY}`)} stroke={colors.ink} strokeWidth="3.4" fill="none" strokeLinecap="round" />
          </G>
        </G>
      </Svg>
    </View>
  );
}

// Réaction partagée : une coche n'importe où → secousse du Mochi vivant à l'écran (proposition ChatGPT n°2, 14 sept)
const reactListeners = new Set();
export const mochiReact = () => reactListeners.forEach(f => f());

// Corps vivant : respiration (squash/stretch depuis la base), inclinaison en ressort, secousse gélatine au toucher.
export function LiveMochiGalet({ size = 140, mood = 'happy', lean = 0, breathe = true, onPress }) {
  const sx = useSharedValue(1), sy = useSharedValue(1), skew = useSharedValue(-lean * 10), rot = useSharedValue(lean * 4);
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    if (!breathe) return;
    sx.value = withRepeat(withTiming(1.03, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
    sy.value = withRepeat(withTiming(0.97, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [breathe]);
  useEffect(() => {
    skew.value = withSpring(-lean * 10, { damping: 12, stiffness: 120 });
    rot.value = withSpring(lean * 4, { damping: 12, stiffness: 120 });
  }, [lean]);
  useEffect(() => {
    let t; const loop = () => { t = setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 120); loop(); }, 4000 + Math.random() * 2000); };
    loop(); return () => clearTimeout(t);
  }, []);
  const wobble = () => {
    const s = { damping: 7, stiffness: 260 };
    sx.value = withSequence(withTiming(1.14, { duration: 90 }), withSpring(1, s));
    sy.value = withSequence(withTiming(0.86, { duration: 90 }), withSpring(1, s));
    onPress && onPress();
  };
  useEffect(() => { const f = () => wobble(); reactListeners.add(f); return () => reactListeners.delete(f); }, []);
  const style = useAnimatedStyle(() => ({
    transformOrigin: '50% 100%',
    transform: [{ skewX: `${skew.value}deg` }, { rotate: `${rot.value}deg` }, { scaleX: sx.value }, { scaleY: sy.value }],
  }));
  return (
    <Pressable onPress={wobble}>
      <Animated.View style={style}><MochiGalet size={size} mood={blink ? 'wink' : mood} lean={0} /></Animated.View>
    </Pressable>
  );
}
