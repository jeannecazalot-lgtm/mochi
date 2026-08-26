// Écran 36 · Analyse charge mentale (Duo+). Recette : docs/recettes/36-analyse.md
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, GlassRow } from '../src/components/ui';
import { CountUp, ProgressBar } from '../src/components/motion';
import { BackButton, PremiumGate, SectionMicro } from '../src/components/premium/extra';
import { Dot } from '../src/components/sober';
import { me, partner, byId } from '../src/demo';
import { mentalLoad, heavier, isPremium } from '../src/demo-premium';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, alpha, slotColors } from '../src/theme';

const t = copy.analyse;
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const deep = m => slotColors[m.slot].deep;
const pct = v => `${Math.round(v)}%`;

export default function Analyse() {
  const [applied, setApplied] = useState(false);
  const shareMe = mentalLoad.share[me.id], sharePartner = mentalLoad.share[partner.id];
  const heavy = heavier();
  const title = shareMe === sharePartner ? t.titleBalanced : fill(t.title, { name: heavy.first_name });
  const sug = mentalLoad.suggestion;
  const sugCat = mentalLoad.categories.find(c => c.id === sug.category_id);
  const sugTo = byId(sug.to_id);

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={s.header}>
            <BackButton label={copy.common.back} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
                <PillLabel color={colors.lavender}>{t.pill}</PillLabel>
                <PillLabel color={colors.butter}>{t.pillPremium}</PillLabel>
              </View>
              <Text style={s.title}>{title}</Text>
            </View>
          </View>

          {!isPremium() && <PremiumGate title={t.gateTitle} sub={t.gateSub} cta={t.gateCta} style={{ marginBottom: 11 }} />}

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
              {mentalLoad.categories.map((c, i) => {
                const who = byId(c.carrier_id);
                return (
                  <GlassRow key={c.id} style={{ paddingVertical: 10 }}>
                    <Dot color={who.color} />
                    <View style={{ flex: 1 }}>
                      <Text style={[font.row, { marginBottom: 6 }]}>{c.title}</Text>
                      <ProgressBar ratio={c.pct / 100} color={who.color} track={alpha(colors.ink, 0.07)} height={4} radius={2} delay={80 * i} />
                    </View>
                    <Text style={[s.who, { color: deep(who) }]}>{who.first_name}</Text>
                  </GlassRow>
                );
              })}
            </View>

            <Card accent={colors.sage} padding={0} r={radius.card} style={{ paddingVertical: 13, paddingHorizontal: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                <View style={{ flex: 1 }}>
                  <Text style={s.sugTitle}>{t.suggestTitle}</Text>
                  <Text style={[font.secondary, { marginTop: 3, lineHeight: 18 }]}>{fill(t.suggestBody, { task: sugCat.title, name: sugTo.first_name, me: pct(sug.after[me.id]).replace('%', ''), partner: pct(sug.after[partner.id]).replace('%', '') })}</Text>
                </View>
                <Pressable onPress={() => setApplied(true)} disabled={applied} hitSlop={8} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
                  <Text style={[s.apply, applied && { color: colors.muted }]}>{applied ? t.applied : t.apply}</Text>
                </Pressable>
              </View>
            </Card>
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
