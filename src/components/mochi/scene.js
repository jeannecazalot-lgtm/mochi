// Scène de Mochi — version « images » (4 nov 2026, décision Jeanne : même matière que Mochi et les pictos).
// Les meubles sont les images ChatGPT (assets/maison, découpées depuis planche-chatgpt.png), posés sur un mur et
// un sol plats, aux mêmes positions et paliers que la version en formes : jour 1 = fenêtre, rideau, étagère,
// table, plante, tapis, cadre ; palier 2 lampe ; palier 3 banquette (remplace la table). Micro-mouvements :
// la plante se balance, la lampe respire la nuit. La nuit : voile navy sur la pièce, lune et étoiles dans la fenêtre.
import React, { useEffect } from 'react';
import { View, Image, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, withSequence, withRepeat, Easing, ZoomIn, FadeIn } from 'react-native-reanimated';
import { LiveMochiImage, MOCHI_RATIO } from '../mochi-img';
import { prefersReducedMotion } from '../motion';
import { layout } from '../../theme-v3';

const IMG = {
  window: require('../../../assets/maison/window.png'), plant: require('../../../assets/maison/plant.png'), shelf: require('../../../assets/maison/shelf.png'),
  table: require('../../../assets/maison/table.png'), sofa: require('../../../assets/maison/sofa.png'), lamp: require('../../../assets/maison/lamp.png'),
  rug: require('../../../assets/maison/rug.png'), frame: require('../../../assets/maison/frame.png'), curtain: require('../../../assets/maison/curtain.png'),
  egg: require('../../../assets/maison/egg.png'), eggCrack: require('../../../assets/maison/egg-crack.png'), eggOpen: require('../../../assets/maison/egg-open.png'),
  decorJour: require('../../../assets/maison/decor-jour.png'), decorNuit: require('../../../assets/maison/decor-nuit.png'),
  jour: [require('../../../assets/maison/jour-vide.png'), require('../../../assets/maison/jour-moyen.png'), require('../../../assets/maison/jour-plein.png')],
  nuit: [require('../../../assets/maison/nuit-vide.png'), require('../../../assets/maison/nuit-moyen.png'), require('../../../assets/maison/nuit-plein.png')],
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

export function Scene({ T, stage = 'mini', mood, lvl = 1, away = false, height = layout.scene, hideMochi = false, cracking = false, topInset = 0, backdrop = undefined, mochiSource = null, mochiBottom = null, shiftY = 0 }) {
  const c = T.scene, hh = height, fl = layout.floor, night = !!c.moon;
  const { width: SW } = useWindowDimensions();
  // décision Jeanne 5 nov 2026 (« je préfère l'ancien ») : la pièce est le décor entier de ChatGPT, B le jour, D la nuit
  // l'appartement se remplit avec les paliers (Jeanne 5 nov : « au début l'appart est plus vide ») ; la nuit = le même décor sous un voile prune
  // le jour : la pièce de jour (soleil, mur mauve clair) ; le soir : la pièce validée (lune, gris-violet) — Jeanne 5 nov « montre la journée plutôt »
  if (backdrop === undefined) backdrop = (night ? IMG.nuit : IMG.jour)[lvl <= 1 ? 0 : lvl <= 3 ? 1 : 2];
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
  // mise en place (retour Jeanne 4 nov 2026, « c'est un collage ») : les meubles REPOSENT sur le sol, la fenêtre est
  // sur le mur, le tapis est à plat sous Mochi, les tailles se répondent. Tout est relatif à la largeur de l'écran.
  const u = SW / 440; // unité : 1 px sur un 440 pt
  const fl2 = fl + 10; // sol un peu plus haut pour poser les meubles
  // topInset : zone réservée en haut (Accueil : barre d'état + en-tête) pour que rien ne passe sous le texte
  const winW = 168 * u, winH = Math.min(190 * u, hh - fl2 - topInset - 36), winT = Math.max(topInset + 8, hh - fl2 - winH - 28);
  return (
    <View style={{ height: hh, backgroundColor: c.wall, overflow: 'hidden' }}>
      {backdrop ? <Image source={backdrop} style={{ position: 'absolute', left: 0, top: shiftY, width: SW, height: hh }} resizeMode="cover" accessibilityIgnoresInvertColors /> : null}
      {backdrop ? null : <S l={0} r={0} b={0} h={fl2} c={c.floor} />}

      {topInset && night ? <LinearGradient colors={['rgba(30,24,40,0.45)', 'rgba(30,24,40,0)']} style={{ position: 'absolute', left: 0, right: 0, top: 0, height: topInset + 28 }} pointerEvents="none" /> : null}
      {/* fondu entre la pièce et l'écran (Jeanne 5 nov : « au lieu d'une coupure nette, un fondu ») */}
      <LinearGradient colors={[T.bg + '00', T.bg]} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 64 }} pointerEvents="none" />
      {/* tapis à plat, sous Mochi */}
      {backdrop ? null : <>
      <Im k="rug" l={SW * 0.28} w={SW * 0.44} b={fl2 - 30} h={44} op={0.95} />
      {/* fenêtre sur le mur, rideau à sa droite ; la nuit : lune et étoiles par-dessus le ciel */}
      <Im k="window" l={30 * u} t={winT} w={winW} h={winH} />
      {night ? <><S l={30 * u + winW * 0.42} t={winT + winH * 0.22} w={34} h={34} rad={17} c={c.window} /><S l={30 * u + winW * 0.48} t={winT + winH * 0.24} w={14} h={14} rad={7} c={c.moon} op={0.95} /><Glow style={{ position: 'absolute', left: 30 * u + winW * 0.22, top: winT + winH * 0.3, width: 3, height: 3, borderRadius: 2, backgroundColor: c.moon }} from={0.2} to={0.9} period={1900} /><Glow style={{ position: 'absolute', left: 30 * u + winW * 0.34, top: winT + winH * 0.18, width: 2, height: 2, borderRadius: 1, backgroundColor: c.moon }} from={0.3} to={0.9} period={2300} delay={400} /><Glow style={{ position: 'absolute', left: 30 * u + winW * 0.7, top: winT + winH * 0.34, width: 3, height: 3, borderRadius: 2, backgroundColor: c.moon }} from={0.2} to={0.8} period={2100} delay={900} /></> : null}
      <Im k="curtain" l={30 * u + winW - 14 * u} t={winT - 10} w={58 * u} h={winH * 0.92} />
      {/* étagère haute à droite, petit cadre entre les deux */}
      <Im k="shelf" r={22 * u} t={winT + 6} w={118 * u} h={66 * u} />
      <Im k="frame" r={150 * u} t={winT + 40} w={30 * u} h={34 * u} />
      {/* table basse à gauche (banquette au palier 3), plante à droite : posées sur le sol */}
      {lvl < 3 ? <Im k="table" l={34 * u} b={fl2 - 16} w={104 * u} h={72 * u} /> : null}
      <Sway style={{ position: 'absolute', right: 18 * u, bottom: fl2 - 12, width: 78 * u, height: 104 * u }}><Image source={IMG.plant} style={{ width: 78 * u, height: 104 * u }} resizeMode="contain" /></Sway>
      {lvl >= 2 ? <Layer delay={120}>
        <Im k="lamp" l={6 * u} b={fl2 - 8} w={44 * u} h={130 * u} />
        {night ? <Glow style={{ position: 'absolute', left: -20, bottom: fl2 + 70, width: 96, height: 96, borderRadius: 48, backgroundColor: c.lamp }} from={0.12} to={0.26} /> : null}
      </Layer> : null}
      {lvl >= 3 ? <Layer delay={200}><Im k="sofa" l={24 * u} b={fl2 - 16} w={134 * u} h={84 * u} /></Layer> : null}
      {lvl >= 4 ? <Layer delay={300} fade><Im k="frame" r={112 * u} t={winT - 30} w={26 * u} h={30 * u} /></Layer> : null}
      {night ? <S l={0} r={0} t={0} b={0} c={c.wall} op={0.5} /> : null}
      </>}
      {hideMochi ? null : stage === 'egg'
        ? <><Animated.View entering={ZoomIn.springify().damping(12)} style={{ position: 'absolute', bottom: backdrop ? 30 : fl2 - 12, left: 0, right: 0, alignItems: 'center' }}><Image source={cracking ? IMG.eggCrack : IMG.egg} style={{ width: 96, height: 120 }} resizeMode="contain" accessibilityIgnoresInvertColors /></Animated.View></>
        : <Animated.View entering={ZoomIn.springify().damping(12).stiffness(160)} style={{ position: 'absolute', bottom: mochiBottom ?? (backdrop ? 26 : fl2 - 18), left: 0, right: 0 }}><Animated.View style={[{ alignItems: 'center' }, walk]}>
              <View style={{ position: 'absolute', bottom: 4, width: Math.round(W * 0.9), height: 10, borderRadius: 5, backgroundColor: c.shadow, opacity: 0.6 }} />
              <LiveMochiImage size={W} lean={0} mood={mood} source={mochiSource} />
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
