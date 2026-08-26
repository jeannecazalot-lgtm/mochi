// PLANCHE JETABLE — 3 propositions d'écran 06 « profil » façon minimale (réf. Zenly
// envoyée par Jeanne le 23 août 2026), dans la DA mochi. Textes en dur assumés.
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { GlowBg, Card, Mochi } from '../../src/components/ui';
import { PropsHeader, PropBlock } from '../../src/components/props/extra';
import { colors, radius, alpha, gradients } from '../../src/theme';
import { LinearGradient } from 'expo-linear-gradient';

const CameraIcon = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" /><Circle cx="12" cy="13" r="4" />
  </Svg>
);

const CTA = ({ label = 'Continuer' }) => (
  <LinearGradient {...gradients.mochi} style={s.cta}><Text style={s.ctaTxt}>{label}</Text></LinearGradient>
);

const Frame = ({ children }) => <View style={s.frame} pointerEvents="none">{children}</View>;

export default function Profil06Props() {
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 48 }}>
          <PropsHeader title="Profil — 3 propositions" sub="Écran 06 façon minimale (réf. envoyée par Jeanne), DA mochi. Planche à regarder : rien n'est tactile." />

          <PropBlock label="PROPOSITION A" color={colors.coral} note="Capsule photo en vedette, titre centré, une seule pilule prénom. Le plus proche de ta référence.">
            <Frame>
              <Text style={s.title}>Crée ton profil</Text>
              <View style={s.capsule}><CameraIcon size={26} /></View>
              <View style={s.pill}><Text style={s.pillPh}>Ton prénom</Text></View>
              <View style={{ flex: 1 }} />
              <CTA />
            </Frame>
          </PropBlock>

          <PropBlock label="PROPOSITION B" color={colors.sage} note="Mochi reste le guide (continuité avec 07-12) : il surplombe un avatar rond pointillé + la pilule prénom.">
            <Frame>
              <View style={{ alignItems: 'center', marginTop: 4 }}><Mochi size={84} mood="happy" /></View>
              <Text style={[s.title, { marginTop: 8 }]}>C'est toi.</Text>
              <View style={s.round}><CameraIcon /></View>
              <View style={s.pill}><Text style={s.pillPh}>Ton prénom</Text></View>
              <View style={{ flex: 1 }} />
              <CTA />
            </Frame>
          </PropBlock>

          <PropBlock label="PROPOSITION C" color={colors.lavender} note="La photo EST l'avatar : tant qu'il n'y a pas de photo, l'initiale tapée s'affiche en direct dans le rond couleur — on voit tout de suite « soi » dans l'app.">
            <Frame>
              <Text style={s.title}>Crée ton profil</Text>
              <View style={[s.round, { backgroundColor: colors.sky, borderStyle: 'solid', borderColor: colors.sky }]}>
                <Text style={s.initial}>K</Text>
              </View>
              <Text style={s.livePh}>Ket<Text style={{ color: colors.coral }}>|</Text></Text>
              <Text style={s.liveNote}>l'initiale se met à jour pendant la saisie</Text>
              <View style={{ flex: 1 }} />
              <CTA />
            </Frame>
          </PropBlock>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  frame: { height: 470, backgroundColor: colors.bg, borderRadius: 24, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, padding: 22, overflow: 'hidden' },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.8, color: colors.ink, textAlign: 'center', marginTop: 10, marginBottom: 22 },
  capsule: { alignSelf: 'center', width: 108, height: 138, borderRadius: 64, backgroundColor: colors.butterLight, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  round: { alignSelf: 'center', width: 96, height: 96, borderRadius: 48, backgroundColor: alpha(colors.ink, 0.04), borderWidth: 1.5, borderStyle: 'dashed', borderColor: alpha(colors.ink, 0.22), alignItems: 'center', justifyContent: 'center' },
  pill: { alignSelf: 'stretch', marginTop: 22, height: 54, borderRadius: 999, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  pillPh: { fontSize: 16, fontWeight: '500', color: alpha(colors.ink, 0.3) },
  initial: { fontSize: 40, fontWeight: '700', color: colors.card },
  livePh: { textAlign: 'center', marginTop: 18, fontSize: 22, fontWeight: '600', color: colors.ink },
  liveNote: { textAlign: 'center', marginTop: 6, fontSize: 12, color: colors.muted },
  cta: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginHorizontal: 6 },
  ctaTxt: { fontSize: 16, fontWeight: '600', color: colors.ink },
});
