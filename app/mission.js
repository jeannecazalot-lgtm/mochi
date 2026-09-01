// Sheet Mission (Accueil → tap sur le titre/émoji d'une mission du jour).
// Demande Jeanne (1er sept 2026) : pop-up pour agir sur la tâche — la valider en
// notant le temps réel passé, dire qu'on n'aura pas le temps, ou la modifier.
// `?occ=<id>` = occurrence concernée. Démo : la coche repasse par missionDone (demo-core).
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Card, Micro } from '../src/components/ui';
import { SheetHandle, Chevron } from '../src/components/social/extra';
import { occurrences, taskById, me, fmtMin, partner } from '../src/demo';
import { missionDone } from '../src/demo-core';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, alpha } from '../src/theme';

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export default function Mission() {
  const { occ: occId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const t = copy.mission;

  const occ = occurrences.find(o => o.id === occId) || occurrences.find(o => o.assignee_id === me.id && o.status !== 'done');
  const task = occ ? taskById(occ.task_id) : null;
  const [mins, setMins] = useState(task?.duration_min || 15);
  // « Je n'aurai pas le temps » ouvre un vrai choix dans la sheet (retour Jeanne,
  // 1er sept 2026 : une action qui ne fait rien ne doit pas être affichée comme active)
  const [asking, setAsking] = useState(false);
  const step = d => setMins(m => Math.max(5, m + d * 5));

  const close = () => router.back();
  // la navigation attend la fin de l'animation de fermeture de la sheet,
  // sinon les deux transitions se chevauchent (retour Jeanne : « pas smooth »)
  const closeThen = href => { close(); setTimeout(() => router.push(href), 320); };
  const markDone = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    // TODO Supabase : occurrence → done + minutes réelles (comptées dans la balance)
    if (occ) missionDone.set(occ.id, true);
    close();
  };
  const postpone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    // TODO Supabase : occurrence reportée à demain
    close();
  };
  const swap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    // TODO Supabase : swap_requests → proposition de repassage au binôme
    close();
  };
  const edit = () => closeThen(`/task/edit?id=${task?.id}`);
  const view = () => closeThen(`/task/${task?.id}`);

  if (!task) return null;
  return (
    <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]}>
      <SheetHandle />
      <View style={s.head}>
        <Text style={{ fontSize: 22 }}>{task.emoji}</Text>
        <Text style={s.headTitle} numberOfLines={1}>{task.title}</Text>
      </View>

      {/* temps réel passé : − n min + */}
      <Card r={radius.row} padding={0} style={{ marginBottom: 6 }}>
        <View style={s.timeRow}>
          <Micro style={{ flex: 1 }}>{t.timeLabel}</Micro>
          <Pressable onPress={() => step(-1)} hitSlop={8} style={s.stepBtn}><Text style={s.stepTxt}>−</Text></Pressable>
          <Text style={s.timeTxt}>{fmtMin(mins)}</Text>
          <Pressable onPress={() => step(1)} hitSlop={8} style={s.stepBtn}><Text style={s.stepTxt}>+</Text></Pressable>
        </View>
      </Card>

      <Pressable onPress={markDone} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
        <Card r={radius.row} padding={0} style={{ marginBottom: 6 }} accent={colors.sage}>
          <View style={s.optRow}>
            <Text style={{ fontSize: 19 }}>✅</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.optLabel}>{t.doneLabel}</Text>
              <Text style={s.optSub}>{fill(t.doneSub, { time: fmtMin(mins) })}</Text>
            </View>
            <Chevron />
          </View>
        </Card>
      </Pressable>

      {!asking ? (
        <Pressable onPress={() => setAsking(true)} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
          <Card r={radius.row} padding={0} style={{ marginBottom: 6 }}>
            <View style={s.optRow}>
              <Text style={{ fontSize: 19 }}>⏭️</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.optLabel}>{t.noTimeLabel}</Text>
                <Text style={s.optSub}>{fill(t.noTimeSub, { name: partner.first_name })}</Text>
              </View>
              <Chevron />
            </View>
          </Card>
        </Pressable>
      ) : (
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
          <Pressable onPress={postpone} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.8 : 1 }]}>
            <Card r={radius.row} padding={0}>
              <View style={s.choiceCol}>
                <Text style={{ fontSize: 19 }}>🗓️</Text>
                <Text style={s.optLabel}>{t.noTimePostpone}</Text>
              </View>
            </Card>
          </Pressable>
          <Pressable onPress={swap} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.8 : 1 }]}>
            <Card r={radius.row} padding={0}>
              <View style={s.choiceCol}>
                <Text style={{ fontSize: 19 }}>🤝</Text>
                <Text style={s.optLabel}>{fill(t.noTimeSwap, { name: partner.first_name })}</Text>
              </View>
            </Card>
          </Pressable>
        </View>
      )}

      <Pressable onPress={edit} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
        <Card r={radius.row} padding={0} style={{ marginBottom: 6 }}>
          <View style={s.optRow}>
            <Text style={{ fontSize: 19 }}>✏️</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.optLabel}>{t.editLabel}</Text>
              <Text style={s.optSub}>{t.editSub}</Text>
            </View>
            <Chevron />
          </View>
        </Card>
      </Pressable>

      <Pressable onPress={view} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
        <Card r={radius.row} padding={0}>
          <View style={s.optRow}>
            <Text style={{ fontSize: 19 }}>👀</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.optLabel}>{t.viewLabel}</Text>
              <Text style={s.optSub}>{t.viewSub}</Text>
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
  head: { flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 4, marginBottom: 13, paddingHorizontal: 2 },
  headTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3, color: colors.ink, flex: 1 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 14 },
  stepBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: alpha(colors.ink, 0.06), alignItems: 'center', justifyContent: 'center' },
  stepTxt: { fontSize: 15, fontWeight: '600', color: colors.ink, lineHeight: 17 },
  timeTxt: { fontSize: 15, fontWeight: '600', color: colors.ink, fontVariant: ['tabular-nums'], minWidth: 52, textAlign: 'center' },
  optRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, paddingHorizontal: 14 },
  choiceCol: { alignItems: 'center', gap: 6, paddingVertical: 13, paddingHorizontal: 10 },
  optLabel: { fontSize: 15.5, fontWeight: '600', color: colors.ink },
  optSub: { ...font.caption, marginTop: 3 },
});
