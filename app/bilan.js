// Écran 26 · Bilan mensuel. Recette : docs/recettes/26-bilan.md
import React from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, CTAPrimary, Micro, ScreenTitle } from '../src/components/ui';
import { SplitBar, BackButton, moments, fill } from '../src/components/moments/extra';
import { bilan, badgeById, fmtMonth, fmtDay } from '../src/demo-moments';
import copy from '../src/data/copy.json';
import { colors, space } from '../src/theme';

const t = copy.bilan;

export default function Bilan() {
  const month = fmtMonth(bilan.month), next = fmtMonth(bilan.next_month);
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <BackButton onPress={() => router.back()} style={{ marginBottom: 12 }} />
          <View style={{ marginBottom: 6 }}><PillLabel color={colors.butter}>{fill(t.pill, { month })}</PillLabel></View>
          <ScreenTitle style={{ letterSpacing: -1.2, lineHeight: 22 }}>{t.title}</ScreenTitle>
        </View>

        <View style={{ paddingHorizontal: 22, marginBottom: 11 }}>
          <Card r={20} style={{ paddingVertical: 18, paddingHorizontal: 20, alignItems: 'center' }}>
            <Text style={s.verdict}>{t.verdict}</Text>
            <Text style={s.verdictSub}>{fill(t.verdictSub, { a: bilan.me_pct, b: bilan.partner_pct, days: bilan.days, n: bilan.balanced_days })}</Text>
            <SplitBar left={bilan.me_pct / (bilan.me_pct + bilan.partner_pct)} style={{ alignSelf: 'stretch' }} />
          </Card>
        </View>

        <Micro style={[s.label, { marginTop: 4 }]}>{t.badgesLabel}</Micro>
        <View style={s.grid}>
          {bilan.badges.map(b => {
            const def = badgeById(b.badge_id);
            const unlocked = !!b.unlocked_on;
            const inner = (
              <>
                <Text style={{ fontSize: 21, marginBottom: 6 }}>{unlocked ? def.emoji : '🔒'}</Text>
                <Text style={s.badgeTitle}>{def.title}</Text>
                <Text style={s.badgeSub}>{unlocked ? fill(t.badgeUnlocked, { days: def.days, date: fmtDay(b.unlocked_on) }) : fill(t.badgeLocked, { days: def.days, n: b.remaining })}</Text>
              </>
            );
            return unlocked
              ? <Card key={b.badge_id} r={14} style={s.badge}>{inner}</Card>
              : <View key={b.badge_id} style={[s.badge, s.locked]}>{inner}</View>;
          })}
        </View>

        <Micro style={s.label}>{t.malusLabel}</Micro>
        <View style={{ paddingHorizontal: 22 }}>
          <Card r={16} style={{ paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 13 }}>
            <Text style={{ fontSize: 20, color: colors.ink }}>✓</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.malusTitle}>{t.malusSettled}</Text>
              <Text style={s.malusSub}>{fill(t.malusSettledSub, { n: bilan.malus_settled_points })}</Text>
            </View>
          </Card>
        </View>

        <View style={s.ctaWrap}>
          <CTAPrimary label={fill(t.cta, { month, next })} big onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 14, paddingHorizontal: space.headerX, marginBottom: 14 },
  verdict: { fontSize: 20, fontWeight: '600', letterSpacing: -0.9, lineHeight: 21, color: colors.ink, textAlign: 'center' },
  verdictSub: { fontSize: 14, fontWeight: '400', color: colors.muted, marginTop: 6, marginBottom: 11, textAlign: 'center', fontVariant: ['tabular-nums'] },
  label: { paddingHorizontal: 22, letterSpacing: 1.5, marginBottom: 8 },
  grid: { paddingHorizontal: 22, flexDirection: 'row', gap: 8, marginBottom: 14 },
  badge: { flex: 1, paddingVertical: 13, paddingHorizontal: 14 },
  locked: { backgroundColor: moments.lockedBg, borderWidth: 1, borderStyle: 'dashed', borderColor: moments.lockedBorder, borderRadius: 14, opacity: 0.7 },
  badgeTitle: { fontSize: 15, fontWeight: '600', color: colors.ink },
  badgeSub: { fontSize: 12, fontWeight: '400', color: colors.muted, marginTop: 3, fontVariant: ['tabular-nums'] },
  malusTitle: { fontSize: 16, fontWeight: '600', color: colors.ink },
  malusSub: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 3 },
  ctaWrap: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 24 },
});
