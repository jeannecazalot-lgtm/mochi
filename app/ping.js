// Écran 18 · Ping sheet (long press sur une tâche de l'autre). Recette : docs/recettes/18-ping.md
// Modale transparente : scrim + tâche surélevée + sheet basse. `?occ=<id>` = occurrence concernée.
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Card, Avatar, Micro } from '../src/components/ui';
import { SheetHandle, ReplyChip, Chevron, social } from '../src/components/social/extra';
import { occurrences, taskById, byId, partner, me } from '../src/demo';
import { pingOptions } from '../src/demo-social';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, motion } from '../src/theme';

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

export default function Ping() {
  const { occ: occId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const t = copy.pings;

  const occ = occurrences.find(o => o.id === occId) || occurrences.find(o => o.assignee_id === partner.id && o.status === 'pending');
  const task = occ ? taskById(occ.task_id) : null;
  const who = (occ && byId(occ.assignee_id)) || partner;
  const time = occ?.time || task?.window_end?.replace(':00', 'h') || occ?.badge || null;

  const close = () => router.back();
  const send = (key) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    // TODO Supabase : insérer { type: 'ping', actor_id: me.id, target_id: who.id, task_id, preset_key: key }
    close();
  };

  const options = pingOptions
    .filter(k => k !== 'deadline' || time)
    .map(k => ({ key: k, emoji: k === 'reminder' ? '🌷' : k === 'turn' ? (task?.emoji || '🍽') : k === 'deadline' ? '⏰' : '🤝', label: fill(t.options[k].label, { time }), sub: t.options[k].sub }));

  return (
    <View style={{ backgroundColor: colors.card }}>
      {task ? (
        <View style={{ paddingHorizontal: space.screenX, paddingTop: 14 }}>
          <Card r={radius.card} padding={0}>
            <View style={s.raisedRow}>
              <Text style={{ fontSize: 19 }}>{task.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.raisedTitle}>{task.title}</Text>
                {time ? <Text style={s.raisedSub}>{time} · {who.first_name}</Text> : <Text style={s.raisedSub}>{who.first_name}</Text>}
              </View>
              <Avatar initial={who.initial} color={who.color} photo={who.avatar_url} size={26} />
            </View>
          </Card>
        </View>
      ) : null}

      <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]}>
        <SheetHandle />
        <View style={s.titleRow}>
          <Micro style={{ flex: 1 }}>{fill(t.sheetTitle, { name: who.id === me.id ? copy.common.partner : who.first_name })}</Micro>
          {task ? <ReplyChip muted label={fill(t.attached, { emoji: task.emoji })} /> : null}
        </View>
        {options.map(o => (
          <Pressable key={o.key} onPress={() => send(o.key)} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
            <Card r={radius.row} padding={0} style={{ marginBottom: 6 }}>
              <View style={s.optRow}>
                <Text style={{ fontSize: 19 }}>{o.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.optLabel}>{o.label}</Text>
                  <Text style={s.optSub}>{o.sub}</Text>
                </View>
                <Chevron />
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  raised: { position: 'absolute', left: 24, right: 24 },
  raisedRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, paddingHorizontal: 16 },
  raisedTitle: { fontSize: 16, fontWeight: '600', color: colors.ink },
  raisedSub: { fontSize: 12, fontWeight: '400', color: colors.muted, marginTop: 3 },
  sheet: { backgroundColor: colors.card, paddingTop: 10, paddingHorizontal: space.screenX },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 11 },
  optRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, paddingHorizontal: 14 },
  optLabel: { fontSize: 15.5, fontWeight: '600', color: colors.ink },
  optSub: { ...font.caption, marginTop: 3 },
});
