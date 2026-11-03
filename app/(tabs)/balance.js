// Écran 21 · Balance — v3 « l'instrument » (4 nov 2026). Logique v1 conservée (balance réelle de la semaine,
// prévu, ratées) ; les points et le point hebdo disparaissent, une ratée coûte un cœur à Mochi (recette §1, §6).
import React, { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CountUp } from '../../src/components/motion';
import { Label, Num, Hair } from '../../src/components/mochi/gauges';
import { useTokens, type, layout } from '../../src/theme-v3';
import { frameFor, MOCHI_RATIO } from '../../src/components/mochi-img';
import { members, me, partner, taskById, fmtMin } from '../../src/demo';
import { shares, balanceState, weekInfo, malusItems, dayMinutes } from '../../src/demo-balance';
import { missionDone, occStore } from '../../src/demo-core';
import { read } from '../../src/store';
import { loadSetup, setup, inRealMode } from '../../src/setup-state';
import { getUid, useIdentity } from '../../src/identity';
import { localIso } from '../../src/dates';
import { weekMalus, sweepMissed } from '../../src/malus-actions';
import { computeRealBalance } from '../../src/balance-real';
import { mochiStore, getMochi, STAGES, STAGE_AT } from '../../src/mochi-state';
import copy from '../../src/data/copy.json';
import { slotColors } from '../../src/theme';

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const deep = m => slotColors[m.slot]?.deep ?? '#2B2420';
const DEMO_MOCHI = { stage: 'mini', hearts: 4, healthy_weeks: 2 };

function Split({ T, parts, height = 8 }) {
  return <View style={{ height, borderRadius: height / 2, backgroundColor: T.seg, overflow: 'hidden', flexDirection: 'row' }}>{parts.map((p, i) => <View key={i} style={{ width: `${Math.max(0, Math.min(1, p.ratio)) * 100}%`, backgroundColor: p.color }} />)}</View>;
}

export default function Balance() {
  const t = copy.balanceV3, h = copy.home;
  const T = useTokens();
  useIdentity();
  const occV = occStore.useVersion(); const mochiV = mochiStore.useVersion();
  missionDone.useVersion();
  const [real, setReal] = useState(null);
  const [planned, setPlanned] = useState(null);
  const [missed, setMissed] = useState([]);
  const [mochi, setMochi] = useState(null);
  useEffect(() => {
    (async () => {
      await loadSetup();
      if (!inRealMode()) { setMochi(DEMO_MOCHI); return; }
      await sweepMissed().catch(() => {});
      const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]);
      setReal(computeRealBalance(occs, getUid()));
      const byTask = Object.fromEntries(tasks.map(tk => [tk.id, tk]));
      const d0 = new Date(); const mon = new Date(d0); mon.setDate(d0.getDate() - ((d0.getDay() + 6) % 7)); const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
      const from = localIso(mon), to = localIso(sun); const uid = getUid();
      const pl = { me: 0, partner: 0, both: 0 };
      for (const o of occs) { if (o.status === 'skipped' || o.due_date < from || o.due_date > to) continue; const min = o.duration_min || byTask[o.task_id]?.duration_min || 15; if (!o.assignee_id) pl.both += min; else if (o.assignee_id === uid) pl.me += min; else pl.partner += min; }
      setPlanned(pl);
      setMissed(await weekMalus().catch(() => []));
      setMochi(await getMochi());
    })();
  }, [occV, mochiV]);

  const demoParts = useMemo(shares, []); const demoState = useMemo(balanceState, []);
  const parts = real?.parts || demoParts;
  const { state, top, lean } = real ? { state: real.state, top: real.top, lean: real.lean } : demoState;
  const week = real?.week || weekInfo();
  const chartDays = real?.days || dayMinutes;
  const m = mochi || DEMO_MOCHI;
  const stateLabel = state === 'balanced' ? h.mochiBalanced : fill(state === 'leaning' ? (top === me ? h.mochiLeaningMe : h.mochiLeaningOther) : (top === me ? h.mochiUnbalancedMe : h.mochiUnbalancedOther), { name: top.first_name });
  const mood = state === 'unbalanced' ? 'sad' : state === 'leaning' ? 'neutral' : undefined;
  const k = Math.max(0, STAGES.indexOf(m.stage)); const hw = m.healthy_weeks || 0;
  const nextAt = m.stage === 'mini' ? STAGE_AT.mochi : m.stage === 'mochi' ? STAGE_AT.maxi : m.stage === 'maxi' ? STAGE_AT.dore : null;
  const growLine = m.stage === 'egg' ? t.growEgg : nextAt ? fill(t.growNext, { n: hw, left: Math.max(1, nextAt - hw) }) : t.growMax;
  const missedRows = real
    ? missed.filter(x => x.occurrence_id).map(x => ({ id: x.id, emoji: x.task_emoji, title: x.task_title || '…', sub: fill(t.missedSub, { who: x.user_id === getUid() ? t.missedMe : partner.first_name, n: x.due_date ? Math.max(1, Math.round((new Date(localIso()) - new Date(x.due_date)) / 86400000)) : 1 }) }))
    : malusItems.map(x => { const task = taskById(x.task_id); return { id: x.id, emoji: task?.emoji, title: task?.title, sub: fill(t.missedSub, { who: t.missedMe, n: x.times || 1 }) }; });
  const X = layout.x, A = layout.air;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingTop: 14, paddingHorizontal: X, flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[type.name, { color: T.ink, flex: 1 }]}>{t.title}</Text>
            <Label T={T}>{fill(t.week, { n: week.num, range: week.range })}</Label>
          </View>

          {/* Mochi penche vers qui porte plus */}
          <Pressable onPress={() => router.push('/balance-detail')} style={{ paddingHorizontal: X, paddingTop: 18 * A, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Image source={frameFor(lean, mood)} style={{ width: 64, height: 64 * MOCHI_RATIO, transform: [{ rotate: `${(lean || 0) * 8}deg` }] }} resizeMode="contain" />
            <Text style={[type.sub, { color: T.ink, flex: 1 }]}>{stateLabel}</Text>
          </Pressable>

          {/* croissance : 5 paliers, pas de nom pour l'instant */}
          <View style={{ marginHorizontal: X, marginTop: 22 * A, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingTop: 16 * A }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}><Text style={[type.section, { color: T.ink }]}>{t.growTitle}</Text><Label T={T}>{m.stage === 'egg' ? copy.homeV3.eggPill : `palier ${k}`}</Label></View>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}>{STAGES.map((st, i) => <View key={st} style={{ flex: 1, height: 14, borderRadius: 2, backgroundColor: i <= k ? T.ink : T.seg }} />)}</View>
            <Text style={[type.sub, { color: T.muted, marginTop: 10 }]}>{growLine}</Text>
          </View>

          {/* héros : temps de chacun */}
          <Pressable onPress={() => router.push('/balance-detail')} style={{ marginHorizontal: X, marginTop: 18 * A, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingTop: 16 * A }}>
            <View style={{ flexDirection: 'row', gap: 13, marginBottom: 12 }}>
              {parts.map((p, i) => { const align = i === 0 ? 'left' : i === parts.length - 1 ? 'right' : 'center'; return (
                <View key={p.member.id} style={{ flex: 1 }}>
                  <Text style={[type.label, { color: deep(p.member), fontWeight: '600', textAlign: align }]}>{p.member.first_name}</Text>
                  <CountUp value={p.minutes} format={v => fmtMin(Math.round(v))} style={{ fontSize: 30, fontWeight: '600', letterSpacing: -1.2, color: T.ink, fontVariant: ['tabular-nums'], textAlign: align, marginTop: 2 }} />
                  <Label T={T} style={{ textAlign: align, marginTop: 2 }}>{p.tasks === 1 ? fill(t.heroTasksOne, { pct: p.pct }) : fill(t.heroTasks, { pct: p.pct, n: p.tasks })}</Label>
                </View>); })}
            </View>
            <Split T={T} parts={parts.map(p => ({ ratio: p.pct / 100, color: p.member.color }))} />
            {real && parts.every(p => !p.minutes) ? <Label T={T} style={{ marginTop: 10 }}>{t.empty}</Label> : null}
            {real && planned ? <Label T={T} style={{ marginTop: 10 }}>{fill(copy.balance.plannedWeek, { total: fmtMin(planned.me + planned.partner + planned.both), me: fmtMin(planned.me + Math.round(planned.both / 2)), partner: fmtMin(planned.partner + Math.round(planned.both / 2)), name: partner.first_name })}</Label> : null}
            <Label T={T} style={{ marginTop: 10, textAlign: 'right', color: T.ink }}>{t.detail}</Label>
          </Pressable>

          {/* 7 jours */}
          <View style={{ marginHorizontal: X, marginTop: 18 * A, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingTop: 16 * A }}>
            <Text style={[type.section, { color: T.ink }]}>{t.chartTitle}</Text>
            <View style={{ marginTop: 12, gap: 8 }}>
              {chartDays.map((d, i) => { const total = members.reduce((a, mm) => a + (d.by[mm.id] || 0), 0); return (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Label T={T} style={{ width: 16, textAlign: 'center' }}>{d.d}</Label>
                  <View style={{ flex: 1 }}><Split T={T} height={6} parts={members.map(mm => ({ ratio: total ? (d.by[mm.id] || 0) / total : 0, color: mm.color }))} /></View>
                </View>); })}
            </View>
          </View>

          {/* ratées = cœurs perdus */}
          <View style={{ marginHorizontal: X, marginTop: 18 * A, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingTop: 16 * A }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}><Text style={[type.section, { color: T.ink }]}>{t.missedTitle}</Text>{missedRows.length ? <Label T={T}>{`− ${missedRows.length} ${missedRows.length > 1 ? 'cœurs' : 'cœur'}`}</Label> : null}</View>
            {missedRows.length === 0 ? <Text style={[type.sub, { color: T.muted, marginTop: 8 }]}>{t.missedNone}</Text> : missedRows.map((r, i) => (
              <View key={r.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 * A, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: T.line, marginTop: i ? 0 : 4 }}>
                <Text style={{ fontSize: 16 }}>{r.emoji}</Text>
                <View style={{ flex: 1, minWidth: 0 }}><Text style={[type.body, { color: T.ink }]} numberOfLines={1}>{r.title}</Text><Label T={T} style={{ marginTop: 2 }}>{r.sub}</Label></View>
                <Label T={T} style={{ color: T.accent }}>{t.heartCost}</Label>
              </View>))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
