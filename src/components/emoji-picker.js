// ═══════════════════════════════════════════════════════════════════
// EmojiPicker — tuile émoji + rangée de choix (même recette que l'événement). Sert à la
// tâche ajoutée (décision Jeanne 13 sept 2026 : « émoji au choix sur une tâche ajoutée »).
// ═══════════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, alpha } from '../theme';

export const TASK_EMOJIS = ['📝', '🍽️', '🍳', '🛒', '🧺', '👕', '🧹', '🛁', '🗑️', '🛏️', '🐶', '👶', '🌱', '🧾', '🔧', '🚗', '💊', '🎁'];

export function EmojiPicker({ value, onChange, choices = TASK_EMOJIS, size = 46 }) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable onPress={() => setOpen(o => !o)} style={[s.tile, { width: size, height: size, borderRadius: size * 0.3 }, open && { borderColor: colors.ink }]}>
        <Text style={{ fontSize: size * 0.42 }}>{value || choices[0]}</Text>
      </Pressable>
      {open ? (
        <View style={s.row}>
          {choices.map(e => <Pressable key={e} onPress={() => { onChange(e); setOpen(false); }} style={[s.btn, e === value && { backgroundColor: alpha(colors.ink, 0.08) }]}><Text style={{ fontSize: 20 }}>{e}</Text></Pressable>)}
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  tile: { backgroundColor: alpha(colors.ink, 0.05), alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  row: { position: 'absolute', top: 52, left: 0, zIndex: 10, width: 300, flexDirection: 'row', flexWrap: 'wrap', gap: 4, padding: 8, backgroundColor: colors.card, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  btn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
