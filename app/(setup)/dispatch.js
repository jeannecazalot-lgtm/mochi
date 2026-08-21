// Écran 12 · Proposition de dispatch. Recette : docs/recettes/12-dispatch.md
import React from 'react';
import { router } from 'expo-router';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, Avatar } from '../../src/components/ui';
import { StepTitle, BottomCTA, fill } from '../../src/components/setup/extra';
import { me, partner, byId, fmtMin } from '../../src/demo';
import { dispatch, dispatchEmoji, weeklyLoad, balanceState } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space, alpha } from '../../src/theme';

const t = copy.setup;
const next = () => router.push('/(setup)/reattribuer');

export default function Dispatch() {
  const load = weeklyLoad();
  const state = balanceState(load);
  const tot = load[me.id] + load[partner.id] || 1;
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <StepTitle title={t.dispatchTitle} sub={t.dispatchSub} />

        <View style={{ paddingHorizontal: space.headerX, paddingTop: 18 }}>
          <Card padding={0} r={20} accent={colors.sage} style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 17, paddingHorizontal: 18 }}>
              <View style={{ flex: 1 }}>
                <Text style={s.state}>{t[state]}</Text>
                <Text style={s.loads}>
                  <Text style={s.strong}>{fmtMin(load[me.id])}</Text> {me.first_name} · <Text style={s.strong}>{fmtMin(load[partner.id])}</Text> {partner.first_name} {t.perWeek}
                </Text>
              </View>
              <View style={s.bar}>
                <View style={{ flex: load[me.id] / tot, backgroundColor: me.color }} />
                <View style={{ flex: load[partner.id] / tot, backgroundColor: partner.color }} />
              </View>
            </View>
          </Card>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: space.screenX, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {dispatch.map(it => {
            const who = it.assignee_id ? byId(it.assignee_id) : null;
            const tag = it.tagN ? fill(t[it.tag], { n: it.tagN }) : t[it.tag];
            return (
              <Card key={it.task_id} padding={0} r={12} style={{ marginBottom: 6 }}>
                <View style={s.row}>
                  <Text style={{ fontSize: 19 }}>{dispatchEmoji(it)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.title}>{it.label}</Text>
                    <Text style={s.meta}>{tag} · {it.mins}min</Text>
                  </View>
                  {who ? <Avatar initial={who.initial} color={who.color} size={26} /> : (
                    <View style={{ flexDirection: 'row' }}>
                      <Avatar initial={me.initial} color={me.color} size={26} ring />
                      <View style={{ marginLeft: -8 }}><Avatar initial={partner.initial} color={partner.color} size={26} ring /></View>
                    </View>
                  )}
                </View>
              </Card>
            );
          })}
        </ScrollView>

        <BottomCTA primary={t.go} onPrimary={next} secondary={t.edit} onSecondary={next} />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  state: { fontSize: 21, fontWeight: '600', letterSpacing: -0.6, lineHeight: 21, color: colors.ink },
  loads: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 6 },
  strong: { color: colors.ink, fontWeight: '600', fontVariant: ['tabular-nums'] },
  bar: { height: 8, width: 80, borderRadius: 4, overflow: 'hidden', flexDirection: 'row', backgroundColor: alpha(colors.ink, 0.10) },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 14 },
  title: { fontSize: 16, fontWeight: '500', color: colors.ink },
  meta: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 3, fontVariant: ['tabular-nums'] },
});
