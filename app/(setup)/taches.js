// Écran 10 · Choisir les tâches. Recette : docs/recettes/10-taches.md
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card } from '../../src/components/ui';
import { StepPillHeader, StepTitle, BottomCTA, Toggle, fill } from '../../src/components/setup/extra';
import { catalogue } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space, alpha } from '../../src/theme';

const t = copy.setup;
const freqLabel = f => f.daily ? t.freqDaily : f.perDay ? fill(t.freqPerDay, { n: f.perDay }) : fill(t.freqPerWeek, { n: f.perWeek });
const next = () => router.push('/(setup)/calcul');

export default function Taches() {
  const [on, setOn] = useState(catalogue.filter(c => c.on).map(c => c.id));
  const toggle = id => setOn(l => l.includes(id) ? l.filter(x => x !== id) : [...l, id]);
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <StepPillHeader step={4} onSkip={next} />
        <StepTitle title={t.tasksTitle} sub={t.tasksSub} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: space.screenX, paddingTop: 18, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {catalogue.map(c => {
            const active = on.includes(c.id);
            return (
              <Card key={c.id} padding={0} r={14} style={{ marginBottom: 6, opacity: active ? 1 : 0.55 }}>
                <View style={s.row}>
                  <View style={s.emoji}><Text style={{ fontSize: 19 }}>{c.emoji}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.title}>{c.label}</Text>
                    <Text style={s.freq}>{freqLabel(c.freq)}</Text>
                  </View>
                  <Toggle on={active} onPress={() => toggle(c.id)} />
                </View>
              </Card>
            );
          })}
        </ScrollView>
        <BottomCTA primary={t.launch} onPrimary={next} secondary={t.addTask} onSecondary={() => {}} disabled={on.length === 0} />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 11, paddingHorizontal: 14 },
  emoji: { width: 38, height: 38, borderRadius: 12, backgroundColor: alpha(colors.ink, 0.06), alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '500', color: colors.ink },
  freq: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 3 },
});
