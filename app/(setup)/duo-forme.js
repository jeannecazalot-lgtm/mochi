// Écran 09b · Duo formé — l'autre a accepté. Recette : docs/recettes/09b-duo-forme.md
// Retours Jeanne 22 août 2026 : arrivée « waouh » — confetti palette + Mochi en
// ZoomIn spring + avatars qui glissent l'un vers l'autre puis léger pulse.
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Avatar, PillLabel, CTAPrimary } from '../../src/components/ui';
import {
  LiveMochi, Confetti, prefersReducedMotion, ZoomIn, Animated,
} from '../../src/components/motion';
import {
  useSharedValue, useAnimatedStyle, withSpring, withSequence, withDelay, withTiming,
} from 'react-native-reanimated';
import { fill } from '../../src/components/setup/extra';
import { me, partner } from '../../src/demo';
import copy from '../../src/data/copy.json';
import { colors, space, motion } from '../../src/theme';

const t = copy.setup;
const confettiPalette = [colors.coral, colors.butter, colors.sage, colors.lavender, colors.sky];

export default function DuoForme() {
  const reduced = prefersReducedMotion();
  // avatars : partent écartés (±46 px), glissent l'un vers l'autre en spring
  // jusqu'au léger chevauchement du layout final, puis pulse 1 → 1.06 → 1.
  // (restaurée le 1er sept 2026 — Jeanne signale son absence sur le 09b)
  const gap = useSharedValue(reduced ? 0 : 46);
  const pulse = useSharedValue(1);
  useEffect(() => {
    if (reduced) return;
    gap.value = withDelay(150, withSpring(0, { damping: motion.spring.damping }));
    pulse.value = withDelay(750, withSequence(withTiming(1.06, { duration: 160 }), withTiming(1, { duration: 180 })));
  }, []);
  const left = useAnimatedStyle(() => ({ transform: [{ translateX: -gap.value }, { scale: pulse.value }] }));
  const right = useAnimatedStyle(() => ({ transform: [{ translateX: gap.value }, { scale: pulse.value }] }));

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.center}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 19 }}>
            <Animated.View style={[s.ring, left]}><Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={62} /></Animated.View>
            <Animated.View entering={reduced ? undefined : ZoomIn.springify().damping(motion.spring.damping)} style={{ marginHorizontal: -4, zIndex: 2 }}>
              <LiveMochi size={84} mood="happy" />
            </Animated.View>
            <Animated.View style={[s.ring, right]}><Avatar initial={partner.initial} color={partner.color} size={62} /></Animated.View>
          </View>
          <View style={{ marginBottom: 11 }}><PillLabel color={colors.sageDeep}>{t.duoPill}</PillLabel></View>
          <Text style={s.title}>{fill(t.duoTitle, { name: partner.first_name })}</Text>
          <Text style={s.sub}>{t.duoSub}</Text>
        </View>
        <View style={s.ctaWrap}>
          <CTAPrimary label={t.chooseTasks} onPress={() => router.push('/(setup)/taches')} big />
        </View>
      </SafeAreaView>
      {/* confetti au-dessus de tout ; rend null si « réduire les animations » */}
      <Confetti colors={confettiPalette} />
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
