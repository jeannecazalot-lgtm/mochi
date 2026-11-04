// Scène de Mochi (DA v3, recette §7) : l'appartement en formes plates sans contour, pleine largeur.
// Refonte 4 nov 2026 (retour Jeanne : « un peu triste », « plus de choses autour ») : la pièce est PLEINE dès le
// jour 1 (fenêtre avec le ciel et la colline, rideau, tapis, table, plante, étagère, cadre), les paliers ajoutent
// (lampe, banquette, deuxième plante, cadres) ; micro-mouvements permanents : la plante se balance, la lampe
// respire la nuit, les étoiles scintillent. Mochi = l'image actuelle, taille selon le stade.
// Positions ancrées gauche/droite (à passer en largeur relative quand on fera les petits écrans).
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, withSequence, withRepeat, Easing, ZoomIn, FadeIn } from 'react-native-reanimated';
import { LiveMochiImage, MOCHI_RATIO } from '../mochi-img';
import { prefersReducedMotion } from '../motion';
import { layout } from '../../theme-v3';

const S = ({ l, r, t, b, w, h, rad = 0, c, tl, tr, bl, br, op }) => <View style={{ position: 'absolute', left: l, right: r, top: t, bottom: b, width: w, height: h, borderRadius: rad, borderTopLeftRadius: tl ?? rad, borderTopRightRadius: tr ?? rad, borderBottomLeftRadius: bl ?? rad, borderBottomRightRadius: br ?? rad, backgroundColor: c, opacity: op }} />;
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
  const winT = hh - 214;
  return (
    <View style={{ height: hh, backgroundColor: c.wall, overflow: 'hidden' }}>
      <S l={0} r={0} b={0} h={fl} c={c.floor} />
      {/* tapis, dès le jour 1 */}
      <S l={70} r={70} b={12} h={28} rad={14} c={c.rug} />
      {/* la grande arche : le ciel, la colline, le soleil le jour, la lune et les étoiles la nuit */}
      <S l={36} t={winT} w={156} h={160} tl={78} tr={78} bl={12} br={12} c={c.window} />
      <S l={36} t={winT + 112} w={156} h={48} bl={12} br={12} tl={60} tr={60} c={c.hill} />
      {c.moon
        ? <><S l={126} t={winT + 30} w={14} h={14} rad={7} c={c.moon} op={0.9} />{c.stars ? <><Glow style={{ position: 'absolute', left: 70, top: winT + 46, width: 3, height: 3, borderRadius: 2, backgroundColor: c.moon }} from={0.2} to={0.9} period={1900} /><Glow style={{ position: 'absolute', left: 96, top: winT + 28, width: 2, height: 2, borderRadius: 1, backgroundColor: c.moon }} from={0.3} to={0.9} period={2300} delay={400} /><Glow style={{ position: 'absolute', left: 160, top: winT + 58, width: 3, height: 3, borderRadius: 2, backgroundColor: c.moon }} from={0.2} to={0.8} period={2100} delay={900} /></> : null}</>
        : <S l={66} t={winT + 34} w={48} h={48} rad={24} c={c.sun} op={0.95} />}
      {/* rideau à droite de l'arche, étagère et cadre : dès le jour 1 */}
      <S l={190} t={winT - 6} w={12} h={176} rad={6} c={c.curtain} />
      <S r={40} t={hh - 162} w={120} h={8} rad={4} c={c.shelf} />
      <S r={126} t={hh - 190} w={26} h={28} rad={13} c={c.vase} />
      <S r={100} t={hh - 188} w={12} h={26} rad={3} c={c.book1} />
      <S r={86} t={hh - 184} w={10} h={22} rad={3} c={c.book2} />
      <S r={52} t={hh - 196} w={26} h={30} rad={5} c={c.frame} />
      {/* table basse à gauche (remplacée par la banquette au palier 3), plante à droite : dès le jour 1 */}
      {lvl < 3 ? <><S l={60} b={fl - 2} w={5} h={30} c={c.stool} /><S l={109} b={fl - 2} w={5} h={30} c={c.stool} /><S l={52} b={fl + 26} w={70} h={10} rad={5} c={c.stool} /><S l={74} b={fl + 36} w={26} h={12} rad={6} c={c.vase} /></> : null}
      <Sway style={{ position: 'absolute', right: 20, bottom: fl - 6, width: 74, height: 110 }}>
        <S l={20} b={0} w={34} h={32} rad={8} c={c.pot} />
        <S l={4} b={28} w={66} h={76} rad={34} c={c.plant} />
        <S l={40} b={66} w={34} h={44} rad={18} c={c.book2} />
      </Sway>
      {/* palier 2 : lampe (allumée la nuit) et petite plante sur l'étagère */}
      {lvl >= 2 ? <Layer delay={120}>
        <S l={20} b={fl - 2} w={3} h={150} c={T.muted} op={0.5} />
        <S l={2} b={fl + 142} w={38} h={26} tl={10} tr={10} bl={4} br={4} c={c.lamp} />
        {c.lampOn ? <Glow style={{ position: 'absolute', left: -24, bottom: fl + 60, width: 90, height: 90, borderRadius: 45, backgroundColor: c.lamp }} from={0.1} to={0.22} /> : null}
        <Sway style={{ position: 'absolute', right: 150, top: hh - 190, width: 24, height: 30 }} deg={2} period={3300} delay={600}><S l={0} t={0} w={22} h={24} rad={11} c={c.plant} /><S l={6} t={20} w={10} h={8} rad={2} c={c.pot} /></Sway>
      </Layer> : null}
      {/* palier 3 : la banquette et ses coussins */}
      {lvl >= 3 ? <Layer delay={200}><S l={40} b={fl - 6} w={120} h={30} rad={13} c={c.sofa} /><S l={52} b={fl + 20} w={36} h={20} rad={8} c={c.cushion} /><S l={104} b={fl + 20} w={36} h={20} rad={8} c={c.cushion} /></Layer> : null}
      {/* palier 4 : un deuxième cadre, une guirlande de livres */}
      {lvl >= 4 ? <Layer delay={300} fade><S r={86} t={hh - 236} w={22} h={22} rad={5} c={c.frame} /><S r={116} t={hh - 232} w={16} h={16} rad={4} c={c.sofa} /></Layer> : null}
      {/* Mochi : œuf (forme), parti (hors cadre, la phrase de l'Accueil le dit), ou l'image à la taille du stade */}
      {hideMochi ? null : stage === 'egg'
        ? <><View style={{ position: 'absolute', bottom: fl - 10, alignSelf: 'center', width: 150, height: 14, borderRadius: 7, backgroundColor: c.shadow }} /><View style={{ position: 'absolute', bottom: fl - 4, alignSelf: 'center', width: 92, height: 112, borderRadius: 46, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: c.vase }} /></>
        : <Animated.View entering={ZoomIn.springify().damping(12).stiffness(160)} style={{ position: 'absolute', bottom: fl - 14, left: 0, right: 0 }}><Animated.View style={[{ alignItems: 'center' }, walk]}>
              <View style={{ position: 'absolute', bottom: 2, width: Math.round(W * 1.1), height: 16, borderRadius: 8, backgroundColor: c.shadow }} />
              <LiveMochiImage size={W} lean={0} mood={mood} />
            </Animated.View></Animated.View>}
    </View>
  );
}
