// Proto · DA v2, 3 directions rendues sur l'Accueil « Mochi qu'on élève » (3 nov 2026).
// Recette : docs/recettes/da-v2-mochi-eleve.md. URL : /proto-da?v=recre|maison|veilleuse
// Tokens LOCAUX au proto (à déplacer dans theme.js si une direction est retenue).
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Ellipse } from 'react-native-svg';
import { MochiImage } from '../src/components/mochi-img';
import { me, partner } from '../src/demo';
import { GlowBg } from '../src/components/ui';

const THEMES = {
  // A' « Foyer » (retour Jeanne 3 nov 2026) : DNA actuel (cartes crème plates + hairline, halos, typo système,
  // CTA corail) + ciel et Mochi grand de A + bandeau pièce de B. Aucun bord 3D.
  foyer: { name: 'Foyer', bg: ['#EAF4FF', '#FAFAF7', '#FAFAF7'], card: '#FFFCF5', border: 'rgba(26,26,31,0.06)', bottom: 0, radius: 16, ink: '#1A1A1F', muted: '#8A857C', coral: '#E97A6A', mint: '#9FC9A8', butter: '#F5C76E', sky: '#7DB3D5', lav: '#B8A5D9', title: null, bar: '#FFFFFF', barLine: '#EBEBEB', track: 'rgba(26,26,31,0.06)', decor: 'room', wall: '#FFF6E8', floor: '#F3E3CC', shelf: '#E6D2B5', halos: true },
  recre: { name: 'Récré', bg: ['#EAF4FF', '#FFF8EA'], card: '#FFFFFF', border: '#E6E1F3', bottom: 4, radius: 22, ink: '#2E2A4A', muted: '#8B86A6', coral: '#FF8A73', mint: '#7ED3A6', butter: '#FFD166', sky: '#7FB8F0', lav: '#B59CF2', title: 'ArialRoundedMTBold', bar: '#FFFFFF', barLine: '#E6E1F3', track: '#EFEBF8', decor: 'hill' },
  maison: { name: 'Maison', bg: ['#F7F0E4', '#F2E7D6'], card: '#FFFBF3', border: 'transparent', bottom: 0, radius: 26, shadow: { shadowColor: '#3A2E28', shadowOpacity: 0.07, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } }, ink: '#3A2E28', muted: '#9A8B7E', coral: '#D97757', mint: '#7E9463', butter: '#E0A93F', sky: '#6F8FA6', lav: '#8A6B9E', title: 'Georgia-Bold', bar: '#FFFBF3', barLine: '#E8DCC8', track: '#EEE3D2', decor: 'room' },
  veilleuse: { name: 'Veilleuse', bg: ['#1C1B33', '#2B2650'], card: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.12)', bottom: 0, radius: 20, ink: '#F4F1FF', muted: '#A9A4C8', coral: '#FF9C8A', mint: '#8FE3C0', butter: '#FFD98A', sky: '#8FC4FF', lav: '#C9B6FF', title: 'AvenirNext-DemiBold', bar: 'rgba(28,27,51,0.9)', barLine: 'rgba(255,255,255,0.1)', track: 'rgba(255,255,255,0.1)', decor: 'glow', dark: true },
};

const ICONS = {
  home: 'M4 11.5L12 4l8 7.5V20a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8.5z',
  planning: 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z',
  balance: 'M12 4v16M5 7h14M5 7l-2.5 6a3.5 3.5 0 007 0L7 7M19 7l-2.5 6a3.5 3.5 0 007 0L21 7M8 20h8',
  budget: 'M3 8a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8zM3 10h18M16 15h2',
  check: 'M2.5 6.5l2.5 2.5 4.5-5',
};

function Card({ T, children, style, pad = 16 }) {
  return (
    <View style={[{ backgroundColor: T.card, borderRadius: T.radius, padding: pad, borderWidth: T.border === 'transparent' ? 0 : 1.5, borderColor: T.border, borderBottomWidth: T.bottom || (T.border === 'transparent' ? 0 : 1.5) }, T.shadow, style]}>{children}</View>
  );
}
function Pill({ T, color, children }) {
  return <View style={{ backgroundColor: color + (T.dark ? '33' : '2E'), borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ fontFamily: T.title || undefined, fontWeight: '600', fontSize: 11, letterSpacing: 1.2, color: T.dark ? color : T.ink, textTransform: 'uppercase' }}>{children}</Text></View>;
}
function Check({ T, done }) {
  return (
    <View style={{ width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: done ? T.mint : T.muted + '66', backgroundColor: done ? T.mint : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
      {done ? <Svg width={12} height={12} viewBox="0 0 12 12"><Path d={ICONS.check} stroke={T.dark ? '#1C1B33' : '#FFFFFF'} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg> : null}
    </View>
  );
}
function Row({ T, emoji, title, done, who, together, first }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 12, borderTopWidth: first ? 0 : 1, borderTopColor: T.dark ? 'rgba(255,255,255,0.08)' : T.ink + '0D', opacity: done ? 0.45 : 1 }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <Text style={{ flex: 1, fontSize: 16, fontWeight: '500', color: T.ink, textDecorationLine: done ? 'line-through' : 'none' }} numberOfLines={1}>{title}</Text>
      {together ? <Pill T={T} color={T.mint}>À deux</Pill> : who ? <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: who.color, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{who.initial}</Text></View> : null}
      <Check T={T} done={done} />
    </View>
  );
}
function Decor({ T }) {
  if (T.decor === 'hill') return (
    <>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%"><Ellipse cx="50%" cy="300" rx="330" ry="140" fill={T.mint} opacity={0.55} /><Ellipse cx="18%" cy="330" rx="200" ry="120" fill={T.mint} opacity={0.35} /></Svg>
      <View style={{ position: 'absolute', right: 34, top: 2, width: 46, height: 46, borderRadius: 23, backgroundColor: T.butter }} />
      <View style={{ position: 'absolute', right: 96, top: 44, width: 54, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF' }} />
      <View style={{ position: 'absolute', right: 80, top: 36, width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFFFFF' }} />
    </>
  );
  if (T.decor === 'room') return (
    <>
      <View style={{ position: 'absolute', left: 18, right: 18, top: 0, bottom: 0, borderRadius: 26, backgroundColor: T.wall || '#F1E3CF', overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 64, backgroundColor: T.floor || '#E4CDAE' }} />
        <View style={{ position: 'absolute', left: 26, top: 56, width: 110, height: 6, borderRadius: 3, backgroundColor: T.shelf || '#D6BC98' }} />
        <Text style={{ position: 'absolute', left: 34, top: 22, fontSize: 28 }}>🪴</Text>
        <Text style={{ position: 'absolute', left: 84, top: 26, fontSize: 24 }}>📚</Text>
        <Text style={{ position: 'absolute', right: 30, top: 26, fontSize: 34 }}>🪟</Text>
        <Text style={{ position: 'absolute', left: 30, bottom: 30, fontSize: 32 }}>🛋️</Text>
        <Text style={{ position: 'absolute', right: 34, bottom: 34, fontSize: 28 }}>🪨</Text>
      </View>
    </>
  );
  return (
    <>
      {[[30, 20], [90, 70], [160, 15], [300, 40], [360, 90], [250, 110], [60, 130], [340, 150]].map(([x, y], i) => <View key={i} style={{ position: 'absolute', left: x, top: y, width: i % 3 ? 2 : 3, height: i % 3 ? 2 : 3, borderRadius: 2, backgroundColor: '#FFFFFF', opacity: 0.5 + (i % 2) * 0.3 }} />)}
      {[300, 260, 220, 190, 160, 135].map((d, i) => <View key={d} style={{ position: 'absolute', alignSelf: 'center', top: 150 - d / 2, width: d, height: d, borderRadius: d / 2, backgroundColor: T.coral, opacity: 0.035 + i * 0.03 }} />)}
    </>
  );
}

export default function ProtoDA() {
  const { v = 'recre' } = useLocalSearchParams();
  const T = THEMES[v] || THEMES.recre;
  const tabs = [['home', 'Accueil'], ['planning', 'Planning'], ['balance', 'Balance'], ['budget', 'Budget']];
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={T.bg} style={StyleSheet.absoluteFill} />
      {T.halos ? <GlowBg intensity="normal" /> : null}
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingTop: 14, paddingHorizontal: 23, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ flex: 1, fontSize: 11.5, fontWeight: '600', letterSpacing: 1.4, color: T.muted }}>MARDI 3 NOVEMBRE</Text>
            <Pill T={T} color={T.butter}>◉ 128 perles</Pill>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: me.color, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontWeight: '700' }}>K</Text></View>
          </View>

          {/* héros : décor + Mochi + bulle */}
          <View style={{ height: 230, marginTop: 14, justifyContent: 'flex-end', alignItems: 'center' }}>
            <Decor T={T} />
            <View style={{ position: 'absolute', top: T.decor === 'room' ? 82 : T.decor === 'glow' ? 0 : 30, left: 34, maxWidth: 200, backgroundColor: T.dark ? 'rgba(255,255,255,0.12)' : '#FFFFFF', borderRadius: 16, borderBottomRightRadius: 4, paddingHorizontal: 12, paddingVertical: 8, zIndex: 2 }}>
              <Text style={{ fontSize: 13.5, fontWeight: '500', color: T.ink, lineHeight: 18 }}>Encore 2 missions et je pars en balade !</Text>
            </View>
            <View style={{ marginBottom: T.decor === 'room' ? 18 : T.decor === 'hill' ? 34 : 22 }}><MochiImage size={150} /></View>
          </View>
          <View style={{ alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
            <Text style={{ fontFamily: T.title || undefined, fontWeight: T.title ? undefined : '700', letterSpacing: T.title ? undefined : -0.5, fontSize: 24, color: T.ink }}>Mochi</Text>
            <Pill T={T} color={T.coral}>Mini · jour 12</Pill>
          </View>

          {/* jauges */}
          <Card T={T} style={{ marginHorizontal: 18, marginTop: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: T.butter + (T.dark ? '33' : '55'), alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 18 }}>⚡</Text></View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}><Text style={{ fontFamily: T.title || undefined, fontWeight: T.title ? undefined : '700', letterSpacing: T.title ? undefined : -0.5, fontSize: 17, color: T.ink }}>Énergie du jour</Text><Text style={{ fontSize: 13, fontWeight: '600', color: T.muted }}>3 / 5</Text></View>
                <View style={{ height: 14, borderRadius: 7, backgroundColor: T.track, marginTop: 8, overflow: 'hidden' }}><View style={{ width: '60%', height: '100%', borderRadius: 7, backgroundColor: T.butter }} /></View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: T.coral + (T.dark ? '33' : '40'), alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 17 }}>♥</Text></View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View><Text style={{ fontFamily: T.title || undefined, fontWeight: T.title ? undefined : '700', letterSpacing: T.title ? undefined : -0.5, fontSize: 17, color: T.ink }}>Forme</Text><Text style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>En pleine forme</Text></View>
                <Text style={{ fontSize: 17, letterSpacing: 3 }}><Text style={{ color: T.coral }}>♥♥♥♥</Text><Text style={{ color: T.muted + '66' }}>♥</Text></Text>
              </View>
            </View>
          </Card>

          {/* aujourd'hui */}
          <View style={{ paddingTop: 24, paddingBottom: 9, paddingHorizontal: 23, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={{ fontFamily: T.title || undefined, fontWeight: T.title ? undefined : '700', letterSpacing: T.title ? undefined : -0.5, fontSize: 19, color: T.ink }}>Aujourd'hui</Text><Text style={{ fontSize: 13, fontWeight: '500', color: T.muted }}>2 restantes · 35 min</Text>
          </View>
          <Card T={T} style={{ marginHorizontal: 18 }} pad={0}>
            <View style={{ paddingHorizontal: 14, paddingVertical: 4 }}>
              <Row T={T} first emoji="🧺" title="Lancer une lessive" />
              <Row T={T} emoji="📞" title="Appeler le pédiatre" who={me} />
              <Row T={T} emoji="🍽️" title="Vaisselle du soir" done together />
              <Row T={T} emoji="🛒" title="Courses de la semaine" done who={partner} />
              <Row T={T} emoji="🗑️" title="Sortir les poubelles" done />
            </View>
          </Card>
        </ScrollView>

        {/* tab bar thémée */}
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: T.bar, borderTopWidth: 1, borderTopColor: T.barLine, paddingTop: 8, paddingBottom: 30, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          {tabs.slice(0, 2).map(([k, l], i) => <Tab key={k} T={T} k={k} l={l} on={i === 0} />)}
          <View style={{ marginTop: -34, width: 54, height: 54, borderRadius: 27, backgroundColor: T.coral, borderWidth: 4, borderColor: T.bar, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 28, color: T.dark ? '#1C1B33' : '#FFFFFF', marginTop: -2 }}>+</Text></View>
          {tabs.slice(2).map(([k, l]) => <Tab key={k} T={T} k={k} l={l} />)}
        </View>
      </SafeAreaView>
    </View>
  );
}
function Tab({ T, k, l, on }) {
  const c = on ? T.coral : T.muted;
  return (
    <View style={{ alignItems: 'center', gap: 5, minWidth: 52 }}>
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none"><Path d={ICONS[k]} stroke={c} strokeWidth={on ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round" /></Svg>
      <Text style={{ fontSize: 11, color: c, fontWeight: on ? '600' : '400' }}>{l}</Text>
    </View>
  );
}
