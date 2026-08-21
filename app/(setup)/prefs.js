// Écran 08 · Setup C — Préférences. Recette : docs/recettes/08-prefs.md
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, SetupHeader, Card, CTAPrimary } from '../../src/components/ui';
import { SectionLabel, fill, setupTokens } from '../../src/components/setup/extra';
import { likeChips, hateChips, prefsMax, reminderTimes } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space, alpha } from '../../src/theme';

const t = copy.setup;
const onColor = { like: setupTokens.chipLike, hate: setupTokens.chipHate };

function Chips({ items, tone, selected, onToggle }) {
  return (
    <View style={s.wrap}>
      {items.map(c => {
        const on = selected.includes(c.id);
        return (
          <Pressable key={c.id} onPress={() => onToggle(c.id)} style={[s.chip, on ? { backgroundColor: onColor[tone], borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline } : s.chipOff]}>
            <Text style={s.chipTxt}>{c.emoji} {c.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function Prefs() {
  const [likes, setLikes] = useState(likeChips.filter(c => c.on).map(c => c.id));
  const [hates, setHates] = useState(hateChips.filter(c => c.on).map(c => c.id));
  const [timeIdx, setTimeIdx] = useState(0);

  const toggle = (set) => (id) => set(list => list.includes(id) ? list.filter(x => x !== id) : list.length >= prefsMax ? list : [...list, id]);

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <SetupHeader step={3} title={t.prefsTitle} sub={t.prefsSub} />

        <View style={{ paddingHorizontal: space.headerX, paddingTop: 17 }}>
          <SectionLabel color={colors.sageDeep}>{fill(t.likeLabel, { max: prefsMax })}</SectionLabel>
          <Chips items={likeChips} tone="like" selected={likes} onToggle={toggle(setLikes)} />

          <SectionLabel color={colors.coralDeep} style={{ marginTop: 16 }}>{fill(t.hateLabel, { max: prefsMax })}</SectionLabel>
          <Chips items={hateChips} tone="hate" selected={hates} onToggle={toggle(setHates)} />

          <SectionLabel style={{ marginTop: 19 }}>{t.reminderLabel}</SectionLabel>
          <Card padding={0} r={16}>
            <View style={s.remRow}>
              <Text style={{ fontSize: 19 }}>🔔</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.remTitle}>{t.reminderTitle}</Text>
                <Text style={s.remSub}>{t.reminderSub}</Text>
              </View>
              <Pressable onPress={() => setTimeIdx(i => (i + 1) % reminderTimes.length)} style={s.time}>
                <Text style={s.timeTxt}>{reminderTimes[timeIdx]}</Text>
              </Pressable>
            </View>
          </Card>
        </View>

        <View style={s.ctaWrap}>
          <CTAPrimary label={t.letsGo} onPress={() => router.push('/(setup)/invite')} big />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingVertical: 8, paddingHorizontal: 13, borderRadius: 999 },
  chipOff: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: alpha(colors.ink, 0.10) },
  chipTxt: { fontSize: 14, fontWeight: '500', color: colors.ink },
  remRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14, paddingHorizontal: 18 },
  remTitle: { fontSize: 15.5, fontWeight: '600', color: colors.ink },
  remSub: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 3 },
  time: { backgroundColor: alpha(colors.ink, 0.06), borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  timeTxt: { fontSize: 17, fontWeight: '600', color: colors.ink, fontVariant: ['tabular-nums'] },
  ctaWrap: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 26 },
});
