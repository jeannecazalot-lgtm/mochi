// Écran 22 · Balance détail. Recette : docs/recettes/22-balance-detail.md
// Source : duo-embossed-pings-balance-malus.jsx › BalanceDetailEmbossed. Écran poussé (retour).
import React, { useMemo, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GlowBg, Card, PillLabel, Micro, Avatar } from '../src/components/ui';
import { CountUp } from '../src/components/motion';
import { ScreenHeader, SplitBar, VBar, OffsetCard, InfoRow, NoteBox } from '../src/components/balance/extra';
import { members, byId, taskById, fmtMin, me } from '../src/demo';
import { shares, balanceState, dayMinutes, contributors } from '../src/demo-balance';
import { read } from '../src/store';
import { loadSetup, inRealMode } from '../src/setup-state';
import { getUid, loadIdentity, useIdentity } from '../src/identity';
import { computeRealBalance, realContributors } from '../src/balance-real';
import copy from '../src/data/copy.json';
import { colors, space, radius, gradients, shadows, slotColors } from '../src/theme';

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const deep = m => slotColors[m.slot]?.deep ?? colors.ink;
const PILL = { balanced: { key: 'detailPillBalanced', color: colors.sageDeep }, leaning: { key: 'detailPillLeaning', color: colors.coral }, unbalanced: { key: 'detailPillUnbalanced', color: colors.coral } };

export default function BalanceDetail() {
  const t = copy.balance;
  // Réel (5 sept 2026, audit QA) : mêmes calculs que l'onglet Balance ; « ce qui pèse » =
  // les 3 tâches où l'écart de minutes faites est le plus grand
  useIdentity();
  const [real, setReal] = useState(null);
  useEffect(() => {
    (async () => {
      await loadSetup();
      if (!inRealMode()) return;
      await loadIdentity();
      const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]);
      const uid = getUid();
      setReal({ bal: computeRealBalance(occs, uid), contribs: realContributors(occs, tasks, uid) });
    })();
  }, []);
  const demoParts = useMemo(shares, []);
  const demoState = useMemo(balanceState, []);
  const parts = real ? real.bal.parts : demoParts;
  const { state, gap, top } = real ? { state: real.bal.state, gap: real.bal.gap, top: real.bal.top } : demoState;
  const days = real ? real.bal.days : dayMinutes;
  const maxMin = Math.max(1, ...days.flatMap(d => members.map(m => d.by[m.id] || 0)));
  const weighs = real
    ? real.contribs.map(c => ({ id: c.task_id, kind: 'task', emoji: c.task.emoji || '•', title: c.task.title, member_id: c.who.id, delta_min: c.delta_min, accent: 'coral', sub: fill(t.contribRealSub, { a: c.who.id === me.id ? c.mine : c.other, b: c.who.id === me.id ? c.other : c.mine }) }))
    : contributors;

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeader title={t.detailHeader} onBack={() => router.back()} />
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* état + titre */}
          <View style={s.head}>
            <View style={{ marginBottom: 6 }}><PillLabel color={PILL[state].color}>{fill(t[PILL[state].key], { n: gap })}</PillLabel></View>
            <Text style={s.title}>{state === 'balanced' ? t.detailTitleEven : fill(t.detailTitleMore, { name: top.first_name })}</Text>
          </View>

          {/* héros comparatif */}
          <View style={[s.block, { paddingTop: 17 }]}>
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
              <SplitBar height={10} style={s.barRing} parts={parts.map(p => ({ ratio: p.pct / 100, color: p.member.color }))} />
              {state !== 'balanced' && <NoteBox emoji="⚠️" lead={t.forecastLead} strong={t.forecastStrong} />}
            </Card>
          </View>

          {/* chart 7 jours : barres verticales par membre, en min/jour */}
          <View style={[s.block, { paddingBottom: 10 }]}>
            <View style={s.chartHead}>
              <Micro>{t.chartTitle}</Micro>
              <Text style={s.chartUnit}>{t.chartUnit}</Text>
            </View>
            <Card padding={14}>
              <View style={s.chart}>
                {days.map((d, i) => (
                  <View key={i} style={s.chartCol}>
                    <View style={s.chartBars}>
                      {members.map(m => <VBar key={m.id} ratio={(d.by[m.id] || 0) / maxMin} color={m.color} delay={i * 40} />)}
                    </View>
                    <Text style={s.dayLabel}>{d.d}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>

          {/* ce qui pèse */}
          <Micro style={s.section}>{t.weighsTitle}</Micro>
          <View style={s.block}>
            {real && weighs.length === 0 ? <Text style={s.weighsNone}>{t.weighsNone}</Text> : null}
            {weighs.map(c => {
              const who = byId(c.member_id);
              const title = c.title ?? (c.kind === 'mental' ? t.contribMental : (taskById(c.task_ids[0])?.title || ''));
              const sub = c.sub ?? (c.kind === 'mental'
                ? fill(t.contribMentalSub, { examples: c.examples.join(', ') })
                : fill(t.contribCyclesSub, { a: c.cycles[who.id] ?? 0, b: Math.max(...members.filter(m => m.id !== who.id).map(m => c.cycles[m.id] ?? 0)) }));
              return (
                <OffsetCard key={c.id} accent={colors[c.accent]} padding={0}>
                  <View style={{ paddingVertical: 9, paddingHorizontal: 13 }}>
                    <InfoRow emoji={c.emoji} title={title} sub={sub} right={(
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                        <Text style={s.delta}>{fill(t.contribDelta, { n: c.delta_min })}</Text>
                        <Avatar initial={who.initial} color={who.color} photo={who.avatar_url} size={24} />
                      </View>
                    )} />
                  </View>
                </OffsetCard>
              );
            })}
          </View>
        </ScrollView>

        {/* CTA bas : rééquilibrage par Mochi → proposition de dispatch (12) */}
        <View style={s.ctaWrap}>
          <Pressable onPress={() => router.push('/(setup)/dispatch')} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
            <LinearGradient {...gradients.mochi} style={[s.cta, shadows.cta]}>
              <Text style={{ fontSize: 18 }}>✨</Text>
              <Text style={s.ctaText}>{t.rebalanceCta}</Text>
              <Text style={{ fontSize: 18, color: colors.ink }}>›</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { paddingBottom: 110 },
  head: { paddingTop: 14, paddingHorizontal: space.headerX },
  title: { fontSize: 22, fontWeight: '600', letterSpacing: -1, lineHeight: 22, color: colors.ink },
  block: { paddingHorizontal: space.screenX, marginBottom: 11 },
  heroRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginBottom: 14 },
  heroName: { fontSize: 11.5, fontWeight: '600', letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6 },
  heroNum: { fontSize: 22, fontWeight: '600', letterSpacing: -1.2, lineHeight: 22, color: colors.ink, fontVariant: ['tabular-nums'] },
  heroSub: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 4, fontVariant: ['tabular-nums'] },
  barRing: { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  chartHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 4, paddingBottom: 8 },
  chartUnit: { fontSize: 11.5, fontWeight: '500', color: colors.muted },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 90 },
  chartCol: { flex: 1, alignItems: 'center', gap: 5 },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 70 },
  dayLabel: { fontSize: 11.5, fontWeight: '600', color: colors.muted },
  section: { paddingHorizontal: space.headerX, paddingTop: 8, paddingBottom: 8 },
  delta: { fontSize: 13, fontWeight: '600', color: colors.coralDeep, fontVariant: ['tabular-nums'] },
  weighsNone: { fontSize: 13.5, fontWeight: '400', color: colors.muted, paddingHorizontal: 4, paddingBottom: 8 },
  ctaWrap: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 26 },
  cta: { borderRadius: radius.row, paddingVertical: 14, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 10 },
  ctaText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.ink },
});
