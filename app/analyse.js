// Écran 36 · Analyse charge mentale (Duo+). Recette : docs/recettes/36-analyse.md
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, GlassRow } from '../src/components/ui';
import { CountUp, ProgressBar } from '../src/components/motion';
import { BackButton, PremiumGate, SectionMicro } from '../src/components/premium/extra';
import { me, partner, byId } from '../src/demo';
import { mentalLoad as demoMental, heavier, isPremium } from '../src/demo-premium';
import { computeMentalLoad } from '../src/moments-real';
import { read } from '../src/store';
import { loadSetup, inRealMode } from '../src/setup-state';
import { getUid, loadIdentity, useIdentity } from '../src/identity';
import { saveRule, deadlineOf } from '../src/mission-data';
import { occStore } from '../src/demo-core';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, alpha, slotColors } from '../src/theme';

const t = copy.analyse;
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const deep = m => slotColors[m.slot].deep;
const pct = v => `${Math.round(v)}%`;

export default function Analyse() {
  const [applied, setApplied] = useState(false);
  useIdentity();
  // réel (14 sept 2026) : 4 dernières semaines sur les vraies occurrences ; démo sans foyer
  const [real, setReal] = useState(null);
  const occV = occStore.useVersion();
  useEffect(() => { (async () => { await loadSetup(); if (!inRealMode()) return; await loadIdentity(); const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]); setReal(computeMentalLoad(occs, tasks, getUid())); })(); }, [occV]);
  const shareMe = real ? real.shareMe : demoMental.share[me.id], sharePartner = real ? real.sharePartner : demoMental.share[partner.id];
  const heavy = real ? real.heavy : heavier();
  const title = real?.empty ? t.titleEmpty : shareMe === sharePartner ? t.titleBalanced : fill(t.title, { name: heavy.first_name });
  const categories = real ? real.categories.map(c => ({ ...c, carrier_id: c.carrier === 'me' ? me.id : partner.id })) : demoMental.categories;
  const sug = real ? real.suggestion : demoMental.suggestion;
  const sugCat = real ? (sug ? { title: sug.task.title } : null) : demoMental.categories.find(c => c.id === sug.category_id);
  const sugTo = real ? (sug ? (sug.to === 'me' ? me : partner) : null) : byId(sug.to_id);
  const sugAfter = real ? (sug ? { me: sug.after.me, partner: sug.after.partner } : null) : { me: pct(sug.after[me.id]).replace('%', ''), partner: pct(sug.after[partner.id]).replace('%', '') };
  // Appliquer : la tâche passe à l'autre (règle fixée), l'autre est prévenu
  const apply = async () => {
    setApplied(true);
    if (!real || !sug) return;
    const tk = sug.task;
    await saveRule(tk.id, { window_days: tk.window_days || [], duration_min: tk.duration_min || 15, note: tk.note || '', deadline: deadlineOf(tk), who: sug.to }).catch(() => {});
  };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={s.header}>
            <BackButton label={copy.common.back} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
                <PillLabel color={colors.lavender}>{t.pill}</PillLabel>
              </View>
              <Text style={s.title}>{title}</Text>
            </View>
          </View>


          <View style={{ paddingHorizontal: 22, marginBottom: 11 }}>
            <Card padding={0} r={18} style={{ paddingVertical: 17, paddingHorizontal: 18 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 }}>
                <CountUp value={shareMe} format={v => fill(t.share, { name: me.first_name, n: Math.round(v) })} style={[s.share, { color: me.color }]} />
                <CountUp value={sharePartner} format={v => fill(t.share, { name: partner.first_name, n: Math.round(v) })} style={[s.share, { color: deep(partner) }]} />
              </View>
              <ProgressBar ratio={shareMe / 100} color={me.color} track={partner.color} height={10} radius={5} style={{ marginBottom: 10 }} />
              <Text style={[font.secondary, { lineHeight: 19 }]}>{t.explain}</Text>
            </Card>
          </View>

          <View style={{ paddingHorizontal: 22 }}>
            <SectionMicro>{t.sectionWho}</SectionMicro>
            <View style={{ gap: 6, marginBottom: 11 }}>
              {categories.length === 0 ? <Text style={[font.secondary, { paddingVertical: 8 }]}>{t.empty}</Text> : null}
              {categories.map((c, i) => {
                const who = byId(c.carrier_id);
                return (
                  <GlassRow key={c.id} style={{ paddingVertical: 10 }}>
                    <Text style={{ fontSize: 19 }}>{c.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[font.row, { marginBottom: 6 }]}>{c.title}</Text>
                      <ProgressBar ratio={c.pct / 100} color={who.color} track={alpha(colors.ink, 0.07)} height={4} radius={2} delay={80 * i} />
                    </View>
                    <Text style={[s.who, { color: deep(who) }]}>{who.first_name}</Text>
                  </GlassRow>
                );
              })}
            </View>

            {sug ? <Card accent={colors.sage} padding={0} r={radius.card} style={{ paddingVertical: 13, paddingHorizontal: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                <Text style={{ fontSize: 21 }}>✨</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.sugTitle}>{t.suggestTitle}</Text>
                  <Text style={[font.secondary, { marginTop: 3, lineHeight: 18 }]}>{fill(t.suggestBody, { task: sugCat.title, name: sugTo.first_name, me: sugAfter.me, partner: sugAfter.partner })}</Text>
                </View>
                <Pressable onPress={apply} disabled={applied} hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                  <Text style={[s.apply, applied && { color: colors.muted }]}>{applied ? t.applied : t.apply}</Text>
                </Pressable>
              </View>
            </Card> : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 14, paddingHorizontal: space.headerX, marginBottom: 11, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  title: { fontSize: 22, fontWeight: '600', letterSpacing: -1.1, lineHeight: 23, color: colors.ink },
  share: { fontSize: 13.5, fontWeight: '600', fontVariant: ['tabular-nums'] },
  who: { fontSize: 12, fontWeight: '600' },
  sugTitle: { fontSize: 15, fontWeight: '600', color: colors.ink },
  apply: { fontSize: 13, fontWeight: '600', color: colors.sageDeep },
});
