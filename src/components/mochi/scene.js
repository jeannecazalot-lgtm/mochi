// Scène de Mochi (DA v3, recette §7) : l'appartement en formes plates sans contour, pleine largeur, qui se
// remplit avec le temps (lvl 0 œuf → 4 un mois). Mochi = l'image actuelle, taille selon le stade.
// Positions ancrées gauche/droite (à passer en largeur relative quand on fera les petits écrans).
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, withSequence, ZoomIn, FadeIn } from 'react-native-reanimated';
import { LiveMochiImage, MOCHI_RATIO } from '../mochi-img';
import { prefersReducedMotion } from '../motion';
import { layout } from '../../theme-v3';

const S = ({ l, r, t, b, w, h, rad = 0, c, tl, tr, bl, br, op }) => <View style={{ position: 'absolute', left: l, right: r, top: t, bottom: b, width: w, height: h, borderRadius: rad, borderTopLeftRadius: tl ?? rad, borderTopRightRadius: tr ?? rad, borderBottomLeftRadius: bl ?? rad, borderBottomRightRadius: br ?? rad, backgroundColor: c, opacity: op }} />;
export const SIZE_BY_STAGE = { egg: 0.6, mini: 0.75, mochi: 1, maxi: 1.15, dore: 1.25 };

export function Scene({ T, stage = 'mini', mood, lvl = 1, away = false, height = layout.scene, hideMochi = false }) {
  const c = T.scene, hh = height, fl = layout.floor;
  const W = Math.round(layout.mochi * (SIZE_BY_STAGE[stage] || 1)), H = W * MOCHI_RATIO;
  // départ en balade : Mochi trottine vers la droite et sort du cadre ; retour : il rentre par la droite en ressort
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
  return (
    <View style={{ height: hh, backgroundColor: c.wall, overflow: 'hidden' }}>
      <S l={0} r={0} b={0} h={fl} c={c.floor} />
      {lvl >= 4 ? <S l={40} r={40} b={14} h={30} rad={15} c={c.rug} /> : null}
      {/* la grande arche, soleil le jour, lune la nuit */}
      <S l={36} t={hh - 204} w={156} h={152} tl={78} tr={78} bl={12} br={12} c={c.window} />
      {c.moon ? <S l={126} t={hh - 176} w={12} h={12} rad={6} c={c.moon} op={0.9} /> : <S l={66} t={hh - 166} w={48} h={48} rad={24} c={c.sun} op={0.9} />}
      {lvl >= 1 ? <Animated.View entering={ZoomIn.springify().damping(14)} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} pointerEvents="none">
        <S r={40} b={fl - 6} w={34} h={32} rad={8} c={c.pot} />
        <S r={24} b={fl + 22} w={66} h={76} rad={34} c={c.plant} />
        <S r={60} b={fl + 60} w={34} h={44} rad={18} c={c.book2} />
        {lvl < 3 ? <><S l={60} b={fl - 2} w={5} h={30} c={c.stool} /><S l={109} b={fl - 2} w={5} h={30} c={c.stool} /><S l={52} b={fl + 26} w={70} h={10} rad={5} c={c.stool} /></> : null}
      </Animated.View> : null}
      {lvl >= 2 ? <Animated.View entering={ZoomIn.springify().damping(14).delay(120)} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} pointerEvents="none">
        <S r={92} t={hh - 162} w={120} h={8} rad={4} c={c.shelf} />
        <S r={178} t={hh - 190} w={26} h={28} rad={13} c={c.vase} />
        {lvl >= 3 ? <><S r={152} t={hh - 188} w={12} h={26} rad={3} c={c.book1} /><S r={138} t={hh - 184} w={10} h={22} rad={3} c={c.book2} /><S r={100} t={hh - 186} w={22} h={24} rad={11} c={c.plant} /><S r={106} t={hh - 166} w={10} h={6} rad={2} c={c.pot} /></> : null}
        {lvl >= 4 ? <S r={124} t={hh - 184} w={22} h={22} rad={5} c={c.frame} /> : null}
      </Animated.View> : null}
      {lvl >= 3 ? <Animated.View entering={ZoomIn.springify().damping(14).delay(200)} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} pointerEvents="none"><S l={40} b={fl - 6} w={120} h={30} rad={13} c={c.sofa} /><S l={52} b={fl + 20} w={36} h={20} rad={8} c={c.cushion} /><S l={104} b={fl + 20} w={36} h={20} rad={8} c={c.cushion} /></Animated.View> : null}
      {lvl >= 4 ? <Animated.View entering={FadeIn.delay(300)} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} pointerEvents="none"><S l={20} b={fl - 2} w={3} h={150} c={T.muted} op={0.5} /><S l={2} b={fl + 142} w={38} h={26} tl={10} tr={10} bl={4} br={4} c={c.lamp} /></Animated.View> : null}
      {/* Mochi : œuf (forme), parti (hors cadre, la phrase de l'Accueil le dit), ou l'image à la taille du stade */}
      {hideMochi ? null : stage === 'egg'
        ? <><View style={{ position: 'absolute', bottom: fl - 10, alignSelf: 'center', width: 150, height: 14, borderRadius: 7, backgroundColor: c.shadow }} /><View style={{ position: 'absolute', bottom: fl - 4, alignSelf: 'center', width: 92, height: 112, borderRadius: 46, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: c.vase }} /></>
        : <>
            <Animated.View entering={ZoomIn.springify().damping(12).stiffness(160)} style={{ position: 'absolute', bottom: fl - 14, left: 0, right: 0 }}><Animated.View style={[{ alignItems: 'center' }, walk]}>
              <View style={{ position: 'absolute', bottom: 2, width: Math.round(W * 1.1), height: 16, borderRadius: 8, backgroundColor: c.shadow }} />
              <LiveMochiImage size={W} lean={0} mood={mood} />
            </Animated.View></Animated.View>
          </>}
    </View>
  );
}
