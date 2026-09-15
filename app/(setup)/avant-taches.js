// Écran 09c · Avant le choix des tâches (retour Jeanne 10 sept 2026, test réel avec Ketley :
// « il faudrait un écran avant pour dire : comme tu as créé le duo, on choisit les missions sur
// Depuis le choix partagé (15 sept 2026) : « on choisit à deux, ce que tu coches X le voit en direct ».
import React from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, CTAPrimary } from '../../src/components/ui';
import { LiveMochi } from '../../src/components/motion';
import { fill } from '../../src/components/setup/extra';
import { partner } from '../../src/demo';
import { useIdentity } from '../../src/identity';
import copy from '../../src/data/copy.json';
import { colors, space, font } from '../../src/theme';

const t = copy.setup;

export default function AvantTaches() {
  useIdentity();
  const name = partner.first_name || copy.common.partner;
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.body}>
          <LiveMochi size={120} />
          <Text style={s.title}>{t.beforeTasksTitle}</Text>
          <Text style={s.sub}>{fill(t.beforeTasksSub, { name })}</Text>
        </View>
        <View style={s.bottom}><CTAPrimary label={t.beforeTasksCta} onPress={() => router.push('/(setup)/taches')} big /></View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.headerX, gap: 18 },
  title: { ...font.screenTitle, textAlign: 'center' },
  sub: { ...font.secondary, textAlign: 'center', lineHeight: 22, maxWidth: 320 },
  bottom: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 26 },
});
