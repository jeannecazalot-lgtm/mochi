// Écran 10 · Choisir les tâches. Recette : docs/recettes/10-taches.md
// Retours Jeanne 22 août 2026 : DA uniformisée (SetupHeader 4/4), catalogue large
// + intertitre « Selon ton foyer », pop + haptique au cochage, entrée en cascade.
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GlowBg, Card, SetupHeader, CTAPrimary } from '../../src/components/ui';
import { CheckDot, AddButton, SkipLink, SectionLabel, fill } from '../../src/components/setup/extra';
import { Animated, FadeInDown, prefersReducedMotion } from '../../src/components/motion';
import { catalogue } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space, alpha, motion } from '../../src/theme';

const t = copy.setup;
const freqLabel = f => f.daily ? t.freqDaily : f.perDay ? fill(t.freqPerDay, { n: f.perDay }) : fill(t.freqPerWeek, { n: f.perWeek });
const next = () => router.push('/(setup)/calcul');

// une rangée du catalogue : cascade FadeInDown (~25 ms d'écart), rond de sélection qui pop
function Row({ c, index, active, onToggle }) {
  const meta = `${freqLabel(c.freq)} · ${c.mins} min${c.mental ? ` · ${t.mentalTag}` : ''}`;
  return (
    <Animated.View entering={prefersReducedMotion() ? undefined : FadeInDown.delay(index * 25).duration(motion.screen)}>
      <Pressable onPress={onToggle}>
        <Card padding={0} r={14} style={{ marginBottom: 6, opacity: active ? 1 : 0.55 }}>
          <View style={s.row}>
            <View style={s.emoji}><Text style={{ fontSize: 19 }}>{c.emoji}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.title}>{c.label}</Text>
              <Text style={s.freq}>{meta}</Text>
            </View>
            <CheckDot on={active} onPress={onToggle} />
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
}

export default function Taches() {
  const [on, setOn] = useState(catalogue.filter(c => c.on).map(c => c.id));
  const toggle = id => {
    if (!on.includes(id)) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setOn(l => (l.includes(id) ? l.filter(x => x !== id) : [...l, id]));
  };
  const broad = catalogue.filter(c => !c.specific);
  const specific = catalogue.filter(c => c.specific);
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <SetupHeader step={4} total={4} title={t.tasksTitle} sub={t.tasksSub} />
          <SkipLink onPress={next} />
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: space.screenX, paddingTop: 18, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {broad.map((c, i) => <Row key={c.id} c={c} index={i} active={on.includes(c.id)} onToggle={() => toggle(c.id)} />)}
          <Animated.View entering={prefersReducedMotion() ? undefined : FadeInDown.delay(broad.length * 25).duration(motion.screen)}>
            <SectionLabel style={{ marginTop: 14, marginBottom: 9 }}>{t.tasksSpecificLabel}</SectionLabel>
          </Animated.View>
          {specific.map((c, i) => <Row key={c.id} c={c} index={broad.length + 1 + i} active={on.includes(c.id)} onToggle={() => toggle(c.id)} />)}
        </ScrollView>
        <View style={s.bottom}>
          <AddButton label={t.addTask} onPress={() => {}} style={{ flex: 1 }} />
          <CTAPrimary label={t.launch} onPress={next} disabled={on.length === 0} style={{ flex: 1.6 }} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 11, paddingHorizontal: 14 },
  emoji: { width: 38, height: 38, borderRadius: 12, backgroundColor: alpha(colors.ink, 0.06), alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '500', color: colors.ink },
  freq: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 3 },
  bottom: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 24, flexDirection: 'row', gap: 8 },
});
