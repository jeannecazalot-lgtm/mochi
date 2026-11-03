// Scène de Mochi (DA v3, recette §7) : l'appartement en formes plates sans contour, pleine largeur, qui se
// remplit avec le temps (lvl 0 œuf → 4 un mois). Mochi = l'image actuelle, taille selon le stade.
// Positions ancrées gauche/droite (à passer en largeur relative quand on fera les petits écrans).
import React from 'react';
import { View, Image, Text } from 'react-native';
import { frameFor, MOCHI_RATIO } from '../mochi-img';
import { layout } from '../../theme-v3';

const S = ({ l, r, t, b, w, h, rad = 0, c, tl, tr, bl, br, op }) => <View style={{ position: 'absolute', left: l, right: r, top: t, bottom: b, width: w, height: h, borderRadius: rad, borderTopLeftRadius: tl ?? rad, borderTopRightRadius: tr ?? rad, borderBottomLeftRadius: bl ?? rad, borderBottomRightRadius: br ?? rad, backgroundColor: c, opacity: op }} />;
export const SIZE_BY_STAGE = { egg: 0.6, mini: 0.75, mochi: 1, maxi: 1.15, dore: 1.25 };

export function Scene({ T, stage = 'mini', mood, lvl = 1, away = false, height = layout.scene }) {
  const c = T.scene, hh = height, fl = layout.floor;
  const W = Math.round(layout.mochi * (SIZE_BY_STAGE[stage] || 1)), H = W * MOCHI_RATIO;
  return (
    <View style={{ height: hh, backgroundColor: c.wall, overflow: 'hidden' }}>
      <S l={0} r={0} b={0} h={fl} c={c.floor} />
      {lvl >= 4 ? <S l={40} r={40} b={14} h={30} rad={15} c={c.rug} /> : null}
      {/* la grande arche, soleil le jour, lune la nuit */}
      <S l={36} t={hh - 204} w={156} h={152} tl={78} tr={78} bl={12} br={12} c={c.window} />
      {c.moon ? <S l={126} t={hh - 176} w={12} h={12} rad={6} c={c.moon} op={0.9} /> : <S l={66} t={hh - 166} w={48} h={48} rad={24} c={c.sun} op={0.9} />}
      {lvl >= 1 ? <>
        <S r={40} b={fl - 6} w={34} h={32} rad={8} c={c.pot} />
        <S r={24} b={fl + 22} w={66} h={76} rad={34} c={c.plant} />
        <S r={60} b={fl + 60} w={34} h={44} rad={18} c={c.book2} />
        {lvl < 3 ? <><S l={60} b={fl - 2} w={5} h={30} c={c.stool} /><S l={109} b={fl - 2} w={5} h={30} c={c.stool} /><S l={52} b={fl + 26} w={70} h={10} rad={5} c={c.stool} /></> : null}
      </> : null}
      {lvl >= 2 ? <>
        <S r={92} t={hh - 162} w={120} h={8} rad={4} c={c.shelf} />
        <S r={178} t={hh - 190} w={26} h={28} rad={13} c={c.vase} />
        {lvl >= 3 ? <><S r={152} t={hh - 188} w={12} h={26} rad={3} c={c.book1} /><S r={138} t={hh - 184} w={10} h={22} rad={3} c={c.book2} /><S r={100} t={hh - 186} w={22} h={24} rad={11} c={c.plant} /><S r={106} t={hh - 166} w={10} h={6} rad={2} c={c.pot} /></> : null}
        {lvl >= 4 ? <S r={124} t={hh - 184} w={22} h={22} rad={5} c={c.frame} /> : null}
      </> : null}
      {lvl >= 3 ? <><S l={40} b={fl - 6} w={120} h={30} rad={13} c={c.sofa} /><S l={52} b={fl + 20} w={36} h={20} rad={8} c={c.cushion} /><S l={104} b={fl + 20} w={36} h={20} rad={8} c={c.cushion} /></> : null}
      {lvl >= 4 ? <><S l={20} b={fl - 2} w={3} h={150} c={T.muted} op={0.5} /><S l={2} b={fl + 142} w={38} h={26} tl={10} tr={10} bl={4} br={4} c={c.lamp} /></> : null}
      {/* Mochi : œuf (forme), absent (traces), ou l'image à la taille du stade */}
      {stage === 'egg'
        ? <><View style={{ position: 'absolute', bottom: fl - 10, alignSelf: 'center', width: 150, height: 14, borderRadius: 7, backgroundColor: c.shadow }} /><View style={{ position: 'absolute', bottom: fl - 4, alignSelf: 'center', width: 92, height: 112, borderRadius: 46, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: c.vase }} /></>
        : away
          ? <View style={{ position: 'absolute', bottom: fl + 10, alignSelf: 'center', width: 64, height: 64, borderRadius: 32, borderWidth: 1.5, borderStyle: 'dashed', borderColor: T.muted, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 22 }}>👣</Text></View>
          : <>
            <View style={{ position: 'absolute', bottom: fl - 12, alignSelf: 'center', width: Math.round(W * 1.1), height: 16, borderRadius: 8, backgroundColor: c.shadow }} />
            <Image source={frameFor(0, mood)} style={{ position: 'absolute', bottom: fl - 14, alignSelf: 'center', width: W, height: H }} resizeMode="contain" />
          </>}
    </View>
  );
}
