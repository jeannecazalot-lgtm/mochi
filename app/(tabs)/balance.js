// Écran 21 · Onglet Balance. Recette : docs/recettes/21-balance.md
// Source : duo-v2-iridescent-iter3.jsx › BalanceEmbossed (DNA) + brief (Mochi qui penche,
// chart 7 jours, streak, malus en cours). Onglet : pas de retour, tab bar par le layout.
import React, { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, Micro, Divider } from '../../src/components/ui';
import { LiveMochi, CountUp } from '../../src/components/motion';
import { SplitBar, DarkPill, InfoRow } from '../../src/components/balance/extra';
import { members, me, partner, streak, taskById, fmtMin } from '../../src/demo';
import { shares, balanceState, weekInfo, nextReview, malusItems, dayMinutes } from '../../src/demo-balance';
import { weekDays, missionDone, occStore } from '../../src/demo-core';
import { read } from '../../src/store';
import { loadSetup, setup, inRealMode } from '../../src/setup-state';
import { getUid, useIdentity } from '../../src/identity';
import { localIso } from '../../src/dates';
import { weekMalus, sweepMissed } from '../../src/malus-actions';
import { computeRealBalance } from '../../src/balance-real';
import copy from '../../src/data/copy.json';
import { colors, space, radius, font, slotColors } from '../../src/theme';

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const deep = m => slotColors[m.slot]?.deep ?? colors.ink;

export default function Balance() {
  const t = copy.balance;
  useIdentity();
  const occV = occStore.useVersion();
  missionDone.useVersion();
  const [real, setReal] = useState(null);
  const [planned, setPlanned] = useState(null); // { me, partner, both } minutes prévues cette semaine
  const [realMalusItems, setRealMalusItems] = useState([]);
  useEffect(() => {
    (async () => {
      await loadSetup();
      // Réel dès qu'on a un foyer, même vide (retour test à deux, 3 sept 2026)
      if (!inRealMode()) return;
      await sweepMissed().catch(() => {}); // les échues deviennent missed + malus
      const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]);
      setReal(computeRealBalance(occs, getUid())); // gère aussi zéro occurrence
      // prévu cette semaine (lun → dim), par personne : toutes les occurrences à faire ou faites
      const byTask = Object.fromEntries(tasks.map(tk => [tk.id, tk]));
      const d0 = new Date(); const mon = new Date(d0); mon.setDate(d0.getDate() - ((d0.getDay() + 6) % 7)); const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
      const from = localIso(mon), to = localIso(sun); const uid = getUid();
      const pl = { me: 0, partner: 0, both: 0 };
      for (const o of occs) {
        if (o.status === 'skipped' || o.due_date < from || o.due_date > to) continue;
        const min = o.duration_min || byTask[o.task_id]?.duration_min || 15;
        if (!o.assignee_id) pl.both += min; else if (o.assignee_id === uid) pl.me += min; else pl.partner += min;
      }
      setPlanned(pl);
      setRealMalusItems(await weekMalus().catch(() => []));
    })();
  }, [occV]);

  const demoParts = useMemo(shares, []);
  const demoState = useMemo(balanceState, []);
  const parts = real?.parts || demoParts;
  const { state, top, lean } = real ? { state: real.state, top: real.top, lean: real.lean } : demoState;
  const week = real?.week || weekInfo();
  const review = nextReview(real ? new Date() : undefined); // réel : le vrai prochain dimanche (la démo a une date figée)
  const chartDays = real?.days || dayMinutes;
  // malus réels de la semaine (écrits par sweepMissed / postponeMalus), démo sinon
  const realMalus = real
    ? realMalusItems.filter(m => m.occurrence_id).map(m => ({ id: m.id, emoji: m.task_emoji, title: m.task_title || '…', sub: fill(t.missedSub, { who: m.user_id === getUid() ? t.missedMe : partner.first_name, n: m.due_date ? Math.max(1, Math.round((new Date(localIso()) - new Date(m.due_date)) / 86400000)) : 1 }), points: m.points, real: true }))
    : malusItems;
  // même phrase que l'Accueil (Jeanne, 15 sept 2026 : « on ne me dit pas la même chose »)
  const h = copy.home;
  const stateLabel = state === 'balanced' ? h.mochiBalanced
    : fill(state === 'leaning' ? (top === me ? h.mochiLeaningMe : h.mochiLeaningOther) : (top === me ? h.mochiUnbalancedMe : h.mochiUnbalancedOther), { name: top.first_name });

  // README flow : déséquilibre > 25 % → écran détail (une fois, au montage de l'onglet)
  useEffect(() => { if (!real && state === 'unbalanced') router.push('/balance-detail'); }, []);

  const openDetail = () => router.push('/balance-detail');
  const left = streak.next.at - streak.days;

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Retour Jeanne (1er sept 2026) : titre aligné sur les autres onglets
              (même ligne de base que Planning/Budget), pastille semaine à sa droite */}
          <View style={s.header}>
            <Text style={s.title}>{t.title}</Text>
            <PillLabel color={colors.sky}>{fill(t.weekPill, { n: week.num, range: week.range })}</PillLabel>
          </View>

          {/* Mochi qui penche vers celui qui porte plus */}
          <Pressable onPress={openDetail} style={s.mochiWrap}>
            <LiveMochi size={72} mood={state === 'unbalanced' ? 'sad' : state === 'leaning' ? 'neutral' : 'happy'} lean={lean} />
            <Text style={s.stateLabel}>{stateLabel}</Text>
          </Pressable>

          {/* héros : temps de chacun + barre scindée */}
          <Pressable onPress={openDetail} style={({ pressed }) => [s.block, { opacity: pressed ? 0.9 : 1 }]}>
            <Card r={radius.cardLg} padding={18}>
              <View style={s.heroRow}>
                {parts.map((p, i) => {
                  const align = i === 0 ? 'left' : i === parts.length - 1 ? 'right' : 'center';
                  return (
                    <View key={p.member.id} style={{ flex: 1 }}>
                      <Text style={[s.heroName, { color: deep(p.member), textAlign: align }]}>{p.member.first_name}</Text>
                      <CountUp value={p.minutes} format={v => fmtMin(Math.round(v))} style={[s.heroNum, { textAlign: align }]} />
                      <Text style={[s.heroSub, { textAlign: align }]}>{p.tasks === 1 ? fill(t.heroTasksOne, { pct: p.pct }) : fill(t.heroTasks, { pct: p.pct, n: p.tasks })}</Text>
                    </View>
                  );
                })}
              </View>
              <SplitBar height={8} parts={parts.map(p => ({ ratio: p.pct / 100, color: p.member.color }))} />
              {real && parts.every(p => !p.minutes) ? <Text style={s.plannedTxt}>{t.emptyWeek}</Text> : null}
              {real && planned ? <Text style={s.plannedTxt}>{fill(t.plannedWeek, { total: fmtMin(planned.me + planned.partner + planned.both), me: fmtMin(planned.me + Math.round(planned.both / 2)), partner: fmtMin(planned.partner + Math.round(planned.both / 2)), name: partner.first_name })}</Text> : null}
              <Text style={s.seeDetail}>{t.seeDetail}</Text>
            </Card>
          </Pressable>

          {/* chart 7 jours : une barre scindée animée par jour */}
          <View style={s.block}>
            <View style={s.chartHead}>
              <Micro>{t.chartTitle}</Micro>
              <Text style={s.chartUnit}>{t.chartUnit}</Text>
            </View>
            <Card padding={14}>
              {chartDays.map((d, i) => {
                const total = members.reduce((a, m) => a + (d.by[m.id] || 0), 0);
                return (
                  <View key={i} style={[s.dayRow, i > 0 && { marginTop: 8 }]}>
                    <Text style={s.dayLabel}>{d.d}</Text>
                    <SplitBar height={6} delay={i * 40} style={{ flex: 1 }}
                      parts={members.map(m => ({ ratio: total ? (d.by[m.id] || 0) / total : 0, color: m.color }))} />
                  </View>
                );
              })}
            </Card>
          </View>

          {/* streak */}
          <View style={s.block}>
            <Card padding={14}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                <Text style={{ fontSize: 24 }}>🔥</Text>
                <View style={{ flex: 1 }}>
                  <Micro>{t.streakTitle}</Micro>
                  <CountUp value={real ? real.streakDays : streak.days} format={v => (Math.round(v) === 1 ? t.streakDaysOne : fill(t.streakDays, { n: Math.round(v) }))} style={s.streakNum} />
                  {real ? null : <Text style={s.streakNext}>{fill(left === 1 ? t.streakNextOne : t.streakNextMany, { left, badge: streak.next.label })}</Text>}
                </View>
                {real ? null : <Text style={s.record}>{fill(t.streakRecord, { n: streak.record })}</Text>}
              </View>
            </Card>
          </View>

          {/* malus en cours → point hebdo */}
          <View style={s.block}>
            <Card padding={14}>
              <Micro style={{ marginBottom: 10 }}>{real ? t.missedTitle : t.malusTitle}</Micro>
              {realMalus.length === 0 ? <Text style={font.secondary}>{real ? t.missedNone : t.malusNone}</Text> : realMalus.map((m, i) => {
                const task = m.real ? null : taskById(m.task_id);
                const emoji = m.real ? m.emoji : task?.emoji;
                const title = m.real ? m.title : task?.title;
                const sub = m.real ? m.sub : fill(copy.malus.times, { n: m.times, i: m.importance });
                return (
                  <View key={m.id}>
                    {i > 0 && <Divider />}
                    <View style={{ paddingTop: i > 0 ? 10 : 0, paddingBottom: 10 }}>
                      <InfoRow emoji={emoji} title={title} sub={sub} right={m.real ? null : <DarkPill>{fill(t.malusPts, { n: m.points })}</DarkPill>} />
                    </View>
                  </View>
                );
              })}
              <Pressable onPress={() => router.push('/analyse')} hitSlop={6}>
                <Text style={[s.weeklyLink, { color: colors.lavenderDeep }]}>{t.analyseLink}</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/point-hebdo')} hitSlop={6}>
                <Text style={s.weeklyLink}>{fill(t.weeklyLink, { day: review.label })}</Text>
              </Pressable>
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { paddingBottom: 24 },
  header: { paddingTop: 14, paddingHorizontal: space.headerX, marginBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 22, fontWeight: '600', letterSpacing: -1.2, lineHeight: 22, color: colors.ink },
  mochiWrap: { alignItems: 'center', gap: 8, marginBottom: 14 },
  stateLabel: { fontSize: 13, fontWeight: '500', color: colors.muted },
  block: { paddingHorizontal: space.screenX, marginBottom: 12 },
  heroRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 13, marginBottom: 11 },
  heroName: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  plannedTxt: { ...font.caption, textAlign: 'center', marginTop: 10 },
  heroNum: { fontSize: 32, fontWeight: '600', letterSpacing: -1.4, lineHeight: 32, color: colors.ink, fontVariant: ['tabular-nums'] },
  heroSub: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 4, fontVariant: ['tabular-nums'] },
  seeDetail: { marginTop: 10, fontSize: 12.5, fontWeight: '500', color: colors.muted, textAlign: 'right' },
  chartHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 4, paddingBottom: 8 },
  chartUnit: { fontSize: 11.5, fontWeight: '500', color: colors.muted },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dayLabel: { width: 14, fontSize: 11.5, fontWeight: '600', color: colors.muted, textAlign: 'center' },
  streakNum: { fontSize: 20, fontWeight: '600', letterSpacing: -0.6, color: colors.ink, marginTop: 2, fontVariant: ['tabular-nums'] },
  streakNext: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 3 },
  record: { fontSize: 12, fontWeight: '500', color: colors.muted, fontVariant: ['tabular-nums'] },
  weeklyLink: { marginTop: 4, fontSize: 13, fontWeight: '600', color: colors.coralDeep, textAlign: 'right' },
});
