// Écran 21 · Onglet Balance. Recette : docs/recettes/21-balance.md
// Source : duo-v2-iridescent-iter3.jsx › BalanceEmbossed (DNA) + brief (Mochi qui penche,
// chart 7 jours, streak, malus en cours). Onglet : pas de retour, tab bar par le layout.
import React, { useEffect, useMemo } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, Micro, Divider } from '../../src/components/ui';
import { LiveMochi, CountUp } from '../../src/components/motion';
import { SplitBar, DarkPill, InfoRow } from '../../src/components/balance/extra';
import { members, streak, taskById, fmtMin } from '../../src/demo';
import { shares, balanceState, weekInfo, nextReview, malusItems, dayMinutes } from '../../src/demo-balance';
import copy from '../../src/data/copy.json';
import { colors, space, radius, font, slotColors } from '../../src/theme';

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const deep = m => slotColors[m.slot]?.deep ?? colors.ink;

export default function Balance() {
  const t = copy.balance;
  const parts = useMemo(shares, []);
  const { state, top, lean } = useMemo(balanceState, []);
  const week = weekInfo();
  const review = nextReview();
  const stateLabel = fill(t[state], { name: top.first_name });

  // README flow : déséquilibre > 25 % → écran détail (une fois, au montage de l'onglet)
  useEffect(() => { if (state === 'unbalanced') router.push('/balance-detail'); }, []);

  const openDetail = () => router.push('/balance-detail');
  const left = streak.next.at - streak.days;

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* en-tête : pastille semaine + titre */}
          <View style={s.header}>
            <View style={{ marginBottom: 6 }}><PillLabel color={colors.sky}>{fill(t.weekPill, { n: week.num, range: week.range })}</PillLabel></View>
            <Text style={s.title}>{t.title}</Text>
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
              {dayMinutes.map((d, i) => {
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
                  <CountUp value={streak.days} format={v => fill(t.streakDays, { n: Math.round(v) })} style={s.streakNum} />
                  <Text style={s.streakNext}>{fill(left === 1 ? t.streakNextOne : t.streakNextMany, { left, badge: streak.next.label })}</Text>
                </View>
                <Text style={s.record}>{fill(t.streakRecord, { n: streak.record })}</Text>
              </View>
            </Card>
          </View>

          {/* malus en cours → point hebdo */}
          <View style={s.block}>
            <Card padding={14}>
              <Micro style={{ marginBottom: 10 }}>{t.malusTitle}</Micro>
              {malusItems.length === 0 ? <Text style={font.secondary}>{t.malusNone}</Text> : malusItems.map((m, i) => {
                const task = taskById(m.task_id);
                return (
                  <View key={m.id}>
                    {i > 0 && <Divider />}
                    <View style={{ paddingTop: i > 0 ? 10 : 0, paddingBottom: 10 }}>
                      <InfoRow emoji={task?.emoji} title={task?.title} sub={fill(copy.malus.times, { n: m.times, i: m.importance })} right={<DarkPill>{fill(t.malusPts, { n: m.points })}</DarkPill>} />
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
  header: { paddingTop: 14, paddingHorizontal: space.headerX, marginBottom: 14 },
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
