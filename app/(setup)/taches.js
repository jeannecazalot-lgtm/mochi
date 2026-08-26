// Écran 10 · Choisir les tâches. Recette : docs/recettes/10-taches.md
// Retours Jeanne 22 août 2026 : DA uniformisée (SetupHeader 4/4), catalogue large
// + intertitre « Selon ton foyer », pop + haptique au cochage, entrée en cascade.
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GlowBg, Card, SetupHeader, CTAPrimary } from '../../src/components/ui';
import { LiveMochi } from '../../src/components/motion';
import { CheckDot, AddButton, SkipLink, SectionLabel, fill } from '../../src/components/setup/extra';
import { Animated, FadeInDown, prefersReducedMotion } from '../../src/components/motion';
import { catalogue } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space, motion } from '../../src/theme';

const t = copy.setup;
const next = () => router.push('/(setup)/calcul');

// une rangée du catalogue : cascade FadeInDown (~25 ms d'écart), rond de sélection qui pop
function Row({ c, index, active, onToggle }) {
  return (
    <Animated.View entering={prefersReducedMotion() ? undefined : FadeInDown.delay(index * 45).duration(motion.screen)}>
      <Pressable onPress={onToggle}>
        <Card padding={0} r={14} style={{ marginBottom: 6 }} accent={active ? colors.sage : undefined}>
          <View style={s.row}>
            <Text style={[s.title, { flex: 1 }]}>{c.label}</Text>
            {c.mental ? <Text style={s.mental}>{t.mentalTag}</Text> : null}
            <CheckDot on={active} onPress={onToggle} />
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
}

export default function Taches() {
  // Retour Jeanne (23 août 2026) : rien de pré-coché, pas de rangée grisée.
  const [on, setOn] = useState([]);
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
          <SetupHeader hero={<LiveMochi size={96} />} title={t.tasksTitle} sub={t.tasksSub} />
          <SkipLink onPress={next} />
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: space.screenX, paddingTop: 18, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {broad.map((c, i) => <Row key={c.id} c={c} index={i} active={on.includes(c.id)} onToggle={() => toggle(c.id)} />)}
          <Animated.View entering={prefersReducedMotion() ? undefined : FadeInDown.delay(broad.length * 45).duration(motion.screen)}>
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, paddingHorizontal: 16 },
  title: { fontSize: 16, fontWeight: '500', color: colors.ink },
  mental: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', color: colors.lavenderDeep },
  bottom: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 24, flexDirection: 'row', gap: 8 },
});
