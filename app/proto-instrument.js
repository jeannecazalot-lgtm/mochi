// Proto · DA v3 « l'instrument et la créature », 3 variantes (3 nov 2026, soir).
// Retours Jeanne sur la v1 : pas de pointillés, peur que ce soit froid, plus aéré, night shift aimé.
// A « Chaud » = chaleur par la couleur · B « Doux » = chaleur par la typo · C « Scène » = chaleur par l'appartement.
// URL : /proto-instrument?v=a|b|c|d[&n=1 pour la nuit] — d = version retenue
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { frameFor, MOCHI_RATIO } from '../src/components/mochi-img';

const NEUTRE = { bg: '#F3F1EC', ink: '#1A1A1F', muted: '#8E8A82', line: 'rgba(26,26,31,0.10)', seg: 'rgba(26,26,31,0.08)', accent: '#E97A6A', wall: '#E6E2DA', floor: '#D9D3C8', window: '#F6F3EC', sky: '#F6F3EC', sofa: '#C9B9A8', plant: '#9FB59A', pot: '#C98F6E', rug: '#E0DAD0', light: 'rgba(255,255,255,0.45)', shadow: 'rgba(26,26,31,0.10)' };
const CHAUD = { bg: '#F7F2E9', ink: '#2B2420', muted: '#9A8F84', line: 'rgba(43,36,32,0.10)', seg: 'rgba(43,36,32,0.08)', accent: '#E0725C', wall: '#EFE3D3', floor: '#E2CFB8', window: '#FBF2E2', sky: '#FBF2E2', sofa: '#D9A98F', plant: '#8FA985', pot: '#C27A58', rug: '#EAD9C4', light: 'rgba(255,240,210,0.6)', shadow: 'rgba(43,36,32,0.10)' };
const NUIT = { bg: '#0E0E10', ink: '#F2F0EB', muted: '#6F6D68', line: 'rgba(255,255,255,0.12)', seg: 'rgba(255,255,255,0.12)', accent: '#E97A6A', wall: '#17171A', floor: '#1F1F23', window: '#2A2A40', sky: '#2A2A40', sofa: '#3A3530', plant: '#2F4234', pot: '#5A4030', rug: '#232327', light: 'rgba(120,120,180,0.18)', shadow: 'rgba(0,0,0,0.5)', mood: 'sleeping' };

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
// l'appartement : formes plates sans contour
function Scene({ T, V }) {
  const W = 150, H = W * MOCHI_RATIO, hh = V.scene, fl = V.rug ? 72 : 54;
  return (
    <View style={{ height: hh, backgroundColor: T.wall, overflow: 'hidden' }}>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: fl, backgroundColor: T.floor }} />
      <View style={{ position: 'absolute', right: 34, top: hh - 234, width: 92, height: 118, borderRadius: 46, backgroundColor: T.window }} />
      {T.mood ? <View style={{ position: 'absolute', right: 62, top: hh - 212, width: 10, height: 10, borderRadius: 5, backgroundColor: '#F2F0EB', opacity: 0.9 }} /> : null}
      {V.light ? <View style={{ position: 'absolute', right: 10, bottom: fl - 30, width: 150, height: 90, borderRadius: 45, backgroundColor: T.light, transform: [{ skewX: '-18deg' }] }} /> : null}
      {V.rug ? <View style={{ position: 'absolute', alignSelf: 'center', bottom: 18, width: 300, height: 44, borderRadius: 22, backgroundColor: T.rug }} /> : null}
      <View style={{ position: 'absolute', left: 30, bottom: fl - 8, width: 118, height: 46, borderRadius: 23, backgroundColor: T.sofa }} />
      <View style={{ position: 'absolute', left: 44, bottom: fl + 26, width: 90, height: 26, borderRadius: 13, backgroundColor: T.sofa }} />
      <View style={{ position: 'absolute', right: 52, bottom: fl - 8, width: 30, height: 30, borderRadius: 6, backgroundColor: T.pot }} />
      <View style={{ position: 'absolute', right: 40, bottom: fl + 14, width: 54, height: 62, borderRadius: 30, backgroundColor: T.plant }} />
      <View style={{ position: 'absolute', bottom: fl - 12, alignSelf: 'center', width: 170, height: 16, borderRadius: 8, backgroundColor: T.shadow }} />
      <Image source={frameFor(0, T.mood)} style={{ position: 'absolute', bottom: fl - 14, alignSelf: 'center', width: W, height: H }} resizeMode="contain" />
    </View>
  );
}
const ICONS = { home: 'M4 11.5L12 4l8 7.5V20a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8.5z', planning: 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z', balance: 'M12 4v16M5 7h14M5 7l-2.5 6a3.5 3.5 0 007 0L7 7M19 7l-2.5 6a3.5 3.5 0 007 0L21 7M8 20h8', budget: 'M3 8a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8zM3 10h18M16 15h2' };

export default function ProtoInstrument() {
  const { v = 'd', n } = useLocalSearchParams();
  const V = VARIANTS[v] || VARIANTS.d;
  const T = n ? NUIT : V.pal;
  const X = 24, A = V.air;
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}><Scene T={T} V={V} /></View>
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
