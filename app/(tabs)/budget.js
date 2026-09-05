// Écran 23 · Budget. Recette : docs/recettes/23-budget.md
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, ScreenTitle, Secondary, Card, PillLabel, Micro, GlassRow, Avatar } from '../../src/components/ui';
import { CountUp } from '../../src/components/motion';
import { PillButton, BadgePill, Hint } from '../../src/components/core/extra';
import { PremiumGate } from '../../src/components/premium/extra';
import { isPremium } from '../../src/demo-premium';
import { me, partner, byId, taskById, expenses, budget, fmtMoney, today } from '../../src/demo';
import { monthLong, daysBetween, fmtDayLower, sortedByDate, occStore } from '../../src/demo-core';
import { read, pull } from '../../src/store';
import { loadSetup, setup, inRealMode } from '../../src/setup-state';
import { getUid, loadIdentity, useIdentity } from '../../src/identity';
import copy from '../../src/data/copy.json';
import { colors, space, font } from '../../src/theme';

const t = copy.budget;
const fill = (s, vars) => Object.keys(vars).reduce((acc, k) => acc.replace(`{${k}}`, vars[k]), s);

// « Jeanne te doit {amount} » avec le montant en CountUp, ou « Vous êtes à zéro »
function Solde({ owes = budget.owes }) {
  const { who, to, cents } = owes;
  if (!cents) return <Text style={s.hero}>{t.settled}</Text>;
  const iAmOwed = to === me.id;
  const tpl = fill(iAmOwed ? t.owes : t.youOwe, { name: byId(iAmOwed ? who : to).first_name });
  const [before, after] = tpl.split('{amount}');
  return <Text style={s.hero}>{before}<CountUp value={cents} format={c => fmtMoney(c)} style={s.hero} />{after}</Text>;
}

function relDay(d, now = today) {
  const n = daysBetween(d, now);
  return n === 0 ? t.today : n === 1 ? t.yesterday : fmtDayLower(d);
}
function desc(e, now) {
  const payer = e.paid_by === me.id ? t.you : byId(e.paid_by).first_name;
  const viaTitle = e._viaTitle ?? (e.via_task ? taskById(e.via_task).title : null);
  return viaTitle
    ? `${relDay(e.spent_on, now)} · ${fill(t.viaTaskDesc, { task: viaTitle.split(' ')[0] })} · ${payer}`
    : `${relDay(e.spent_on, now)} · ${fill(t.paidBy, { name: payer })}`;
}

// Budget RÉEL (5 sept 2026, « mets-le gratuit pour le moment ») : dépenses du foyer
// (table expenses), partage à parts égales → solde du mois. La saisie (écran 30b)
// reste à brancher ; en attendant, un état vide honnête plutôt que la démo.
async function loadRealBudget() {
  await loadSetup();
  if (!inRealMode()) return null;
  await loadIdentity();
  const uid = getUid();
  const hid = setup.householdId;
  const [rows, occs, tasks] = await Promise.all([hid ? pull('expenses', hid) : read('expenses'), read('occurrences'), read('tasks')]);
  const byOcc = Object.fromEntries(occs.map(o => [o.id, o]));
  const byTask = Object.fromEntries(tasks.map(tk => [tk.id, tk]));
  const now = new Date();
  const list = rows.filter(e => !e.deleted_at).map(e => ({
    id: e.id, title: e.title, emoji: e.emoji || '•', amount_cents: e.amount_cents,
    paid_by: e.paid_by === uid ? me.id : partner.id,
    spent_on: new Date(`${e.spent_on}T12:00:00`),
    via_task: null, _viaTitle: e.occurrence_id ? (byTask[byOcc[e.occurrence_id]?.task_id]?.title || null) : null,
  }));
  const month = list.filter(e => e.spent_on.getMonth() === now.getMonth() && e.spent_on.getFullYear() === now.getFullYear());
  const paidMe = month.filter(e => e.paid_by === me.id).reduce((a, e) => a + e.amount_cents, 0);
  const paidP = month.filter(e => e.paid_by === partner.id).reduce((a, e) => a + e.amount_cents, 0);
  const diff = Math.round((paidMe - paidP) / 2); // parts égales : l'autre me doit la moitié de l'écart
  const owes = diff === 0 ? { cents: 0 } : diff > 0 ? { who: partner.id, to: me.id, cents: diff } : { who: me.id, to: partner.id, cents: -diff };
  return { list, total_cents: month.reduce((a, e) => a + e.amount_cents, 0), owes, now };
}

export default function Budget() {
  // Décision Jeanne (1er sept 2026) : le Budget est une fonctionnalité Duo+ —
  // sans abonnement, l'onglet montre sa promesse verrouillée + l'accès au paywall (37).
  // 5 sept 2026 : « mets-le gratuit pour le moment » — verrou désactivé le temps
  // du test, à réactiver (BUDGET_FREE = false) quand RevenueCat sera branché.
  const BUDGET_FREE = true;
  useIdentity();
  const occV = occStore.useVersion();
  const [real, setReal] = useState(null);
  useEffect(() => { loadRealBudget().then(r => { if (r) setReal(r); }).catch(() => {}); }, [occV]);
  const rows = real ? sortedByDate(real.list) : sortedByDate(expenses);
  const now = real ? real.now : today;
  if (!BUDGET_FREE && !isPremium()) {
    return (
      <View style={{ flex: 1 }}>
        <GlowBg intensity="strong" />
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <View style={s.header}>
            <ScreenTitle style={{ letterSpacing: -1.1 }}>{t.title}</ScreenTitle>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: space.headerX, paddingBottom: 90 }}>
            <View style={{ alignItems: 'center', marginBottom: 18 }}>
              <Text style={{ fontSize: 44 }}>🔒</Text>
            </View>
            <PremiumGate title={t.gateTitle} sub={t.gateSub} cta={t.gateCta} />
          </View>
        </SafeAreaView>
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
          <View style={s.header}>
            <ScreenTitle style={{ letterSpacing: -1.1 }}>{t.title}</ScreenTitle>
            <Secondary style={{ marginTop: 4 }}>{fill(t.subtitle, { month: monthLong(now) })}</Secondary>
          </View>

          <View style={{ paddingHorizontal: 22, marginBottom: 11 }}>
            <Card r={20} style={{ paddingVertical: 18, paddingHorizontal: 20 }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ marginBottom: 9 }}><PillLabel color={colors.lavender}>{t.balancePill}</PillLabel></View>
                <Solde owes={real ? real.owes : budget.owes} />
                <Secondary style={{ marginTop: 6 }}>{fill(t.spent, { amount: fmtMoney(real ? real.total_cents : budget.total_cents) })}</Secondary>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                <PillButton dark label={t.settleBtn} onPress={() => {}} />
                <PillButton label={t.remindBtn} onPress={() => {}} />
              </View>
            </Card>
          </View>

          <Micro style={{ paddingHorizontal: 22, paddingBottom: 8 }}>{t.recent}</Micro>
          <View style={{ paddingHorizontal: space.screenX }}>
            {real && rows.length === 0 ? <Text style={[font.secondary, { textAlign: 'center', paddingVertical: 18 }]}>{t.emptyReal}</Text> : null}
            {rows.map(e => {
              const payer = byId(e.paid_by);
              return (
                <GlassRow key={e.id} style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 19 }}>{e.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ fontSize: 15.5, fontWeight: '500', color: colors.ink }} numberOfLines={1}>{e.title}</Text>
                      {e.via_task || e._viaTitle ? <BadgePill color={colors.sageDeep} tint={colors.sage} a={0.25} size={9.5}>{t.viaTask}</BadgePill> : null}
                    </View>
                    <Text style={[font.caption, { marginTop: 3 }]}>{desc(e, now)}</Text>
                  </View>
                  <Text style={[font.tabular, { fontSize: 15, fontWeight: '600', color: colors.ink }]}>{fmtMoney(e.amount_cents)}</Text>
                  <Avatar initial={payer.initial} color={payer.color} size={24} />
                </GlassRow>
              );
            })}
            {real && rows.length === 0 ? null : <Hint size={12} style={{ marginTop: 4 }}>{t.hint}</Hint>}
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
