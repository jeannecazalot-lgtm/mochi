// Écran 23 · Point hebdo (malus). Recette : docs/recettes/23-point-hebdo.md
// Source : duo-embossed-pings-balance-malus.jsx › MalusEmbossed. Écran poussé (retour).
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, CTAPrimary } from '../src/components/ui';
import { LiveMochi, CountUp } from '../src/components/motion';
import { ScreenHeader, OffsetCard, InfoRow, DarkPill, ChoiceChip, SectionMicro } from '../src/components/balance/extra';
import { byId, taskById } from '../src/demo';
import { malusItems, malusTotal, malusProposal, MALUS_THRESHOLD, nextReview } from '../src/demo-balance';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, alpha } from '../src/theme';

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export default function PointHebdo() {
  const t = copy.malus;
  const total = malusTotal();
  const review = nextReview();
  const from = byId(malusProposal.from_id);
  const [decision, setDecision] = useState(null); // null | 'accepted' | 'refused' (local, pas encore en base)
  const [idea, setIdea] = useState(null);          // idée piochée (index dans copy.malus.ideas)

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeader title={t.header} onBack={() => router.back()} />
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <View style={s.head}>
            <View style={{ marginBottom: 6 }}><PillLabel color={colors.coral}>{fill(t.pill, { day: review.label })}</PillLabel></View>
            <Text style={s.title}>{t.title}</Text>
            <Text style={s.sub}>{t.sub}</Text>
          </View>

          {/* héros : score + jauge, bordure coral (action attendue), Mochi triste */}
          <View style={[s.block, { paddingTop: 13, marginBottom: 10 }]}>
            <Card r={radius.cardLg} padding={0} accent={colors.coral}>
              <View style={{ paddingVertical: 14, paddingHorizontal: 18 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <LiveMochi size={56} mood="sad" />
                  <View style={{ flex: 1 }}>
                    <Text style={s.pointsLabel}>{t.pointsLabel}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                      <CountUp value={total} style={s.score} />
                      <Text style={s.pts}>{t.pts}</Text>
                    </View>
                    <Text style={s.thisWeek}>{t.thisWeek}</Text>
                  </View>
                </View>
                <View style={s.gauge}>
                  {Array.from({ length: MALUS_THRESHOLD }, (_, i) => (
                    <View key={i} style={[s.gaugeSeg, { backgroundColor: i < total ? colors.coral : alpha(colors.ink, 0.10) }]} />
                  ))}
                </View>
                <View style={s.scale}>
                  <Text style={s.scaleText}>{t.scaleMin}</Text>
                  <Text style={s.scaleText}>{fill(t.scaleMax, { n: MALUS_THRESHOLD })}</Text>
                </View>
              </View>
            </Card>
          </View>

          {/* détail des malus */}
          <SectionMicro>{t.detail}</SectionMicro>
          <View style={s.block}>
            {malusItems.map(m => {
              const task = taskById(m.task_id);
              return (
                <OffsetCard key={m.id} accent={colors[m.accent]} padding={0}>
                  <View style={{ paddingVertical: 11, paddingHorizontal: 14 }}>
                    <InfoRow emoji={task?.emoji} title={fill(m.kind === 'missed' ? t.missed : t.swapped, { task: task?.title })}
                      sub={fill(t.times, { n: m.times, i: m.importance })} right={<DarkPill>{fill(copy.balance.malusPts, { n: m.points })}</DarkPill>} />
                  </View>
                </OffsetCard>
              );
            })}
          </View>

          {/* proposition de geste par l'autre */}
          <View style={[s.block, { paddingTop: 4 }]}>
            <OffsetCard accent={colors.sage} opacity={0.45} offset={{ x: 4, y: 5 }} r={radius.card} padding={0}>
              <View style={{ paddingVertical: 13, paddingHorizontal: 16 }}>
                <View style={s.propHead}>
                  <Text style={{ fontSize: 18 }}>💡</Text>
                  <Text style={s.propTitle}>{fill(t.proposes, { name: from?.first_name })}</Text>
                  <Text style={s.propErase}>{t.eraseAll}</Text>
                </View>
                <Text style={s.quote}>“{malusProposal.text}”</Text>
                {decision ? (
                  <Text style={[s.decision, decision === 'accepted' && { color: colors.sageDeep }]}>{decision === 'accepted' ? t.accepted : t.refused}</Text>
                ) : (
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <Pressable onPress={() => setDecision('accepted')} style={({ pressed }) => [s.btn, s.btnDark, { opacity: pressed ? 0.85 : 1 }]}><Text style={s.btnDarkText}>{t.accept}</Text></Pressable>
                    <Pressable onPress={() => setDecision('refused')} style={({ pressed }) => [s.btn, s.btnLight, { opacity: pressed ? 0.85 : 1 }]}><Text style={s.btnLightText}>{t.refuse}</Text></Pressable>
                  </View>
                )}
              </View>
            </OffsetCard>
          </View>

          {/* idées de geste : choix local */}
          <View style={{ paddingHorizontal: 22, paddingTop: 6 }}>
            <Text style={[font.micro, { fontSize: 10.5, marginBottom: 6 }]}>{t.ideasTitle}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
              {t.ideas.map((label, i) => <ChoiceChip key={label} label={label} selected={idea === i} onPress={() => setIdea(idea === i ? null : i)} />)}
            </View>
          </View>
        </ScrollView>

        {/* clôture du point : remise à zéro (locale pour l'instant) → retour */}
        <View style={s.ctaWrap}>
          <CTAPrimary label={t.resetCta} onPress={() => router.back()} big />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { paddingBottom: 110 },
  head: { paddingTop: 14, paddingHorizontal: space.headerX },
  title: { fontSize: 20, fontWeight: '600', letterSpacing: -1, lineHeight: 20, color: colors.ink },
  sub: { fontSize: 13.5, fontWeight: '400', color: colors.muted, marginTop: 6, lineHeight: 18 },
  block: { paddingHorizontal: space.screenX },
  pointsLabel: { fontSize: 10.5, letterSpacing: 1.4, fontWeight: '600', textTransform: 'uppercase', color: colors.coralDeep, marginBottom: 6 },
  score: { fontSize: 36, fontWeight: '600', letterSpacing: -1.4, lineHeight: 36, color: colors.ink, fontVariant: ['tabular-nums'] },
  pts: { fontSize: 15, fontWeight: '600', color: colors.muted },
  thisWeek: { fontSize: 13, fontWeight: '500', color: colors.ink, marginTop: 3 },
  gauge: { marginTop: 10, flexDirection: 'row', gap: 5 },
  gaugeSeg: { flex: 1, height: 4, borderRadius: 2 },
  scale: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 },
  scaleText: { fontSize: 10.5, fontWeight: '600', color: colors.muted, textTransform: 'uppercase', fontVariant: ['tabular-nums'] },
  propHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 9 },
  propTitle: { flex: 1, fontSize: 12, fontWeight: '600', letterSpacing: 0.4, textTransform: 'uppercase', color: colors.sageDeep },
  propErase: { fontSize: 12, fontWeight: '600', color: colors.muted },
  quote: { fontSize: 16.5, fontWeight: '600', fontStyle: 'italic', letterSpacing: -0.2, lineHeight: 21, color: colors.ink, marginBottom: 10 },
  decision: { fontSize: 14, fontWeight: '600', color: colors.muted },
  btn: { borderRadius: radius.pill, paddingVertical: 8, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  btnDark: { flex: 1.4, backgroundColor: colors.ink },
  btnDarkText: { fontSize: 14.5, fontWeight: '600', color: colors.card },
  btnLight: { flex: 1, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  btnLightText: { fontSize: 14.5, fontWeight: '500', color: colors.ink },
  ctaWrap: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 26 },
});
