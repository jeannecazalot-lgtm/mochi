// Proto statique · Sheet Tâche v2 (5 sept 2026) — à valider par Jeanne sur captures.
// Recette : docs/recettes/17c-sheet-tache-v2.md. Une seule sheet, deux étages.
// URL : /proto-mission?v=a|b&s=home|expense|notime|rule|done|moved|swap
//   v=a : « C'est fait » en rangée cochable · v=b : « C'est fait » en CTA dégradé.
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Micro, Avatar, CTAPrimary } from '../src/components/ui';
import { SheetHandle } from '../src/components/social/extra';
import { Row, Stepper, PillChip, RuleGroup, ConfirmBlock, DoneCircle, Arrow, Caption } from '../src/components/task/proto';
import { taskById, fmtMin } from '../src/demo';
import copy from '../src/data/copy.json';
import { colors, space, font, slotColors } from '../src/theme';

// personnes fixes du proto (le vrai couple, indépendant du foyer courant du simulateur)
const me = { initial: 'J', first_name: 'Jeanne', color: slotColors[1].main };
const partner = { initial: 'K', first_name: 'Ketley', color: slotColors[2].main };

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const FREQS = ['daily', 'twiceWeek', 'weekly', 'monthly', 'once'];

export default function ProtoMission() {
  const { v = 'a', s = 'home' } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const t = copy.missionV2;
  const task = taskById('t-lessive');
  const [mins, setMins] = useState(task.duration_min);
  const [est, setEst] = useState(task.duration_min);
  const expense = s === 'expense' || s === 'done' ? '12,40 €' : null;
  const asking = s === 'notime';
  const ruleOpen = s === 'rule';
  const time = fmtMin(mins);
  const close = () => router.back();

  const head = (
    <View style={st.head}>
      <Text style={st.title}>{task.title}</Text>
      <View style={st.meta}>
        <Avatar initial={me.initial} color={me.color} size={18} />
        <Text style={st.metaTxt}>{t.metaYou} · {t.metaToday} · {fill(t.metaApprox, { time: fmtMin(est) })}</Text>
      </View>
    </View>
  );

  // ─── confirmations : remplacent tout le contenu ───────────────────
  if (s === 'done' || s === 'moved' || s === 'swap') {
    const props = s === 'done'
      ? { kind: 'done', title: t.confirmDone, sub: fill(t.confirmDoneSub, { time, amount: expense }) }
      : s === 'moved'
        ? { kind: 'moved', title: fill(t.confirmMoved, { day: 'jeudi' }), sub: fill(t.confirmMovedSub, { name: partner.first_name }) }
        : { kind: 'swap', who: partner, title: fill(t.confirmSwap, { name: partner.first_name }), sub: t.confirmSwapSub, pill: t.confirmSwapPill };
    return (
      <View style={[st.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]}>
        <SheetHandle />
        {head}
        <ConfirmBlock {...props} />
      </View>
    );
  }

  const stepper = <Stepper value={time} onMinus={() => setMins(m => Math.max(5, m - 5))} onPlus={() => setMins(m => m + 5)} />;
  const expenseChip = <PillChip label={expense || t.expenseAdd} selected={!!expense} onPress={() => {}} />;

  return (
    <View style={[st.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]}>
      <SheetHandle />
      {head}

      {/* ─── étage « ce moment-ci » ─── */}
      <Card r={16} padding={0} style={st.block}>
        <Row first label={t.timeLabel} right={stepper} />
        <Row label={t.expenseLabel} right={expenseChip} />
        {v === 'a' ? (
          <Row strong label={t.doneLabel} sub={fill(t.doneSub, { time })} left={<DoneCircle />} right={<Arrow />} onPress={close} />
        ) : null}
        {!asking ? (
          <Row strong label={t.noTimeLabel} sub={fill(t.noTimeSub, { name: partner.first_name })} right={<Arrow />} onPress={() => {}} />
        ) : (
          <View>
            <View style={st.moveBox}>
              <Micro>{t.moveLabel}</Micro>
              <View style={st.days}>
                {['dim', 'lun', 'mar', 'mer', 'jeu', 'ven'].map((d, i) => <PillChip key={d} flex label={d} selected={i === 4} onPress={() => {}} />)}
              </View>
              <Caption style={{ textAlign: 'left' }}>{fill(t.moveWarn, { name: partner.first_name })}</Caption>
            </View>
            <Row strong label={fill(t.swapLabel, { name: partner.first_name })} sub={t.swapSub} left={<Avatar initial={partner.initial} color={partner.color} size={22} />} right={<Arrow />} onPress={() => {}} />
          </View>
        )}
      </Card>
      {v === 'b' ? <CTAPrimary big label={fill(t.doneCta, { time })} onPress={close} style={st.cta} /> : null}

      {/* ─── étage « la règle » ─── */}
      <Card r={16} padding={0}>
        {!ruleOpen ? (
          <Row first label={t.ruleLabel} sub={fill(t.ruleSummary, { freq: t.freq[task.frequency], days: 'lun, jeu', who: t.whoAuto })} right={<Arrow />} onPress={() => {}} />
        ) : (
          <View>
            <RuleGroup first label={t.ruleFreq}>
              {FREQS.map(f => <PillChip key={f} label={t.freq[f]} selected={f === task.frequency} onPress={() => {}} />)}
            </RuleGroup>
            <RuleGroup label={t.ruleDays} row>
              {t.days.map((d, i) => <PillChip key={i} flex label={d} selected={i === 0 || i === 3} onPress={() => {}} />)}
            </RuleGroup>
            <RuleGroup label={t.ruleWho}>
              <PillChip label={t.whoMe} avatar={me} onPress={() => {}} />
              <PillChip label={partner.first_name} avatar={partner} onPress={() => {}} />
              <PillChip label={t.whoAlt} onPress={() => {}} />
              <PillChip label={t.whoAuto} selected onPress={() => {}} />
            </RuleGroup>
            <Row label={t.ruleDuration} right={<Stepper value={fmtMin(est)} onMinus={() => setEst(m => Math.max(5, m - 5))} onPlus={() => setEst(m => m + 5)} />} />
            <Row label={t.ruleNote} sub={t.noteSample} right={<Arrow />} onPress={() => {}} />
          </View>
        )}
      </Card>
    </View>
  );
}

const st = StyleSheet.create({
  sheet: { backgroundColor: colors.card, paddingTop: 10, paddingHorizontal: space.screenX },
  head: { marginTop: 2, marginBottom: 12, paddingHorizontal: 2, gap: 4 },
  title: { ...font.cardTitle },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaTxt: { fontSize: 13, fontWeight: '400', color: colors.muted },
  block: { marginBottom: 8 },
  cta: { marginBottom: 8 },
  moveBox: { paddingVertical: 12, paddingHorizontal: 14, gap: 9, borderTopWidth: 1, borderTopColor: colors.line },
  days: { flexDirection: 'row', gap: 6 },
});
