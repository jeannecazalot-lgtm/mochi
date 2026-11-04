// Écran 33 · Mood check-in du dimanche soir (modal sheet). Recette : docs/recettes/33-mood.md
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { PillLabel } from '../src/components/ui';
import { ModalSheet, SectionLabel, CtaModal, Chip, extraColors } from '../src/components/modaux/extra';
import { partner } from '../src/demo';
import { moodLevels, moodTags } from '../src/demo-modaux';
import copy from '../src/data/copy.json';
import { colors, font, radius, alpha } from '../src/theme';
import { styles as v3Styles, currentTokens as tk } from '../src/theme-v3';

export default function Mood() {
  const t = copy.mood;
  const [level, setLevel] = useState(null);
  const [tags, setTags] = useState([]);
  const [note, setNote] = useState('');
  const toggleTag = k => setTags(l => l.includes(k) ? l.filter(x => x !== k) : [...l, k]);

  return (
    <ModalSheet>
        <ScrollView contentInsetAdjustmentBehavior="never" automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="handled" contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: 6 }}><PillLabel color={tk().accent}>{t.eyebrow}</PillLabel></View>
          <Text style={[font.screenTitle, { color: tk().ink }, { lineHeight: 23 }]}>{t.title}</Text>
          <Text style={s.sub}>{t.sub.replace('{partner}', partner.first_name)}</Text>

          <View style={s.faces}>
            {moodLevels.map(m => {
              const on = level === m.key;
              return (
                <Pressable key={m.key} onPress={() => setLevel(m.key)} style={{ alignItems: 'center', gap: 6 }}>
                  <View style={[s.face, on && { backgroundColor: extraColors.peach }]}><Text style={{ fontSize: 22 }}>{m.emoji}</Text></View>
                  <Text style={[s.faceLabel, on && { color: tk().ink, fontWeight: '600' }]}>{t.levels[m.key]}</Text>
                </Pressable>
              );
            })}
          </View>

          <SectionLabel>{t.tagsLabel}</SectionLabel>
          <View style={s.chips}>
            {moodTags.map(k => <Chip key={k} label={t.tags[k]} on={tags.includes(k)} onPress={() => toggleTag(k)} />)}
          </View>

          <SectionLabel>{t.noteLabel}</SectionLabel>
          <View style={s.noteCard}>
            <TextInput value={note} onChangeText={setNote} placeholder={t.notePlaceholder} placeholderTextColor={tk().seg} multiline style={s.noteInput} cursorColor={tk().accent} selectionColor={tk().accent} />
          </View>

          <CtaModal label={t.cta} disabled={!level} onPress={() => router.back()} />
        </ScrollView>
    </ModalSheet>
  );
}

const s = v3Styles(T => StyleSheet.create({
  body: { paddingHorizontal: 22 },
  sub: { fontSize: 14, fontWeight: '400', color: T.muted, lineHeight: 20, marginTop: 6, marginBottom: 16 },
  faces: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 19 },
  face: { width: 52, height: 52, borderRadius: 26, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: T.line },
  faceLabel: { fontSize: 12, fontWeight: '400', color: T.muted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 19 },
  noteCard: { backgroundColor: T.bg, borderRadius: radius.row, borderWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 16 },
  noteInput: { fontSize: 16, fontWeight: '400', fontStyle: 'italic', color: T.ink, lineHeight: 22, minHeight: 44, padding: 0, textAlignVertical: 'top' },
}));
