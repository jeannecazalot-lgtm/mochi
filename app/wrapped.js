// Écrans 24 + 25 · Wrapped solo puis couple (stories). Recette : docs/recettes/24-25-wrapped.md
import React, { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Card, PillLabel, CTAPrimary, Mochi } from '../src/components/ui';
import { CountUp, Animated, FadeIn } from '../src/components/motion';
import { DarkBg, StoryProgress, DarkRow, darkValue, moments, fill } from '../src/components/moments/extra';
import { me, partner, fmtMin } from '../src/demo';
import { wrappedSolo, wrappedCouple, weekNumber, taskTitle } from '../src/demo-moments';
import copy from '../src/data/copy.json';
import { colors, font, space, motion } from '../src/theme';

const t = copy.wrapped;
const SLIDES = ['solo', 'couple', 'share'];

export default function Wrapped() {
  const [i, setI] = useState(0);
  const last = i === SLIDES.length - 1;
  const next = useCallback(() => { if (last) router.back(); else setI(x => x + 1); }, [last]);
  const prev = useCallback(() => setI(x => Math.max(0, x - 1)), []);

  // auto-advance 5 s par slide ; la dernière (partage) attend l'utilisateur
  useEffect(() => { if (last) return undefined; const h = setTimeout(next, moments.storyDuration); return () => clearTimeout(h); }, [i, last, next]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <DarkBg />
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Pressable style={{ flex: 1 }} onPress={prev} />
          <Pressable style={{ flex: 1 }} onPress={next} />
        </View>
      </View>
      <SafeAreaView style={{ flex: 1 }} pointerEvents="box-none">
        <StoryProgress count={SLIDES.length} index={i} duration={last ? 0 : moments.storyDuration} />
        <Animated.View key={i} entering={FadeIn.duration(motion.screen)} style={{ flex: 1 }} pointerEvents="box-none">
          {SLIDES[i] === 'solo' && <Solo />}
          {SLIDES[i] === 'couple' && <Couple />}
          {SLIDES[i] === 'share' && <Share />}
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

function Highlight({ emoji, title, sub }) {
  return (
    <View style={{ paddingHorizontal: 22, marginBottom: 10 }}>
      <Card r={18} style={{ paddingVertical: 17, paddingHorizontal: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Text style={{ fontSize: 24 }}>{emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.hlTitle}>{title}</Text>
            <Text style={s.hlSub}>{sub}</Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

function Solo() {
  const w = wrappedSolo;
  return (
    <View style={{ flex: 1 }} pointerEvents="none">
      <View style={{ paddingTop: 26, paddingHorizontal: 26, alignItems: 'center' }}>
        <View style={{ marginBottom: 11 }}><PillLabel color={colors.butter}>{fill(t.pillSolo, { n: weekNumber() })}</PillLabel></View>
        <View style={{ marginBottom: 9 }}><Mochi size={110} mood="wink" /></View>
        <CountUp value={w.minutes} format={v => fmtMin(Math.round(v))} style={s.heroSolo} />
        <Text style={[s.sub, { marginTop: 6, marginBottom: 21 }]}>{t.hoursSub}</Text>
      </View>
      <Highlight emoji="🍽" title={t.highlightTitle} sub={fill(t.highlightSub, { n: w.highlight.count, name: partner.first_name })} />
      <View style={s.rows}>
        <DarkRow icon="✓" label={t.tasksDone}><CountUp value={w.tasks_done} style={darkValue} /></DarkRow>
        <DarkRow icon="🧠" label={t.mentalAbsorbed}><CountUp value={w.mental_absorbed} style={darkValue} /></DarkRow>
        <DarkRow icon="⇄" label={t.swapsAccepted}><CountUp value={w.swaps_accepted} style={darkValue} /></DarkRow>
      </View>
      <View style={[s.foot, { bottom: 28 }]}><Text style={s.next}>{t.next}</Text></View>
    </View>
  );
}

function Couple() {
  const w = wrappedCouple;
  const streakSub = w.streak_days >= w.record
    ? t.streakRecord
    : w.next ? fill(t.streakNext, { n: w.next.days - w.streak_days, badge: w.next.title }) : '';
  return (
    <View style={{ flex: 1 }} pointerEvents="none">
      <View style={{ paddingTop: 31, paddingHorizontal: 26, alignItems: 'center' }}>
        <View style={{ marginBottom: 19 }}><PillLabel color={colors.lavender}>{t.pillCouple}</PillLabel></View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <CountUp value={w.me_pct} style={[s.heroCouple, { color: me.color }]} />
          <Text style={s.heroSlash}> / </Text>
          <CountUp value={w.partner_pct} style={[s.heroCouple, { color: partner.color }]} />
        </View>
        <Text style={[s.sub, { marginTop: 9, marginBottom: 9 }]}>{fill(t.leaningSub, { name: w.leader.first_name, n: w.gap_min })}</Text>
        <View style={{ flexDirection: 'row', gap: 18, marginBottom: 20 }}>
          <Text style={[s.legend, { color: me.color }]}>● {me.first_name}</Text>
          <Text style={[s.legend, { color: partner.color }]}>● {partner.first_name}</Text>
        </View>
      </View>
      <Highlight emoji="🔥" title={fill(t.streakTitle, { n: w.streak_days })} sub={streakSub} />
      <View style={s.rows}>
        <DarkRow icon="🧺" label={fill(t.laundryQueen, { name: w.laundry.who.first_name })}><CountUp value={w.laundry.count} format={v => `×${Math.round(v)}`} style={darkValue} /></DarkRow>
        <DarkRow icon="😬" label={fill(t.forgotten, { task: w.forgotten.short || taskTitle(w.forgotten.task_id), day: w.forgotten.day })}><Text style={darkValue}>{w.forgotten.points > 0 ? `+${w.forgotten.points}` : `−${Math.abs(w.forgotten.points)}`}</Text></DarkRow>
        <DarkRow icon="⏱" label={t.coordination}><CountUp value={w.coordination_min} format={v => `≈${fmtMin(Math.round(v))}`} style={darkValue} /></DarkRow>
      </View>
      <View style={[s.foot, { bottom: 28 }]}><Text style={s.next}>{t.next}</Text></View>
    </View>
  );
}

function Share() {
  return (
    <View style={{ flex: 1 }} pointerEvents="box-none">
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 26 }} pointerEvents="none">
        <Mochi size={140} mood="happy" />
        <Text style={s.shareTitle}>{t.shareTitle}</Text>
      </View>
      <View style={[s.foot, { bottom: 24, gap: 13, alignItems: 'center' }]}>
        <CTAPrimary label={t.share} big onPress={() => {}} style={{ alignSelf: 'stretch' }} />
        <Pressable onPress={() => router.back()} hitSlop={10}><Text style={s.close}>{t.close}</Text></Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  heroSolo: { fontSize: 56, fontWeight: '700', letterSpacing: -2.5, lineHeight: 58, color: moments.heroPeach, fontVariant: ['tabular-nums'] },
  heroCouple: { fontSize: 54, fontWeight: '700', letterSpacing: -2.5, lineHeight: 56, fontVariant: ['tabular-nums'] },
  heroSlash: { fontSize: 54, fontWeight: '400', lineHeight: 56, color: moments.cream40 },
  sub: { fontSize: 16, fontWeight: '400', color: moments.cream70, textAlign: 'center' },
  legend: { fontSize: 13, fontWeight: '600' },
  hlTitle: { fontSize: 18, fontWeight: '600', letterSpacing: -0.3, color: colors.ink },
  hlSub: { fontSize: 13.5, fontWeight: '400', color: colors.muted, marginTop: 3 },
  rows: { paddingHorizontal: 22, gap: 6 },
  foot: { position: 'absolute', left: 22, right: 22, alignItems: 'center' },
  next: { fontSize: 13, fontWeight: '500', color: moments.cream50 },
  shareTitle: { ...font.screenTitle, color: moments.cream, marginTop: space.xl, textAlign: 'center' },
  close: { fontSize: 14, fontWeight: '500', color: moments.cream60 },
});
