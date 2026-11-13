// Intro animée après le splash (piste « Headspace » choisie par Jeanne le 9 nov 2026) : fond crème en feutre,
// Mochi géant qui monte du bas les yeux fermés, ouvre les yeux, sourit ; une phrase courte en haut.
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import copy from '../src/copy';

const FELT = require('../assets/splash/feutre.jpg');
const FACE = { sleeping: require('../assets/splash/mochi-sleeping.png'), neutral: require('../assets/splash/mochi-neutral.png'), happy: require('../assets/splash/mochi-happy.png') };
const INK = '#1F2A58';
const t = copy.intro;
const ease = Easing.out(Easing.cubic);

// onDone : au lancement, l'écran s'efface en fondu puis se retire (monté par app/_layout.js)
export function IntroView({ onDone }) {
  const { width: W, height: H } = useWindowDimensions();
  const [run, setRun] = useState(0);
  const [face, setFace] = useState('sleeping');
  const rise = useSharedValue(0); const txt = useSharedValue(0); const out = useSharedValue(1);
  useEffect(() => {
    setFace('sleeping'); rise.value = 0; txt.value = 0;
    rise.value = withTiming(1, { duration: 900, easing: ease });
    txt.value = withDelay(500, withTiming(1, { duration: 600, easing: ease }));
    const ids = [setTimeout(() => setFace('neutral'), 1250), setTimeout(() => setFace('happy'), 1650)];
    if (onDone) ids.push(setTimeout(() => { out.value = withTiming(0, { duration: 380, easing: Easing.in(Easing.quad) }, f => { if (f) runOnJS(onDone)(); }); }, 2300));
    return () => ids.forEach(clearTimeout);
  }, [run]);
  const outSt = useAnimatedStyle(() => ({ opacity: out.value }));
  // Mochi géant : 1,5 × la largeur, on n'en voit que le haut (comme l'icône)
  const mw = W * 1.5; const mh = mw * 414 / 512; const mx = (W - mw) / 2; const my = H - mh * 0.78;
  const riseSt = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - rise.value) * mh * 0.7 }] }));
  const txtSt = useAnimatedStyle(() => ({ opacity: txt.value, transform: [{ translateY: (1 - txt.value) * 12 }] }));
  return (
    <Animated.View style={[{ flex: 1 }, outSt]}>
    <Pressable style={{ flex: 1, backgroundColor: '#F3EADF', overflow: 'hidden' }} onPress={() => (onDone ? null : setRun(r => r + 1))}>
      <Image source={FELT} style={{ position: 'absolute', top: 0, left: (W - H) / 2, width: H, height: H, opacity: 0.55 }} />
      <Animated.View style={[{ position: 'absolute', left: 24, right: 24, top: H * 0.19, alignItems: 'center' }, txtSt]}>
        <Text style={{ fontSize: 52, lineHeight: 58, fontWeight: '700', letterSpacing: -1.6, color: INK }}>Mindpair</Text>
        <Text style={{ marginTop: 10, fontSize: 21, lineHeight: 28, fontWeight: '500', letterSpacing: -0.3, color: INK, opacity: 0.7, textAlign: 'center' }}>{t.l1} {t.l2}</Text>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', left: mx, top: my, width: mw, height: mh }, riseSt]}>
        <Image source={FACE[face]} style={{ width: mw, height: mh }} resizeMode="contain" />
      </Animated.View>
    </Pressable>
    </Animated.View>
  );
}
// route de démo (Plan des écrans) : toucher l'écran rejoue l'animation
export default function Intro() { return <IntroView />; }
