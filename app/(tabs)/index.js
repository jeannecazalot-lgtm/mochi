// Écran 17 · Accueil. Recette : docs/recettes/17-home.md
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GlowBg, Card, Divider, GlassRow, Avatar } from '../../src/components/ui';
import { LiveMochi, useCheckPop, Animated } from '../../src/components/motion';
import { Icon, ICON, BadgePill, CheckCircle, RoundButton, Hint } from '../../src/components/core/extra';
import { me, partner, balance, streak, myToday, partnerToday, taskById, fmtMin } from '../../src/demo';
import { fmtHeaderDate, mochiLean, moreLoaded, sumMinutes, hasUnreadPing } from '../../src/demo-core';
import copy from '../../src/data/copy.json';
import { colors, space, font, motion } from '../../src/theme';

const fill = (s, vars) => Object.keys(vars).reduce((acc, k) => acc.replace(`{${k}}`, vars[k]), s);

function mochiLine(t) {
  const who = moreLoaded();
  const other = who.id !== me.id;
  if (balance.state === 'balanced') return { line: t.mochiBalanced, sub: t.mochiBalancedSub };
  if (balance.state === 'unbalanced') return { line: fill(other ? t.mochiUnbalancedOther : t.mochiUnbalancedMe, { name: who.first_name }), sub: t.mochiUnbalancedSub };
  return { line: fill(other ? t.mochiLeaningOther : t.mochiLeaningMe, { name: who.first_name }), sub: t.mochiLeaningSub };
}

function MissionRow({ occ, first, done, onToggle }) {
  const task = taskById(occ.task_id);
  const pop = useCheckPop(done);
  const op = useSharedValue(done ? 0.45 : 1);
  useEffect(() => { op.value = withTiming(done ? 0.45 : 1, { duration: motion.micro }); }, [done]);
  const rowStyle = useAnimatedStyle(() => ({ opacity: op.value }));
  const mental = task.mental_load || occ.kind === 'plan';
  return (
    <Pressable onPress={() => router.push(`/task/${task.id}`)} onLongPress={() => router.push(`/ping?occ=${occ.id}`)} delayLongPress={400}>
      {!first ? <Divider /> : null}
      <Animated.View style={[s.row, rowStyle]}>
        <Text style={{ fontSize: 19 }}>{task.emoji}</Text>
        <Text style={[font.body, { flex: 1 }, done && { textDecorationLine: 'line-through' }]} numberOfLines={1}>{task.title}</Text>
        {occ.badge ? <BadgePill color={colors.coralDeep} tint={colors.coral} a={0.14}>{occ.badge}</BadgePill>
          : mental ? <BadgePill color={colors.lavenderDeep} tint={colors.lavender} a={0.18}>{copy.home.mentalBadge}</BadgePill> : null}
        <Pressable onPress={onToggle} hitSlop={8}>
          <Animated.View style={pop}><CheckCircle done={done} /></Animated.View>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
}

export default function Home() {
  const t = copy.home;
  const missions = myToday();
  const [doneIds, setDoneIds] = useState(() => new Set(missions.filter(o => o.status === 'done').map(o => o.id)));
  const toggle = id => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setDoneIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const pt = partnerToday();
  const { line, sub } = mochiLine(t);
  const meta = fill(missions.length === 1 ? t.missionMeta : t.missionsMeta, { n: missions.length, time: fmtMin(sumMinutes(missions)) });
  const partnerMeta = fill(pt.length === 1 ? t.partnerMetaOne : t.partnerMeta, { n: pt.length, time: fmtMin(sumMinutes(pt)) });
  const left = Math.max(0, streak.next.at - streak.days);

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Header : date + bulle activité + avatar */}
          <View style={s.header}>
            <Text style={[font.micro, { flex: 1, fontWeight: '500' }]}>{fmtHeaderDate()}</Text>
            <RoundButton onPress={() => router.push('/activite')} accessibilityLabel={t.activityA11y}>
              <Icon d={ICON.bubble} size={17} />
              {hasUnreadPing() ? <View style={s.dot} /> : null}
            </RoundButton>
            <Pressable onPress={() => router.push('/profil')} accessibilityLabel={t.profileA11y}>
              <Avatar initial={me.initial} color={me.color} size={36} />
            </Pressable>
          </View>

          {/* Bloc 1 · Mochi qui penche + phrase */}
          <View style={s.mochiBlock}>
            <LiveMochi size={104} mood="neutral" lean={mochiLean()} />
            <View style={{ flex: 1 }}>
              <Text style={[font.cardTitle, { lineHeight: 23 }]}>{line}</Text>
              <Text style={[font.secondary, { marginTop: 4 }]}>{sub}</Text>
            </View>
          </View>

          {/* Bloc 2 · Mes missions du jour */}
          <View style={s.sectionHead}>
            <Pressable onPress={() => router.push('/afaire')} hitSlop={6}><Text style={font.sectionTitle}>{t.todayTitle}</Text></Pressable>
            <Text style={{ fontSize: 13, fontWeight: '500', color: colors.muted }}>{meta}</Text>
          </View>
          <View style={{ paddingHorizontal: space.screenX }}>
            <Card padding={0} style={{ paddingVertical: 11, paddingHorizontal: 14 }}>
              {missions.map((o, i) => <MissionRow key={o.id} occ={o} first={i === 0} done={doneIds.has(o.id)} onToggle={() => toggle(o.id)} />)}
            </Card>
            <Hint style={{ marginTop: 6 }}>{t.swipeHint}</Hint>
          </View>

          {/* Bloc 3 · Côté binôme — lecture seule */}
          <View style={{ paddingHorizontal: space.screenX, paddingTop: 14 }}>
            <GlassRow onPress={() => router.push('/afaire')}>
              <Avatar initial={partner.initial} color={partner.color} size={28} />
              <Text style={[font.row, { flex: 1 }]} numberOfLines={1}>
                {fill(t.sideOf, { name: partner.first_name })} <Text style={font.secondary}>{partnerMeta}</Text>
              </Text>
              <Text style={{ fontSize: 16, color: colors.muted }}>›</Text>
            </GlassRow>
          </View>

          {/* Bloc 4 · Streak discret */}
          <View style={{ flex: 1 }} />
          <Text style={s.streak}>{fill(t.streak, { n: streak.days, left, badge: streak.next.label })}</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 14, paddingHorizontal: space.headerX, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { position: 'absolute', top: 1, right: 1, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.coral, borderWidth: 2, borderColor: colors.bg },
  mochiBlock: { paddingTop: 10, paddingHorizontal: space.headerX, flexDirection: 'row', alignItems: 'center', gap: 16 },
  sectionHead: { paddingTop: 18, paddingBottom: 6, paddingHorizontal: space.headerX, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 11 },
  streak: { textAlign: 'center', fontSize: 13, fontWeight: '500', color: colors.muted, paddingTop: 16, paddingBottom: 12, paddingHorizontal: space.screenX },
});
