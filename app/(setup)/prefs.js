// Écran 08 · Setup C — Préférences. Recette : docs/recettes/08-prefs.md
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, SetupHeader, Card, CTAPrimary } from '../../src/components/ui';
import { LiveMochi, FadeInDown, Animated } from '../../src/components/motion';
import { SectionLabel, fill, setupTokens, useShake, LegendChip } from '../../src/components/setup/extra';
import { prefsPool, prefsMax, reminderTimes } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space, alpha } from '../../src/theme';

const t = copy.setup;
const onColor = { like: setupTokens.chipLike, hate: setupTokens.chipHate };

// 08 v2 (retour Jeanne, 22 août 2026) : UNE seule liste — chaque tâche cycle
// neutre → j'aime → je déteste → neutre. Secousse si le côté visé est plein.
function Chip({ c, state, onCycle, delay }) {
  const { style, shake } = useShake();
  const bg = state === 'like' ? onColor.like : state === 'hate' ? onColor.hate : null;
  return (
    <Animated.View entering={FadeInDown.duration(220).delay(delay)} style={style}>
      <Pressable
        onPress={() => { if (!onCycle(c.id)) shake(); }}
        style={[s.chip, bg ? { backgroundColor: bg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline } : s.chipOff]}>
        <Text style={s.chipTxt}>{c.emoji} {c.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function Prefs() {
  // Aucun état pré-rempli ; cycle neutre → j'aime → je déteste → neutre.
  const [prefs, setPrefs] = useState({});
  const [timeIdx, setTimeIdx] = useState(0);
  const count = tone => Object.values(prefs).filter(v => v === tone).length;

  // Cycle neutre → j'aime → je déteste → neutre. Si l'état visé est plein,
  // on SAUTE au suivant (retour Jeanne, 23 août 2026 : 3 « j'aime » posés ne
  // doivent pas empêcher de marquer « je déteste »). Vibre seulement si rien
  // ne peut changer.
  const cycle = (id) => {
    const order = [undefined, 'like', 'hate'];
    const cur = prefs[id];
    let i = order.indexOf(cur);
    for (let step = 0; step < order.length; step++) {
      i = (i + 1) % order.length;
      const next = order[i];
      if (next === undefined || count(next) < prefsMax) {
        if (next === cur) break;
        setPrefs(p => ({ ...p, [id]: next }));
        return true;
      }
    }
    return false;
  };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <SetupHeader hero={<LiveMochi size={96} />} step={3} total={4} title={t.prefsTitle} sub={t.prefsSub2} />

        <View style={{ paddingHorizontal: space.headerX, paddingTop: 17 }}>
          <View style={s.legendTop}>
            <LegendChip state={0} label={t.prefsLegendNeutral} />
            <View style={[s.legendPill, { backgroundColor: onColor.like }]}><Text style={s.legendPillTxt}>💚 {t.prefsLegendLike}</Text></View>
            <View style={[s.legendPill, { backgroundColor: onColor.hate }]}><Text style={s.legendPillTxt}>🙅 {t.prefsLegendHate}</Text></View>
          </View>
          <Text style={s.hint}>{t.prefsHint} · {fill(t.prefsMaxNote, { max: prefsMax })}</Text>
          <View style={s.wrap}>
            {prefsPool.map((c, i) => (
              <Chip key={c.id} c={c} state={prefs[c.id]} onCycle={cycle} delay={i * 30} />
            ))}
          </View>

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
  legendTop: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 6 },
  legendPill: { paddingVertical: 7, paddingHorizontal: 11, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  legendPillTxt: { fontSize: 12.5, fontWeight: '500', color: colors.ink },
  hint: { textAlign: 'center', fontSize: 12, fontWeight: '400', color: colors.muted, marginBottom: 12 },
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
