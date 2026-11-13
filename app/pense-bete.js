// Écran 32 · Pense-bête partagé (Duo+). Recette : docs/recettes/32-pense-bete.md
import React, { useState, useMemo, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GlowBg, PillLabel, ScreenTitle } from '../src/components/ui';
import { Animated, FadeIn, useCheckPop } from '../src/components/motion';
import { RoundButton, CtaModal, extraColors } from '../src/components/modaux/extra';
import { demoNotes } from '../src/demo-modaux';
import { loadNotes, toggleNote } from '../src/notes-actions';
import { occStore } from '../src/demo-core';
import { inRealMode, loadSetup } from '../src/setup-state';
import copy from '../src/copy';
import { colors, radius, space, alpha } from '../src/theme';
import { styles as v3Styles, currentTokens as tk } from '../src/theme-v3';
import { LOCALE } from '../src/lang';

const fmtDate = iso => new Intl.DateTimeFormat(LOCALE, { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso + 'T12:00:00'));

export default function PenseBete() {
  const t = copy.notes;
  // réel (13 sept 2026) : les notes du foyer ; démo seulement sans foyer
  const [notes, setNotes] = useState(demoNotes);
  const [real, setReal] = useState(false);
  const occV = occStore.useVersion();
  useEffect(() => { (async () => { await loadSetup(); if (!inRealMode()) return; setReal(true); setNotes((await loadNotes()).map(n => ({ id: n.id, emoji: n.emoji || '📌', title: n.title || n.body, detail: n.title ? [n.due_date ? fmtDate(n.due_date) : null, n.body].filter(Boolean).join(' · ') : '', tone: n.tone || 0, done: !!n.done }))); })(); }, [occV]);
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetail, setNewDetail] = useState('');

  const shown = useMemo(() => { const q = query.trim().toLowerCase(); return q ? notes.filter(n => (n.title + ' ' + n.detail).toLowerCase().includes(q)) : notes; }, [notes, query]);

  const toggle = id => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); if (real) { toggleNote(id).catch(() => {}); return; } setNotes(l => l.map(n => n.id === id ? { ...n, done: !n.done } : n)); };
  const open = id => (real ? router.push(`/note?id=${id}`) : toggle(id));
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
              <PillLabel color={'#9A7BC8'}>{t.eyebrow}</PillLabel>
            </View>
            <ScreenTitle style={{ lineHeight: 24 }}>{t.title}</ScreenTitle>
          </View>
          <RoundButton kind="plus" onPress={() => (real ? router.push('/note') : setAdding(a => !a))} />
        </View>

        <View style={s.searchWrap}>
          <View style={s.search}>
            <Text style={{ fontSize: 15, opacity: 0.6 }}>🔍</Text>
            <TextInput value={query} onChangeText={setQuery} placeholder={t.searchPlaceholder} placeholderTextColor={tk().muted} style={s.searchInput} cursorColor={tk().accent} selectionColor={tk().accent} autoCorrect={false} />
            <Text style={s.count}>{t.count.replace('{n}', String(notes.length))}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {adding && (
            <Animated.View entering={FadeIn.duration(200)} style={s.addCard}>
              <TextInput value={newTitle} onChangeText={setNewTitle} placeholder={t.newTitlePlaceholder} placeholderTextColor={tk().seg} style={s.addTitle} cursorColor={tk().accent} selectionColor={tk().accent} />
              <TextInput value={newDetail} onChangeText={setNewDetail} placeholder={t.newDetailPlaceholder} placeholderTextColor={tk().seg} style={s.addDetail} onSubmitEditing={add} returnKeyType="done" cursorColor={tk().accent} selectionColor={tk().accent} />
              <CtaModal label={t.add} disabled={!newTitle.trim()} onPress={add} style={{ marginTop: 10 }} />
            </Animated.View>
          )}
          <View style={s.grid}>
            {shown.map((n, i) => <Note key={n.id} note={n} index={i} onPress={() => open(n.id)} onLongPress={() => toggle(n.id)} />)}
          </View>
          {shown.length === 0 && <Text style={s.empty}>{t.empty}</Text>}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Note({ note, index, onPress, onLongPress }) {
  const pop = useCheckPop(note.done);
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} delayLongPress={350} style={s.cell}>
      <Animated.View style={[s.note, { backgroundColor: extraColors.notes[note.tone % extraColors.notes.length], transform: [{ rotate: index % 2 === 0 ? '-0.8deg' : '0.6deg' }], opacity: note.done ? 0.45 : 1 }, pop]}>
        <View style={s.tape} />
        <Text style={[s.noteTitle, note.done && { textDecorationLine: 'line-through' }]}>{note.emoji ? `${note.emoji} ` : ''}{note.title}</Text>
        {!!note.detail && <Text style={s.noteDetail}>{note.detail}</Text>}
      </Animated.View>
    </Pressable>
  );
}

const s = v3Styles(T => StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingTop: 14, paddingHorizontal: space.headerX },
  searchWrap: { paddingTop: 14, paddingHorizontal: space.screenX, paddingBottom: 13 },
  search: { backgroundColor: T.bg, borderRadius: radius.pill, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: T.line },
  searchInput: { flex: 1, fontSize: 14.5, fontWeight: '400', color: T.ink, padding: 0 },
  count: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', color: T.muted, fontVariant: ['tabular-nums'] },
  body: { paddingHorizontal: space.screenX, paddingBottom: 40 },
  addCard: { backgroundColor: T.bg, borderRadius: radius.row, borderWidth: StyleSheet.hairlineWidth, borderColor: T.line, padding: 14, marginBottom: 12 },
  addTitle: { fontSize: 16, fontWeight: '600', letterSpacing: -0.2, color: T.ink, padding: 0 },
  addDetail: { fontSize: 12, fontWeight: '400', color: T.seg, marginTop: 6, padding: 0 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cell: { width: '48%', flexGrow: 1 },
  note: { borderRadius: radius.row, paddingVertical: 13, paddingHorizontal: 14, minHeight: 92, borderWidth: StyleSheet.hairlineWidth, borderColor: T.line },
  tape: { position: 'absolute', top: -5, alignSelf: 'center', width: 28, height: 10, backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: StyleSheet.hairlineWidth, borderColor: T.line, transform: [{ rotate: '-2deg' }] },
  noteTitle: { fontSize: 16, fontWeight: '600', letterSpacing: -0.2, lineHeight: 18.5, color: T.ink, marginTop: 4 },
  noteDetail: { fontSize: 12, fontWeight: '400', color: T.seg, marginTop: 4, lineHeight: 16 },
  empty: { fontSize: 13.5, color: T.muted, textAlign: 'center', marginTop: 24 },
}));
