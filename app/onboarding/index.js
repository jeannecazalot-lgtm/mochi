// Onboarding v5 (6 nov 2026, retours Jeanne : « un œuf direct, les titres, les écrans de texte vides, il grandit
// avec vous doit éclore »). Trois écrans, la pièce avec l'œuf dès le premier, la scène prend la moitié haute et
// le texte est centré dans le reste (règle « moment »). Écran 2 : Mochi parle et on le nomme. Écran 3 : l'œuf se
// fêle, Mochi apparaît en fondu, la jauge se remplit, il part en balade et revient. Commencer → connexion.
// L'ancien onboarding reste à /onboarding/ancien.
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, FlatList, TextInput, Keyboard, useWindowDimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { CTAPrimary } from '../../src/components/ui';
import { CountUp } from '../../src/components/motion';
import { Scene } from '../../src/components/mochi/scene';
import { Bubble } from '../../src/components/mochi/bubble';
import { Label, Num } from '../../src/components/mochi/gauges';
import { setPendingName } from '../../src/mochi-state';
import { useTokens, type, layout } from '../../src/theme-v3';
import copy from '../../src/data/copy.json';

const t = copy.onbV5;

function Dot({ T, on }) {
  const w = useSharedValue(on ? 28 : 8);
  useEffect(() => { w.value = withTiming(on ? 28 : 8, { duration: 260 }); }, [on]);
  const st = useAnimatedStyle(() => ({ width: w.value }));
  return <Animated.View style={[{ height: 4, borderRadius: 2, backgroundColor: on ? T.ink : T.seg }, st]} />;
}

export default function Onboarding() {
  const T = useTokens();
  const { width, height: SH } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const list = useRef(null);
  const [index, setIndex] = useState(0);
  const [name, setName] = useState('');
  const [kb, setKb] = useState(0); // hauteur du clavier : la scène se réduit pour laisser le texte et le champ visibles
  useEffect(() => {
    const a = Keyboard.addListener('keyboardWillShow', e => setKb(e.endCoordinates.height));
    const b = Keyboard.addListener('keyboardWillHide', () => setKb(0));
    return () => { a.remove(); b.remove(); };
  }, []);
  const last = index === t.slides.length - 1;
  const sceneH = Math.round(SH * (kb ? 0.2 : t.slides[index].items ? 0.34 : 0.46)); // l'écran des pensées a besoin de place


  const finish = useCallback(() => {
    Keyboard.dismiss();
    setPendingName(name.trim() || t.namePlaceholder).catch(() => {});
    AsyncStorage.setItem('mochi:onboarded', '1').catch(() => {}); // ne se remontre plus
    router.replace('/(auth)/login');
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

  const say = t.slides[index].say ? t.slides[index].say.replace('Mochi', name.trim() || 'Mochi') : null;
  const renderItem = useCallback(({ item, index: i }) => (
    <View style={{ width, paddingHorizontal: layout.x, flex: 1, justifyContent: 'center' }}>
      <Animated.View entering={FadeInDown.duration(320)} style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: kb ? 20 : 28, fontWeight: '600', letterSpacing: -0.8, lineHeight: kb ? 26 : 34, color: T.ink, textAlign: 'center' }}>{item.title}</Text>
        {kb ? null : <Text style={{ fontSize: 17, lineHeight: 24, color: T.muted, textAlign: 'center', marginTop: 12, maxWidth: 360 }}>{item.body}</Text>}
      </Animated.View>
      {item.rows ? (
        <View style={{ marginTop: 20, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
          {item.rows.map((r, k) => (
            <Animated.View key={r.t} entering={FadeInDown.delay(150 + k * 90).duration(300)} style={{ flexDirection: 'row', alignItems: 'baseline', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
              <Label T={T} style={{ flex: 1 }}>{r.t}</Label>
              {/* les chiffres comptent sous les yeux (retour Jeanne 7 nov 2026), en cascade */}
              {i === index && r.n ? <CountUp value={r.n} duration={900 + k * 250} format={v => (r.f === 'hm' ? `+${Math.floor(v / 60)}h${String(Math.round(v % 60)).padStart(2, '0')}` : `≈ ${Math.round(v)}h`)} style={{ fontSize: 22, fontWeight: '600', letterSpacing: -0.4, color: T.accent, fontVariant: ['tabular-nums'] }} /> : <Num T={T} style={{ fontSize: 22, color: T.accent }}>{r.v}</Num>}
            </Animated.View>
          ))}
          <Label T={T} style={{ marginTop: 8, textAlign: 'center' }}>{item.source}</Label>
        </View>
      ) : null}
      {item.items ? (
        <View style={{ marginTop: 18, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
          {item.items.map((it, k) => <Animated.View key={it} entering={FadeInDown.delay(150 + k * 90).duration(300)} style={{ paddingVertical: 7, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: T.line }}><Text style={[type.body, { color: T.ink, textAlign: 'center' }]}>{it}</Text></Animated.View>)}
          {item.outro ? <Text style={[type.sub, { color: T.ink, textAlign: 'center', marginTop: 12, fontStyle: 'italic' }]}>{item.outro}</Text> : null}
        </View>
      ) : null}
      {i === t.slides.length - 1 ? (
        <View style={{ marginTop: kb ? 12 : 22, borderBottomWidth: 1.5, borderColor: T.ink, paddingBottom: 6, alignSelf: 'center', minWidth: 200 }}>
          <TextInput value={name} onChangeText={setName} placeholder={t.namePlaceholder} placeholderTextColor={T.muted} maxLength={18} returnKeyType="done" onSubmitEditing={next} textAlign="center" style={{ fontSize: 26, fontWeight: '600', color: T.ink, padding: 0 }} />
        </View>
      ) : null}
    </View>
  ), [width, T, name, next, index, kb]);

  return (
    <View style={{ flex: 1, backgroundColor: T.bg, paddingBottom: kb }}>
      <Animated.View layout={LinearTransition.duration(260)}>
        <Scene T={T} stage="egg" lvl={1} height={sceneH} />
        {/* la bulle, plus bas (Jeanne 8 nov 2026 : « trop haute ») : au tiers de la scène, au-dessus de l'œuf */}
        {say && !kb ? <Bubble T={T} style={{ top: Math.max(insets.top + 56, sceneH * 0.4) }}>{say}</Bubble> : null}
        {!last ? <Pressable onPress={finish} hitSlop={12} style={{ position: 'absolute', top: insets.top + 10, right: layout.x }}><Text style={[type.label, { color: T.ink, opacity: 0.7 }]}>{t.skip}</Text></Pressable> : null}
      </Animated.View>
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
      {kb ? null : <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', paddingBottom: 14 }}>
        {t.slides.map((_, i) => <Dot key={i} T={T} on={i === index} />)}
      </View>}
      <View style={{ paddingHorizontal: layout.x, paddingBottom: Math.max(insets.bottom, 16) }}>
        <CTAPrimary big label={last ? t.start : t.next} onPress={next} />
      </View>
    </View>
  );
}
