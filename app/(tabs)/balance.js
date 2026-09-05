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
import copy from '../../src/data/copy.json';
import { colors, space, radius, font, slotColors } from '../../src/theme';

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const deep = m => slotColors[m.slot]?.deep ?? colors.ink;

// numéro de semaine ISO
const isoWeek = d => {
  const x = new Date(d); x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() + 3 - ((x.getDay() + 6) % 7));
  const w1 = new Date(x.getFullYear(), 0, 4);
  return 1 + Math.round(((x - w1) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7);
};

// ─── Balance RÉELLE (SPECS §3) sur les occurrences cochées : score =
// durée réelle × (1 + pénibilité × 0,15), tâches mentales ×1,5. ───
function computeRealBalance(occs, uid) {
  const dones = occs.filter(o => o.status === 'done');
  const score = o => (o.duration_min || 0) * (1 + (o.pain ?? 3) * 0.15) * (o.mental_load ? 1.5 : 1);
  const mine = dones.filter(o => o.done_by === uid);
  const other = dones.filter(o => o.done_by && o.done_by !== uid);
  const sMe = mine.reduce((a, o) => a + score(o), 0);
  const sP = other.reduce((a, o) => a + score(o), 0);
  const tot = sMe + sP || 1;
  const gap = Math.abs(sMe - sP) / tot;
  const state = gap < 0.10 ? 'balanced' : gap <= 0.25 ? 'leaning' : 'unbalanced';
  const parts = [
    { member: me, minutes: mine.reduce((a, o) => a + (o.duration_min || 0), 0), pct: Math.round((sMe / tot) * 100), tasks: mine.length },
    { member: partner, minutes: other.reduce((a, o) => a + (o.duration_min || 0), 0), pct: Math.round((sP / tot) * 100), tasks: other.length },
  ];
  // chart : 7 jours de la semaine courante, minutes faites par membre
  const dows = copy.calendar.dows;
  const days = weekDays(new Date()).map(d => {
    const iso = localIso(d);
    const by = { [me.id]: 0, [partner.id]: 0 };
    dones.filter(o => o.due_date === iso).forEach(o => { by[o.done_by === uid ? me.id : partner.id] += o.duration_min || 0; });
    return { d: dows[(d.getDay() + 6) % 7], by };
  });
  // streak réel : jours consécutifs (en remontant depuis hier/aujourd'hui) où tout le dû est fait
  let streakDays = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const iso = localIso(d);
    const due = occs.filter(o => o.due_date === iso);
    if (!due.length) { if (i === 0) continue; break; }
    if (due.every(o => o.status === 'done')) streakDays++;
    else { if (i === 0) continue; break; } // aujourd'hui pas fini ≠ streak cassé
  }
  const wk = weekDays(new Date());
  const week = { num: isoWeek(new Date()), range: `${wk[0].getDate()} au ${wk[6].getDate()}` };
  return { parts, state, top: sMe >= sP ? me : partner, lean: Math.max(-1, Math.min(1, (sMe - sP) / tot)), days, streakDays, week };
}

export default function Balance() {
  const t = copy.balance;
  useIdentity();
  const occV = occStore.useVersion();
  missionDone.useVersion();
  const [real, setReal] = useState(null);
  const [realMalusItems, setRealMalusItems] = useState([]);
  useEffect(() => {
    (async () => {
      await loadSetup();
      // Réel dès qu'on a un foyer, même vide (retour test à deux, 3 sept 2026)
      if (!inRealMode()) return;
      await sweepMissed().catch(() => {}); // les échues deviennent missed + malus
      const occs = await read('occurrences');
      setReal(computeRealBalance(occs, getUid())); // gère aussi zéro occurrence
      setRealMalusItems(await weekMalus().catch(() => []));
    })();
  }, [occV]);

  const demoParts = useMemo(shares, []);
  const demoState = useMemo(balanceState, []);
  const parts = real?.parts || demoParts;
  const { state, top, lean } = real ? { state: real.state, top: real.top, lean: real.lean } : demoState;
  const week = real?.week || weekInfo();
  const review = nextReview();
  const chartDays = real?.days || dayMinutes;
  // malus réels de la semaine (écrits par sweepMissed / postponeMalus), démo sinon
  const realMalus = real
    ? realMalusItems.map(m => ({ id: m.id, emoji: m.task_emoji, title: m.task_title || t.malusPostponed, sub: fill(t.malusReal, { n: m.points }), points: m.points, real: true }))
    : malusItems;
  const stateLabel = fill(t[state], { name: top.first_name });

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
            <LiveMochi size={72} mood={state === 'unbalanced' ? 'neutral' : 'happy'} lean={lean} />
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
                      <Text style={[s.heroSub, { textAlign: align }]}>{fill(t.heroTasks, { pct: p.pct, n: p.tasks })}</Text>
                    </View>
                  );
                })}
              </View>
              <SplitBar height={8} parts={parts.map(p => ({ ratio: p.pct / 100, color: p.member.color }))} />
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
                  <CountUp value={real ? real.streakDays : streak.days} format={v => fill(t.streakDays, { n: Math.round(v) })} style={s.streakNum} />
                  {real ? null : <Text style={s.streakNext}>{fill(left === 1 ? t.streakNextOne : t.streakNextMany, { left, badge: streak.next.label })}</Text>}
                </View>
                {real ? null : <Text style={s.record}>{fill(t.streakRecord, { n: streak.record })}</Text>}
              </View>
            </Card>
          </View>

          {/* malus en cours → point hebdo */}
          <View style={s.block}>
            <Card padding={14}>
              <Micro style={{ marginBottom: 10 }}>{t.malusTitle}</Micro>
              {realMalus.length === 0 ? <Text style={font.secondary}>{t.malusNone}</Text> : realMalus.map((m, i) => {
                const task = m.real ? null : taskById(m.task_id);
                const emoji = m.real ? m.emoji : task?.emoji;
                const title = m.real ? m.title : task?.title;
                const sub = m.real ? m.sub : fill(copy.malus.times, { n: m.times, i: m.importance });
                return (
                  <View key={m.id}>
                    {i > 0 && <Divider />}
                    <View style={{ paddingTop: i > 0 ? 10 : 0, paddingBottom: 10 }}>
                      <InfoRow emoji={emoji} title={title} sub={sub} right={<DarkPill>{fill(t.malusPts, { n: m.points })}</DarkPill>} />
                    </View>
                  </View>
                );
              })}
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
