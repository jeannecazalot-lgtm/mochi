// Pense-bête · fiche (sheet, depuis le ⊕ ou une note existante `?id=`) — retour Ketley 12 sept 2026 :
// « ça devrait apparaître en fenêtre sur le bas de l'écran comme pour ajouter une tâche », « choisir la
// date en mode calendrier et qu'il s'affiche dans notre planning… avec date, rappel, note ».
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Card } from '../src/components/ui';
import { SheetHandle } from '../src/components/social/extra';
import { Row, PillChip, Arrow } from '../src/components/task/proto';
import { Toggle } from '../src/components/task/extra';
import { DateGrid } from '../src/components/date-grid';
import { useSheetGrow, CREATE_SHEET_MIN } from '../src/components/sheet-grow';
import { loadNotes, saveNote, deleteNote } from '../src/notes-actions';
import copy from '../src/data/copy.json';
import { colors, space, font, alpha } from '../src/theme';

const t = copy.notes;
const fmtDate = iso => new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso + 'T12:00:00'));

export default function NoteSheet() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [date, setDate] = useState(null);
  const [remind, setRemind] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [bodyOpen, setBodyOpen] = useState(false);
  const [existing, setExisting] = useState(null);
  const onGrowLayout = useSheetGrow(dateOpen || bodyOpen, bodyOpen, CREATE_SHEET_MIN);
  useEffect(() => { if (id) loadNotes().then(rows => { const n = rows.find(x => x.id === id); if (n) { setExisting(n); setTitle(n.title || n.body || ''); setBody(n.title ? n.body || '' : ''); setDate(n.due_date || null); setRemind(!!n.remind); } }); }, [id]);

  const save = async () => {
    if (!title.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    await saveNote({ id: existing?.id, title, body, due_date: date, remind: date ? remind : false });
    router.back();
  };
  const remove = async () => { await deleteNote(existing.id); router.back(); };

  return (
    <KeyboardAvoidingView behavior="padding" style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]} onLayout={onGrowLayout}>
      <Pressable onPress={Keyboard.dismiss} accessible={false}>
        <SheetHandle />
        <View style={s.head}>
          <TextInput value={title} onChangeText={setTitle} placeholder={t.newTitlePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)} autoCorrect={false} returnKeyType="done" cursorColor={colors.coral} selectionColor={colors.coral} style={s.title} />
        </View>
        <Card r={16} padding={0} style={s.block}>
          {bodyOpen
            ? <View style={s.bodyBox}><TextInput value={body} onChangeText={setBody} placeholder={t.newDetailPlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)} multiline autoFocus returnKeyType="done" blurOnSubmit onSubmitEditing={() => { setBodyOpen(false); Keyboard.dismiss(); }} style={s.bodyInput} /><View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}><PillChip label={copy.mission.noteDone} selected onPress={() => { setBodyOpen(false); Keyboard.dismiss(); }} /></View></View>
            : <Row first label={t.detailLabel} sub={body || t.newDetailPlaceholder} right={<Arrow />} onPress={() => setBodyOpen(true)} />}
          <Row label={t.dateLabel} sub={date ? fmtDate(date) : t.noDate} right={<PillChip label={date ? fmtDate(date) : t.pickDate} selected={!!date} onPress={() => setDateOpen(o => !o)} />} onPress={() => setDateOpen(o => !o)} />
          {dateOpen ? (
            <View>
              <DateGrid value={date} onChange={iso => { setDate(iso); setDateOpen(false); }} />
              {date ? <Pressable onPress={() => { setDate(null); setRemind(false); setDateOpen(false); }} style={{ alignSelf: 'center', paddingBottom: 12 }}><Text style={s.link}>{t.clearDate}</Text></Pressable> : null}
            </View>
          ) : null}
          {date ? <Row label={t.remindLabel} sub={t.remindSub} right={<Toggle on={remind} onChange={setRemind} />} /> : null}
        </Card>
        <Card r={16} padding={0}>
          <Row first strong label={existing ? copy.common.save : t.add} sub={title.trim() ? null : t.newTitlePlaceholder} right={<Arrow />} onPress={title.trim() ? save : undefined} />
          {existing ? <Row label={<Text style={{ color: colors.coralDeep }}>{t.delete}</Text>} onPress={remove} /> : null}
          {!existing ? <Row label={t.seeAll} right={<Arrow />} onPress={() => { router.back(); setTimeout(() => router.push('/pense-bete'), 250); }} /> : null}
        </Card>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  sheet: { backgroundColor: colors.card, paddingTop: 10, paddingHorizontal: space.screenX },
  head: { marginTop: 2, marginBottom: 12, paddingHorizontal: 2 },
  title: { ...font.cardTitle, padding: 0 },
  block: { marginBottom: 8 },
  bodyBox: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  bodyInput: { fontSize: 15, color: colors.ink, minHeight: 60, textAlignVertical: 'top' },
  link: { fontSize: 13, fontWeight: '600', color: colors.muted },
});
