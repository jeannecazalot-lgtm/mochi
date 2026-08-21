// Écran 13 · Réattribuer (drag simplifié : tap tâche puis tap avatar/colonne). Recette : docs/recettes/13-reattribuer.md
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, Avatar, CTAPrimary } from '../../src/components/ui';
import { StepPillHeader, StepTitle } from '../../src/components/setup/extra';
import { members } from '../../src/demo';
import { reassignInitial, dispatchEmoji } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space, gradients, alpha, shadows } from '../../src/theme';

const t = copy.setup;
const finish = () => router.replace('/(tabs)');

export default function Reattribuer() {
  const [items, setItems] = useState(reassignInitial);
  const [picked, setPicked] = useState(() => reassignInitial().find(i => i.dragging)?.task_id ?? null);

  const drop = memberId => {
    if (!picked) return;
    setItems(l => l.map(i => (i.task_id === picked ? { ...i, assignee_id: memberId } : i)));
    setPicked(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <StepPillHeader pill="·" onSkip={finish} />
        <StepTitle title={t.reassignTitle} sub={t.reassignSub} />

        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: space.screenX, paddingTop: 18, paddingBottom: 110 }}>
          {members.map(m => (
            <Card key={m.id} padding={13} r={18} style={{ flex: 1 }}>
              <Pressable onPress={() => drop(m.id)} style={s.head}>
                <Avatar initial={m.initial} color={m.color} size={28} />
                <Text style={s.name}>{m.first_name}</Text>
              </Pressable>
              {items.filter(i => i.assignee_id === m.id).map(i => {
                const on = i.task_id === picked;
                return (
                  <Pressable key={i.task_id} onPress={() => setPicked(on ? null : i.task_id)} style={[s.item, on && s.itemOn]}>
                    <Text style={s.grip}>≡</Text>
                    <Text style={{ fontSize: 14 }}>{dispatchEmoji(i)}</Text>
                    <Text style={[s.itemTxt, on && { fontWeight: '600' }]} numberOfLines={1}>{i.label}</Text>
                  </Pressable>
                );
              })}
            </Card>
          ))}
        </View>

        <View style={s.ctaWrap}><CTAPrimary label={t.validate} onPress={finish} big /></View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  name: { fontSize: 15, fontWeight: '600', color: colors.ink },
  item: { backgroundColor: alpha(colors.card, 0.55), borderRadius: 10, padding: 10, marginBottom: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemOn: { backgroundColor: colors.card, borderWidth: 2, borderColor: gradients.mochi.colors[2], transform: [{ rotate: '-3deg' }], ...shadows.fab, shadowOpacity: 0.22, shadowRadius: 28, shadowOffset: { width: 0, height: 12 } },
  grip: { color: colors.muted, fontSize: 11.5 },
  itemTxt: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.ink },
  ctaWrap: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 24 },
});
