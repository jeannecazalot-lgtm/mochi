// Onboarding v3 court (4 nov 2026) : trois slides, l'œuf avant toute question, jamais revu.
// Une seule scène en haut qui évolue avec le slide (œuf → éclosion + jauge qui se remplit + balade → Mochi
// dans sa pièce), l'instrument (énergie, forme) dessous comme sur l'Accueil, le texte en pager.
// Fin : paywall doux (décision tableau de bord, 3 nov 2026 : « après l'onboarding, comme Finch ») puis connexion.
// L'ancien onboarding (5 slides, 14 sept 2026) reste consultable : /onboarding/ancien
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, FlatList, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn } from 'react-native-reanimated';
import { CTAPrimary } from '../../src/components/ui';
import { Burst } from '../../src/components/motion';
import { Scene } from '../../src/components/mochi/scene';
import { Gauges } from '../../src/components/mochi/gauges';
import { useTokens, type, layout } from '../../src/theme-v3';
import copy from '../../src/data/copy.json';

const t = copy.onbV3;
const DEMO_TOTAL = 5; // missions du jour de la démo
const SCENE = [{ stage: 'egg', lvl: 0 }, { stage: 'mini', lvl: 1 }, { stage: 'mochi', lvl: 3 }];

function Dot({ T, on }) {
  const w = useSharedValue(on ? 28 : 8);
  useEffect(() => { w.value = withTiming(on ? 28 : 8, { duration: 260 }); }, [on]);
  const st = useAnimatedStyle(() => ({ width: w.value }));
  return <Animated.View style={[{ height: 4, borderRadius: 2, backgroundColor: on ? T.ink : T.seg }, st]} />;
}

export default function Onboarding() {
  const T = useTokens();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const list = useRef(null);
  const [index, setIndex] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [away, setAway] = useState(false);
  const [burst, setBurst] = useState(0);
  const last = index === t.slides.length - 1;

  // la scène joue le slide : 1 → éclosion (burst), la jauge se remplit mission par mission, puis Mochi part en balade
  useEffect(() => {
    if (index === 0) { setAway(false); setEnergy(0); return; }
    if (index === 1) {
      setAway(false); setEnergy(0); setBurst(b => b + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      let i = 0;
      const id = setInterval(() => {
        i += 1; setEnergy(i); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        if (i >= DEMO_TOTAL) { clearInterval(id); setTimeout(() => setAway(true), 600); }
      }, 420);
      return () => clearInterval(id);
    }
    setAway(false); setEnergy(DEMO_TOTAL);
  }, [index]);

  const finish = useCallback(() => router.replace({ pathname: '/paywall', params: { next: '/(auth)/login' } }), []);
  const next = useCallback(() => {
    if (last) return finish();
    list.current?.scrollToIndex({ index: index + 1, animated: true });
  }, [index, last, finish]);
  const onMomentumScrollEnd = useCallback(e => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(Math.max(0, Math.min(t.slides.length - 1, i)));
  }, [width, index]);

  const sc = SCENE[index];
  const sceneH = layout.scene + insets.top + 40;
  const renderItem = useCallback(({ item }) => (
    <View style={{ width, paddingHorizontal: layout.x, paddingTop: 26 }}>
      <Text style={[type.name, { color: T.ink }]} numberOfLines={3} adjustsFontSizeToFit minimumFontScale={0.85}>{item.title}</Text>
      <Text style={[type.sub, { color: T.muted, marginTop: 12, maxWidth: 380 }]}>{item.body}</Text>
    </View>
  ), [width, T]);

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View>
        <Scene T={T} stage={sc.stage} mood={index === 2 ? 'wink' : undefined} lvl={sc.lvl} away={away} height={sceneH} />
        {burst ? <View key={burst} pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: sceneH }}><Burst count={18} colors={[T.accent, T.ok, T.scene.lamp, T.ink]} dist={150} /></View> : null}
        {!last ? <Pressable onPress={finish} hitSlop={12} style={{ position: 'absolute', top: insets.top + 10, right: layout.x }}><Text style={[type.label, { color: T.ink, opacity: 0.7 }]}>{t.skip}</Text></Pressable> : null}
      </View>
      <Animated.View entering={FadeIn.duration(400)}>
        <Gauges T={T} t={copy.homeV3} energy={{ done: energy, total: DEMO_TOTAL }} hearts={5} formLabel={copy.homeV3.formLabels[5]} />
      </Animated.View>
      <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: layout.x, paddingTop: 22 }}>
        {t.slides.map((_, i) => <Dot key={i} T={T} on={i === index} />)}
      </View>
      <FlatList
        ref={list}
        data={t.slides}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        extraData={index}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={{ flex: 1 }}
      />
      <View style={{ paddingHorizontal: layout.x, paddingBottom: Math.max(insets.bottom, 16) }}>
        <CTAPrimary big label={last ? t.start : t.next} onPress={next} />
      </View>
    </View>
  );
}
