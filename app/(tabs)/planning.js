// Écran 19 · Planning. Recette : docs/recettes/19-planning.md
// Retour Jeanne (1er sept 2026) : le segment Semaine/Mois ne pousse plus un nouvel
// écran — les deux vues glissent l'une vers l'autre dans la page (slide 320 ms),
// la vue mois est une grille calendrier, tap sur un jour → sheet « planning du jour ».
import React, { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';
import { GlowBg, ScreenTitle, Micro, Avatar } from '../../src/components/ui';
import { Animated } from '../../src/components/motion';
import { Icon, ICON, Segment, AvatarPair, Hint, CheckCircle } from '../../src/components/core/extra';
import { members, byId, taskById, today, me, partner, fmtMin } from '../../src/demo';
import { weekDays, dayDots, planningGroups, sameDay, fmtDayLabel, weekdayShort, MENTAL_COEF, fmtCoef, missionDone, occStore } from '../../src/demo-core';
import { read } from '../../src/store';
import { loadSetup, setup } from '../../src/setup-state';
import { getUid, useIdentity } from '../../src/identity';
import { localIso } from '../../src/dates';
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

// tap sur un jour → la liste défile jusqu'à ce jour (retour Jeanne, 2 sept 2026)
function DayChip({ date, on, dots, onPress }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, on && s.chipOn]}>
      <Text style={{ fontSize: 10.5, fontWeight: '600', opacity: 0.6, color: on ? colors.card : colors.ink }}>{weekdayShort(date)[0]}</Text>
      <Text style={[font.tabular, { fontSize: 15, fontWeight: '700', color: on ? colors.card : colors.ink }]}>{date.getDate()}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 3, height: 4 }}>
        {dots.map((c, j) => <View key={j} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: on ? colors.butterLight : c }} />)}
      </View>
    </Pressable>
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

// Vue mois : grille calendrier du mois courant (même recette que l'écran 35),
// tap sur un jour → sheet /jour avec le planning de la journée.
function MonthPane() {
  const tc = copy.calendar;
  const year = today.getFullYear(), month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // lundi = 0
  const cells = Array.from({ length: Math.ceil((firstDow + daysInMonth) / 7) * 7 }, (_, i) => { const d = i - firstDow + 1; return d >= 1 && d <= daysInMonth ? d : null; });
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: space.screenX, paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
      <Micro style={{ paddingHorizontal: 4, paddingBottom: 8 }}>{tc.months[month].toUpperCase()}</Micro>
      <View style={s.grid}>{tc.dows.map((d, i) => <Text key={i} style={s.dow}>{d}</Text>)}</View>
      <View style={s.grid}>
        {cells.map((d, i) => {
          if (!d) return <View key={i} style={s.cell} />;
          const date = new Date(year, month, d);
          const isToday = sameDay(date, today);
          return (
            <View key={i} style={s.cell}>
              <Pressable onPress={() => router.push(`/jour?d=${date.getTime()}`)} style={[s.day, isToday && s.today]}>
                <Text style={[s.dayNum, isToday && { color: colors.card }]}>{d}</Text>
                <View style={{ flexDirection: 'row', gap: 5, height: 4 }}>
                  {dayDots(date).map((c, j) => <View key={j} style={[s.dot, { backgroundColor: isToday ? colors.butterLight : c }]} />)}
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
      <Hint style={{ marginTop: 8 }}>{t.monthHint}</Hint>
    </ScrollView>
  );
}

// rangée RÉELLE : tap → sheet Mission (avec « Déplacer ») ; rond de coche pour
// mes tâches et les communes ; encadré corail si en retard (retour Jeanne, 2 sept 2026)
function RealRow({ vm, onToggle }) {
  return (
    <Pressable onPress={() => router.push(vm.href)}>
      <View style={[s.row, vm.late && { borderColor: colors.coral, borderWidth: 1.5 }]}>
        <Text style={{ fontSize: 18 }}>{vm.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15.5, fontWeight: '500', color: colors.ink, textDecorationLine: vm.done ? 'line-through' : 'none', opacity: vm.done ? 0.5 : 1 }} numberOfLines={1}>{vm.title}</Text>
          <Text style={[font.caption, { marginTop: 3 }, vm.late && { color: colors.coralDeep, fontWeight: '600' }]}>{vm.sub}</Text>
        </View>
        {vm.who
          ? <Avatar initial={vm.who.initial} color={vm.who.color} photo={vm.who.avatar_url} size={24} />
          : <AvatarPair members={members} size={24} />}
        {vm.checkable ? (
          <Pressable onPress={onToggle} hitSlop={8}><CheckCircle done={vm.done} /></Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function Planning() {
  const [grabbed, setGrabbed] = useState(false);
  const [mode, setMode] = useState('week');
  useIdentity();
  const t2 = copy.planning;
  // ─── vraies occurrences groupées par jour (démo en fallback) ───
  const [realGroups, setRealGroups] = useState(null);
  const occV = occStore.useVersion();
  missionDone.useVersion();
  useEffect(() => {
    (async () => {
      await loadSetup();
      if (!setup.result?.items?.length) return;
      const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]);
      if (!occs.length) return;
      const byTask = Object.fromEntries(tasks.map(tk => [tk.id, tk]));
      const uid = getUid();
      const todayIso = localIso();
      const byDate = {};
      for (const o of occs) {
        const tk = byTask[o.task_id] || {};
        const late = o.due_date < todayIso && !missionDone.has(o.id);
        const who = o.assignee_id ? (o.assignee_id === uid ? me : partner) : null;
        const q = `occ=${o.id}&tid=${o.task_id}&title=${encodeURIComponent(tk.title || '')}&emoji=${encodeURIComponent(tk.emoji || '•')}&mins=${tk.duration_min || 15}`;
        (byDate[o.due_date] ||= []).push({
          id: o.id, emoji: tk.emoji || '•', title: tk.title || '…',
          sub: late ? t2.late : `${fmtMin(tk.duration_min || 15)}${tk.mental_load ? ` · ${t2.mental.replace('{coef}', fmtCoef(MENTAL_COEF))}` : ''}`,
          who, checkable: !o.assignee_id || o.assignee_id === uid,
          done: missionDone.has(o.id), late, href: `/mission?${q}`,
        });
      }
      const groups = Object.keys(byDate).sort().map(d => ({ iso: d, date: new Date(d + 'T12:00:00'), items: byDate[d] }));
      setRealGroups(groups.length ? groups : null);
    })();
  }, [occV]);
  const toggleOcc = id => missionDone.toggle(id);
  // tap sur un jour du semainier → la liste défile jusqu'à ce jour (retour Jeanne)
  const scrollRef = useRef(null);
  const groupY = useRef({});
  const jumpTo = date => {
    const iso = localIso(date);
    const y = groupY.current[iso];
    if (y != null) scrollRef.current?.scrollTo({ y: Math.max(0, y - 8), animated: true });
  };
  const todayIso = localIso();
  // points du semainier en mode réel : couleurs des porteurs du jour
  const dotsFor = d => {
    const iso = localIso(d);
    const g2 = (realGroups || []).find(x => x.iso === iso);
    if (!g2) return [];
    const set = new Set();
    g2.items.forEach(it => { if (it.who) set.add(it.who.color); else members.forEach(m => set.add(m.color)); });
    return [...set];
  };
  const W = useWindowDimensions().width;
  const slide = useSharedValue(0); // 0 = semaine, 1 = mois
  const onSegment = v => { setMode(v); slide.value = withTiming(v === 'month' ? 1 : 0, { duration: 320, easing: Easing.inOut(Easing.cubic) }); };
  const weekStyle = useAnimatedStyle(() => ({ transform: [{ translateX: -slide.value * W }] }));
  const monthStyle = useAnimatedStyle(() => ({ transform: [{ translateX: (1 - slide.value) * W }] }));
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={s.header}>
          <ScreenTitle style={{ letterSpacing: -1.1 }}>{t.title}</ScreenTitle>
          <Segment value={mode} onChange={onSegment} options={[{ value: 'week', label: t.week }, { value: 'month', label: t.month }]} />
        </View>

        <View style={{ flex: 1 }}>
          {/* vue semaine — réelle (occurrences du foyer) ou démo en fallback */}
          <Animated.View style={[StyleSheet.absoluteFill, weekStyle]}>
            <View style={s.week}>
              {(realGroups ? weekDays(new Date()) : weekDays()).map(d => (
                <DayChip
                  key={d.getTime()} date={d}
                  on={sameDay(d, realGroups ? new Date() : today)}
                  dots={realGroups ? dotsFor(d) : dayDots(d)}
                  onPress={() => jumpTo(d)}
                />
              ))}
            </View>
            <ScrollView ref={scrollRef} contentContainerStyle={{ paddingHorizontal: space.screenX, paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
              {realGroups
                ? realGroups.map(g => (
                  <View key={g.iso} style={{ marginBottom: 11 }} onLayout={e => { groupY.current[g.iso] = e.nativeEvent.layout.y; }}>
                    <Micro style={s.groupLabel}>{fmtDayLabel(g.date)}{g.iso === todayIso ? ` · ${t.todaySuffix}` : ''}</Micro>
                    {g.items.map(vm => <RealRow key={vm.id} vm={vm} onToggle={() => toggleOcc(vm.id)} />)}
                  </View>
                ))
                : planningGroups().map(g => (
                  <View key={g.date.getTime()} style={{ marginBottom: 11 }}>
                    <Micro style={s.groupLabel}>{fmtDayLabel(g.date)}{sameDay(g.date, today) ? ` · ${t.todaySuffix}` : ''}</Micro>
                    {g.items.map(o => <TaskRow key={o.id} occ={o} onGrab={setGrabbed} />)}
                  </View>
                ))}
              <Hint>{realGroups ? t.realHint : grabbed ? t.grabbed : t.dragHint}</Hint>
            </ScrollView>
          </Animated.View>

          {/* vue mois */}
          <Animated.View style={[StyleSheet.absoluteFill, monthStyle]}>
            <MonthPane />
          </Animated.View>
        </View>
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
  // grille mois — même recette que l'écran 35 (7 colonnes 1/7, gouttière 5)
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -2.5, marginBottom: 6 },
  dow: { width: '14.2857%', textAlign: 'center', fontSize: 10.5, letterSpacing: 1, fontWeight: '600', color: colors.muted },
  cell: { width: '14.2857%', height: 44, paddingHorizontal: 2.5, marginBottom: 5 },
  day: { flex: 1, borderRadius: 10, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center', gap: 5 },
  today: { backgroundColor: colors.ink, borderWidth: 0 },
  dayNum: { fontSize: 14, fontWeight: '600', color: colors.ink, fontVariant: ['tabular-nums'] },
  dot: { width: 4, height: 4, borderRadius: 2 },
});
