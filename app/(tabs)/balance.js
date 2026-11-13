// Écran 21 · Balance — v3 « l'instrument » (4 nov 2026). Logique v1 conservée (balance réelle de la semaine,
// prévu, ratées) ; les points et le point hebdo disparaissent, une ratée coûte un cœur à Mochi (recette §1, §6).
import { RouteError } from '../../src/components/route-error';
import React, { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CountUp } from '../../src/components/motion';
import { Label, Num, Hair } from '../../src/components/mochi/gauges';
import { useTokens, type, layout } from '../../src/theme-v3';
import { MochiImage } from '../../src/components/mochi-img';
import { members, me, partner, taskById, fmtMin } from '../../src/demo';
import { shares, balanceState, weekInfo, malusItems, dayMinutes } from '../../src/demo-balance';
import { missionDone, occStore, weekDays } from '../../src/demo-core';
import { read } from '../../src/store';
import { loadSetup, setup, inRealMode } from '../../src/setup-state';
import { getUid, getPartnerUid, useIdentity } from '../../src/identity';
import { localIso } from '../../src/dates';
import { weekMalus, sweepMissed } from '../../src/malus-actions';
import { computeRealBalance, realContributors } from '../../src/balance-real';
import { suggestRebalance, rebalanceWeek, handTask } from '../../src/rebalance';
import * as Haptics from 'expo-haptics';
import { mochiStore, getMochi, STAGES, STAGE_AT } from '../../src/mochi-state';
import copy from '../../src/copy';
import { isEN } from '../../src/lang';
import { slotColors } from '../../src/theme';
import { TaskIcon } from '../../src/components/task-icon';

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
  const [retain, setRetain] = useState(null);
  const [suggest, setSuggest] = useState(null); // { n, to } : ce que « Rééquilibrer » ferait
  const [contribs, setContribs] = useState([]); // ce qui pèse (réel)
  const [msg, setMsg] = useState(null); const [given, setGiven] = useState({}); // ressenti vs réel : { pct, moods: { iso: 1|2|3 } }
  useEffect(() => {
    (async () => {
      await loadSetup();
      if (!inRealMode()) { setMochi(DEMO_MOCHI); const wk = weekDays(new Date()).map(localIso); setRetain({ pct: 80, moods: { [wk[0]]: 1, [wk[1]]: 2, [wk[2]]: 3, [wk[3]]: 2, [wk[4]]: 1 } }); return; }
      await sweepMissed().catch(() => {});
      const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]);
      setReal(computeRealBalance(occs, getUid()));
      setContribs(realContributors(occs, tasks, getUid()));
      suggestRebalance().then(setSuggest).catch(() => {});
      const byTask = Object.fromEntries(tasks.map(tk => [tk.id, tk]));
      const d0 = new Date(); const mon = new Date(d0); mon.setDate(d0.getDate() - ((d0.getDay() + 6) % 7)); const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
      const from = localIso(mon), to = localIso(sun); const uid = getUid();
      const pl = { me: 0, partner: 0, both: 0 };
      for (const o of occs) { if (o.status === 'skipped' || o.due_date < from || o.due_date > to) continue; const min = o.duration_min || byTask[o.task_id]?.duration_min || 15; if (!o.assignee_id) pl.both += min; else if (o.assignee_id === uid) pl.me += min; else pl.partner += min; }
      setPlanned(pl);
      setMissed(await weekMalus().catch(() => []));
      // ce que Mochi en retient : mes missions dues cette semaine (jusqu'à aujourd'hui) faites, et mon ressenti par jour
      const today = localIso();
      const mineDue = occs.filter(o => o.status !== 'skipped' && o.due_date >= from && o.due_date <= Math.min(to, today) && (!o.assignee_id || o.assignee_id === uid));
      const cks = await read('mochi_checkins').catch(() => []);
      const moods = {};
      for (const c of cks) { if (c.user_id !== uid || c.day < from || c.day > to) continue; if (c.moment === 'morning' || !moods[c.day]) moods[c.day] = c.mood; }
      setRetain({ pct: mineDue.length ? Math.round((mineDue.filter(o => o.status === 'done').length / mineDue.length) * 100) : null, moods });
      setMochi(await getMochi());
    })();
  }, [occV, mochiV]);

  const demoParts = useMemo(shares, []); const demoState = useMemo(balanceState, []);
  const parts = real?.parts || demoParts;
  const { state, top, lean } = real ? { state: real.state, top: real.top, lean: real.lean } : demoState;
  const week = real?.week || weekInfo();
  const chartDays = real?.days || dayMinutes;
  // semaine n° depuis que vous êtes deux (éclosion de Mochi) — plus le numéro ISO de l'année
  const monday = d => { const x = new Date(d); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
  const weekN = real && mochi?.hatched_at ? Math.max(1, Math.round((monday(new Date()) - monday(new Date(mochi.hatched_at))) / (7 * 86400e3)) + 1) : !real ? week.num : null;
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
  const weekIsos = useMemo(() => weekDays(new Date()).map(localIso), []);
  const moodColor = v => (v === 1 ? T.accent : v === 3 ? T.ok : v === 2 ? T.muted : T.seg);
  const heavyDays = weekIsos.filter(iso => retain?.moods?.[iso] === 1).length;
  const retainLine = retain && retain.pct != null ? fill(copy.checkin.retain, { pct: retain.pct, days: copy.checkin.days[heavyDays] }) : null;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingTop: 14, paddingHorizontal: X, flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[type.name, { color: T.ink, flex: 1 }]}>{t.title}</Text>
            <Label T={T}>{weekN ? fill(t.week, { n: weekN, range: week.range }) : week.range}</Label>
          </View>

          {real && !getPartnerUid() ? (
            <View style={{ paddingHorizontal: X, paddingTop: 18 * A }}><Text style={[type.sub, { color: T.muted }]}>{t.solo}</Text><Pressable onPress={() => router.push('/(setup)/invite?from=home')} style={{ marginTop: 12, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: T.ink }}><Text style={[type.body, { color: T.bg }]}>{copy.homeV3.soloCta}</Text></Pressable></View>
          ) : (<>
          {/* 1 · QUI EN FAIT LE PLUS : Mochi penche vers qui porte plus, puis le temps de chacun */}
          <Pressable onPress={() => router.push('/chambre')} style={{ paddingHorizontal: X, paddingTop: 18 * A, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <MochiImage size={64} lean={lean} mood={mood} />
            <Text style={[type.sub, { color: T.ink, flex: 1 }]}>{stateLabel}</Text>
          </Pressable>

          {/* héros : temps de chacun */}
          <View style={{ marginHorizontal: X, marginTop: 18 * A, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingTop: 16 * A }}>
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
            
          </View>

          {/* 2 · POURQUOI (Jeanne, 13 nov 2026 : « qui en fait le plus · pourquoi · comment rééquilibrer ») */}
          {(real && contribs.length) || planned ? (
            <View style={{ marginHorizontal: X, marginTop: 18 * A, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingTop: 16 * A }}>
              <Text style={[type.section, { color: T.ink }]}>{t.whyTitle}</Text>
              {real && contribs.length ? <Label T={T} style={{ marginTop: 4 }}>{t.weighsTitle}</Label> : null}
              {real && contribs.map((cb, i) => (
                <View key={cb.task_id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: T.line, marginTop: i ? 0 : 4 }}>
                  <TaskIcon emoji={cb.task.emoji} size={21} />
                  <View style={{ flex: 1, minWidth: 0 }}><Text style={[type.body, { color: T.ink }]} numberOfLines={1}>{cb.task.title}</Text><Label T={T} style={{ marginTop: 2 }}>{fill(t.weighsRowNamed, { mine: cb.mine, other: cb.other, name: partner.first_name })}</Label></View>
                </View>
              ))}
              {planned ? (() => { const pm = planned.me + planned.both / 2, pp = planned.partner + planned.both / 2, pt = pm + pp || 1; const dm = parts[0].pct, plannedPct = Math.round(pm / pt * 100); const planFair = Math.abs(plannedPct - 50) < 10, doneLeans = state !== 'balanced'; return (
                <View style={{ marginTop: 14 }}>
                  <Label T={T}>{t.planTitle}</Label>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 }}><Label T={T} style={{ width: 62 }} numberOfLines={1}>{t.planned}</Label><View style={{ flex: 1 }}><Split T={T} height={8} parts={[{ ratio: pm / pt, color: me.color }, { ratio: pp / pt, color: partner.color }]} /></View><Num T={T} style={{ width: 44, textAlign: 'right' }}>{plannedPct}{isEN ? '%' : ' %'}</Num></View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 }}><Label T={T} style={{ width: 62 }} numberOfLines={1}>{t.done}</Label><View style={{ flex: 1 }}><Split T={T} height={8} parts={parts.map(p => ({ ratio: p.pct / 100, color: p.member.color }))} /></View><Num T={T} style={{ width: 44, textAlign: 'right' }}>{dm}{isEN ? '%' : ' %'}</Num></View>
                  {planFair && doneLeans ? <Text style={[type.sub, { color: T.muted, marginTop: 10 }]}>{t.planHint}</Text> : null}
                </View>
              ); })() : null}
            </View>
          ) : null}

          {/* 3 · COMMENT RÉÉQUILIBRER : un geste global, ou tâche par tâche */}
          {real ? (
            <View style={{ marginHorizontal: X, marginTop: 18 * A, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingTop: 16 * A }}>
              <Text style={[type.section, { color: T.ink }]}>{t.howTitle}</Text>
              {state === 'balanced' ? <Text style={[type.sub, { color: T.muted, marginTop: 8 }]}>{t.howBalanced}</Text> : (
                <View style={{ marginTop: 12 }}>
                  {msg ? <Text style={[type.sub, { color: T.ink }]}>{msg}</Text> : suggest?.n ? <>
                    <Pressable onPress={async () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}); const r = await rebalanceWeek(); setMsg(r.ok ? fill(t.rebalanced, { n: r.n, name: partner.first_name }) : t.rebalanceNone); }} style={({ pressed }) => [{ alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: T.ink, opacity: pressed ? 0.8 : 1 }]}><Text style={[type.body, { color: T.bg }]}>{t.rebalance}</Text></Pressable>
                    <Label T={T} style={{ marginTop: 8 }}>{fill(t.rebalanceSub, { n: suggest.n, name: suggest.to === getUid() ? me.first_name : partner.first_name })}</Label>
                  </> : <Label T={T}>{t.rebalanceNone}</Label>}
                  {contribs.filter(cb => cb.who === me).map((cb, i) => (
                    <View key={cb.task_id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, marginTop: i ? 0 : 14 }}>
                      <Text style={[type.body, { color: T.ink, flex: 1 }]} numberOfLines={1}>{fill(t.giveRow, { task: cb.task.title.toLowerCase(), name: partner.first_name })}</Text>
                      {given[cb.task_id] ? <Label T={T}>{fill(t.given, { name: partner.first_name })}</Label> : <Pressable onPress={async () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); const r = await handTask(cb.task_id); if (r.ok) setGiven(g => ({ ...g, [cb.task_id]: true })); }} style={({ pressed }) => [{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1.5, borderColor: T.ink, opacity: pressed ? 0.7 : 1 }]}><Text style={[type.label, { color: T.ink, fontWeight: '600' }]}>{t.giveBtn}</Text></Pressable>}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : null}

          {/* le détail, en dessous */}
          {/* 7 jours */}
          <View style={{ marginHorizontal: X, marginTop: 18 * A, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingTop: 16 * A }}>
            <Text style={[type.section, { color: T.ink }]}>{t.chartTitle}</Text>
            <View style={{ marginTop: 12, gap: 8 }}>
              {chartDays.map((d, i) => { const total = members.reduce((a, mm) => a + (d.by[mm.id] || 0), 0); return (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Label T={T} style={{ width: 16, textAlign: 'center' }}>{d.d}</Label>
                  <View style={{ flex: 1 }}><Split T={T} height={6} parts={members.map(mm => ({ ratio: total ? (d.by[mm.id] || 0) / total : 0, color: mm.color }))} /></View>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: moodColor(retain?.moods?.[weekIsos[i]]) }} />
                </View>); })}
            </View>
            <Label T={T} style={{ marginTop: 10 }}>{t.moodLegend}</Label>
          </View>
          {/* ressenti vs réel : ce que Mochi en retient (décision 3 nov 2026, retiré de la sheet check-in) */}
          <View style={{ marginHorizontal: X, marginTop: 18 * A, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingTop: 16 * A }}>
            <Text style={[type.section, { color: T.ink }]}>{copy.checkin.retainTitle}</Text>
            {retainLine ? (
              <View style={{ flexDirection: 'row', gap: 13, marginTop: 12 }}>
                <View style={{ flex: 1 }}><Label T={T}>{copy.checkin.done}</Label><CountUp value={retain.pct} format={v => `${Math.round(v)}${isEN ? '%' : ' %'}`} style={{ fontSize: 30, fontWeight: '600', letterSpacing: -1.2, color: T.ink, fontVariant: ['tabular-nums'], marginTop: 2 }} /></View>
                <View style={{ flex: 1 }}><Label T={T}>{copy.checkin.felt}</Label><Text style={{ fontSize: 30, fontWeight: '600', letterSpacing: -1.2, color: heavyDays ? T.accent : T.ink, fontVariant: ['tabular-nums'], marginTop: 2 }}>{copy.checkin.days[heavyDays]}</Text></View>
              </View>
            ) : null}
            <Text style={[type.sub, { color: T.muted, marginTop: 10 }]}>{retainLine || copy.checkin.subNone.replace('{name}', partner.first_name)}</Text>
          </View>
          {/* croissance : 5 paliers, pas de nom pour l'instant — rien tant que c'est un œuf */}
          {m.stage === 'egg' ? null : <View style={{ marginHorizontal: X, marginTop: 22 * A, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingTop: 16 * A }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}><Text style={[type.section, { color: T.ink }]}>{t.growTitle}</Text><Label T={T}>{m.stage === 'egg' ? copy.homeV3.eggPill : (isEN ? `stage ${k}` : `palier ${k}`)}</Label></View>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}>{STAGES.map((st, i) => <View key={st} style={{ flex: 1, height: 14, borderRadius: 2, backgroundColor: i <= k ? T.ink : T.seg }} />)}</View>
            <Text style={[type.sub, { color: T.muted, marginTop: 10 }]}>{growLine}</Text>
          </View>}
          </>)}

          {/* ratées = cœurs perdus */}
          <View style={{ marginHorizontal: X, marginTop: 18 * A, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingTop: 16 * A }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}><Text style={[type.section, { color: T.ink }]}>{t.missedTitle}</Text>{missedRows.length ? <Label T={T}>{`− ${missedRows.length} ${missedRows.length > 1 ? 'cœurs' : 'cœur'}`}</Label> : null}</View>
            {missedRows.length === 0 ? <Text style={[type.sub, { color: T.muted, marginTop: 8 }]}>{t.missedNone}</Text> : missedRows.map((r, i) => (
              <View key={r.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 * A, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: T.line, marginTop: i ? 0 : 4 }}>
                <TaskIcon emoji={r.emoji} size={21} />
                <View style={{ flex: 1, minWidth: 0 }}><Text style={[type.body, { color: T.ink }]} numberOfLines={1}>{r.title}</Text><Label T={T} style={{ marginTop: 2 }}>{r.sub}</Label></View>
                <Label T={T} style={{ color: T.accent }}>{t.heartCost}</Label>
              </View>))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// expo-router : une erreur de rendu affiche ce filet au lieu d'un écran vide
export function ErrorBoundary(props) { return <RouteError {...props} />; }
