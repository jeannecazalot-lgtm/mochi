// Scène de Mochi — version « images » (4 nov 2026, décision Jeanne : même matière que Mochi et les pictos).
// Les meubles sont les images ChatGPT (assets/maison, découpées depuis planche-chatgpt.png), posés sur un mur et
// un sol plats, aux mêmes positions et paliers que la version en formes : jour 1 = fenêtre, rideau, étagère,
// table, plante, tapis, cadre ; palier 2 lampe ; palier 3 banquette (remplace la table). Micro-mouvements :
// la plante se balance, la lampe respire la nuit. La nuit : voile navy sur la pièce, lune et étoiles dans la fenêtre.
import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, withSequence, withRepeat, Easing, ZoomIn, FadeIn } from 'react-native-reanimated';
import { LiveMochiImage, MOCHI_RATIO } from '../mochi-img';
import { prefersReducedMotion } from '../motion';
import { layout } from '../../theme-v3';

const IMG = {
  window: require('../../../assets/maison/window.png'), plant: require('../../../assets/maison/plant.png'), shelf: require('../../../assets/maison/shelf.png'),
  table: require('../../../assets/maison/table.png'), sofa: require('../../../assets/maison/sofa.png'), lamp: require('../../../assets/maison/lamp.png'),
  rug: require('../../../assets/maison/rug.png'), frame: require('../../../assets/maison/frame.png'), curtain: require('../../../assets/maison/curtain.png'),
  egg: require('../../../assets/maison/egg.png'), eggCrack: require('../../../assets/maison/egg-crack.png'), eggOpen: require('../../../assets/maison/egg-open.png'),
};
const S = ({ l, r, t, b, w, h, rad = 0, c, op }) => <View style={{ position: 'absolute', left: l, right: r, top: t, bottom: b, width: w, height: h, borderRadius: rad, backgroundColor: c, opacity: op }} />;
const Im = ({ k, l, r, t, b, w, h, op = 1 }) => <Image source={IMG[k]} style={{ position: 'absolute', left: l, right: r, top: t, bottom: b, width: w, height: h, opacity: op }} resizeMode="contain" accessibilityIgnoresInvertColors />;
export const SIZE_BY_STAGE = { egg: 0.6, mini: 0.75, mochi: 1, maxi: 1.15, dore: 1.25 };

// la plante se balance très lentement (±1,5°, 2,8 s), depuis sa base
function Sway({ children, style, deg = 1.5, period = 2800, delay = 0 }) {
  const r = useSharedValue(-deg);
  useEffect(() => { if (prefersReducedMotion()) { r.value = 0; return; } r.value = withDelay(delay, withRepeat(withTiming(deg, { duration: period, easing: Easing.inOut(Easing.sin) }), -1, true)); }, []);
  const st = useAnimatedStyle(() => ({ transformOrigin: '50% 100%', transform: [{ rotate: `${r.value}deg` }] }));
  return <Animated.View pointerEvents="none" style={[style, st]}>{children}</Animated.View>;
}
// une lueur qui respire (lampe la nuit, étoiles)
function Glow({ style, from = 0.35, to = 0.6, period = 2600, delay = 0 }) {
  const op = useSharedValue(from);
  useEffect(() => { if (prefersReducedMotion()) { op.value = to; return; } op.value = withDelay(delay, withRepeat(withTiming(to, { duration: period, easing: Easing.inOut(Easing.sin) }), -1, true)); }, []);
  const st = useAnimatedStyle(() => ({ opacity: op.value }));
  return <Animated.View pointerEvents="none" style={[style, st]} />;
}
const Layer = ({ children, delay = 0, fade }) => <Animated.View entering={fade ? FadeIn.delay(delay) : ZoomIn.springify().damping(14).delay(delay)} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} pointerEvents="none">{children}</Animated.View>;

export function Scene({ T, stage = 'mini', mood, lvl = 1, away = false, height = layout.scene, hideMochi = false }) {
  const c = T.scene, hh = height, fl = layout.floor, night = !!c.moon;
  const W = Math.round(layout.mochi * (SIZE_BY_STAGE[stage] || 1)), H = W * MOCHI_RATIO;
  const tx = useSharedValue(away ? 420 : 0), hop = useSharedValue(0);
  useEffect(() => {
    const rm = prefersReducedMotion();
    if (away) {
      if (rm) { tx.value = 420; return; }
      hop.value = withSequence(withTiming(-10, { duration: 120 }), withTiming(0, { duration: 120 }), withTiming(-10, { duration: 120 }), withTiming(0, { duration: 120 }), withTiming(-8, { duration: 120 }), withTiming(0, { duration: 120 }));
      tx.value = withTiming(420, { duration: 900 });
    } else {
      tx.value = rm ? 0 : withSpring(0, { damping: 14, stiffness: 90 });
    }
  }, [away]);
  const walk = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value }, { translateY: hop.value }] }));
  const winT = hh - 232;
  return (
    <View style={{ height: hh, backgroundColor: c.wall, overflow: 'hidden' }}>
      <S l={0} r={0} b={0} h={fl} c={c.floor} />
      <Im k="rug" l={60} r={60} b={6} h={46} />
      {/* fenêtre en arche à gauche ; la nuit : lune et étoiles par-dessus le ciel */}
      <Im k="window" l={28} t={winT} w={180} h={200} />
      {night ? <><S l={118} t={winT + 46} w={34} h={34} rad={17} c={c.window} /><S l={128} t={winT + 50} w={14} h={14} rad={7} c={c.moon} op={0.95} /><Glow style={{ position: 'absolute', left: 78, top: winT + 64, width: 3, height: 3, borderRadius: 2, backgroundColor: c.moon }} from={0.2} to={0.9} period={1900} /><Glow style={{ position: 'absolute', left: 100, top: winT + 40, width: 2, height: 2, borderRadius: 1, backgroundColor: c.moon }} from={0.3} to={0.9} period={2300} delay={400} /><Glow style={{ position: 'absolute', left: 168, top: winT + 70, width: 3, height: 3, borderRadius: 2, backgroundColor: c.moon }} from={0.2} to={0.8} period={2100} delay={900} /></> : null}
      <Im k="curtain" l={192} t={winT - 14} w={60} h={190} />
      <Im k="shelf" r={28} t={hh - 212} w={130} h={74} />
      <Im k="frame" r={70} t={hh - 128} w={34} h={40} />
      {lvl < 3 ? <Im k="table" l={46} b={fl - 10} w={110} h={76} /> : null}
      <Sway style={{ position: 'absolute', right: 16, bottom: fl - 8, width: 96, height: 128 }}><Image source={IMG.plant} style={{ width: 96, height: 128 }} resizeMode="contain" /></Sway>
      {lvl >= 2 ? <Layer delay={120}>
        <Im k="lamp" l={2} b={fl - 6} w={54} h={146} />
        {night ? <Glow style={{ position: 'absolute', left: -22, bottom: fl + 70, width: 100, height: 100, borderRadius: 50, backgroundColor: c.lamp }} from={0.12} to={0.26} /> : null}
      </Layer> : null}
      {lvl >= 3 ? <Layer delay={200}><Im k="sofa" l={34} b={fl - 10} w={140} h={88} /></Layer> : null}
      {lvl >= 4 ? <Layer delay={300} fade><Im k="frame" r={120} t={hh - 236} w={28} h={32} /></Layer> : null}
      {/* la nuit : un voile navy sur toute la pièce (les images gardent leur matière) */}
      {night ? <S l={0} r={0} t={0} b={0} c={c.wall} op={0.5} /> : null}
      {hideMochi ? null : stage === 'egg'
        ? <><View style={{ position: 'absolute', bottom: fl - 10, alignSelf: 'center', width: 150, height: 14, borderRadius: 7, backgroundColor: c.shadow }} /><Animated.View entering={ZoomIn.springify().damping(12)} style={{ position: 'absolute', bottom: fl - 6, left: 0, right: 0, alignItems: 'center' }}><Image source={IMG.egg} style={{ width: 96, height: 120 }} resizeMode="contain" accessibilityIgnoresInvertColors /></Animated.View></>
        : <Animated.View entering={ZoomIn.springify().damping(12).stiffness(160)} style={{ position: 'absolute', bottom: fl - 14, left: 0, right: 0 }}><Animated.View style={[{ alignItems: 'center' }, walk]}>
              <View style={{ position: 'absolute', bottom: 2, width: Math.round(W * 1.1), height: 16, borderRadius: 8, backgroundColor: c.shadow }} />
              <LiveMochiImage size={W} lean={0} mood={mood} />
            </Animated.View></Animated.View>}
    </View>
  );
}

// l'œuf seul, en petit (setup : Mochi n'existe pas encore)
export function Egg({ T, size = 56 }) {
  return (
    <View style={{ width: size * 1.3, height: size + 10, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{ position: 'absolute', bottom: 0, width: size * 1.3, height: 10, borderRadius: 5, backgroundColor: T.scene.shadow }} />
      <Image source={IMG.egg} style={{ width: size * 0.85, height: size, marginBottom: 4 }} resizeMode="contain" accessibilityIgnoresInvertColors />
    </View>
  );
}
