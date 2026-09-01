// Sheet Jour — tap sur un jour de la vue mois du Planning (retour Jeanne, 1er sept 2026).
// `?d=<timestamp>` = jour concerné ; liste le planning de la journée pour les deux membres.
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Micro, Divider, Avatar } from '../src/components/ui';
import { SheetHandle } from '../src/components/social/extra';
import { byId, taskById, today } from '../src/demo';
import { occurrencesOn, fmtDayLabel, sameDay } from '../src/demo-core';
import copy from '../src/data/copy.json';
import { colors, space, font } from '../src/theme';

export default function Jour() {
  const { d } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const date = d ? new Date(Number(d)) : today;
  const items = occurrencesOn(date);
  const label = `${fmtDayLabel(date)}${sameDay(date, today) ? ` · ${copy.planning.todaySuffix}` : ''}`;

  return (
    <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]}>
      <SheetHandle />
      <Micro style={{ marginBottom: 11 }}>{label}</Micro>
      {items.length === 0 ? <Text style={font.secondary}>{copy.calendar.empty}</Text> : items.map((o, i) => {
        const task = taskById(o.task_id);
        const who = o.assignee_id ? byId(o.assignee_id) : null;
        return (
          <View key={o.id}>
            {i > 0 ? <Divider /> : null}
            <View style={s.row}>
              <Text style={{ fontSize: 17 }}>{task.emoji}</Text>
              <Text style={s.rowLabel} numberOfLines={1}>{task.title}{o.time ? ` · ${o.time}` : ''}</Text>
              {who ? <Avatar initial={who.initial} color={who.color} photo={who.avatar_url} size={22} /> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  sheet: { backgroundColor: colors.card, paddingTop: 10, paddingHorizontal: space.screenX },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9 },
  rowLabel: { flex: 1, fontSize: 14.5, fontWeight: '500', color: colors.ink },
});
