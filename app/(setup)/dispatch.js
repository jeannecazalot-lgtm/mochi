// Écran 12 · Proposition de dispatch + réattribution directe (fusion 12+13 décidée
// par Jeanne le 22 août 2026 : l'écran 13 n'existe plus dans le parcours).
// Tap sur une rangée ou son avatar = la tâche bascule vers l'autre membre (pop),
// totaux et équilibre recalculés en direct. Recette : docs/recettes/12-dispatch.md
import React, { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSharedValue, useAnimatedStyle, withTiming, withSpring, withSequence, Easing } from 'react-native-reanimated';
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
    sc.value = withSequence(withTiming(0.96, { duration: 70 }), withSpring(1.03, { damping: 18 }), withSpring(1, motion.spring)); // pop léger (retour Jeanne)
  }, [dep]);
  return useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
}

function Row({ it, index, onToggle, onFreq }) {
  const both = it.assignee_id === 'both';
  const who = both ? me : byId(it.assignee_id);
  const pop = usePopOnChange(it.assignee_id);
  return (
    <Animated.View entering={prefersReducedMotion() ? undefined : FadeInDown.delay(index * 45).duration(motion.screen)}>
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
          <Pressable onPress={onToggle} hitSlop={8} accessibilityLabel={`${it.label} · ${both ? t.both : who.first_name}`}>
            <Animated.View style={[pop, s.whoChip, { borderColor: both ? colors.ink : who.color }]}>
              {both ? (
                <View style={{ flexDirection: 'row' }}>
                  <Avatar initial={me.initial} color={me.color} size={22} ring />
                  <View style={{ marginLeft: -8 }}><Avatar initial={partner.initial} color={partner.color} size={22} ring /></View>
                </View>
              ) : <Avatar initial={who.initial} color={who.color} size={22} />}
              <Text style={s.whoTxt}>{both ? t.both : who.first_name}</Text>
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
  // cycle du porteur : moi → binôme → les deux → moi (retour Jeanne, 23 août 2026)
  const toggle = task_id => setItems(l => l.map(i => {
    if (i.task_id !== task_id) return i;
    const next = i.assignee_id === me.id ? partner.id : i.assignee_id === partner.id ? 'both' : me.id;
    return { ...i, assignee_id: next };
  }));

  const load = items.reduce((acc, i) => {
    if (i.assignee_id === 'both') { acc[me.id] += i.weekly_min / 2; acc[partner.id] += i.weekly_min / 2; }
    else acc[i.assignee_id] += i.weekly_min;
    return acc;
  }, { [me.id]: 0, [partner.id]: 0 });
  const state = balanceState(load);
  const tot = load[me.id] + load[partner.id] || 1;

  // Retour Jeanne (1er sept 2026) : la barre d'équilibre s'anime — elle part de
  // 50/50 au montage puis glisse vers la vraie répartition, et suit en douceur
  // chaque bascule de porteur ou réglage de fréquence (avant : saut sec).
  const meShare = useSharedValue(0.5);
  useEffect(() => {
    const target = load[me.id] / tot;
    if (prefersReducedMotion()) { meShare.value = target; return; }
    meShare.value = withTiming(target, { duration: 500, easing: Easing.inOut(Easing.cubic) });
  }, [load[me.id], tot]);
  const barMe = useAnimatedStyle(() => ({ flex: meShare.value }));
  const barPartner = useAnimatedStyle(() => ({ flex: 1 - meShare.value }));

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <SetupHeader hero={<LiveMochi size={96} />} title={t.dispatchTitle} sub={t.dispatchSubTap} />

        <View style={{ paddingHorizontal: space.headerX, paddingTop: 18 }}>
          <Animated.View entering={prefersReducedMotion() ? undefined : FadeInDown.duration(motion.screen)}>
            <Card padding={0} r={20} accent={colors.sage} style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, height: 96, paddingHorizontal: 18 }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.state} numberOfLines={1}>{t[state]}</Text>
                  <Text style={s.loads} numberOfLines={1}>
                    <Text style={s.strong}>{fmtMinRound(load[me.id])}</Text> {me.first_name} · <Text style={s.strong}>{fmtMinRound(load[partner.id])}</Text> {partner.first_name} {t.perWeekSlash}
                  </Text>
                </View>
                <View style={s.bar}>
                  <Animated.View style={[barMe, { backgroundColor: me.color }]} />
                  <Animated.View style={[barPartner, { backgroundColor: partner.color }]} />
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
