// Écran « Jour X ensemble » (Jeanne, 14 nov 2026 : « un écran qui s'affiche à l'entrée avec une animation cute »).
// Recette validée : fond crème, Mochi arrive en rebondissant, vos deux photos glissent l'une vers l'autre et se
// rejoignent sous lui, le chiffre compte de 0 à X, « jours ensemble » dessous, puis Mochi fait un clin d'œil.
// Une fois par jour (première ouverture), se ferme seul après ~3 s ou d'une touche. Pas de confettis, pas de pulsation.
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withSequence, withSpring, withTiming, Easing, FadeIn } from 'react-native-reanimated';
import { MochiImage } from '../src/components/mochi-img';
import { Avatar } from '../src/components/ui';
import { CountUp } from '../src/components/motion';
import { useTokens } from '../src/theme-v3';
import { me, partner } from '../src/demo';
import { useIdentity } from '../src/identity';
import copy from '../src/copy';

const STAY = 3200; // ms avant fermeture automatique

export default function JourEnsemble() {
  const T = useTokens();
  useIdentity();
  const { day: dayParam } = useLocalSearchParams();
  const day = Math.max(1, parseInt(dayParam, 10) || 1);
  const t = copy.dayScreen;
  const [mood, setMood] = useState('happy');

  // Mochi tombe d'un peu plus haut et rebondit deux fois
  const drop = useSharedValue(-260);
  const squash = useSharedValue(1);
  // les deux photos partent des bords et se rejoignent
  const slide = useSharedValue(1);
  const pair = useSharedValue(0);

  useEffect(() => {
    drop.value = withSpring(0, { damping: 9, stiffness: 140, mass: 0.9 });
    squash.value = withDelay(380, withSequence(withTiming(0.9, { duration: 110 }), withSpring(1, { damping: 6, stiffness: 220 })));
    // glissé sans ressort : les photos se rejoignent sans se croiser (vu au simulateur le 14 nov)
    slide.value = withDelay(500, withTiming(0, { duration: 520, easing: Easing.out(Easing.cubic) }));
    pair.value = withDelay(500, withTiming(1, { duration: 300 }));
    const a = setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}), 420);
    const b = setTimeout(() => { setMood('wink'); Haptics.selectionAsync().catch(() => {}); }, 1900);
    const c = setTimeout(() => { if (router.canGoBack()) router.back(); }, STAY);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, []);

  const mochiStyle = useAnimatedStyle(() => ({ transform: [{ translateY: drop.value }, { scaleY: squash.value }, { scaleX: 2 - squash.value }] }));
  const leftStyle = useAnimatedStyle(() => ({ opacity: pair.value, transform: [{ translateX: -140 * slide.value }] }));
  const rightStyle = useAnimatedStyle(() => ({ opacity: pair.value, transform: [{ translateX: 140 * slide.value }] }));

  const close = () => { if (router.canGoBack()) router.back(); };
  return (
    <Pressable onPress={close} style={{ flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }} accessibilityRole="button" accessibilityLabel={t.closeA11y}>
      <Animated.View style={mochiStyle}><MochiImage size={190} mood={mood} /></Animated.View>
      <View style={{ flexDirection: 'row', marginTop: 18 }}>
        <Animated.View style={[leftStyle, { marginRight: -10, zIndex: 1 }]}><Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={56} ring /></Animated.View>
        <Animated.View style={rightStyle}><Avatar initial={partner.initial} color={partner.color} photo={partner.avatar_url} size={56} ring /></Animated.View>
      </View>
      <CountUp value={day} duration={1100} format={v => String(Math.round(v))} style={{ marginTop: 26, fontSize: 84, fontWeight: '700', letterSpacing: -3, color: T.ink, fontVariant: ['tabular-nums'] }} />
      <Animated.Text entering={FadeIn.delay(700).duration(400)} style={{ fontSize: 20, fontWeight: '600', letterSpacing: -0.4, color: T.ink, marginTop: -4 }}>{day === 1 ? t.daysOne : t.days}</Animated.Text>
      <Animated.Text entering={FadeIn.delay(1300).duration(400)} style={{ fontSize: 15, color: T.muted, marginTop: 10, textAlign: 'center' }}>{t.sub.replace('{name}', partner.first_name)}</Animated.Text>
    </Pressable>
  );
}
