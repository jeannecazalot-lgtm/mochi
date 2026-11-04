// Onboarding v4 (4 nov 2026, retour Jeanne : « mixer le pathos de l'ancien et Mochi, l'allégorie de la relation »).
// Cinq écrans, une seule scène en haut qui vit avec le récit : la pièce vide pendant les deux constats (chiffres
// Insee), puis l'œuf arrive et c'est Mochi qui parle dans une bulle, on lui donne un nom, puis il éclot,
// la jauge se remplit, il part en balade. Commencer → paywall doux Mochi+ → connexion.
// L'ancien onboarding (5 slides, 14 sept 2026) reste à /onboarding/ancien.
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, FlatList, TextInput, KeyboardAvoidingView, Keyboard, useWindowDimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn, FadeInDown } from 'react-native-reanimated';
import { CTAPrimary } from '../../src/components/ui';
import { Burst } from '../../src/components/motion';
import { Scene } from '../../src/components/mochi/scene';
import { Bubble } from '../../src/components/mochi/bubble';
import { Gauges, Label, Num } from '../../src/components/mochi/gauges';
import { setPendingName } from '../../src/mochi-state';
import { useTokens, type, layout } from '../../src/theme-v3';
import copy from '../../src/data/copy.json';

const t = copy.onbV4;
const DEMO_TOTAL = 5;
// la scène par écran : pièce vide → une plante → l'œuf → l'œuf → éclosion + jauge + balade
const SCENE = [{ stage: null, lvl: 0 }, { stage: null, lvl: 1 }, { stage: 'egg', lvl: 1 }, { stage: 'egg', lvl: 1 }, { stage: 'mini', lvl: 2 }];

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
  const [name, setName] = useState('');
  const last = index === t.slides.length - 1;
  const sc = SCENE[index];

  // le dernier écran joue : éclosion (burst + haptique), la jauge se remplit mission par mission, puis la balade
  useEffect(() => {
    if (!last) { setAway(false); setEnergy(0); return; }
    setBurst(b => b + 1);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    let i = 0;
    const id = setInterval(() => {
      i += 1; setEnergy(i); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      if (i >= DEMO_TOTAL) { clearInterval(id); setTimeout(() => setAway(true), 600); setTimeout(() => setAway(false), 3400); } // il part… et revient
    }, 420);
    return () => clearInterval(id);
  }, [index]);

  const finish = useCallback(() => {
    Keyboard.dismiss();
    setPendingName(name.trim() || t.namePlaceholder).catch(() => {});
    router.replace({ pathname: '/paywall', params: { next: '/(auth)/login' } });
  }, [name]);
  const next = useCallback(() => {
    if (last) return finish();
    Keyboard.dismiss();
    list.current?.scrollToIndex({ index: index + 1, animated: true });
  }, [index, last, finish]);
  const onMomentumScrollEnd = useCallback(e => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(Math.max(0, Math.min(t.slides.length - 1, i)));
  }, [width, index]);

  const sceneH = layout.scene + insets.top;
  const say = t.slides[index].say ? t.slides[index].say.replace('Mochi', name.trim() || 'Mochi') : null;
  const renderItem = useCallback(({ item, index: i }) => (
    <View style={{ width, paddingHorizontal: layout.x, paddingTop: 22 }}>
      <Text style={[type.name, { color: T.ink }]} numberOfLines={3} adjustsFontSizeToFit minimumFontScale={0.85}>{item.title}</Text>
      <Text style={[type.sub, { color: T.muted, marginTop: 10, maxWidth: 380 }]}>{item.body}</Text>
      {item.rows ? (
        <View style={{ marginTop: 18, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
          {item.rows.map((r, k) => (
            <Animated.View key={r.t} entering={FadeInDown.delay(150 + k * 90).duration(300)} style={{ flexDirection: 'row', alignItems: 'baseline', paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
              <Label T={T} style={{ flex: 1 }}>{r.t}</Label>
              <Num T={T} style={{ fontSize: 22, color: T.accent }}>{r.v}</Num>
            </Animated.View>
          ))}
          <Label T={T} style={{ marginTop: 8 }}>{item.source}</Label>
        </View>
      ) : null}
      {i === 3 ? (
        <View style={{ marginTop: 18, borderBottomWidth: 1.5, borderColor: T.ink, paddingBottom: 6 }}>
          <TextInput value={name} onChangeText={setName} placeholder={t.namePlaceholder} placeholderTextColor={T.muted} maxLength={18} returnKeyType="done" onSubmitEditing={next} style={[type.name, { color: T.ink, padding: 0 }]} />
        </View>
      ) : null}
    </View>
  ), [width, T, name, next]);

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: T.bg }}>
      <View>
        <Scene T={T} stage={sc.stage || 'egg'} hideMochi={!sc.stage} mood={last && energy >= DEMO_TOTAL ? 'wink' : undefined} lvl={sc.lvl} away={away} height={sceneH} />
        {say ? <Bubble T={T} style={{ top: insets.top + 54 }}>{say}</Bubble> : null}
        {burst ? <View key={burst} pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: sceneH }}><Burst count={18} colors={[T.accent, T.ok, T.scene.lamp, T.ink]} dist={150} /></View> : null}
        {!last ? <Pressable onPress={finish} hitSlop={12} style={{ position: 'absolute', top: insets.top + 10, right: layout.x }}><Text style={[type.label, { color: T.ink, opacity: 0.7 }]}>{t.skip}</Text></Pressable> : null}
      </View>
      {last ? (
        <Animated.View entering={FadeIn.duration(400)}>
          <Gauges T={T} t={copy.homeV3} energy={{ done: energy, total: DEMO_TOTAL }} hearts={5} formLabel={copy.homeV3.formLabels[5]} />
        </Animated.View>
      ) : null}
      <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: layout.x, paddingTop: 20 }}>
        {t.slides.map((_, i) => <Dot key={i} T={T} on={i === index} />)}
      </View>
      <FlatList
        ref={list}
        data={t.slides}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        extraData={[index, name]}
        horizontal
        pagingEnabled
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={{ flex: 1 }}
      />
      <View style={{ paddingHorizontal: layout.x, paddingBottom: Math.max(insets.bottom, 16) }}>
        <CTAPrimary big label={last ? t.start : t.next} onPress={next} />
      </View>
    </KeyboardAvoidingView>
  );
}
