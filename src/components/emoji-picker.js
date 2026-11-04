// ═══════════════════════════════════════════════════════════════════
// EmojiPicker — tuile + rangée de choix, rendus avec NOS icônes (task-icon.js, 4 nov 2026) ; la valeur reste l'emoji-clé (même recette que l'événement). Sert à la
// tâche ajoutée (décision Jeanne 13 sept 2026 : « émoji au choix sur une tâche ajoutée »).
// ═══════════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, alpha } from '../theme';
import { styles as v3Styles, currentTokens as tk } from '../theme-v3';
import { TaskIcon } from './task-icon';

export const TASK_EMOJIS = ['📝', '🍽️', '🍳', '🛒', '🧺', '👕', '🧹', '🛁', '🗑️', '🛏️', '🐶', '👶', '🌱', '🧾', '🔧', '🚗', '💊', '🎁'];

export function EmojiPicker({ value, onChange, choices = TASK_EMOJIS, size = 46 }) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable onPress={() => setOpen(o => !o)} style={[s.tile, { width: size, height: size, borderRadius: size * 0.3 }, open && { borderColor: tk().ink }]}>
        <TaskIcon emoji={value || choices[0]} size={size * 0.5} pad={false} />
      </Pressable>
      {open ? (
        <View style={s.row}>
          {choices.map(e => <Pressable key={e} onPress={() => { onChange(e); setOpen(false); }} style={[s.btn, e === value && { backgroundColor: tk().seg }]}><TaskIcon emoji={e} size={20} pad={false} /></Pressable>)}
        </View>
      ) : null}
    </View>
  );
}

const s = v3Styles(T => StyleSheet.create({
  tile: { backgroundColor: T.seg, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: T.line },
  row: { position: 'absolute', top: 52, left: 0, zIndex: 10, width: 300, flexDirection: 'row', flexWrap: 'wrap', gap: 4, padding: 8, backgroundColor: T.bg, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: T.line, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  btn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
}));
