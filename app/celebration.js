// Écran 28 · Célébration streak / badge. Recette : docs/recettes/28-celebration.md
import React from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, CTAPrimary } from '../src/components/ui';
import { LiveMochi, Confetti, CountUp, Animated, ZoomIn } from '../src/components/motion';
import { moments, fill } from '../src/components/moments/extra';
import { celebration, badgeById } from '../src/demo-moments';
import copy from '../src/data/copy.json';
import { colors, space, motion } from '../src/theme';

const t = copy.celebration;

export default function Celebration() {
  const badge = badgeById(celebration.badge_id);
  // le titre contient {n} suivi du reste : on découpe pour garder le CountUp sur le chiffre
  const [before, after] = t.title.split('{n}');
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <Confetti colors={moments.confetti} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingTop: 40, paddingHorizontal: 26, alignItems: 'center' }}>
          <Animated.View entering={ZoomIn.springify().damping(motion.spring.damping)} style={{ marginBottom: 19 }}>
            <LiveMochi size={180} mood="happy" />
          </Animated.View>
          <View style={{ marginBottom: 11 }}><PillLabel color={colors.sageDeep}>{t.pill}</PillLabel></View>
          <Text style={s.title}>
            {before}<CountUp value={celebration.days} style={s.title} />{after}
          </Text>
          {celebration.is_record ? <Text style={s.sub}>{t.sub}</Text> : null}
        </View>

        <View style={{ paddingHorizontal: 22, marginTop: 21 }}>
          <Card r={18} accent={colors.butter} style={{ paddingVertical: 17, paddingHorizontal: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <Text style={{ fontSize: 24 }}>{badge.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.badgeLabel}>{t.badgeLabel}</Text>
                <Text style={s.badgeTitle}>{badge.title}</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={s.foot}>
          <CTAPrimary label={t.cta} big onPress={() => router.back()} style={{ alignSelf: 'stretch' }} />
          <Pressable onPress={() => {}} hitSlop={10}><Text style={s.share}>{t.share}</Text></Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 34, fontWeight: '600', letterSpacing: -1.5, lineHeight: 36, color: colors.ink, textAlign: 'center', fontVariant: ['tabular-nums'] },
  sub: { fontSize: 15, fontWeight: '400', color: colors.muted, marginTop: 10, textAlign: 'center' },
  badgeLabel: { fontSize: 10.5, fontWeight: '600', letterSpacing: 1.4, textTransform: 'uppercase', color: moments.gold, marginBottom: 6 },
  badgeTitle: { fontSize: 19, fontWeight: '600', letterSpacing: -0.4, color: colors.ink },
  foot: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 24, gap: 13, alignItems: 'center' },
});
