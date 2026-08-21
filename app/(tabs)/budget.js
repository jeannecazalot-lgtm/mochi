// Écran 23 · Budget. Recette : docs/recettes/23-budget.md
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, ScreenTitle, Secondary, Card, PillLabel, Micro, GlassRow, Avatar } from '../../src/components/ui';
import { CountUp } from '../../src/components/motion';
import { PillButton, BadgePill, Hint } from '../../src/components/core/extra';
import { me, byId, taskById, expenses, budget, fmtMoney, today } from '../../src/demo';
import { monthLong, daysBetween, fmtDayLower, sortedByDate } from '../../src/demo-core';
import copy from '../../src/data/copy.json';
import { colors, space, font } from '../../src/theme';

const t = copy.budget;
const fill = (s, vars) => Object.keys(vars).reduce((acc, k) => acc.replace(`{${k}}`, vars[k]), s);

// « Jeanne te doit {amount} » avec le montant en CountUp, ou « Vous êtes à zéro »
function Solde() {
  const { who, to, cents } = budget.owes;
  if (!cents) return <Text style={s.hero}>{t.settled}</Text>;
  const iAmOwed = to === me.id;
  const tpl = fill(iAmOwed ? t.owes : t.youOwe, { name: byId(iAmOwed ? who : to).first_name });
  const [before, after] = tpl.split('{amount}');
  return <Text style={s.hero}>{before}<CountUp value={cents} format={c => fmtMoney(c)} style={s.hero} />{after}</Text>;
}

function relDay(d) {
  const n = daysBetween(d, today);
  return n === 0 ? t.today : n === 1 ? t.yesterday : fmtDayLower(d);
}
function desc(e) {
  const payer = e.paid_by === me.id ? t.you : byId(e.paid_by).first_name;
  return e.via_task
    ? `${relDay(e.spent_on)} · ${fill(t.viaTaskDesc, { task: taskById(e.via_task).title.split(' ')[0] })} · ${payer}`
    : `${relDay(e.spent_on)} · ${fill(t.paidBy, { name: payer })}`;
}

export default function Budget() {
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
          <View style={s.header}>
            <ScreenTitle style={{ letterSpacing: -1.1 }}>{t.title}</ScreenTitle>
            <Secondary style={{ marginTop: 4 }}>{fill(t.subtitle, { month: monthLong(today) })}</Secondary>
          </View>

          <View style={{ paddingHorizontal: 22, marginBottom: 11 }}>
            <Card r={20} style={{ paddingVertical: 18, paddingHorizontal: 20 }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ marginBottom: 9 }}><PillLabel color={colors.lavender}>{t.balancePill}</PillLabel></View>
                <Solde />
                <Secondary style={{ marginTop: 6 }}>{fill(t.spent, { amount: fmtMoney(budget.total_cents) })}</Secondary>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                <PillButton dark label={t.settleBtn} onPress={() => {}} />
                <PillButton label={t.remindBtn} onPress={() => {}} />
              </View>
            </Card>
          </View>

          <Micro style={{ paddingHorizontal: 22, paddingBottom: 8 }}>{t.recent}</Micro>
          <View style={{ paddingHorizontal: space.screenX }}>
            {sortedByDate(expenses).map(e => {
              const payer = byId(e.paid_by);
              return (
                <GlassRow key={e.id} style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 19 }}>{e.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ fontSize: 15.5, fontWeight: '500', color: colors.ink }} numberOfLines={1}>{e.title}</Text>
                      {e.via_task ? <BadgePill color={colors.sageDeep} tint={colors.sage} a={0.25} size={9.5}>{t.viaTask}</BadgePill> : null}
                    </View>
                    <Text style={[font.caption, { marginTop: 3 }]}>{desc(e)}</Text>
                  </View>
                  <Text style={[font.tabular, { fontSize: 15, fontWeight: '600', color: colors.ink }]}>{fmtMoney(e.amount_cents)}</Text>
                  <Avatar initial={payer.initial} color={payer.color} size={24} />
                </GlassRow>
              );
            })}
            <Hint size={12} style={{ marginTop: 4 }}>{t.hint}</Hint>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 14, paddingHorizontal: space.headerX, marginBottom: 11 },
  hero: { ...font.hero, textAlign: 'center', lineHeight: 28 },
});
