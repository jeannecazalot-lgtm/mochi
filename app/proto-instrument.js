// Proto · DA v3 « l'instrument et la créature », 3 variantes (3 nov 2026, soir).
// Retours Jeanne sur la v1 : pas de pointillés, peur que ce soit froid, plus aéré, night shift aimé.
// A « Chaud » = chaleur par la couleur · B « Doux » = chaleur par la typo · C « Scène » = chaleur par l'appartement.
// URL : /proto-instrument?v=a|b|c|d[&n=1 pour la nuit][&apt=1|2|3|4 composition de l'appartement, 4 = retenue, &lvl=0..4 son remplissage] — d = version retenue
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { frameFor, MOCHI_RATIO } from '../src/components/mochi-img';

const NEUTRE = { cushion: '#D9CCBE', lamp: '#F3EDE2', lampOn: false, frame: '#D4CBBE', shelf: '#CFC5B6', book1: '#C98F6E', book2: '#9FB59A', vase: '#E3DCD0', stool: '#C9BBA8', bg: '#F3F1EC', ink: '#1A1A1F', muted: '#8E8A82', line: 'rgba(26,26,31,0.10)', seg: 'rgba(26,26,31,0.08)', accent: '#E97A6A', wall: '#E6E2DA', floor: '#D9D3C8', window: '#F6F3EC', sky: '#F6F3EC', sofa: '#C9B9A8', plant: '#9FB59A', pot: '#C98F6E', rug: '#E0DAD0', light: 'rgba(255,255,255,0.45)', shadow: 'rgba(26,26,31,0.10)' };
const CHAUD = { cushion: '#F1CDB8', lamp: '#FBE9C8', lampOn: false, frame: '#E3CBB2', shelf: '#D8C2A6', book1: '#C27A58', book2: '#8FA985', vase: '#E8D5BE', stool: '#D4B894', bg: '#F7F2E9', ink: '#2B2420', muted: '#9A8F84', line: 'rgba(43,36,32,0.10)', seg: 'rgba(43,36,32,0.08)', accent: '#E0725C', wall: '#EFE3D3', floor: '#E2CFB8', window: '#FBF2E2', sky: '#FBF2E2', sofa: '#D9A98F', plant: '#8FA985', pot: '#C27A58', rug: '#EAD9C4', light: 'rgba(255,240,210,0.6)', shadow: 'rgba(43,36,32,0.10)' };
const NUIT = { cushion: '#4A3F38', lamp: '#E0B86A', lampOn: true, frame: '#26262B', shelf: '#2C2823', book1: '#5A4030', book2: '#2F4234', vase: '#3A3530', stool: '#33302B', bg: '#0E0E10', ink: '#F2F0EB', muted: '#6F6D68', line: 'rgba(255,255,255,0.12)', seg: 'rgba(255,255,255,0.12)', accent: '#E97A6A', wall: '#17171A', floor: '#1F1F23', window: '#2A2A40', sky: '#2A2A40', sofa: '#3A3530', plant: '#2F4234', pot: '#5A4030', rug: '#232327', light: 'rgba(120,120,180,0.18)', shadow: 'rgba(0,0,0,0.5)', mood: 'sleeping' };

// variantes : palette, étiquettes (capitales ou phrase), jauge (segments / barre), chiffres, hauteur de scène, aération
const VARIANTS = {
  a: { name: 'Chaud', pal: CHAUD, caps: true, meter: 'segments', scene: 300, air: 1.15, rug: false, light: false },
  b: { name: 'Doux', pal: NEUTRE, caps: false, meter: 'bar', scene: 300, air: 1.3, rug: false, light: false },
  c: { name: 'Scène', pal: NEUTRE, caps: true, meter: 'thin', scene: 380, air: 1.15, rug: true, light: true },
  // D = décision Jeanne 3 nov 2026 (« fais confiance ») : étiquettes et air de B + palette de A + vu-mètre à segments
  d: { name: 'Final', pal: CHAUD, caps: false, meter: 'segments', scene: 300, air: 1.3, rug: false, light: false },
};

function Label({ T, V, children, style }) {
  return V.caps
    ? <Text style={[{ fontSize: 10.5, fontWeight: '600', letterSpacing: 1.8, textTransform: 'uppercase', color: T.muted }, style]}>{children}</Text>
    : <Text style={[{ fontSize: 13.5, fontWeight: '500', color: T.muted }, style]}>{children}</Text>;
}
const Num = ({ T, children, big }) => <Text style={{ fontSize: big ? 22 : 15, fontWeight: '600', letterSpacing: -0.4, color: T.ink, fontVariant: ['tabular-nums'] }}>{children}</Text>;
function Meter({ T, V, n, of }) {
  if (V.meter === 'bar') return <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: T.seg }}><View style={{ width: `${(n / of) * 100}%`, height: 6, borderRadius: 3, backgroundColor: T.ink }} /></View>;
  const segs = V.meter === 'thin' ? 10 : 20, h = V.meter === 'thin' ? 8 : 14, lit = Math.round((n / of) * segs);
  return <View style={{ flexDirection: 'row', gap: V.meter === 'thin' ? 4 : 3, flex: 1 }}>{Array.from({ length: segs }).map((_, i) => <View key={i} style={{ flex: 1, height: h, borderRadius: 2, backgroundColor: i < lit ? T.ink : T.seg }} />)}</View>;
}
function Row({ T, V, title, emoji, done, who, last }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 * V.air, borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth, borderBottomColor: T.line, opacity: done ? 0.4 : 1 }}>
      <Text style={{ fontSize: 16 }}>{emoji}</Text>
      <Text style={{ flex: 1, fontSize: 16, fontWeight: '500', color: T.ink, textDecorationLine: done ? 'line-through' : 'none' }}>{title}</Text>
      {who ? <Label T={T} V={V}>{who}</Label> : null}
      <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: done ? T.ink : T.muted, backgroundColor: done ? T.ink : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
        {done ? <Svg width={11} height={11} viewBox="0 0 12 12"><Path d="M2.5 6.5l2.5 2.5 4.5-5" stroke={T.bg} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg> : null}
      </View>
    </View>
  );
}
// l'appartement : formes plates sans contour — 3 compositions à comparer (?apt=1|2|3)
const S = ({ l, r, t, b, w, h, rad = 0, c, tl, tr, bl, br, op }) => <View style={{ position: 'absolute', left: l, right: r, top: t, bottom: b, width: w, height: h, borderRadius: rad, borderTopLeftRadius: tl ?? rad, borderTopRightRadius: tr ?? rad, borderBottomLeftRadius: bl ?? rad, borderBottomRightRadius: br ?? rad, backgroundColor: c, opacity: op }} />;
function Scene({ T, V, apt = '1', lvl = 4 }) {
  const W = 150, H = W * MOCHI_RATIO, hh = V.scene, fl = 54;
  const mochi = <>
    <View style={{ position: 'absolute', bottom: fl - 12, alignSelf: 'center', width: 170, height: 16, borderRadius: 8, backgroundColor: T.shadow }} />
    <Image source={frameFor(0, T.mood)} style={{ position: 'absolute', bottom: fl - 14, alignSelf: 'center', width: W, height: H }} resizeMode="contain" />
  </>;
  const moon = T.mood ? <S r={74} t={hh - 172} w={10} h={10} rad={5} c="#F2F0EB" op={0.9} /> : null;
  return (
    <View style={{ height: hh, backgroundColor: T.wall, overflow: 'hidden' }}>
      <S l={0} r={0} b={0} h={fl} c={T.floor} />
      {apt === '1' ? <>
        {/* 1 · Salon : canapé à coussins, lampadaire, plante, fenêtre en arche, cadre, tapis */}
        <S l={40} r={40} b={14} h={30} rad={15} c={T.rug} />
        <S r={34} t={hh - 196} w={96} h={118} tl={48} tr={48} bl={10} br={10} c={T.window} />{moon}
        <S l={70} t={hh - 184} w={44} h={34} rad={6} c={T.frame} />
        <S l={22} b={fl - 6} w={136} h={48} rad={20} c={T.sofa} />
        <S l={34} b={fl + 34} w={112} h={30} rad={15} c={T.sofa} />
        <S l={52} b={fl + 38} w={34} h={24} rad={9} c={T.cushion} />
        <S l={96} b={fl + 38} w={34} h={24} rad={9} c={T.cushion} />
        <S l={166} b={fl - 2} w={3} h={150} c={T.muted} op={0.5} />
        <S l={148} b={fl + 142} w={40} h={26} tl={10} tr={10} bl={4} br={4} c={T.lamp} />
        <S r={44} b={fl - 6} w={30} h={28} rad={7} c={T.pot} />
        <S r={32} b={fl + 18} w={54} h={58} rad={28} c={T.plant} />
        <S r={58} b={fl + 44} w={30} h={34} rad={16} c={T.book2} />
      </> : apt === '2' ? <>
        {/* 2 · Fenêtre : une grande arche, une plante, un tabouret — presque rien */}
        <S l={36} t={hh - 204} w={156} h={152} tl={78} tr={78} bl={12} br={12} c={T.window} />
        {T.mood ? <S l={126} t={hh - 176} w={12} h={12} rad={6} c="#F2F0EB" op={0.9} /> : <S l={66} t={hh - 166} w={48} h={48} rad={24} c={T.lamp} op={0.9} />}
        <S r={40} b={fl - 6} w={34} h={32} rad={8} c={T.pot} />
        <S r={24} b={fl + 22} w={66} h={76} rad={34} c={T.plant} />
        <S r={60} b={fl + 60} w={34} h={44} rad={18} c={T.book2} />
        <S l={60} b={fl - 2} w={5} h={30} c={T.stool} /><S l={109} b={fl - 2} w={5} h={30} c={T.stool} />
        <S l={52} b={fl + 26} w={70} h={10} rad={5} c={T.stool} />
      </> : apt === '3' ? <>
        {/* 3 · Étagère : le mur porte la collection (souvenirs), banquette basse, hublot */}
        <S l={40} r={40} b={14} h={30} rad={15} c={T.rug} />
        <S l={34} t={hh - 160} w={200} h={8} rad={4} c={T.shelf} />
        <S l={44} t={hh - 186} w={12} h={26} rad={3} c={T.book1} /><S l={58} t={hh - 182} w={10} h={22} rad={3} c={T.book2} /><S l={70} t={hh - 190} w={11} h={30} rad={3} c={T.sofa} />
        <S l={104} t={hh - 188} w={26} h={28} rad={13} c={T.vase} />
        <S l={150} t={hh - 184} w={22} h={24} rad={11} c={T.plant} /><S l={156} t={hh - 164} w={10} h={6} rad={2} c={T.pot} />
        <S l={192} t={hh - 182} w={22} h={22} rad={5} c={T.frame} />
        <S r={40} t={hh - 192} w={76} h={76} rad={38} c={T.window} />{T.mood ? <S r={68} t={hh - 172} w={9} h={9} rad={5} c="#F2F0EB" op={0.9} /> : null}
        <S l={22} b={fl - 6} w={150} h={34} rad={14} c={T.sofa} />
        <S l={30} b={fl + 24} w={40} h={22} rad={9} c={T.cushion} /><S l={120} b={fl + 24} w={40} h={22} rad={9} c={T.cushion} />
        <S l={184} b={fl - 2} w={3} h={128} c={T.muted} op={0.5} />
        <S l={166} b={fl + 120} w={40} h={26} tl={10} tr={10} bl={4} br={4} c={T.lamp} />
        <S r={32} b={fl - 6} w={26} h={24} rad={6} c={T.pot} />
        <S r={24} b={fl + 14} w={42} h={46} rad={22} c={T.plant} />
      </> : null}
      {apt === '4' ? <>
        {/* 4 · RETENUE (Jeanne 3 nov 2026, « vas-y tu as raison ») : départ Fenêtre, la pièce se remplit avec le temps (?lvl=0..4) */}
        {lvl >= 4 ? <S l={40} r={40} b={14} h={30} rad={15} c={T.rug} /> : null}
        <S l={36} t={hh - 204} w={156} h={152} tl={78} tr={78} bl={12} br={12} c={T.window} />
        {T.mood ? <S l={126} t={hh - 176} w={12} h={12} rad={6} c="#F2F0EB" op={0.9} /> : <S l={66} t={hh - 166} w={48} h={48} rad={24} c={T.lamp} op={0.9} />}
        {lvl >= 1 ? <>
          <S r={40} b={fl - 6} w={34} h={32} rad={8} c={T.pot} />
          <S r={24} b={fl + 22} w={66} h={76} rad={34} c={T.plant} />
          <S r={60} b={fl + 60} w={34} h={44} rad={18} c={T.book2} />
          {lvl < 3 ? <><S l={60} b={fl - 2} w={5} h={30} c={T.stool} /><S l={109} b={fl - 2} w={5} h={30} c={T.stool} />
          <S l={52} b={fl + 26} w={70} h={10} rad={5} c={T.stool} /></> : null}
        </> : null}
        {lvl >= 2 ? <>
          {/* l'étagère apparaît avec le premier souvenir ; 5 cases, remplies au fil des balades */}
          <S r={92} t={hh - 162} w={120} h={8} rad={4} c={T.shelf} />
          <S r={178} t={hh - 190} w={26} h={28} rad={13} c={T.vase} />
          {lvl >= 3 ? <><S r={152} t={hh - 188} w={12} h={26} rad={3} c={T.book1} /><S r={138} t={hh - 184} w={10} h={22} rad={3} c={T.book2} /><S r={100} t={hh - 186} w={22} h={24} rad={11} c={T.plant} /><S r={106} t={hh - 166} w={10} h={6} rad={2} c={T.pot} /></> : null}
          {lvl >= 4 ? <S r={124} t={hh - 184} w={22} h={22} rad={5} c={T.frame} /> : null}
        </> : null}
        {lvl >= 3 ? <>
          {/* la banquette remplace le tabouret */}
          <S l={40} b={fl - 6} w={120} h={30} rad={13} c={T.sofa} />
          <S l={52} b={fl + 20} w={36} h={20} rad={8} c={T.cushion} /><S l={104} b={fl + 20} w={36} h={20} rad={8} c={T.cushion} />
        </> : null}
        {lvl >= 4 ? <>
          <S l={20} b={fl - 2} w={3} h={150} c={T.muted} op={0.5} />
          <S l={2} b={fl + 142} w={38} h={26} tl={10} tr={10} bl={4} br={4} c={T.lamp} />
        </> : null}
      </> : null}
      {mochi}
    </View>
  );
}
const ICONS = { home: 'M4 11.5L12 4l8 7.5V20a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8.5z', planning: 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z', balance: 'M12 4v16M5 7h14M5 7l-2.5 6a3.5 3.5 0 007 0L7 7M19 7l-2.5 6a3.5 3.5 0 007 0L21 7M8 20h8', budget: 'M3 8a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8zM3 10h18M16 15h2' };

export default function ProtoInstrument() {
  const { v = 'd', n, apt = '4', lvl = '4' } = useLocalSearchParams();
  const V = VARIANTS[v] || VARIANTS.d;
  const T = n ? NUIT : V.pal;
  const X = 24, A = V.air;
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}><Scene T={T} V={V} apt={String(apt)} lvl={Number(lvl)} /></View>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ paddingTop: 12, paddingHorizontal: X, flexDirection: 'row', alignItems: 'baseline' }}>
          <Label T={T} V={V} style={{ flex: 1, color: T.ink }}>{V.caps ? 'Mar 03 nov' : 'Mardi 3 novembre'}</Label>
          <Num T={T}>128</Num><Label T={T} V={V} style={{ marginLeft: 6 }}>perles</Label>
        </View>
        <View style={{ height: V.scene - 94 }} />

        <View style={{ paddingHorizontal: X, paddingTop: 24 * A, flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={{ fontSize: V.caps ? 28 : 32, fontWeight: '600', letterSpacing: -1, color: T.ink, flex: 1 }}>Mochi</Text>
          <Label T={T} V={V}>{V.caps ? 'Mini · J12' : 'Mini · jour 12'}</Label>
        </View>
        <Text style={{ paddingHorizontal: X, marginTop: 6, fontSize: 15.5, lineHeight: 21, color: T.muted }}>{T.mood ? 'Dort. La journée est faite, il repart demain.' : 'Encore 2 missions et il part en balade.'}</Text>

        <View style={{ marginHorizontal: X, marginTop: 24 * A, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, paddingVertical: 18 * A, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
            <Label T={T} V={V} style={{ width: 66 }}>Énergie</Label>
            <Meter T={T} V={V} n={T.mood ? 5 : 3} of={5} />
            <Num T={T}>{T.mood ? '5' : '3'}<Text style={{ color: T.muted, fontWeight: '500' }}> / 5</Text></Num>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, paddingVertical: 18 * A, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
            <Label T={T} V={V} style={{ width: 66 }}>Forme</Label>
            <View style={{ flexDirection: 'row', gap: 8, flex: 1 }}>{[1, 1, 1, 1, 0].map((on, i) => <View key={i} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: on ? T.accent : T.seg }} />)}</View>
            <Label T={T} V={V} style={{ color: T.ink }}>En forme</Label>
          </View>
        </View>

        <View style={{ paddingHorizontal: X, paddingTop: 28 * A, paddingBottom: 4, flexDirection: 'row', alignItems: 'baseline' }}>
          <Label T={T} V={V} style={{ flex: 1, color: T.ink, fontSize: V.caps ? 10.5 : 17, fontWeight: '600' }}>Aujourd'hui</Label>
          <Label T={T} V={V}>2 restantes · 35 min</Label>
        </View>
        <View style={{ marginHorizontal: X }}>
          <Row T={T} V={V} emoji="🧺" title="Lancer une lessive" />
          <Row T={T} V={V} emoji="📞" title="Appeler le pédiatre" who="K" />
          <Row T={T} V={V} emoji="🍽️" title="Vaisselle du soir" who={V.caps ? 'À deux' : 'à deux'} done />
          <Row T={T} V={V} emoji="🛒" title="Courses de la semaine" who="J" done last />
        </View>

        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingTop: 10, paddingBottom: 30, paddingHorizontal: 10, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, backgroundColor: T.bg }}>
          {[['home', 'Accueil', true], ['planning', 'Planning'], ['fab'], ['balance', 'Balance'], ['budget', 'Budget']].map(([k, l, on]) => k === 'fab'
            ? <View key="fab" style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: T.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}><Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Path d="M12 5v14M5 12h14" stroke={T.bg} strokeWidth={2.4} strokeLinecap="round" /></Svg></View>
            : <View key={k} style={{ alignItems: 'center', gap: 6, minWidth: 56 }}>
                <Svg width={21} height={21} viewBox="0 0 24 24" fill="none"><Path d={ICONS[k]} stroke={on ? T.ink : T.muted} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" /></Svg>
                {V.caps ? <Text style={{ fontSize: 9.5, fontWeight: '600', letterSpacing: 1.4, textTransform: 'uppercase', color: on ? T.ink : T.muted }}>{l}</Text> : <Text style={{ fontSize: 11, fontWeight: on ? '600' : '400', color: on ? T.ink : T.muted }}>{l}</Text>}
              </View>)}
        </View>
      </SafeAreaView>
    </View>
  );
}
