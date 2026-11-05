// Proto « deux DA » (5 nov 2026, Jeanne : « tu peux me faire test avec ces deux DA ? ») : l'Accueil complet dans
// la matière de Mochi (décor B de ChatGPT) et dans la DNA mat / papier plié (référence de Jeanne). /proto-da2?v=mochi|papier
import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { Scene } from '../src/components/mochi/scene';
import { Gauges, Label, Num } from '../src/components/mochi/gauges';
import { TaskIcon } from '../src/components/task-icon';
import { PAPIERS } from '../src/components/mochi-img';
import { Avatar } from '../src/components/ui';
import { useTokens, type, layout } from '../src/theme-v3';
import copy from '../src/data/copy.json';

const PAPIER = { night: false, bg: '#4E4660', ink: '#F4EFE8', muted: '#B8AFC4', line: 'rgba(244,239,232,0.16)', seg: 'rgba(244,239,232,0.16)', accent: '#D9483E', ok: '#BFD94A', scene: { wall: '#4E4660', floor: '#5A5068', shadow: 'rgba(0,0,0,0.25)', vase: '#EAD6BC', moon: null, lamp: '#F7DFA8' } };
const DECOR = { mochi: require('../assets/proto-da/piece-mochi.png'), papier: require('../assets/proto-da/piece-papier.png'), p1: require('../assets/proto-da/iter1/piece.png'), p2: require('../assets/proto-da/iter2/piece.png'), p3: require('../assets/proto-da/iter3/piece.png'), g: require('../assets/proto-da/graph/piece.png') };
const GRAPH = { dish: require('../assets/proto-da/graph/icones/dish.png'), cart: require('../assets/proto-da/graph/icones/cart.png'), calendar: require('../assets/proto-da/graph/icones/calendar.png'), basket: require('../assets/proto-da/graph/icones/basket.png') };
const MOCHIS = { g: require('../assets/proto-da/graph/mochi.png'), p1: require('../assets/proto-da/iter1/mochi.png'), p2: require('../assets/proto-da/iter2/mochi.png'), p3: require('../assets/proto-da/iter3/mochi.png') };
// trois itérations de la DA papier (5 nov 2026), chacune plus près de la référence de Jeanne
const ITER = {
  g: { bg: '#2E2140', ink: '#F6EFE6', muted: '#BDAFCB', accent: '#D9483E', ok: '#C6E04B', line: 'rgba(246,239,230,0.16)', seg: 'rgba(246,239,230,0.16)', name: 'Graphique' },
  p1: { bg: '#3B2C4F', ink: '#F6EFE6', muted: '#C3B4CF', accent: '#D9483E', ok: '#C6E04B', line: 'rgba(246,239,230,0.16)', seg: 'rgba(246,239,230,0.16)', name: 'Fête' },
  p2: { bg: '#1F2A58', ink: '#F6EFE6', muted: '#B9C0DA', accent: '#D9483E', ok: '#F2B8C2', line: 'rgba(246,239,230,0.16)', seg: 'rgba(246,239,230,0.16)', name: 'Poupée' },
  p3: { bg: '#1A1C45', ink: '#F6EFE6', muted: '#AEB1D6', accent: '#E8508F', ok: '#C6E04B', line: 'rgba(246,239,230,0.16)', seg: 'rgba(246,239,230,0.16)', name: 'Nuit de fête' },
};
const MOCHI_PAPIER = require('../assets/proto-da/mochi-papier.png');
const ICO = { dish: require('../assets/proto-da/icones-papier/dish.png'), cart: require('../assets/proto-da/icones-papier/cart.png'), calendar: require('../assets/proto-da/icones-papier/calendar.png'), basket: require('../assets/proto-da/icones-papier/basket.png') };
const CUT = { dish: require('../assets/proto-da/icones-decoupe/dish.png'), cart: require('../assets/proto-da/icones-decoupe/cart.png'), calendar: require('../assets/proto-da/icones-decoupe/calendar.png'), basket: require('../assets/proto-da/icones-decoupe/basket.png') };
const TASKS = [['dish', 'Vaisselle', null, false], ['cart', 'Courses de la semaine', 'à deux', false], ['calendar', 'Penser au RDV pédiatre', 'mental', false], ['basket', 'Lessive', null, true]];

export default function ProtoDa2() {
  const { v = 'mochi', ic: icParam, m } = useLocalSearchParams(); const ic = icParam || (ITER[v] ? 'c' : 'a'); // m=a|b|c : test de Mochi (v=jour) // ic=a pastilles-images · b trait sur pastille · c papier découpé sans fond
  const it = ITER[v]; const papier = v === 'papier' || !!it;
  const T0 = useTokens(); const T = it ? { ...PAPIER, ...it, scene: { ...PAPIER.scene, wall: it.bg, floor: it.bg } } : papier ? PAPIER : T0;
  const insets = useSafeAreaInsets();
  const t = copy.homeV3;
  const EMO = { dish: '🍽', cart: '🛒', calendar: '📅', basket: '🧺' };
  const Icon = ({ k }) => (!papier ? <TaskIcon emoji={EMO[k]} size={21} /> : ic === 'b' ? <TaskIcon emoji={EMO[k]} size={20} image={false} color={T.ink} /> : ic === 'c' ? <Image source={(v === 'g' ? GRAPH : CUT)[k]} style={{ width: 40, height: 40 }} resizeMode="contain" /> : <Image source={ICO[k]} style={{ width: 36, height: 36, borderRadius: 18 }} />);
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <Scene T={T} stage="mochi" lvl={2} height={layout.scene + 40} topInset={insets.top + 44} backdrop={it ? DECOR[v] : papier ? DECOR.papier : undefined} mochiSource={it ? MOCHIS[v] : papier ? MOCHI_PAPIER : m ? PAPIERS[m] : null} mochiBottom={papier ? 34 : 30} />
      </View>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: layout.x, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Label T={T} style={{ flex: 1, color: T.ink }}>Jeudi 5 novembre</Label>
        <Num T={T}>128</Num><Label T={T}>perles</Label>
        <View style={{ width: 36, height: 36, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, borderColor: T.line, alignItems: 'center', justifyContent: 'center' }}><Svg width={17} height={17} viewBox="0 0 24 24" fill="none"><Path d="M4 5h16v11H9l-5 4V5z" stroke={T.ink} strokeWidth={1.8} strokeLinejoin="round" /></Svg></View>
        <Avatar initial="K" color="#7DB3D5" size={36} />
      </View>
      <View style={{ height: layout.scene + 40 - insets.top - 46 }} />
      <View style={{ paddingHorizontal: layout.x, paddingTop: 24, flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={[type.name, { color: T.ink, flex: 1 }]}>Mochi</Text>
        <Label T={T}>Jour 13 · palier 2</Label>
      </View>
      <Text style={[type.sub, { paddingHorizontal: layout.x, marginTop: 6, color: T.muted }]}>Encore 2 missions et il part en balade.</Text>
      <View style={{ marginTop: 22 }}><Gauges T={T} t={t} energy={{ done: 2, total: 4 }} hearts={4} formLabel={t.formLabels[4]} hint={t.energyHint} /></View>
      <View style={{ paddingHorizontal: layout.x, paddingTop: 18, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Text style={[type.section, { color: T.ink }]}>Aujourd'hui</Text><Label T={T}>2 restantes · 55 min</Label>
      </View>
      <View style={{ marginHorizontal: layout.x }}>
        {TASKS.map(([k, title, badge, done], i) => (
          <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: T.line, opacity: done ? 0.45 : 1 }}>
            <Icon k={k} />
            <Text style={[type.body, { color: T.ink, flex: 1, textDecorationLine: done ? 'line-through' : 'none' }]}>{title}</Text>
            {badge ? <Label T={T}>{badge}</Label> : null}
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none"><Circle cx={12} cy={12} r={10} stroke={done ? T.ink : T.line} strokeWidth={1.5} fill={done ? T.ink : 'none'} />{done ? <Path d="M8 12.5l2.5 2.5L16 9.5" stroke={T.bg} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> : null}</Svg>
          </View>
        ))}
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingTop: 10, paddingBottom: Math.max(insets.bottom, 24), paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' }}>
        {[['Accueil', 'M4 11.5L12 4l8 7.5V20a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8.5z', true], ['Planning', 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z', false], null, ['Balance', 'M12 4v16M5 7h14M5 7l-2.5 6a3.5 3.5 0 007 0L7 7M19 7l-2.5 6a3.5 3.5 0 007 0L21 7M8 20h8', false], ['Budget', 'M3 8a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8zM3 10h18', false]].map((tab, i) => tab ? (
          <View key={tab[0]} style={{ alignItems: 'center', gap: 6, minWidth: 56 }}><Svg width={21} height={21} viewBox="0 0 24 24" fill="none"><Path d={tab[1]} stroke={tab[2] ? T.ink : T.muted} strokeWidth={tab[2] ? 2.1 : 1.9} strokeLinecap="round" strokeLinejoin="round" /></Svg><Text style={{ fontSize: 11, color: tab[2] ? T.ink : T.muted, fontWeight: tab[2] ? '600' : '400' }}>{tab[0]}</Text></View>
        ) : <View key="fab" style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: T.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}><Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Path d="M12 5v14M5 12h14" stroke={T.bg} strokeWidth={2.4} strokeLinecap="round" /></Svg></View>)}
      </View>
    </View>
  );
}
