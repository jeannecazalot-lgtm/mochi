// Écran 19 · Planning. Recette : docs/recettes/19-planning.md
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { GlowBg, ScreenTitle, Micro, Avatar } from '../../src/components/ui';
import { Animated } from '../../src/components/motion';
import { Icon, ICON, Segment, AvatarPair, Hint } from '../../src/components/core/extra';
import { members, byId, taskById, today, fmtMin } from '../../src/demo';
import { weekDays, dayDots, planningGroups, sameDay, fmtDayLabel, weekdayShort, MENTAL_COEF, fmtCoef } from '../../src/demo-core';
import copy from '../../src/data/copy.json';
import { colors, space, font, motion, radius } from '../../src/theme';

const t = copy.planning;

// sous-texte d'une rangée : badge · mental ×1,5 · 18h · 30 min · divisible
function subtitle(occ, task) {
  const parts = [];
  if (occ.badge) parts.push(occ.badge);
  else if (task.mental_load || occ.kind === 'plan') parts.push(t.mental.replace('{coef}', fmtCoef(MENTAL_COEF)));
  else { if (occ.time) parts.push(occ.time); parts.push(fmtMin(task.duration_min)); if (task.divisible) parts.push(t.divisible); }
  return parts.join(' · ');
}

function DayChip({ date }) {
  const on = sameDay(date, today);
  return (
    <View style={[s.chip, on && s.chipOn]}>
      <Text style={{ fontSize: 10.5, fontWeight: '600', opacity: 0.6, color: on ? colors.card : colors.ink }}>{weekdayShort(date)[0]}</Text>
      <Text style={[font.tabular, { fontSize: 15, fontWeight: '700', color: on ? colors.card : colors.ink }]}>{date.getDate()}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 3, height: 4 }}>
        {dayDots(date).map((c, j) => <View key={j} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: on ? colors.butterLight : c }} />)}
      </View>
    </View>
  );
}

function TaskRow({ occ, onGrab }) {
  const task = taskById(occ.task_id);
  const g = useSharedValue(0);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: 1 + g.value * 0.02 }], borderColor: g.value ? colors.lavender : colors.hairline, borderWidth: g.value ? 1.5 : StyleSheet.hairlineWidth }));
  const grab = v => { g.value = withSpring(v, motion.spring); onGrab(v === 1); };
  return (
    <Pressable onLongPress={() => grab(1)} onPressOut={() => grab(0)} delayLongPress={300}>
      <Animated.View style={[s.row, st]}>
        <Icon d={ICON.grip} size={13} color={colors.checkRing} sw={2.4} />
        <Text style={{ fontSize: 18 }}>{task.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15.5, fontWeight: '500', color: colors.ink }} numberOfLines={1}>{task.title}</Text>
          <Text style={[font.caption, { marginTop: 3 }]}>{subtitle(occ, task)}</Text>
        </View>
        {occ.assignee_id
          ? <Avatar initial={byId(occ.assignee_id).initial} color={byId(occ.assignee_id).color} size={24} />
          : <AvatarPair members={members} size={24} />}
      </Animated.View>
    </Pressable>
  );
}

export default function Planning() {
  const [grabbed, setGrabbed] = useState(false);
  const onSegment = v => { if (v === 'month') router.push('/calendrier'); };
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={s.header}>
          <ScreenTitle style={{ letterSpacing: -1.1 }}>{t.title}</ScreenTitle>
          <Segment value="week" onChange={onSegment} options={[{ value: 'week', label: t.week }, { value: 'month', label: t.month }]} />
        </View>

        {/* Semainier compact */}
        <View style={s.week}>{weekDays().map(d => <DayChip key={d.getTime()} date={d} />)}</View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: space.screenX, paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
          {planningGroups().map(g => (
            <View key={g.date.getTime()} style={{ marginBottom: 11 }}>
              <Micro style={s.groupLabel}>{fmtDayLabel(g.date)}{sameDay(g.date, today) ? ` · ${t.todaySuffix}` : ''}</Micro>
              {g.items.map(o => <TaskRow key={o.id} occ={o} onGrab={setGrabbed} />)}
            </View>
          ))}
          <Hint>{grabbed ? t.grabbed : t.dragHint}</Hint>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 14, paddingHorizontal: space.headerX, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  week: { paddingHorizontal: space.screenX, paddingBottom: 12, flexDirection: 'row', gap: 5 },
  chip: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink, shadowColor: colors.ink, shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  groupLabel: { paddingHorizontal: 4, paddingBottom: 7 },
  row: { backgroundColor: colors.card, borderRadius: radius.row, paddingVertical: 10, paddingHorizontal: 13, marginBottom: 6, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
});
