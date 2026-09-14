// Dépense (sheet) — même langage que la sheet Tâche (Jeanne 14 sept 2026). `?id=` = édition
// (retour Jeanne 13 sept : « je ne peux pas modifier les dépenses »). Table `expenses`, parts égales.
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Card } from '../src/components/ui';
import { SheetHandle } from '../src/components/social/extra';
import { Row, PillChip, Arrow } from '../src/components/task/proto';
import { DateGrid } from '../src/components/date-grid';
import { useSheetGrow } from '../src/components/sheet-grow';
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
const fmtDate = iso => new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso + 'T12:00:00'));

export default function Depense() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  useIdentity();
  const [existing, setExisting] = useState(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('me');
  const [dateIso, setDateIso] = useState(localIso());
  const [dateOpen, setDateOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const todayIso = localIso(), yesterdayIso = addDaysIso(-1);
  const onGrowLayout = useSheetGrow(dateOpen);
  useEffect(() => { if (!id) return; read('expenses').then(rows => { const e = rows.find(x => x.id === id); if (!e) return; setExisting(e); setTitle(e.title || ''); setAmount((e.amount_cents / 100).toFixed(2).replace('.', ',')); setPaidBy(e.paid_by === getUid() ? 'me' : 'partner'); setDateIso(e.spent_on); }); }, [id]);
  const valid = title.trim().length > 0 && parseAmount(amount) > 0;

  const submit = async () => {
    if (busy || !valid) return;
    setBusy(true);
    try {
      await loadSetup();
      const hid = setup.householdId;
      const uid = getUid();
      if (hid && uid) {
        const households = await read('households');
        const currency = households.find(h => h.id === hid)?.currency || 'EUR';
        await mutate('expenses', {
          ...(existing || { id: uuid(), household_id: hid, emoji: null, split_mode: 'equal', category: 'autre', created_by: uid, currency }),
          title: title.trim(), amount_cents: parseAmount(amount),
          paid_by: paidBy === 'me' ? uid : (getPartnerUid() || uid), spent_on: dateIso,
        });
        occStore.bump();
        if (!existing) {
          const vars = { title: title.trim(), amount: `${(parseAmount(amount) / 100).toFixed(2).replace('.', ',')} €` };
          logActivity({ type: 'ping', preset_key: 'expenseAdded', payload: vars }).catch(() => {});
          pushToPartner('expenseAdded', vars, '/(tabs)/budget');
        }
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
        <View style={s.head}>
          <TextInput value={title} onChangeText={setTitle} placeholder={t.titlePlaceholder} placeholderTextColor={ph} autoCapitalize="sentences" returnKeyType="done" onSubmitEditing={Keyboard.dismiss} cursorColor={colors.coral} selectionColor={colors.coral} style={s.title} />
        </View>
        <Card r={16} padding={0} style={s.block}>
          <Row first label={t.amountLabel} right={<View style={s.amountBox}><TextInput value={amount} onChangeText={setAmount} placeholder={t.amountPlaceholder} placeholderTextColor={ph} keyboardType="decimal-pad" style={s.amountInput} cursorColor={colors.coral} selectionColor={colors.coral} /><Text style={s.amountUnit}>€</Text></View>} />
          <Row label={t.paidByLabel} right={<View style={{ flexDirection: 'row', gap: 6 }}><PillChip label={me.first_name} avatar={me} selected={paidBy === 'me'} onPress={() => setPaidBy('me')} /><PillChip label={partner.first_name} avatar={partner} selected={paidBy === 'partner'} onPress={() => setPaidBy('partner')} /></View>} />
          <Row label={t.dateLabel} right={<View style={{ flexDirection: 'row', gap: 6 }}><PillChip label={t.dateYesterday} selected={dateIso === yesterdayIso && !dateOpen} onPress={() => { setDateIso(yesterdayIso); setDateOpen(false); }} /><PillChip label={t.dateToday} selected={dateIso === todayIso && !dateOpen} onPress={() => { setDateIso(todayIso); setDateOpen(false); }} /><PillChip label={dateOpen || (dateIso !== todayIso && dateIso !== yesterdayIso) ? dateLabel : t.dateOther} selected={dateOpen || (dateIso !== todayIso && dateIso !== yesterdayIso)} onPress={() => setDateOpen(o => !o)} /></View>} />
          {dateOpen ? <DateGrid value={dateIso} onChange={iso => { setDateIso(iso); setDateOpen(false); }} allowPast /> : null}
        </Card>
        <Card r={16} padding={0}>
          <Row first strong label={existing ? copy.common.save : t.cta} sub={valid ? null : t.needAll} right={<Arrow />} onPress={valid ? submit : undefined} />
          {existing ? <Row label={<Text style={{ color: colors.coralDeep }}>{t.delete}</Text>} onPress={remove} /> : null}
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
  amountBox: { flexDirection: 'row', alignItems: 'center', gap: 4, borderBottomWidth: 1.5, borderBottomColor: colors.ink, paddingBottom: 2 },
  amountInput: { fontSize: 17, fontWeight: '600', color: colors.ink, minWidth: 64, textAlign: 'right', padding: 0, fontVariant: ['tabular-nums'] },
  amountUnit: { fontSize: 15, fontWeight: '600', color: colors.ink },
});
