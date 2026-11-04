// Proto « pictos » (4 nov 2026, Jeanne : « réfléchir ensemble, il faut une corrélation partout ») : trois langages
// d'icônes appliqués aux MÊMES éléments (tab bar, missions, réglages, +). /proto-pictos
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { ICONS } from '../src/components/task-icon';
import { useTokens, type, layout } from '../src/theme-v3';

const TABS = [['index', 'Accueil'], ['planning', 'Planning'], ['balance', 'Balance'], ['budget', 'Budget']];
const TAB_D = { index: ICONS.home, planning: ICONS.calendar, balance: ICONS.balance, budget: ICONS.card };
const TASKS = [['dish', 'Vaisselle', '15 min'], ['cart', 'Courses de la semaine', '45 min · divisible'], ['calendar', 'Penser au RDV pédiatre', 'mental ×1,5']];
const SETTINGS = [['bell', 'Notifications', 'Récap chaque jour à 19 h 30'], ['moon', 'Mode nuit', 'Automatique de 22 h à 7 h'], ['mochi', 'Nom de Mochi', 'Comme vous l’appelez à la maison']];

// les trois langages
const STYLES = {
  a: { name: 'A · Trait fin', sub: 'Comme la tab bar aujourd’hui : trait 1,7, encre, pas de fond.', sw: 1.7, pad: false, color: 'ink' },
  b: { name: 'B · Trait sur pastille', sub: 'Trait 2, sur une pastille douce : plus lisible, plus « app ».', sw: 2, pad: true, color: 'ink' },
  c: { name: 'C · Trait épais, couleur', sub: 'Trait 2,6 arrondi, corail pour les missions, encre pour le reste.', sw: 2.6, pad: false, color: 'accent' },
};

function Ico({ T, d, v, size = 22, tint }) {
  const st = STYLES[v]; const color = tint || (st.color === 'accent' ? T.accent : T.ink);
  const box = st.pad ? size + 16 : size;
  return (
    <View style={{ width: box, height: box, borderRadius: box / 2, backgroundColor: st.pad ? T.seg : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d={d} stroke={color} strokeWidth={st.sw} strokeLinecap="round" strokeLinejoin="round" /></Svg>
    </View>
  );
}

function Block({ T, v }) {
  const st = STYLES[v];
  return (
    <View style={{ marginBottom: 34 }}>
      <Text style={[type.section, { color: T.ink, paddingHorizontal: layout.x }]}>{st.name}</Text>
      <Text style={[type.sub, { color: T.muted, paddingHorizontal: layout.x, marginTop: 4 }]}>{st.sub}</Text>
      {/* tab bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingHorizontal: 10, paddingTop: 16, paddingBottom: 10, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: T.line, marginTop: 14 }}>
        {TABS.slice(0, 2).map(([k, lab], i) => <View key={k} style={{ alignItems: 'center', gap: 6, minWidth: 56 }}><Ico T={T} d={TAB_D[k]} v={v} size={21} tint={i === 0 ? T.ink : T.muted} /><Text style={{ fontSize: 11, color: i === 0 ? T.ink : T.muted, fontWeight: i === 0 ? '600' : '400' }}>{lab}</Text></View>)}
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: T.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}><Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Path d="M12 5v14M5 12h14" stroke={T.bg} strokeWidth={st.sw + 0.6} strokeLinecap="round" /></Svg></View>
        {TABS.slice(2).map(([k, lab]) => <View key={k} style={{ alignItems: 'center', gap: 6, minWidth: 56 }}><Ico T={T} d={TAB_D[k]} v={v} size={21} tint={T.muted} /><Text style={{ fontSize: 11, color: T.muted }}>{lab}</Text></View>)}
      </View>
      {/* missions */}
      <View style={{ marginHorizontal: layout.x }}>
        {TASKS.map(([k, title, sub], i) => (
          <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
            <Ico T={T} d={ICONS[k]} v={v} size={st.pad ? 20 : 22} />
            <View style={{ flex: 1 }}><Text style={[type.body, { color: T.ink }]}>{title}</Text><Text style={[type.label, { color: T.muted, marginTop: 2 }]}>{sub}</Text></View>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none"><Circle cx={12} cy={12} r={10} stroke={i === 0 ? T.ink : T.line} strokeWidth={1.5} fill={i === 0 ? T.ink : 'none'} />{i === 0 ? <Path d="M8 12.5l2.5 2.5L16 9.5" stroke={T.bg} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> : null}</Svg>
          </View>
        ))}
      </View>
      {/* réglages */}
      <View style={{ marginHorizontal: layout.x, marginTop: 10 }}>
        {SETTINGS.map(([k, title, sub]) => (
          <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
            <Ico T={T} d={ICONS[k]} v={v} size={st.pad ? 19 : 21} tint={st.color === 'accent' ? T.ink : undefined} />
            <View style={{ flex: 1 }}><Text style={[type.body, { color: T.ink }]}>{title}</Text><Text style={[type.label, { color: T.muted, marginTop: 2 }]}>{sub}</Text></View>
            <Text style={{ color: T.muted }}>›</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ProtoPictos() {
  const T = useTokens();
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <Text style={[type.name, { color: T.ink, paddingHorizontal: layout.x, paddingTop: 14, marginBottom: 18 }]}>Pictos</Text>
          {['a', 'b', 'c'].map(v => <Block key={v} T={T} v={v} />)}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
