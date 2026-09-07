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
import { AvatarPair } from '../src/components/core/extra';
import { occurrences, taskById, byId, me, partner, malus, today } from '../src/demo';
import { read } from '../src/store';
import { loadSetup, inRealMode } from '../src/setup-state';
import { getUid, useIdentity, loadIdentity } from '../src/identity';
import { occStore } from '../src/demo-core';
import { toggleOccurrence, isLive } from '../src/occ-actions';
import { localIso } from '../src/dates';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, motion } from '../src/theme';

const t = copy.afaire;
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const DAY = 86400000;
const dayShort = (d) => new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(d).replace('.', '');
const dayLong = (d) => new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(d);
const SWIPE_W = 72;

// ─── rangée swipeable ────────────────────────────────────────────────
// occ réelle (5 sept 2026) : normalisée par l'écran avec _task, _today, _points, _href
function Row({ occ, done, onToggle }) {
  const task = occ._task || taskById(occ.task_id);
  const who = occ.assignee_id ? byId(occ.assignee_id) : null;
  const now = occ._today || today;
  const late = occ.status === 'missed' || (occ.status === 'pending' && occ.due_date < now);
  const diffDays = Math.round((now - occ.due_date) / DAY);
  const points = occ._points ?? malus.filter(m => m.task_id === occ.task_id && m.user_id === occ.assignee_id).reduce((a, m) => a + m.points, 0);
  const href = occ._href || `/task/${task.id}`;
  const ref = useRef(null);

  const pop = useCheckPop(done);
  const fade = useSharedValue(done ? 0.45 : 1);
  useEffect(() => { fade.value = withTiming(done ? 0.45 : 1, { duration: motion.micro }); }, [done]);
  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  const sub = late
    ? fill(t.lateSince, { ago: diffDays >= 1 ? fill(t.daysAgo, { n: diffDays }) : fill(t.hoursAgo, { n: 1 }) })
    : [occ.time || occ.badge, `${task.duration_min}ʼ`].filter(Boolean).join(' · ');

  const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  // décision Jeanne (6 sept 2026) : glisser vers la DROITE = fait (coche verte à gauche),
  // glisser vers la GAUCHE = reporter / repasser ; le tap ouvre la sheet. `dir` = sens du geste.
  const onOpen = (dir) => {
    if (dir === 'right') { onToggle(occ.id); ref.current?.close(); }
  };

  const renderCheck = () => (
    <Pressable onPress={() => { onToggle(occ.id); ref.current?.close(); }} style={[s.action, { backgroundColor: colors.sage, width: SWIPE_W }]}>
      <CheckCircle done size={22} />
    </Pressable>
  );
  const renderOptions = () => (
    <View style={{ flexDirection: 'row' }}>
      <Pressable onPress={() => { ref.current?.close(); router.push(href); }} style={[s.action, { backgroundColor: social.swipeSwap, width: 78 }]}>
        <Text style={s.actionIcon}>⇄</Text><Text style={s.actionLabel}>{t.swipeSwap}</Text>
      </Pressable>
      <Pressable onPress={() => { ref.current?.close(); router.push(href); }} style={[s.action, { backgroundColor: social.swipePostpone, width: 78 }]}>
        <Text style={s.actionIcon}>⏰</Text><Text style={s.actionLabel}>{t.swipePostpone}</Text>
      </Pressable>
    </View>
  );

  const accent = !done && late ? colors.coral : !done && occ.urgent ? colors.sage : null;
  const inner = (
    <View style={s.rowInner}>
      {/* le rond coche/décoche directement, comme sur l'Accueil (test du 6 sept 2026) */}
      <Pressable onPress={() => onToggle(occ.id)} hitSlop={8}><Animated.View style={pop}><CheckCircle done={done} /></Animated.View></Pressable>
      <Text style={{ fontSize: 19 }}>{task.emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[s.title, done && s.titleDone]} numberOfLines={1}>{task.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <Text style={[s.sub, late && !done && s.subLate]}>{sub}</Text>
          {late && !done && points ? <PillLabel color={colors.coralDeep} tint={colors.coral}>{fill(t.malusPill, { n: points })}</PillLabel> : null}
        </View>
      </View>
      {who ? <Avatar initial={who.initial} color={who.color} photo={who.avatar_url} size={26} /> : <AvatarPair members={[me, partner]} size={22} />}
    </View>
  );

  return (
    <ReanimatedSwipeable
      ref={ref} friction={1.6} leftThreshold={60} rightThreshold={SWIPE_W} overshootLeft={false} overshootRight={false}
      renderLeftActions={renderCheck} renderRightActions={renderOptions}
      onSwipeableWillOpen={haptic} onSwipeableOpen={onOpen}
      containerStyle={{ marginBottom: 4, borderRadius: radius.row, overflow: 'hidden' }}
    >
      <Pressable onPress={() => router.push(href)}>
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
  // Réel (5 sept 2026, audit QA) : les vraies occurrences du foyer, normalisées à la
  // forme de la démo (dates en Date, porteur = me/partner de démo pour les filtres)
  const [realAll, setRealAll] = useState(null);
  const ident = useIdentity();
  const occV = occStore.useVersion();
  useEffect(() => {
    (async () => {
      await loadSetup();
      if (!inRealMode()) return;
      await loadIdentity();
      const [occs, tasks, mal] = await Promise.all([read('occurrences'), read('tasks'), read('malus')]);
      const byTask = Object.fromEntries(tasks.map(tk => [tk.id, tk]));
      const uid = getUid();
      const now = new Date(`${localIso()}T12:00:00`);
      setRealAll(occs.filter(o => isLive(o) && (o.status !== 'done' || o.due_date >= localIso())).map(o => {
        const tk = byTask[o.task_id] || { id: o.task_id, title: '…', emoji: '•', duration_min: 15 };
        const q = `occ=${o.id}&tid=${o.task_id}&title=${encodeURIComponent(tk.title)}&emoji=${encodeURIComponent(tk.emoji || '•')}&mins=${tk.duration_min || 15}`;
        return {
          id: o.id, task_id: o.task_id, status: o.status || 'pending',
          assignee_id: o.assignee_id ? (o.assignee_id === uid ? me.id : partner.id) : null,
          due_date: new Date(`${o.due_date}T12:00:00`), _today: now, _task: tk, _href: `/mission?${q}`,
          _points: mal.filter(m => m.occurrence_id === o.id).reduce((a, m) => a + Number(m.points || 0), 0),
        };
      }));
    })();
  }, [occV, ident]);
  const source = realAll || occurrences;
  const now = realAll ? new Date(`${localIso()}T12:00:00`) : today;
  const isDone = (o) => doneMap[o.id] ?? (o.status === 'done');
  // « Annuler » quelques secondes après une coche (glissement ou tâche future — test du 6 sept 2026)
  const [undo, setUndo] = useState(null);
  const undoTimer = useRef(null);
  const toggle = (id) => {
    const o = source.find(x => x.id === id);
    const nowDone = !isDone(o);
    setDoneMap(m => ({ ...m, [id]: nowDone }));
    if (realAll) toggleOccurrence(String(id), nowDone, o?._task?.duration_min).catch(() => {});
    if (undoTimer.current) clearTimeout(undoTimer.current);
    if (nowDone) { setUndo({ id, title: (o?._task || taskById(o.task_id))?.title || '' }); undoTimer.current = setTimeout(() => setUndo(null), 6000); }
    else setUndo(null);
  };
  useEffect(() => () => { if (undoTimer.current) clearTimeout(undoTimer.current); }, []);

  const isLate = (o) => o.status === 'missed' || (o.status === 'pending' && o.due_date < now);
  const all = source.filter(o => o.due_date >= now || isLate(o));
  // compteurs = ce qui reste à faire ; une tâche commune compte pour les deux
  const todo = all.filter(o => !isDone(o));
  const forMe = o => o.assignee_id === me.id || o.assignee_id == null;
  const forPartner = o => o.assignee_id === partner.id || o.assignee_id == null;
  const counts = { all: todo.length, me: todo.filter(forMe).length, partner: todo.filter(forPartner).length, late: todo.filter(isLate).length };
  const visible = all.filter(o => filter === 'all' || (filter === 'me' && forMe(o)) || (filter === 'partner' && forPartner(o)) || (filter === 'late' && isLate(o)));

  const groups = [];
  visible.sort((a, b) => a.due_date - b.due_date).forEach(o => {
    const diff = Math.round((o.due_date - now) / DAY);
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
            <Text style={s.h2}>{counts.late ? fill(t.subtitle, { n: counts.all, m: counts.late }) : counts.all === 1 ? t.groupCountOne : counts.all === 0 ? t.subtitleNone : fill(t.subtitleNoLate, { n: counts.all })}</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, flexShrink: 0, minHeight: 50 }} contentContainerStyle={s.filters}>
          {filters.map(f => <FilterChip key={f.k} label={f.l} count={f.c} active={filter === f.k} alert={f.alert} onPress={() => setFilter(f.k)} />)}
        </ScrollView>
        <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
          {groups.map(g => (
            <View key={g.label} style={{ marginBottom: 10 }}>
              <View style={s.groupHead}>
                <Text style={s.groupLabel}>{g.label}</Text>
                <Text style={s.groupCount}>{(n => n === 1 ? t.groupCountOne : n === 0 ? t.groupCountZero : fill(t.groupCount, { n }))(g.items.filter(o => !isDone(o)).length)}</Text>
              </View>
              {g.items.map(o => <Row key={o.id} occ={o} done={isDone(o)} onToggle={toggle} />)}
            </View>
          ))}
        </ScrollView>
        {undo ? (
          <View style={s.undoWrap} pointerEvents="box-none">
            <View style={s.undo}>
              <Text style={s.undoTxt} numberOfLines={1}>{fill(t.undoDone, { title: undo.title })}</Text>
              <Pressable onPress={() => toggle(undo.id)} hitSlop={8}><Text style={s.undoBtn}>{t.undo}</Text></Pressable>
            </View>
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  undoWrap: { position: 'absolute', left: 0, right: 0, bottom: 28, alignItems: 'center' },
  undo: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.ink, borderRadius: 999, paddingVertical: 11, paddingHorizontal: 18, maxWidth: '86%' },
  undoTxt: { color: colors.card, fontSize: 14, fontWeight: '500', flexShrink: 1 },
  undoBtn: { color: colors.butter, fontSize: 14, fontWeight: '700' },
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
