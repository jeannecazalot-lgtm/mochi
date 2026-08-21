// Écran 20 · À faire (+ état 21 tâche ratée/malus dans la même liste). Recette : docs/recettes/20-afaire.md
// Source : duo-v2-compare.jsx › CmpList variant="cream". Densité compacte.
import React, { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import * as Haptics from 'expo-haptics';
import { GlowBg, Card, Avatar, PillLabel } from '../src/components/ui';
import { Animated, useCheckPop } from '../src/components/motion';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { BackButton, CheckCircle, FilterChip, social } from '../src/components/social/extra';
import { occurrences, taskById, byId, me, partner, malus, today } from '../src/demo';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, motion } from '../src/theme';

const t = copy.afaire;
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const DAY = 86400000;
const dayShort = (d) => new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(d).replace('.', '');
const dayLong = (d) => new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(d);
const SWIPE_W = 72;

// ─── rangée swipeable ────────────────────────────────────────────────
function Row({ occ, done, onToggle }) {
  const task = taskById(occ.task_id);
  const who = occ.assignee_id ? byId(occ.assignee_id) : null;
  const late = occ.status === 'missed' || (occ.status === 'pending' && occ.due_date < today);
  const diffDays = Math.round((today - occ.due_date) / DAY);
  const points = malus.filter(m => m.task_id === occ.task_id && m.user_id === occ.assignee_id).reduce((a, m) => a + m.points, 0);
  const ref = useRef(null);

  const pop = useCheckPop(done);
  const fade = useSharedValue(done ? 0.45 : 1);
  useEffect(() => { fade.value = withTiming(done ? 0.45 : 1, { duration: motion.micro }); }, [done]);
  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  const sub = late
    ? fill(t.lateSince, { ago: diffDays >= 1 ? fill(t.daysAgo, { n: diffDays }) : fill(t.hoursAgo, { n: 1 }) })
    : [occ.time || occ.badge, `${task.duration_min}ʼ`].filter(Boolean).join(' · ');

  const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  const onOpen = (dir) => {
    if (dir === 'right') { onToggle(occ.id); ref.current?.close(); }
  };

  const renderCheck = () => (
    <View style={[s.action, { backgroundColor: colors.sage, width: SWIPE_W }]}>
      <CheckCircle done size={22} />
    </View>
  );
  const renderOptions = () => (
    <View style={{ flexDirection: 'row' }}>
      <Pressable onPress={() => { ref.current?.close(); router.push(`/task/${task.id}`); }} style={[s.action, { backgroundColor: social.swipeSwap, width: 78 }]}>
        <Text style={s.actionIcon}>⇄</Text><Text style={s.actionLabel}>{t.swipeSwap}</Text>
      </Pressable>
      <Pressable onPress={() => { ref.current?.close(); router.push(`/task/${task.id}`); }} style={[s.action, { backgroundColor: social.swipePostpone, width: 78 }]}>
        <Text style={s.actionIcon}>⏰</Text><Text style={s.actionLabel}>{t.swipePostpone}</Text>
      </Pressable>
    </View>
  );

  const accent = !done && late ? colors.coral : !done && occ.urgent ? colors.sage : null;
  const inner = (
    <View style={s.rowInner}>
      <Animated.View style={pop}><CheckCircle done={done} /></Animated.View>
      <Text style={{ fontSize: 19 }}>{task.emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[s.title, done && s.titleDone]} numberOfLines={1}>{task.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <Text style={[s.sub, late && !done && s.subLate]}>{sub}</Text>
          {late && !done && points ? <PillLabel color={colors.coralDeep} tint={colors.coral}>{fill(t.malusPill, { n: points })}</PillLabel> : null}
        </View>
      </View>
      {who ? <Avatar initial={who.initial} color={who.color} size={26} /> : <Avatar initial="?" color={colors.muted} size={26} />}
    </View>
  );

  return (
    <ReanimatedSwipeable
      ref={ref} friction={1.6} leftThreshold={60} rightThreshold={SWIPE_W} overshootLeft={false} overshootRight={false}
      renderLeftActions={renderOptions} renderRightActions={renderCheck}
      onSwipeableWillOpen={haptic} onSwipeableOpen={onOpen}
      containerStyle={{ marginBottom: 4, borderRadius: radius.row, overflow: 'hidden' }}
    >
      <Pressable onPress={() => router.push(`/task/${task.id}`)}>
        <Animated.View style={fadeStyle}>
          {accent
            ? <Card r={radius.row} padding={0} accent={accent} style={{ paddingVertical: 8, paddingHorizontal: 11 }}>{inner}</Card>
            : <View style={s.glass}>{inner}</View>}
        </Animated.View>
      </Pressable>
    </ReanimatedSwipeable>
  );
}

// ─── écran ──────────────────────────────────────────────────────────
export default function AFaire() {
  const [filter, setFilter] = useState('all');
  const [doneMap, setDoneMap] = useState({});
  const isDone = (o) => doneMap[o.id] ?? (o.status === 'done');
  const toggle = (id) => setDoneMap(m => ({ ...m, [id]: !isDone(occurrences.find(o => o.id === id)) }));
  // TODO Supabase : status done/pending sur occurrences au lieu de doneMap

  const isLate = (o) => o.status === 'missed' || (o.status === 'pending' && o.due_date < today);
  const all = occurrences.filter(o => o.due_date >= today || isLate(o));
  const counts = { all: all.length, me: all.filter(o => o.assignee_id === me.id).length, partner: all.filter(o => o.assignee_id === partner.id).length, late: all.filter(isLate).length };
  const visible = all.filter(o => filter === 'all' || (filter === 'me' && o.assignee_id === me.id) || (filter === 'partner' && o.assignee_id === partner.id) || (filter === 'late' && isLate(o)));

  const groups = [];
  visible.sort((a, b) => a.due_date - b.due_date).forEach(o => {
    const diff = Math.round((o.due_date - today) / DAY);
    const label = isLate(o) ? t.groupLate : diff === 0 ? fill(t.groupToday, { day: dayShort(o.due_date) }) : diff === 1 ? fill(t.groupTomorrow, { day: dayShort(o.due_date) }) : dayLong(o.due_date);
    let g = groups.find(x => x.label === label);
    if (!g) { g = { label, items: [] }; groups.push(g); }
    g.items.push(o);
  });

  const filters = [
    { k: 'all', l: t.filterAll, c: counts.all },
    { k: 'me', l: t.filterMe, c: counts.me },
    { k: 'partner', l: partner.first_name, c: counts.partner },
    { k: 'late', l: t.filterLate, c: counts.late, alert: true },
  ];

  return (
    <View style={{ flex: 1 }}>
      <GlowBg />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={s.header}>
          <BackButton onPress={() => router.back()} />
          <View style={{ flex: 1 }}>
            <Text style={s.h1}>{t.title}</Text>
            <Text style={s.h2}>{counts.late ? fill(t.subtitle, { n: counts.all, m: counts.late }) : fill(t.subtitleNoLate, { n: counts.all })}</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={s.filters}>
          {filters.map(f => <FilterChip key={f.k} label={f.l} count={f.c} active={filter === f.k} alert={f.alert} onPress={() => setFilter(f.k)} />)}
        </ScrollView>
        <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
          {groups.map(g => (
            <View key={g.label} style={{ marginBottom: 10 }}>
              <View style={s.groupHead}>
                <Text style={s.groupLabel}>{g.label}</Text>
                <Text style={s.groupCount}>{fill(t.groupCount, { n: g.items.length })}</Text>
              </View>
              {g.items.map(o => <Row key={o.id} occ={o} done={isDone(o)} onToggle={toggle} />)}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 10, paddingHorizontal: space.screenX, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 7 },
  h1: { fontSize: 22, fontWeight: '600', letterSpacing: -1.2, lineHeight: 24, color: colors.ink },
  h2: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 3, ...font.tabular },
  filters: { paddingTop: 6, paddingHorizontal: 14, paddingBottom: 10, gap: 5, flexDirection: 'row' },
  list: { paddingHorizontal: space.screenX, paddingBottom: 40 },
  groupHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingBottom: 8 },
  groupLabel: { ...font.micro, textTransform: 'uppercase' },
  groupCount: { fontSize: 11.5, fontWeight: '500', color: colors.muted, ...font.tabular },
  glass: { backgroundColor: colors.glass, borderWidth: 0.5, borderColor: social.rowBorder, borderRadius: radius.row, paddingVertical: 7, paddingHorizontal: 11 },
  rowInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 16, fontWeight: '500', color: colors.ink },
  titleDone: { textDecorationLine: 'line-through', color: colors.muted },
  sub: { fontSize: 13, fontWeight: '400', color: colors.muted, ...font.tabular },
  subLate: { color: colors.coralDeep, fontWeight: '600' },
  action: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  actionIcon: { fontSize: 18, color: colors.ink },
  actionLabel: { fontSize: 11, fontWeight: '600', color: colors.ink },
});
