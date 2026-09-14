// Proto · Mochi v2, variantes côte à côte (14 sept 2026) — à valider par Jeanne sur captures.
// Recette : docs/recettes/mochi-v2.md. URL : /proto-mochi
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, ScreenTitle, Card, Micro, Secondary, Mochi } from '../src/components/ui';
import { MochiV2, MochiGalet, LiveMochiGalet } from '../src/components/mochi-v2';
import { colors, space, font } from '../src/theme';

const MOODS = ['happy', 'neutral', 'sad', 'sleeping', 'wink'];
const LEANS = [-1, 0, 1];

function Block({ label, sub, render }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Micro style={{ paddingHorizontal: 5, marginBottom: 2 }}>{label}</Micro>
      <Secondary style={{ paddingHorizontal: 5, marginBottom: 8, fontSize: 13 }}>{sub}</Secondary>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', marginTop: 36, marginBottom: 8 }}>
        {LEANS.map((l) => <View key={l}>{render({ size: 116, mood: 'happy', lean: l })}</View>)}
      </View>
      <Card padding={0}>
        {MOODS.map((m, i) => (
          <View key={m} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderTopWidth: i ? 1 : 0, borderTopColor: colors.line }}>
            {render({ size: 34, mood: m, lean: 0 })}
            <Text style={[font.body, { marginLeft: 12 }]}>{{ happy: 'Tout est fait · Mochi est content', neutral: 'Vous êtes à l’équilibre', sad: 'Ça penche nettement chez Kima', sleeping: 'Bonne nuit', wink: 'Roi de la vaisselle' }[m]}</Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

export default function ProtoMochi() {
  const { v } = useLocalSearchParams(); // ?v=v1|A|B|C : une seule variante (captures)
  const show = (k) => !v || v === k;
  return (
    <View style={{ flex: 1 }}>
      <GlowBg />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: space.screenX, paddingBottom: 40 }}>
          <View style={{ paddingHorizontal: 5, paddingTop: 14, marginBottom: 16 }}>
            <ScreenTitle>Mochi v2 · variantes</ScreenTitle>
            <Secondary style={{ marginTop: 4 }}>Rangée du haut : penche à gauche · droit · penche à droite. Liste : les 5 états à 34 px.</Secondary>
          </View>
          {show('D') && (
            <View style={{ marginBottom: 18 }}>
              <Micro style={{ paddingHorizontal: 5, marginBottom: 2 }}>D · Le visage actuel, corps galet qui bouge</Micro>
              <Secondary style={{ paddingHorizontal: 5, marginBottom: 8, fontSize: 13 }}>Même visage et même matière qu'aujourd'hui. Il respire, il penche depuis sa base, il tremble quand on le touche.</Secondary>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', marginTop: 36, marginBottom: 8 }}>
                {LEANS.map((l) => <LiveMochiGalet key={l} size={116} mood="happy" lean={l} />)}
              </View>
              <Card padding={0}>
                {MOODS.map((m, i) => (
                  <View key={m} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderTopWidth: i ? 1 : 0, borderTopColor: colors.line }}>
                    <MochiGalet size={34} mood={m} />
                    <Text style={[font.body, { marginLeft: 12 }]}>{{ happy: 'Tout est fait · Mochi est content', neutral: 'Vous êtes à l’équilibre', sad: 'Ça penche nettement chez Kima', sleeping: 'Bonne nuit', wink: 'Roi de la vaisselle' }[m]}</Text>
                  </View>
                ))}
              </Card>
            </View>
          )}
          {show('v1') && <Block label="Actuel (v1)" sub="Sphère brillante, rotation autour du centre" render={(p) => <Mochi {...p} />} />}
          {show('A') && <Block label="A · Galet corail mat" sub="Dégradé doux, un reflet diffus, base posée" render={(p) => <MochiV2 variant="A" {...p} />} />}
          {show('B') && <Block label="B · Perle crème" sub="Presque monochrome, teinte corail sur le flanc, filet fin" render={(p) => <MochiV2 variant="B" {...p} />} />}
          {show('C') && <Block label="C · Élastique plat" sub="Aplat sans reflet, se déforme au lieu de tourner" render={(p) => <MochiV2 variant="C" {...p} />} />}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
