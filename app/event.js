// Écran 30 · Événement social (modal sheet). Recette : docs/recettes/30-event.md
// Réel depuis le 7 sept 2026 (retour Jeanne : « pas de chose prédéfinie, on n'a pas la main ») :
// formulaire vide, date dans un calendrier, emoji au choix, lignes « Qui porte quoi » éditables ;
// écrit dans `events` (détails en jsonb, migration 0007). `?id=` = édition d'un événement existant.
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { PillLabel, Divider, Avatar, Micro } from '../src/components/ui';
import { ModalSheet, SectionLabel, EmbossedCard, CtaModal, extraColors } from '../src/components/modaux/extra';
import { me, partner, fmtMin } from '../src/demo';
import { read, mutate, uuid } from '../src/store';
import { loadSetup, setup } from '../src/setup-state';
import { getUid, getPartnerUid } from '../src/identity';
import { isPremium } from '../src/demo-premium';
import { localIso, addDaysIso } from '../src/dates';
import { occStore } from '../src/demo-core';
import { DateGrid } from '../src/components/date-grid';
import { AvatarPair } from '../src/components/core/extra';
import { logActivity } from '../src/activity-actions';
import { pushToPartner } from '../src/push';
import copy from '../src/data/copy.json';
import { colors, font, radius, alpha } from '../src/theme';

const ph = alpha(colors.ink, 0.3);
const EMOJIS = ['🎂', '🍽️', '🎉', '🎁', '✈️', '🏡', '🩺', '🎓', '💍', '🎭', '⚽', '📅'];
const fmtDate = iso => new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso + 'T12:00:00'));
const sameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export default function Event() {
  const t = copy.event;
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [date, setDate] = useState(null); // 'YYYY-MM-DD'
  const [dateOpen, setDateOpen] = useState(false);
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  const [items, setItems] = useState([]); // [{ id, label, who: 'me' | 'partner', minutes }]
  // tenue / budget cadeau retirés (Jeanne, 9 sept 2026) : « Qui porte quoi » couvre la tenue, la dépense se saisit quand on la paie
  const [note, setNote] = useState(''); // note libre → récap du jour (Ketley 12 sept 2026)
  const [existing, setExisting] = useState(null);

  // édition : on recharge l'événement du foyer
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

  const pickDate = iso => {
    // gratuit : une ponctuelle se pose dans les 7 jours (kickoff) ; au-delà → Duo+
    if (iso > addDaysIso(7) && !isPremium()) { router.push('/paywall'); return; }
    setDate(iso); setDateOpen(false);
    Haptics.selectionAsync().catch(() => {});
  };
  const patchItem = (iid, p) => setItems(l => l.map(it => (it.id === iid ? { ...it, ...p } : it)));
  const addItem = () => setItems(l => [...l, { id: uuid(), label: '', who: 'me', minutes: 15 }]);
  const removeItem = iid => setItems(l => l.filter(it => it.id !== iid));
  // porteur d'une ligne : moi → l'autre → à deux (retour Ketley 12 sept 2026 : « on devrait pouvoir mettre les deux »)
  const whoOf = it => (it.who === 'partner' ? partner : me);
  const nextWho = w => (w === 'me' ? 'partner' : w === 'partner' ? 'both' : 'me');

  const save = async () => {
    await loadSetup();
    const hid = setup.householdId;
    const uid = getUid();
    if (!hid || !uid) { router.back(); return; } // démo : rien à écrire
    const puid = getPartnerUid();
    const who = [...new Set(items.flatMap(it => (it.who === 'both' ? [uid, puid] : it.who === 'partner' ? [puid] : [uid])).filter(Boolean))];
    const [h, m] = /^(\d{1,2})\s*[h:]?\s*(\d{0,2})$/.exec(time.trim()) ? [RegExp.$1, RegExp.$2 || '0'] : ['20', '0'];
    const starts = new Date(`${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);
    await mutate('events', {
      ...(existing || { id: uuid(), household_id: hid, created_by: uid }),
      title: title.trim(), emoji, starts_at: starts.toISOString(), who,
      details: { ...(existing?.details || {}), note: note.trim(), time: time.trim(), place: place.trim(), items: items.filter(it => it.label.trim()).map(it => ({ ...it, label: it.label.trim() })) },
    });
    occStore.bump();
    // le fil et l'autre téléphone en sont informés (retour Ketley 12 sept : « ça n'apparaît pas dans activité »)
    if (!existing) {
      const vars = { event: title.trim(), day: fmtDate(date) };
      logActivity({ type: 'ping', preset_key: 'eventCreated', payload: vars }).catch(() => {});
      pushToPartner('eventCreated', vars, '/(tabs)/planning');
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.back();
  };

  return (
    <ModalSheet>
      <ScrollView contentInsetAdjustmentBehavior="never" automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="handled" contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.eyebrow}>
          <PillLabel color={colors.lavender}>{t.eyebrow}</PillLabel>
          <Pressable onPress={() => router.back()} hitSlop={8}><Text style={s.cancel}>{copy.common.cancel}</Text></Pressable>
        </View>

        <EmbossedCard tint={colors.lavender} tintOpacity={0.45} offset={[4, 5]} r={radius.cardLg} padding={0} style={{ marginBottom: 14 }}>
          <View style={s.hero}>
            <Pressable onPress={() => setEmojiOpen(o => !o)} style={[s.tile, emojiOpen && { borderColor: colors.ink }]}><Text style={{ fontSize: 22 }}>{emoji}</Text></Pressable>
            <View style={{ flex: 1 }}>
              <TextInput value={title} onChangeText={setTitle} placeholder={t.titlePlaceholder} placeholderTextColor={ph} style={s.heroTitle} cursorColor={colors.coral} selectionColor={colors.coral} />
              <View style={s.metaRow}>
                <Pressable onPress={() => setDateOpen(o => !o)} style={[s.metaChip, dateOpen && s.metaChipOn]}>
                  <Text style={[s.metaTxt, !date && !dateOpen && { color: ph }, dateOpen && { color: colors.card }]}>{date ? fmtDate(date) : t.datePlaceholder}</Text>
                </Pressable>
                <TextInput value={time} onChangeText={setTime} placeholder={t.timePlaceholder} placeholderTextColor={ph} style={[s.metaInput, { minWidth: 48 }]} cursorColor={colors.coral} selectionColor={colors.coral} />
                <TextInput value={place} onChangeText={setPlace} placeholder={t.placePlaceholder} placeholderTextColor={ph} style={[s.metaInput, { flex: 1 }]} cursorColor={colors.coral} selectionColor={colors.coral} />
              </View>
            </View>
          </View>
          {emojiOpen ? (
            <View style={s.emojiRow}>
              {EMOJIS.map(e => <Pressable key={e} onPress={() => { setEmoji(e); setEmojiOpen(false); }} style={[s.emojiBtn, e === emoji && { backgroundColor: alpha(colors.ink, 0.08) }]}><Text style={{ fontSize: 20 }}>{e}</Text></Pressable>)}
            </View>
          ) : null}
          {dateOpen ? <DateGrid value={date} onChange={pickDate} /> : null}
        </EmbossedCard>

        <SectionLabel>{t.whoLabel}</SectionLabel>
        <View style={[s.card, { marginBottom: 14 }]}>
          {items.map((it, i) => {
            const who = whoOf(it);
            return (
              <View key={it.id}>
                {i > 0 && <Divider />}
                <View style={s.row}>
                  <Pressable onPress={() => patchItem(it.id, { who: nextWho(it.who) })} hitSlop={8}>{it.who === 'both' ? <AvatarPair members={[me, partner]} size={20} /> : <Avatar initial={who.initial} color={who.color} photo={who.avatar_url} size={24} />}</Pressable>
                  <TextInput value={it.label} onChangeText={v => patchItem(it.id, { label: v })} placeholder={t.itemPlaceholder} placeholderTextColor={ph} style={[font.row, { flex: 1, padding: 0 }]} cursorColor={colors.coral} selectionColor={colors.coral} />
                  <Pressable onPress={() => patchItem(it.id, { minutes: it.minutes >= 60 ? 5 : it.minutes + (it.minutes < 30 ? 5 : 15) })} hitSlop={6}><Text style={s.minutes}>{fmtMin(it.minutes)}</Text></Pressable>
                  <Pressable onPress={() => removeItem(it.id)} hitSlop={8}><Text style={s.remove}>×</Text></Pressable>
                </View>
              </View>
            );
          })}
          {items.length ? <Divider /> : null}
          <Pressable onPress={addItem} style={s.row}><Text style={s.add}>{t.addItem}</Text></Pressable>
        </View>

        <SectionLabel>{t.noteLabel}</SectionLabel>
        <View style={[s.card, { marginBottom: 14 }]}>
          <TextInput value={note} onChangeText={setNote} placeholder={t.notePlaceholder} placeholderTextColor={ph} multiline style={[font.row, { padding: 14, minHeight: 56 }]} cursorColor={colors.coral} selectionColor={colors.coral} />
        </View>

        <CtaModal label={existing ? copy.common.save : t.cta} disabled={!title.trim() || !date} onPress={save} />
      </ScrollView>
    </ModalSheet>
  );
}

const s = StyleSheet.create({
  body: { paddingHorizontal: 22 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 },
  cancel: { fontSize: 14, fontWeight: '600', color: colors.muted },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 17, paddingHorizontal: 18 },
  tile: { width: 54, height: 54, borderRadius: 16, backgroundColor: extraColors.lavenderLight, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  heroTitle: { fontSize: 20, fontWeight: '600', letterSpacing: -0.7, color: colors.ink, padding: 0, lineHeight: 22 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  metaChip: { paddingVertical: 4, paddingHorizontal: 9, borderRadius: 999, backgroundColor: alpha(colors.ink, 0.06) },
  metaChipOn: { backgroundColor: colors.ink },
  metaTxt: { fontSize: 13, fontWeight: '500', color: colors.ink },
  metaInput: { fontSize: 13.5, fontWeight: '400', color: colors.muted, padding: 0 },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, paddingHorizontal: 14, paddingBottom: 12 },
  emojiBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, paddingVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 11, paddingHorizontal: 16 },
  minutes: { fontSize: 13, fontWeight: '500', color: colors.muted, fontVariant: ['tabular-nums'] },
  remove: { fontSize: 18, lineHeight: 20, color: colors.muted, paddingHorizontal: 2 },
  add: { fontSize: 14, fontWeight: '600', color: colors.sageDeep },
  duo: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  small: { paddingVertical: 13, paddingHorizontal: 14 },
  smallLabel: { fontSize: 10.5, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', color: colors.muted, marginBottom: 6 },
  amount: { fontSize: 20, fontWeight: '700', letterSpacing: -0.8, color: colors.ink, fontVariant: ['tabular-nums'], padding: 0 },
  dress: { fontSize: 16, fontWeight: '600', letterSpacing: -0.2, color: colors.ink, padding: 0, lineHeight: 18 },
  smallHint: { fontSize: 11.5, fontWeight: '400', color: colors.muted, marginTop: 3, padding: 0 },
});
