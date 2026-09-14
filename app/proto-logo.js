// Proto · logo / icône Mindpair, 4 pistes (14 sept 2026) — à valider par Jeanne sur captures.
// Chaque icône est rendue à 180 px (60 pt @3x, taille réelle de l'écran d'accueil iOS), coins iOS, nom dessous.
// URL : /proto-logo
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, LinearGradient, Stop, Path, Circle, G, Rect, Line } from 'react-native-svg';
import { ScreenTitle, Secondary, Micro } from '../src/components/ui';
import { colors, space, font } from '../src/theme';

const CREAM = '#FBF7F2', INK = '#1A1A1F', CORAL = '#E89B85', CORAL_DEEP = '#DC8B75', SKY = '#6FA7C4', LAV = '#A084C8';
const GALET = 'M110 42 C150 42 184 76 190 126 C195 164 160 190 110 190 C60 190 25 164 30 126 C36 76 70 42 110 42 Z';

const Grad = ({ id, top, bottom }) => (
  <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={top} /><Stop offset="1" stopColor={bottom} /></LinearGradient>
);
const Face = ({ x = 0, y = 0, s = 1, smile = true }) => (
  <G x={x} y={y} scale={s}>
    <Circle cx="92" cy="118" r="4.2" fill={INK} /><Circle cx="128" cy="118" r="4.2" fill={INK} />
    <Path d={smile ? 'M90 142 Q110 156 130 142' : 'M94 144 L126 144'} stroke={INK} strokeWidth="3.6" fill="none" strokeLinecap="round" />
  </G>
);

// 1 · Mochi seul : la mascotte est l'icône
const Icon1 = () => (
  <Svg width="180" height="180" viewBox="0 0 220 220">
    <Defs><Grad id="i1" top="#F4B59F" bottom={CORAL_DEEP} /></Defs>
    <Rect width="220" height="220" fill={CREAM} />
    <G x="0" y="6" scale="1"><Path d={GALET} fill="url(#i1)" /><Face /></G>
  </Svg>
);
// 2 · La paire : deux galets penchés l'un vers l'autre, couleurs des deux membres (ciel, lavande)
const Icon2 = () => (
  <Svg width="180" height="180" viewBox="0 0 220 220">
    <Defs><Grad id="i2a" top="#9AC4DA" bottom={SKY} /><Grad id="i2b" top="#C0ADDC" bottom={LAV} /></Defs>
    <Rect width="220" height="220" fill={CREAM} />
    <G transform="translate(14 64) scale(0.62) rotate(10 110 190)"><Path d={GALET} fill="url(#i2a)" /></G>
    <G transform="translate(70 64) scale(0.62) rotate(-10 110 190)"><Path d={GALET} fill="url(#i2b)" /></G>
  </Svg>
);
// 3 · Le monogramme : un M fait de deux galets qui se rejoignent, encre sur crème
const Icon3 = () => (
  <Svg width="180" height="180" viewBox="0 0 220 220">
    <Rect width="220" height="220" fill={CREAM} />
    <Path d="M46 168 L46 78 Q46 56 66 66 L110 118 L154 66 Q174 56 174 78 L174 168" stroke={INK} strokeWidth="22" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="110" cy="150" r="14" fill={CORAL} />
  </Svg>
);
// 4 · La balance : un fléau incliné, deux poids, Mochi au pivot ; le concept du produit en un signe
const Icon4 = () => (
  <Svg width="180" height="180" viewBox="0 0 220 220">
    <Defs><Grad id="i4" top="#F4B59F" bottom={CORAL_DEEP} /></Defs>
    <Rect width="220" height="220" fill={CREAM} />
    <Line x1="44" y1="150" x2="176" y2="120" stroke={INK} strokeWidth="10" strokeLinecap="round" />
    <Circle cx="44" cy="150" r="17" fill={SKY} /><Circle cx="176" cy="120" r="17" fill={LAV} />
    <G scale="0.42" x="64" y="14"><Path d={GALET} fill="url(#i4)" /><Face /></G>
  </Svg>
);

const ICONS = [['1 · Mochi seul', Icon1], ['2 · La paire', Icon2], ['3 · Monogramme M', Icon3], ['4 · La balance', Icon4]];

export default function ProtoLogo() {
  return (
    <View style={{ flex: 1, backgroundColor: '#2B2B33' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: space.screenX, paddingBottom: 40 }}>
          <View style={{ paddingHorizontal: 5, paddingTop: 14, marginBottom: 20 }}>
            <ScreenTitle style={{ color: '#FFFFFF' }}>Logo Mindpair · 4 pistes</ScreenTitle>
            <Secondary style={{ marginTop: 4, color: '#B9B9C4' }}>Taille réelle de l'écran d'accueil iOS (60 pt), coins iOS, sur fond sombre et sur fond clair.</Secondary>
          </View>
          {[['#2B2B33', '#FFFFFF'], ['#EDE7DC', INK]].map(([bg, fg]) => (
            <View key={bg} style={{ backgroundColor: bg, borderRadius: 24, paddingVertical: 22, marginBottom: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
              {ICONS.map(([label, Icon]) => (
                <View key={label} style={{ alignItems: 'center', width: 120, marginBottom: 18 }}>
                  <View style={{ width: 60, height: 60, borderRadius: 13.4, overflow: 'hidden', transform: [{ scale: 1 }] }}>
                    <View style={{ width: 180, height: 180, transform: [{ scale: 1 / 3 }], transformOrigin: 'top left' }}><Icon /></View>
                  </View>
                  <Text style={[font.micro, { color: fg, marginTop: 8, textTransform: 'none', letterSpacing: 0, fontSize: 12 }]}>Mindpair</Text>
                  <Micro style={{ color: fg, opacity: 0.6, marginTop: 4, fontSize: 9 }}>{label}</Micro>
                </View>
              ))}
            </View>
          ))}
          <Micro style={{ color: '#B9B9C4', marginBottom: 8 }}>Les mêmes en grand</Micro>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {ICONS.map(([label, Icon]) => (
              <View key={label} style={{ width: 180, height: 180, borderRadius: 40, overflow: 'hidden', marginBottom: 16 }}><Icon /></View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
