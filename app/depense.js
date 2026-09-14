// Dépense (sheet) — même langage que la sheet Tâche (Jeanne 14 sept 2026). `?id=` = édition
// (retour Jeanne 13 sept : « je ne peux pas modifier les dépenses »). Table `expenses`, parts égales.
import React, { useState, useEffect, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Card, CTAPrimary } from '../src/components/ui';
import { SheetHandle } from '../src/components/social/extra';
import { Row, PillChip, TrashButton } from '../src/components/task/proto';
import { DateGrid } from '../src/components/date-grid';
import { EmojiPicker } from '../src/components/emoji-picker';
import { useSheetGrow, CREATE_SHEET_MIN } from '../src/components/sheet-grow';
import { me, partner } from '../src/demo';
import { occStore } from '../src/demo-core';
import { mutate, read, uuid } from '../src/store';
import { loadSetup, setup } from '../src/setup-state';
import { getUid, getPartnerUid, useIdentity } from '../src/identity';
import { localIso, addDaysIso } from '../src/dates';
import { logActivity } from '../src/activity-actions';
import { pushToPartner } from '../src/push';
import copy from '../src/data/copy.json';
import { colors, space, font, alpha } from '../src/theme';

const t = copy.depense;
const ph = alpha(colors.ink, 0.3);
const parseAmount = s => Math.round(parseFloat(String(s).replace(',', '.')) * 100) || 0;
const EXPENSE_EMOJIS = ['💶', '🛒', '🍽️', '🏠', '🧸', '💊', '🚗', '🎁', '☕', '🎟️', '🐶', '👕'];
const fmtDate = iso => new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso + 'T12:00:00'));

export default function Depense() {
  const { id, demo } = useLocalSearchParams(); // demo=1 : dépense factice (captures)
  const insets = useSafeAreaInsets();
  useIdentity();
  const [existing, setExisting] = useState(null);
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState(EXPENSE_EMOJIS[0]);
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('me');
  const [dateIso, setDateIso] = useState(localIso());
  const [dateOpen, setDateOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const todayIso = localIso(), yesterdayIso = addDaysIso(-1);
  const onGrowLayout = useSheetGrow(dateOpen, false, CREATE_SHEET_MIN);
  useEffect(() => { if (demo === '1') { setExisting({ id: 'demo' }); setTitle('Pizzas'); setAmount('24,00'); setDateIso(addDaysIso(-9)); } }, [demo]);
  useEffect(() => { if (!id) return; read('expenses').then(rows => { const e = rows.find(x => x.id === id); if (!e) return; setExisting(e); setTitle(e.title || ''); setEmoji(e.emoji || EXPENSE_EMOJIS[0]); setAmount((e.amount_cents / 100).toFixed(2).replace('.', ',')); setPaidBy(e.paid_by === getUid() ? 'me' : 'partner'); setDateIso(e.spent_on); }); }, [id]);
  const valid = title.trim().length > 0 && parseAmount(amount) > 0;
  // existante : s'enregistre à la fermeture, comme la sheet Tâche (Jeanne 15 sept 2026)
  const latest = useRef(null); latest.current = { existing, title, emoji, amount, paidBy, dateIso, valid };
  const initial = useRef(null);
  useEffect(() => { if (existing && !initial.current) initial.current = JSON.stringify({ title, amount, paidBy, dateIso }); }, [existing]);
  useEffect(() => () => { const l = latest.current; if (!l?.existing || l.existing.id === 'demo' || !l.valid) return; if (JSON.stringify({ title: l.title, amount: l.amount, paidBy: l.paidBy, dateIso: l.dateIso }) !== initial.current) persist(l); }, []);

  const persist = async l => {
    await loadSetup();
    const hid = setup.householdId; const uid = getUid();
    if (!hid || !uid) return false;
    const households = await read('households');
    const currency = households.find(h => h.id === hid)?.currency || 'EUR';
    await mutate('expenses', {
      ...(l.existing || { id: uuid(), household_id: hid, split_mode: 'equal', category: 'autre', created_by: uid, currency }),
      title: l.title.trim(), emoji: l.emoji, amount_cents: parseAmount(l.amount),
      paid_by: l.paidBy === 'me' ? uid : (getPartnerUid() || uid), spent_on: l.dateIso,
    });
    occStore.bump();
    return true;
  };
  const submit = async () => {
    if (busy || !valid) return;
    setBusy(true);
    try {
      const ok = await persist({ existing, title, emoji, amount, paidBy, dateIso });
      if (ok && !existing) {
        const vars = { title: title.trim(), amount: `${(parseAmount(amount) / 100).toFixed(2).replace('.', ',')} €` };
        logActivity({ type: 'ping', preset_key: 'expenseAdded', payload: vars }).catch(() => {});
        pushToPartner('expenseAdded', vars, '/(tabs)/budget');
      }
    } catch (e) { /* hors ligne : la file rejouera */ }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.back();
  };
  const remove = async () => { if (!existing) return; await mutate('expenses', { ...existing, deleted_at: new Date().toISOString() }); occStore.bump(); router.back(); };
  const dateLabel = dateIso === todayIso ? t.dateToday : dateIso === yesterdayIso ? t.dateYesterday : fmtDate(dateIso);

  return (
    <KeyboardAvoidingView behavior="padding" style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]} onLayout={onGrowLayout}>
      <Pressable onPress={Keyboard.dismiss} accessible={false}>
        <SheetHandle />
        <View style={[s.head, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
          <EmojiPicker value={emoji} onChange={setEmoji} choices={EXPENSE_EMOJIS} />
          <TextInput value={title} onChangeText={setTitle} placeholder={t.titlePlaceholder} placeholderTextColor={ph} autoCapitalize="sentences" returnKeyType="done" onSubmitEditing={Keyboard.dismiss} cursorColor={colors.coral} selectionColor={colors.coral} style={[s.title, { flex: 1 }]} />
        </View>
        <Card r={16} padding={0} style={s.block}>
          <Row first label={t.amountLabel} right={<View style={s.amountBox}><TextInput value={amount} onChangeText={setAmount} placeholder={t.amountPlaceholder} placeholderTextColor={ph} keyboardType="decimal-pad" style={s.amountInput} cursorColor={colors.coral} selectionColor={colors.coral} /><Text style={s.amountUnit}>€</Text></View>} />
          <Row label={t.paidByLabel} right={<View style={{ flexDirection: 'row', gap: 6 }}><PillChip label={me.first_name} avatar={me} selected={paidBy === 'me'} onPress={() => setPaidBy('me')} /><PillChip label={partner.first_name} avatar={partner} selected={paidBy === 'partner'} onPress={() => setPaidBy('partner')} /></View>} />
          <Row label={t.dateLabel} right={<View style={{ flexDirection: 'row', gap: 6 }}><PillChip label={t.dateYesterday} selected={dateIso === yesterdayIso && !dateOpen} onPress={() => { setDateIso(yesterdayIso); setDateOpen(false); }} /><PillChip label={t.dateToday} selected={dateIso === todayIso && !dateOpen} onPress={() => { setDateIso(todayIso); setDateOpen(false); }} /><PillChip label={dateOpen || (dateIso !== todayIso && dateIso !== yesterdayIso) ? dateLabel : t.dateOther} selected={dateOpen || (dateIso !== todayIso && dateIso !== yesterdayIso)} onPress={() => setDateOpen(o => !o)} /></View>} />
          {dateOpen ? <DateGrid value={dateIso} onChange={iso => { setDateIso(iso); setDateOpen(false); }} allowPast /> : null}
        </Card>
        {existing
          ? <View style={{ marginTop: 18 }}><TrashButton onPress={remove} label={t.delete} /></View>
          : <View style={{ marginTop: 14 }}><CTAPrimary label={t.cta} disabled={!valid || busy} onPress={submit} big /></View>}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  sheet: { backgroundColor: colors.card, paddingTop: 10, paddingHorizontal: space.screenX },
  head: { marginTop: 2, marginBottom: 12, paddingHorizontal: 2 },
  title: { ...font.cardTitle, padding: 0 },
  block: { marginBottom: 8 },
  amountBox: { flexDirection: 'row', alignItems: 'center', gap: 4, borderBottomWidth: 1.5, borderBottomColor: colors.ink, paddingBottom: 2 },
  amountInput: { fontSize: 17, fontWeight: '600', color: colors.ink, minWidth: 64, textAlign: 'right', padding: 0, fontVariant: ['tabular-nums'] },
  amountUnit: { fontSize: 15, fontWeight: '600', color: colors.ink },
});
