// Écran 32 · Pense-bête partagé (Duo+). Recette : docs/recettes/32-pense-bete.md
import React, { useState, useMemo } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GlowBg, PillLabel, ScreenTitle } from '../src/components/ui';
import { Animated, FadeIn, useCheckPop } from '../src/components/motion';
import { RoundButton, CtaModal, extraColors } from '../src/components/modaux/extra';
import { demoNotes } from '../src/demo-modaux';
import copy from '../src/data/copy.json';
import { colors, radius, space, alpha } from '../src/theme';

export default function PenseBete() {
  const t = copy.notes;
  const [notes, setNotes] = useState(demoNotes);
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');

  const shown = useMemo(() => { const q = query.trim().toLowerCase(); return q ? notes.filter(n => (n.title + ' ' + n.detail).toLowerCase().includes(q)) : notes; }, [notes, query]);

  const toggle = id => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); setNotes(l => l.map(n => n.id === id ? { ...n, done: !n.done } : n)); };
  const add = () => {
    if (!newTitle.trim()) return;
    setNotes(l => [{ id: `n-${Date.now()}`, title: newTitle.trim(), detail: newDetail.trim(), tone: l.length % extraColors.notes.length, done: false }, ...l]);
    setNewTitle(''); setNewDetail(''); setAdding(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={s.header}>
          <RoundButton kind="back" onPress={() => router.back()} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
              <PillLabel color={colors.lavender}>{t.eyebrow}</PillLabel>
              <PillLabel color={colors.coralDeep} tint={colors.coral}>{t.duoPlus}</PillLabel>
            </View>
            <ScreenTitle style={{ lineHeight: 24 }}>{t.title}</ScreenTitle>
          </View>
          <RoundButton kind="plus" onPress={() => setAdding(a => !a)} />
        </View>

        <View style={s.searchWrap}>
          <View style={s.search}>
            <Text style={{ fontSize: 15, opacity: 0.6 }}>🔍</Text>
            <TextInput value={query} onChangeText={setQuery} placeholder={t.searchPlaceholder} placeholderTextColor={colors.muted} style={s.searchInput} cursorColor={colors.coral} selectionColor={colors.coral} autoCorrect={false} />
            <Text style={s.count}>{t.count.replace('{n}', String(notes.length))}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {adding && (
            <Animated.View entering={FadeIn.duration(200)} style={s.addCard}>
              <TextInput value={newTitle} onChangeText={setNewTitle} placeholder={t.newTitlePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)} style={s.addTitle} cursorColor={colors.coral} selectionColor={colors.coral} />
              <TextInput value={newDetail} onChangeText={setNewDetail} placeholder={t.newDetailPlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)} style={s.addDetail} onSubmitEditing={add} returnKeyType="done" cursorColor={colors.coral} selectionColor={colors.coral} />
              <CtaModal label={t.add} disabled={!newTitle.trim()} onPress={add} style={{ marginTop: 10 }} />
            </Animated.View>
          )}
          <View style={s.grid}>
            {shown.map((n, i) => <Note key={n.id} note={n} index={i} onPress={() => toggle(n.id)} />)}
          </View>
          {shown.length === 0 && <Text style={s.empty}>{t.empty}</Text>}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Note({ note, index, onPress }) {
  const pop = useCheckPop(note.done);
  return (
    <Pressable onPress={onPress} style={s.cell}>
      <Animated.View style={[s.note, { backgroundColor: extraColors.notes[note.tone % extraColors.notes.length], transform: [{ rotate: index % 2 === 0 ? '-0.8deg' : '0.6deg' }], opacity: note.done ? 0.45 : 1 }, pop]}>
        <View style={s.tape} />
        <Text style={[s.noteTitle, note.done && { textDecorationLine: 'line-through' }]}>{note.title}</Text>
        {!!note.detail && <Text style={s.noteDetail}>{note.detail}</Text>}
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingTop: 14, paddingHorizontal: space.headerX },
  searchWrap: { paddingTop: 14, paddingHorizontal: space.screenX, paddingBottom: 13 },
  search: { backgroundColor: colors.card, borderRadius: radius.pill, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  searchInput: { flex: 1, fontSize: 14.5, fontWeight: '400', color: colors.ink, padding: 0 },
  count: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', color: colors.muted, fontVariant: ['tabular-nums'] },
  body: { paddingHorizontal: space.screenX, paddingBottom: 40 },
  addCard: { backgroundColor: colors.card, borderRadius: radius.row, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, padding: 14, marginBottom: 12 },
  addTitle: { fontSize: 16, fontWeight: '600', letterSpacing: -0.2, color: colors.ink, padding: 0 },
  addDetail: { fontSize: 12, fontWeight: '400', color: alpha(colors.ink, 0.65), marginTop: 6, padding: 0 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cell: { width: '48%', flexGrow: 1 },
  note: { borderRadius: radius.row, paddingVertical: 13, paddingHorizontal: 14, minHeight: 92, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  tape: { position: 'absolute', top: -5, alignSelf: 'center', width: 28, height: 10, backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, transform: [{ rotate: '-2deg' }] },
  noteTitle: { fontSize: 16, fontWeight: '600', letterSpacing: -0.2, lineHeight: 18.5, color: colors.ink, marginTop: 4 },
  noteDetail: { fontSize: 12, fontWeight: '400', color: alpha(colors.ink, 0.65), marginTop: 4, lineHeight: 16 },
  empty: { fontSize: 13.5, color: colors.muted, textAlign: 'center', marginTop: 24 },
});
