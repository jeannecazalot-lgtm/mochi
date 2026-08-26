// Écran 12 · Proposition de dispatch + réattribution directe (fusion 12+13 décidée
// par Jeanne le 22 août 2026 : l'écran 13 n'existe plus dans le parcours).
// Tap sur une rangée ou son avatar = la tâche bascule vers l'autre membre (pop),
// totaux et équilibre recalculés en direct. Recette : docs/recettes/12-dispatch.md
import React, { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSharedValue, useAnimatedStyle, withTiming, withSpring, withSequence } from 'react-native-reanimated';
import { GlowBg, Card, Avatar, SetupHeader, CTAPrimary, useScrollEnd, GrowCTA } from '../../src/components/ui';
import { BottomCTA, LiveCount, fill } from '../../src/components/setup/extra';
import { Animated, FadeInDown, prefersReducedMotion, LiveMochi } from '../../src/components/motion';
import { me, partner, byId, fmtMin } from '../../src/demo';
import { dispatch, dispatchEmoji, weeklyLoad, balanceState } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space, alpha, motion } from '../../src/theme';

const t = copy.setup;
const fmtMinRound = v => fmtMin(Math.round(v));
const finish = () => router.replace('/(tabs)');

// pop d'échelle à chaque bascule d'assigné (pas au montage)
function usePopOnChange(dep) {
  const sc = useSharedValue(1);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (prefersReducedMotion()) return;
    sc.value = withSequence(withTiming(0.7, { duration: 80 }), withSpring(1.15, { damping: 10 }), withSpring(1, motion.spring));
  }, [dep]);
  return useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
}

function Row({ it, index, onToggle, onFreq }) {
  const who = byId(it.assignee_id);
  const pop = usePopOnChange(it.assignee_id);
  return (
    <Animated.View entering={prefersReducedMotion() ? undefined : FadeInDown.delay(index * 25).duration(motion.screen)}>
      <Card padding={0} r={12} style={{ marginBottom: 6 }}>
        <View style={s.row}>
          <Text style={{ fontSize: 19 }}>{dispatchEmoji(it)}</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{it.label}</Text>
            {/* fréquence réglable : − n×/sem + */}
            <View style={s.freqRow}>
              <Pressable onPress={() => onFreq(-1)} hitSlop={8} style={s.stepBtn}><Text style={s.stepTxt}>−</Text></Pressable>
              <Text style={s.freqTxt}>{fill(t.timesPerWeek, { n: it.freq })}</Text>
              <Pressable onPress={() => onFreq(1)} hitSlop={8} style={s.stepBtn}><Text style={s.stepTxt}>+</Text></Pressable>
            </View>
          </View>
          {/* porteur explicite : avatar + prénom, tap = bascule */}
          <Pressable onPress={onToggle} hitSlop={8} accessibilityLabel={`${it.label} · ${who.first_name}`}>
            <Animated.View style={[pop, s.whoChip, { borderColor: who.color }]}>
              <Avatar initial={who.initial} color={who.color} size={22} />
              <Text style={s.whoTxt}>{who.first_name}</Text>
            </Animated.View>
          </Pressable>
        </View>
      </Card>
    </Animated.View>
  );
}

export default function Dispatch() {
  const { atEnd, scrollProps } = useScrollEnd();
  // freq = occurrences/semaine (dérivée des minutes hebdo de la démo), réglable 1-14
  const [items, setItems] = useState(dispatch.map(i => ({ ...i, freq: Math.max(1, Math.round(i.weekly_min / i.mins)) })));
  const bumpFreq = (task_id, d) => setItems(l => l.map(i => (i.task_id === task_id ? { ...i, freq: Math.min(14, Math.max(1, i.freq + d)), weekly_min: Math.min(14, Math.max(1, i.freq + d)) * i.mins } : i)));
  const toggle = task_id => setItems(l => l.map(i => (i.task_id === task_id ? { ...i, assignee_id: i.assignee_id === me.id ? partner.id : me.id } : i)));

  const load = weeklyLoad(items);
  const state = balanceState(load);
  const tot = load[me.id] + load[partner.id] || 1;

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <SetupHeader hero={<LiveMochi size={96} />} title={t.dispatchTitle} sub={t.dispatchSubTap} />

        <View style={{ paddingHorizontal: space.headerX, paddingTop: 18 }}>
          <Animated.View entering={prefersReducedMotion() ? undefined : FadeInDown.duration(motion.screen)}>
            <Card padding={0} r={20} accent={state === 'balanced' ? colors.sage : colors.butter} style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 17, paddingHorizontal: 18 }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.state}>{t[state]}</Text>
                  <Text style={s.loads}>
                    <LiveCount value={load[me.id]} format={fmtMinRound} style={s.strong} /> {me.first_name} · <LiveCount value={load[partner.id]} format={fmtMinRound} style={s.strong} /> {partner.first_name} {t.perWeek}
                  </Text>
                </View>
                <View style={s.bar}>
                  <View style={{ flex: load[me.id] / tot, backgroundColor: me.color }} />
                  <View style={{ flex: load[partner.id] / tot, backgroundColor: partner.color }} />
                </View>
              </View>
            </Card>
          </Animated.View>
        </View>

        <ScrollView {...scrollProps} contentContainerStyle={{ paddingHorizontal: space.screenX, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {items.map((it, i) => <Row key={it.task_id} it={it} index={i} onToggle={() => toggle(it.task_id)} onFreq={d => bumpFreq(it.task_id, d)} />)}
        </ScrollView>

        <GrowCTA grown={atEnd} style={{ position: 'absolute', left: 24, right: 24, bottom: 24 }}><CTAPrimary label={t.go} onPress={finish} big /></GrowCTA>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  state: { fontSize: 21, fontWeight: '600', letterSpacing: -0.6, lineHeight: 21, color: colors.ink },
  loads: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 6 },
  strong: { fontSize: 13, color: colors.ink, fontWeight: '600', fontVariant: ['tabular-nums'] },
  bar: { height: 8, width: 80, borderRadius: 4, overflow: 'hidden', flexDirection: 'row', backgroundColor: alpha(colors.ink, 0.10) },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 14 },
  title: { fontSize: 16, fontWeight: '500', color: colors.ink },
  freqRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  stepBtn: { width: 24, height: 24, borderRadius: 12, backgroundColor: alpha(colors.ink, 0.06), alignItems: 'center', justifyContent: 'center' },
  stepTxt: { fontSize: 15, fontWeight: '600', color: colors.ink, lineHeight: 17 },
  freqTxt: { fontSize: 13, fontWeight: '500', color: colors.muted, fontVariant: ['tabular-nums'], minWidth: 52, textAlign: 'center' },
  whoChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingLeft: 4, paddingRight: 10, borderRadius: 999, borderWidth: 1.5, backgroundColor: colors.card },
  whoTxt: { fontSize: 13, fontWeight: '600', color: colors.ink },
});
