// Écran 09b · Duo formé — l'autre a accepté. Recette : docs/recettes/09b-duo-forme.md
import React from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Avatar, PillLabel, CTAPrimary } from '../../src/components/ui';
import { LiveMochi } from '../../src/components/motion';
import { fill } from '../../src/components/setup/extra';
import { me, partner } from '../../src/demo';
import copy from '../../src/data/copy.json';
import { colors, space } from '../../src/theme';

const t = copy.setup;

export default function DuoForme() {
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.center}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 19 }}>
            <View style={s.ring}><Avatar initial={me.initial} color={me.color} size={62} /></View>
            <View style={{ marginHorizontal: -4, zIndex: 2 }}><LiveMochi size={84} mood="happy" /></View>
            <View style={s.ring}><Avatar initial={partner.initial} color={partner.color} size={62} /></View>
          </View>
          <View style={{ marginBottom: 11 }}><PillLabel color={colors.sageDeep}>{t.duoPill}</PillLabel></View>
          <Text style={s.title}>{fill(t.duoTitle, { name: partner.first_name })}</Text>
          <Text style={s.sub}>{t.duoSub}</Text>
        </View>
        <View style={s.ctaWrap}>
          <CTAPrimary label={t.chooseTasks} onPress={() => router.push('/(setup)/taches')} big />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 26 },
  ring: { borderWidth: 3, borderColor: colors.bg, borderRadius: 34 },
  title: { fontSize: 22, fontWeight: '600', letterSpacing: -1.2, lineHeight: 24, textAlign: 'center', color: colors.ink },
  sub: { fontSize: 14.5, fontWeight: '400', color: colors.muted, marginTop: 10, lineHeight: 22, maxWidth: 240, textAlign: 'center' },
  ctaWrap: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 26 },
});
