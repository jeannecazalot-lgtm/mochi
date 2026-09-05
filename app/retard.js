// Écran 21 · Tâche en retard — sheet de l'ASSIGNÉ (maquette Jeanne, 1er sept 2026).
// Ouvert depuis une rangée en retard du Planning. La vue lecture du non-assigné
// viendra avec l'invitation réelle. `?occ=&tid=&title=&emoji=&mins=&due=`.
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Card, Micro, PillLabel } from '../src/components/ui';
import { LiveMochi } from '../src/components/motion';
import { SheetHandle, Chevron } from '../src/components/social/extra';
import { partner, fmtMin } from '../src/demo';
import { missionDone } from '../src/demo-core';
import { moveOccurrence, toggleOccurrence } from '../src/occ-actions';
import { postponeMalus, malusPoints, clearMalusFor } from '../src/malus-actions';
import { read } from '../src/store';
import { requestSwap } from '../src/swap-actions';
import { localIso, addDaysIso } from '../src/dates';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, alpha } from '../src/theme';

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export default function Retard() {
  const { occ: occId, tid, title, emoji, mins, due } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const t = copy.retard;
  const daysLate = due ? Math.max(1, Math.round((new Date(localIso()) - new Date(String(due))) / 86400000)) : 1;
  // le VRAI malus de cette occurrence (SPECS §4) : déjà posé par sweepMissed, sinon
  // celui qui tombera (importance × (1 + retard × 0,5)) — plus de « +1 » de démo
  const [points, setPoints] = useState(null);
  useEffect(() => {
    (async () => {
      const [malus, tasks] = await Promise.all([read('malus'), read('tasks')]);
      const posed = malus.filter(m => m.occurrence_id === String(occId)).reduce((a, m) => a + Number(m.points || 0), 0);
      const tk = tasks.find(x => x.id === String(tid));
      setPoints(posed || malusPoints(tk?.importance, daysLate));
    })();
  }, [occId]);
  const fmtPts = n => String(Math.round(n * 10) / 10).replace('.', ',');

  const close = () => router.back();
  const doNow = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (occId) {
      missionDone.set(String(occId), true);
      toggleOccurrence(String(occId), true, Number(mins) || undefined).catch(() => {});
      clearMalusFor(String(occId)).catch(() => {}); // faite, même en retard : le malus s'efface
    }
    close();
  };
  const swap = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    // binôme réel → vraie proposition (+1 dette à l'acceptation, SPECS §6)
    await requestSwap(String(occId || '')).catch(() => {});
    close();
  };
  const postpone = async () => {
    const r = await moveOccurrence(String(occId || ''), addDaysIso(1));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (r.ok) postponeMalus(String(occId)).catch(() => {}); // « +1 malus mais ça passe »
    if (r.ok || r.reason === 'introuvable') close();
  };

  return (
    <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]}>
      <SheetHandle />
      <View style={s.head}>
        <LiveMochi size={54} mood="sad" float={false} />
        <View style={{ flex: 1 }}>
          <View style={{ alignSelf: 'flex-start', marginBottom: 5 }}>
            <PillLabel color={colors.coralDeep} tint={colors.coral}>{fill(t.pill, { n: daysLate })}</PillLabel>
          </View>
          <Text style={s.headTitle} numberOfLines={1}>{emoji ? `${emoji} ` : ''}{title || t.fallbackTitle}</Text>
        </View>
      </View>

      {/* le malus réel de cette tâche (proposition montrée à Jeanne le 5 sept 2026) */}
      <View style={s.warn}>
        <Text style={s.warnTxt}>{points == null ? t.warn : fill(t.warnReal, { n: fmtPts(points) })}</Text>
      </View>

      <Micro style={{ marginBottom: 7 }}>{t.recommended}</Micro>
      <Pressable onPress={doNow} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
        <Card r={radius.row} padding={0} style={{ marginBottom: 12 }} accent={colors.sage}>
          <View style={s.optRow}>
            <Text style={{ fontSize: 19 }}>✅</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.optLabel}>{t.doNow}</Text>
              <Text style={s.optSub}>{fill(t.doNowSub, { time: fmtMin(Number(mins) || 15) })}</Text>
            </View>
            <Chevron />
          </View>
        </Card>
      </Pressable>

      <Micro style={{ marginBottom: 7 }}>{t.orElse}</Micro>
      <Pressable onPress={swap} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
        <Card r={radius.row} padding={0} style={{ marginBottom: 6 }}>
          <View style={s.optRow}>
            <Text style={{ fontSize: 19 }}>🤝</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.optLabel}>{fill(t.swap, { name: partner.first_name })}</Text>
              <Text style={s.optSub}>{fill(t.swapSub, { name: partner.first_name })}</Text>
            </View>
            <Chevron />
          </View>
        </Card>
      </Pressable>
      <Pressable onPress={postpone} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
        <Card r={radius.row} padding={0}>
          <View style={s.optRow}>
            <Text style={{ fontSize: 19 }}>⏰</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.optLabel}>{t.postpone}</Text>
              <Text style={s.optSub}>{t.postponeSub}</Text>
            </View>
            <Chevron />
          </View>
        </Card>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  sheet: { backgroundColor: colors.card, paddingTop: 10, paddingHorizontal: space.screenX },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4, marginBottom: 12 },
  headTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3, color: colors.ink },
  warn: { backgroundColor: alpha(colors.coral, 0.14), borderRadius: 12, paddingVertical: 10, paddingHorizontal: 13, marginBottom: 13 },
  warnTxt: { fontSize: 13.5, fontWeight: '500', color: colors.coralDeep, lineHeight: 19 },
  optRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, paddingHorizontal: 14 },
  optLabel: { fontSize: 15.5, fontWeight: '600', color: colors.ink },
  optSub: { ...font.caption, marginTop: 3 },
});
