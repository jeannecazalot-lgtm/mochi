// Sheet Jour — tap sur un jour de la vue mois du Planning (retour Jeanne, 1er sept 2026).
// `?d=<timestamp>` = jour concerné ; liste le planning de la journée pour les deux membres.
// Réel (5 sept 2026, audit QA) : occurrences du foyer ce jour-là — la démo ne sert
// qu'en l'absence de foyer.
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Micro, Divider, Avatar } from '../src/components/ui';
import { AvatarPair } from '../src/components/core/extra';
import { SheetHandle } from '../src/components/social/extra';
import { byId, taskById, today, me, partner } from '../src/demo';
import { occurrencesOn, fmtDayLabel, sameDay } from '../src/demo-core';
import { read } from '../src/store';
import { loadSetup, inRealMode } from '../src/setup-state';
import { getUid } from '../src/identity';
import { isLive } from '../src/occ-actions';
import { localIso } from '../src/dates';
import copy from '../src/data/copy.json';
import { colors, space, font } from '../src/theme';

export default function Jour() {
  const { d } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [real, setReal] = useState(null); // null = démo ; [] = foyer réel sans rien ce jour-là
  const now = new Date();
  const date = d ? new Date(Number(d)) : (real ? now : today);
  useEffect(() => {
    (async () => {
      await loadSetup();
      if (!inRealMode()) return;
      const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]);
      const byTask = Object.fromEntries(tasks.map(tk => [tk.id, tk]));
      const uid = getUid();
      const iso = localIso(date);
      setReal(occs.filter(o => isLive(o) && o.due_date === iso).map(o => ({
        id: o.id, task: byTask[o.task_id] || { title: '…', emoji: '•' },
        who: o.assignee_id ? (o.assignee_id === uid ? me : partner) : null, done: o.status === 'done',
        // tap → la sheet Tâche (retour Jeanne 13 sept 2026 : « bête que je ne puisse pas cliquer »)
        href: `/mission?occ=${o.id}&tid=${o.task_id}&title=${encodeURIComponent(byTask[o.task_id]?.title || '')}&mins=${byTask[o.task_id]?.duration_min || 15}`,
      })));
    })();
  }, [d]);
  const items = real || occurrencesOn(date).map(o => ({ id: o.id, task: taskById(o.task_id), who: o.assignee_id ? byId(o.assignee_id) : null, time: o.time }));
  const isToday = real ? localIso(date) === localIso() : sameDay(date, today);
  const label = `${fmtDayLabel(date)}${isToday ? ` · ${copy.planning.todaySuffix}` : ''}`;

  return (
    <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]}>
      <SheetHandle />
      <Micro style={{ marginBottom: 11 }}>{label}</Micro>
      {items.length === 0 ? <Text style={font.secondary}>{copy.calendar.empty}</Text> : items.map((o, i) => (
        <View key={o.id}>
          {i > 0 ? <Divider /> : null}
          <Pressable disabled={!o.href} onPress={() => router.push(o.href)} style={({ pressed }) => [s.row, pressed && { opacity: 0.7 }]}>
            <Text style={{ fontSize: 18 }}>{o.task.emoji}</Text>
            <Text style={[s.rowLabel, o.done && { textDecorationLine: 'line-through', opacity: 0.5 }]} numberOfLines={1}>{o.task.title}{o.time ? ` · ${o.time}` : ''}</Text>
            {o.who ? <Avatar initial={o.who.initial} color={o.who.color} photo={o.who.avatar_url} size={24} /> : <AvatarPair members={[me, partner]} size={24} />}
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  sheet: { backgroundColor: colors.card, paddingTop: 10, paddingHorizontal: space.screenX },
  // même taille que les rangées de l'Accueil et du Planning (Jeanne 13 sept 2026)
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11 },
  rowLabel: { flex: 1, fontSize: 15.5, fontWeight: '500', color: colors.ink },
});
