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
import { moveOccurrence, toggleOccurrence, takeOver } from '../src/occ-actions';
import { sendPing } from '../src/activity-actions';
import { getUid } from '../src/identity';
import { postponeMalus, malusPoints, clearMalusFor } from '../src/malus-actions';
import { read } from '../src/store';
import { requestSwap } from '../src/swap-actions';
import { localIso, addDaysIso } from '../src/dates';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, alpha } from '../src/theme';

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export default function Retard() {
  // Décision Jeanne (6 sept 2026) : le malus n'apparaît QUE dans le bouton recommandé
  // (« ≈1h · efface 8 pt de malus ») — variante b des trois proposées ; a (légende sous
  // le titre) et c (note en bas) restent accessibles par ?v= pour comparaison.
  const { occ: occId, tid, title, emoji, mins, due, v = 'b', other: otherParam } = useLocalSearchParams(); // other=1 : variante « tâche de l'autre » (captures)
  const insets = useSafeAreaInsets();
  const t = copy.retard;
  const daysLate = due ? Math.max(1, Math.round((new Date(localIso()) - new Date(String(due))) / 86400000)) : 1;
  // le VRAI malus de cette occurrence (SPECS §4) : déjà posé par sweepMissed, sinon
  // celui qui tombera (importance × (1 + retard × 0,5)) — plus de « +1 » de démo
  const [points, setPoints] = useState(null);
  // la tâche en retard de l'AUTRE (10 sept 2026) : pas « je le fais / repasser / décaler » mais
  // « petit rappel » ou « je m'en occupe »
  const [other, setOther] = useState(otherParam === '1');
  useEffect(() => {
    (async () => {
      const [malus, tasks, occs] = await Promise.all([read('malus'), read('tasks'), read('occurrences')]);
      const row = occs.find(o => o.id === String(occId));
      const uid = getUid();
      if (row) setOther(!!(row.assignee_id && uid && row.assignee_id !== uid));
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
  const ping = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    await sendPing(String(occId || ''), 'reminder').catch(() => {});
    close();
  };
  const take = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    await takeOver(String(occId || '')).catch(() => {});
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
          <Text style={s.headTitle} numberOfLines={1}>{emoji ? `${emoji} ` : ''}{title || t.fallbackTitle}</Text>
          <Text style={s.headSub}>{other ? fill(t.lateCaptionOther, { n: daysLate, name: partner.first_name }) : v === 'a' && points != null ? fill(t.lateCaptionMalus, { n: daysLate, pts: fmtPts(points) }) : fill(t.lateCaption, { n: daysLate })}</Text>
        </View>
      </View>

      {other ? (
        <>
          <Micro style={{ marginBottom: 7 }}>{t.recommended}</Micro>
          <Pressable onPress={ping} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
            <Card r={radius.row} padding={0} style={{ marginBottom: 12 }} accent={colors.sage}>
              <View style={s.optRow}>
                <Text style={{ fontSize: 19 }}>🌷</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.optLabel}>{fill(t.pingOther, { name: partner.first_name })}</Text>
                  <Text style={s.optSub}>{t.pingOtherSub}</Text>
                </View>
                <Chevron />
              </View>
            </Card>
          </Pressable>
          <Micro style={{ marginBottom: 7 }}>{t.orElse}</Micro>
          <Pressable onPress={take} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
            <Card r={radius.row} padding={0}>
              <View style={s.optRow}>
                <Text style={{ fontSize: 19 }}>🤝</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.optLabel}>{t.takeOther}</Text>
                  <Text style={s.optSub}>{fill(t.takeOtherSub, { name: partner.first_name })}</Text>
                </View>
                <Chevron />
              </View>
            </Card>
          </Pressable>
        </>
      ) : (
      <>

      <Micro style={{ marginBottom: 7 }}>{t.recommended}</Micro>
      <Pressable onPress={doNow} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
        <Card r={radius.row} padding={0} style={{ marginBottom: 12 }} accent={colors.sage}>
          <View style={s.optRow}>
            <Text style={{ fontSize: 19 }}>✅</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.optLabel}>{t.doNow}</Text>
              <Text style={s.optSub}>{v === 'b' && points != null ? fill(t.doNowSubMalus, { time: fmtMin(Number(mins) || 15), pts: fmtPts(points) }) : fill(t.doNowSub, { time: fmtMin(Number(mins) || 15) })}</Text>
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
      {v === 'c' && points != null ? <Text style={s.footer}>{fill(t.footerMalus, { pts: fmtPts(points) })}</Text> : null}
      </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  sheet: { backgroundColor: colors.card, paddingTop: 10, paddingHorizontal: space.screenX },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4, marginBottom: 12 },
  headTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3, color: colors.ink },
  headSub: { ...font.caption, color: colors.coralDeep, marginTop: 3 },
  footer: { ...font.caption, textAlign: 'center', marginTop: 14 },
  warn: { backgroundColor: alpha(colors.coral, 0.14), borderRadius: 12, paddingVertical: 10, paddingHorizontal: 13, marginBottom: 13 },
  warnTxt: { fontSize: 13.5, fontWeight: '500', color: colors.coralDeep, lineHeight: 19 },
  optRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, paddingHorizontal: 14 },
  optLabel: { fontSize: 15.5, fontWeight: '600', color: colors.ink },
  optSub: { ...font.caption, marginTop: 3 },
});
