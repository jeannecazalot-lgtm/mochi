// Check-in d'humeur — sheet (4 nov 2026, retour Jeanne : « un écran que je peux même pas fermer »).
// Trois choix, Mochi change de tête et tremble à chaque choix, burst à la validation, fermeture au bouton ou au geste.
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withSpring, FadeInDown } from 'react-native-reanimated';
import { CTAPrimary } from '../src/components/ui';
import { Burst } from '../src/components/motion';
import { LiveMochiImage, mochiReact } from '../src/components/mochi-img';
import { Label } from '../src/components/mochi/gauges';
import { useTokens, type, layout } from '../src/theme-v3';
import { me, partner } from '../src/demo';
import { read } from '../src/store';
import { loadSetup, inRealMode } from '../src/setup-state';
import { getUid, getPartnerUid } from '../src/identity';
import { localIso } from '../src/dates';
import { checkin, demoFlags, mochiStore } from '../src/mochi-state';
import copy from '../src/data/copy.json';

const fill = (s, vars) => Object.keys(vars).reduce((acc, k) => acc.replace(`{${k}}`, vars[k]), s);
const MOOD_FACE = { 1: 'sad', 2: 'neutral', 3: 'wink' };

function Choice({ T, label, on, onPress }) {
  const sc = useSharedValue(1);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Pressable onPress={() => { sc.value = withSequence(withTiming(0.92, { duration: 70 }), withSpring(1, { damping: 10, stiffness: 300 })); onPress(); }} style={{ flex: 1 }}>
      <Animated.View style={[{ paddingVertical: 18, borderRadius: 16, borderWidth: 1.5, borderColor: on ? T.ink : T.line, backgroundColor: on ? T.ink : 'transparent', alignItems: 'center' }, st]}>
        <Text style={[type.body, { color: on ? T.bg : T.ink }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function Checkin() {
  const t = copy.checkin;
  const T = useTokens();
  const moment = T.night ? 'evening' : 'morning';
  const [mood, setMood] = useState(null);
  const [partnerAnswer, setPartnerAnswer] = useState(null);
  const [burst, setBurst] = useState(false);
  useEffect(() => {
    (async () => {
      await loadSetup();
      if (!inRealMode()) { setPartnerAnswer(2); return; }
      const rows = await read('mochi_checkins'); const today = localIso();
      const mine = rows.find(r => r.user_id === getUid() && r.day === today && r.moment === moment); if (mine) setMood(mine.mood);
      const theirs = rows.find(r => r.user_id === getPartnerUid() && r.day === today && r.moment === 'morning'); setPartnerAnswer(theirs ? theirs.mood : null);
    })();
  }, []);
  const choose = v => { setMood(v); mochiReact(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); };
  const save = async () => {
    if (!mood) return;
    setBurst(true); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    checkin(mood, moment).catch(() => {}); demoFlags.checkin[moment] = true; mochiStore.bump();
    setTimeout(() => router.back(), 750);
  };
  const X = layout.x;
  return (
    <View style={{ backgroundColor: T.bg, paddingBottom: 34 }}>
      <View style={{ paddingHorizontal: X, paddingTop: 14, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel={copy.common?.close || 'Fermer'} style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: T.seg }}><Text style={{ color: T.ink, fontSize: 16, lineHeight: 18 }}>×</Text></Pressable>
      </View>
      <View style={{ alignItems: 'center', paddingHorizontal: X }}>
        <View style={{ height: 110, justifyContent: 'flex-end' }}>
          {burst ? <Burst count={14} colors={[T.accent, T.ok, T.ink, T.muted]} dist={110} /> : null}
          <LiveMochiImage size={120} lean={0} mood={mood ? MOOD_FACE[mood] : (T.night ? 'sleeping' : undefined)} />
        </View>
        <Animated.Text entering={FadeInDown.duration(260)} style={[type.name, { color: T.ink, marginTop: 14, textAlign: 'center', fontSize: 24 }]}>{moment === 'morning' ? fill(t.morningTitle, { name: me.first_name }) : t.eveningTitle}</Animated.Text>
        <Text style={[type.sub, { color: T.muted, marginTop: 6, textAlign: 'center' }]}>{partnerAnswer ? fill(t.sub, { name: partner.first_name, answer: t.moods[partnerAnswer].toLowerCase() }) : fill(t.subNone, { name: partner.first_name })}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 22, paddingHorizontal: X }}>
        {[1, 2, 3].map(v => <Choice key={v} T={T} label={t.moods[v]} on={mood === v} onPress={() => choose(v)} />)}
      </View>
      <View style={{ paddingHorizontal: X, marginTop: 18 }}><CTAPrimary big label={t.cta} onPress={save} disabled={!mood} /></View>
    </View>
  );
}
