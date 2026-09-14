// Événement (sheet) — même langage que la sheet Tâche (Jeanne 14 sept 2026 : « unifie la DA des tâches
// avec les événements, dépenses et pense-bête »). Écrit dans `events` (détails en jsonb, migration
// 0007). `?id=` = édition. Porteur d'une ligne : moi → l'autre → à deux.
import React, { useEffect, useState, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Card, Avatar, CTAPrimary } from '../src/components/ui';
import { SheetHandle } from '../src/components/social/extra';
import { Row, PillChip, Arrow, TrashButton } from '../src/components/task/proto';
import { AvatarPair } from '../src/components/core/extra';
import { EmojiPicker } from '../src/components/emoji-picker';
import { DateGrid } from '../src/components/date-grid';
import { useSheetGrow, CREATE_SHEET_MIN } from '../src/components/sheet-grow';
import { me, partner, fmtMin } from '../src/demo';
import { read, mutate, uuid } from '../src/store';
import { loadSetup, setup } from '../src/setup-state';
import { getUid, getPartnerUid, useIdentity } from '../src/identity';
import { occStore } from '../src/demo-core';
import { logActivity } from '../src/activity-actions';
import { pushToPartner } from '../src/push';
import copy from '../src/data/copy.json';
import { colors, space, font, alpha } from '../src/theme';

const t = copy.event;
const ph = alpha(colors.ink, 0.3);
const EMOJIS = ['🎂', '🍽️', '🎉', '🎁', '✈️', '🏡', '🩺', '🎓', '💍', '🎭', '⚽', '📅'];
const fmtDate = iso => new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso + 'T12:00:00'));

export default function Evenement() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  useIdentity();
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [date, setDate] = useState(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  const [items, setItems] = useState([]); // [{ id, label, who: 'me' | 'partner' | 'both', minutes }]
  const [note, setNote] = useState('');
  const [noteOpen, setNoteOpen] = useState(false);
  const [existing, setExisting] = useState(null);
  const onGrowLayout = useSheetGrow(dateOpen || noteOpen || items.length > 0, noteOpen, CREATE_SHEET_MIN);

  useEffect(() => {
    if (!id) return;
    read('events').then(rows => {
      const ev = rows.find(r => r.id === id);
      if (!ev) return;
      const d = ev.details || {};
      setExisting(ev); setTitle(ev.title); setEmoji(ev.emoji || EMOJIS[0]); setDate(ev.starts_at.slice(0, 10));
      setTime(d.time || ''); setPlace(d.place || ''); setItems(d.items || []); setNote(d.note || '');
    });
  }, [id]);

  const patchItem = (iid, p) => setItems(l => l.map(it => (it.id === iid ? { ...it, ...p } : it)));
  const addItem = () => setItems(l => [...l, { id: uuid(), label: '', who: 'me', minutes: 15 }]);
  const removeItem = iid => setItems(l => l.filter(it => it.id !== iid));
  const whoOf = it => (it.who === 'partner' ? partner : me);
  const nextWho = w => (w === 'me' ? 'partner' : w === 'partner' ? 'both' : 'me');

  const saveWith = async (l, silent = false) => {
    await loadSetup();
    const hid = setup.householdId;
    const uid = getUid();
    if (!hid || !uid) { if (!silent) router.back(); return; } // démo : rien à écrire
    const puid = getPartnerUid();
    const who = [...new Set(l.items.flatMap(it => (it.who === 'both' ? [uid, puid] : it.who === 'partner' ? [puid] : [uid])).filter(Boolean))];
    const [h, m] = /^(\d{1,2})\s*[h:]?\s*(\d{0,2})$/.exec(l.time.trim()) ? [RegExp.$1, RegExp.$2 || '0'] : ['20', '0'];
    const starts = new Date(`${l.date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
    await mutate('events', {
      ...(l.existing || { id: uuid(), household_id: hid, created_by: uid }),
      title: l.title.trim(), emoji: l.emoji, starts_at: starts.toISOString(), who,
      details: { ...(l.existing?.details || {}), note: l.note.trim(), time: l.time.trim(), place: l.place.trim(), items: l.items.filter(it => it.label.trim()).map(it => ({ ...it, label: it.label.trim() })) },
    });
    occStore.bump();
    if (!l.existing) {
      const vars = { event: l.title.trim(), day: fmtDate(l.date) };
      logActivity({ type: 'ping', preset_key: 'eventCreated', payload: vars }).catch(() => {});
      pushToPartner('eventCreated', vars, '/(tabs)/planning');
    }
    if (!silent) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); router.back(); }
  };
  const save = () => saveWith({ existing, title, emoji, date, time, place, items, note });
  const remove = async () => {
    if (!existing) return;
    await mutate('events', { ...existing, deleted_at: new Date().toISOString() });
    occStore.bump(); router.back();
  };
  const valid = title.trim() && date;
  // existant : s'enregistre à la fermeture (Jeanne 15 sept 2026)
  const latest = useRef(null); latest.current = { existing, title, emoji, date, time, place, items, note, valid };
  const initial = useRef(null);
  useEffect(() => { if (existing && !initial.current) initial.current = JSON.stringify({ title, emoji, date, time, place, items, note }); }, [existing, title]);
  useEffect(() => () => { const l = latest.current; if (!l?.existing || !l.valid) return; if (JSON.stringify({ title: l.title, emoji: l.emoji, date: l.date, time: l.time, place: l.place, items: l.items, note: l.note }) !== initial.current) saveWith(l, true); }, []);

  return (
    <KeyboardAvoidingView behavior="padding" style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]} onLayout={onGrowLayout}>
      <Pressable onPress={Keyboard.dismiss} accessible={false}>
        <SheetHandle />
        <View style={s.head}>
          <EmojiPicker value={emoji} onChange={setEmoji} choices={EMOJIS} />
          <TextInput value={title} onChangeText={setTitle} placeholder={t.titlePlaceholder} placeholderTextColor={ph} autoCorrect={false} returnKeyType="done" onSubmitEditing={Keyboard.dismiss} cursorColor={colors.coral} selectionColor={colors.coral} style={[s.title, { flex: 1 }]} />
        </View>

        <Card r={16} padding={0} style={s.block}>
          <Row first label={t.dateLabel} right={<PillChip label={date ? fmtDate(date) : copy.notes.pickDate} selected={!!date} onPress={() => setDateOpen(o => !o)} />} onPress={() => setDateOpen(o => !o)} />
          {dateOpen ? <DateGrid value={date} onChange={iso => { setDate(iso); setDateOpen(false); Haptics.selectionAsync().catch(() => {}); }} /> : null}
          <Row label={t.timeLabel} right={<TextInput value={time} onChangeText={setTime} placeholder={t.timePlaceholder} placeholderTextColor={ph} keyboardType="numbers-and-punctuation" returnKeyType="done" style={s.inline} cursorColor={colors.coral} selectionColor={colors.coral} />} />
          <Row label={t.placeLabel} right={<TextInput value={place} onChangeText={setPlace} placeholder={t.placePlaceholder} placeholderTextColor={ph} returnKeyType="done" style={[s.inline, { minWidth: 140 }]} cursorColor={colors.coral} selectionColor={colors.coral} />} />
        </Card>

        <Card r={16} padding={0} style={s.block}>
          <Row first label={t.whoLabel} sub={items.length ? null : t.whoSub} right={<PillChip label={t.addItemShort} selected onPress={addItem} />} onPress={addItem} />
          {items.map(it => {
            const who = whoOf(it);
            return (
              <View key={it.id} style={s.itemRow}>
                <Pressable onPress={() => patchItem(it.id, { who: nextWho(it.who) })} hitSlop={8}>{it.who === 'both' ? <AvatarPair members={[me, partner]} size={22} /> : <Avatar initial={who.initial} color={who.color} photo={who.avatar_url} size={24} />}</Pressable>
                <TextInput value={it.label} onChangeText={v => patchItem(it.id, { label: v })} placeholder={t.itemPlaceholder} placeholderTextColor={ph} returnKeyType="done" style={[s.itemInput, { flex: 1 }]} cursorColor={colors.coral} selectionColor={colors.coral} />
                <Pressable onPress={() => patchItem(it.id, { minutes: it.minutes >= 60 ? 5 : it.minutes + (it.minutes < 30 ? 5 : 15) })} hitSlop={6}><Text style={s.minutes}>{fmtMin(it.minutes)}</Text></Pressable>
                <Pressable onPress={() => removeItem(it.id)} hitSlop={8}><Text style={s.remove}>×</Text></Pressable>
              </View>
            );
          })}
          {noteOpen
            ? <View style={s.noteBox}><TextInput value={note} onChangeText={setNote} placeholder={t.notePlaceholder} placeholderTextColor={ph} multiline autoFocus returnKeyType="done" blurOnSubmit onSubmitEditing={() => { setNoteOpen(false); Keyboard.dismiss(); }} style={s.noteInput} /><View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}><PillChip label={copy.mission.noteDone} selected onPress={() => { setNoteOpen(false); Keyboard.dismiss(); }} /></View></View>
            : <Row label={t.noteLabel} sub={note || t.notePlaceholder} right={<Arrow />} onPress={() => setNoteOpen(true)} />}
        </Card>

        {existing
          ? <View style={{ marginTop: 18 }}><TrashButton onPress={remove} label={t.delete} /></View>
          : <View style={{ marginTop: 14 }}><CTAPrimary label={t.cta} disabled={!valid} onPress={save} big /></View>}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  sheet: { backgroundColor: colors.card, paddingTop: 10, paddingHorizontal: space.screenX },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 2, marginBottom: 12, paddingHorizontal: 2 },
  title: { ...font.cardTitle, padding: 0 },
  block: { marginBottom: 8 },
  inline: { fontSize: 15, fontWeight: '500', color: colors.ink, padding: 0, textAlign: 'right', minWidth: 60 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 14, borderTopWidth: 1, borderTopColor: colors.line },
  itemInput: { fontSize: 15, fontWeight: '500', color: colors.ink, padding: 0 },
  minutes: { fontSize: 13, fontWeight: '500', color: colors.muted, fontVariant: ['tabular-nums'] },
  remove: { fontSize: 18, lineHeight: 20, color: colors.muted, paddingHorizontal: 2 },
  noteBox: { paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderTopWidth: 1, borderTopColor: colors.line },
  noteInput: { fontSize: 15, color: colors.ink, minHeight: 60, textAlignVertical: 'top' },
});
