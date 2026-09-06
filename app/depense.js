// Formulaire dépense (pas d'artboard, DNA 30) — présenté en transparentModal par app/_layout.js :
// scrim + sheet qui monte, fermeture router.back(). Recette : docs/recettes/30b-depense.md
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable, ScrollView, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenTitle, Micro, Card, Avatar, CTAPrimary, Footer } from '../src/components/ui';

import { Icon, ICON, Chip, RoundButton, SheetHandle } from '../src/components/core/extra';
import { me, members } from '../src/demo';
import { occStore } from '../src/demo-core';
import { mutate, read, uuid } from '../src/store';
import { loadSetup, setup } from '../src/setup-state';
import { getUid, getPartnerUid, useIdentity } from '../src/identity';
import { localIso } from '../src/dates';
import copy from '../src/data/copy.json';
import { colors, space, font, alpha, radius, motion } from '../src/theme';

const t = copy.depense;
const parseAmount = s => Math.round(parseFloat(String(s).replace(',', '.')) * 100) || 0;

export default function Depense() {
  const insets = useSafeAreaInsets();
  useIdentity(); // vrais prénoms/photos des payeurs
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(me.id);
  const [dayOffset, setDayOffset] = useState(0);
  const valid = title.trim().length > 0 && parseAmount(amount) > 0;

  // Dépense RÉELLE (décision Jeanne 6 sept 2026 : table expenses synchronisée à deux) —
  // sans catégorie (décision Jeanne 6 sept : rien ne s'en sert en v1, la base garde « autre ») :
  // ligne locale + file de synchro, le Budget se relit via occStore ; sans foyer (démo) on ferme.
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await loadSetup();
      const hid = setup.householdId;
      const uid = getUid();
      if (hid && uid) {
        const households = await read('households');
        const currency = households.find(h => h.id === hid)?.currency || 'EUR';
        const d = new Date(); d.setDate(d.getDate() - dayOffset);
        await mutate('expenses', {
          id: uuid(), household_id: hid, title: title.trim(), emoji: null,
          amount_cents: parseAmount(amount), currency,
          paid_by: paidBy === me.id ? uid : (getPartnerUid() || uid),
          split_mode: 'equal', category: 'autre', spent_on: localIso(d), created_by: uid,
        });
        occStore.bump();
      }
    } catch (e) { /* hors ligne : la file rejouera */ }
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
        <View style={[s.sheet, { flex: 1 }]}>
          <SheetHandle />
          <ScrollView contentInsetAdjustmentBehavior="never" automaticallyAdjustKeyboardInsets contentContainerStyle={{ paddingHorizontal: space.headerX, paddingBottom: 24 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={s.header}>
              <ScreenTitle style={{ letterSpacing: -1.1 }}>{t.title}</ScreenTitle>
              <RoundButton size={32} onPress={() => router.back()} accessibilityLabel={copy.common.cancel}><Icon d={ICON.close} size={15} sw={2} /></RoundButton>
            </View>
            <Micro style={s.label}>{t.titleLabel}</Micro>
            <Card padding={0}>
              <TextInput value={title} onChangeText={setTitle} placeholder={t.titlePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)}
                autoCapitalize="sentences" returnKeyType="next" cursorColor={colors.coral} selectionColor={colors.coral} style={s.input} />
            </Card>

            <Micro style={s.label}>{t.amountLabel}</Micro>
            <Card padding={0}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18 }}>
                <TextInput value={amount} onChangeText={setAmount} placeholder={t.amountPlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)}
                  keyboardType="decimal-pad" cursorColor={colors.coral} selectionColor={colors.coral} style={[s.input, s.amount]} />
                <Text style={{ fontSize: 20, fontWeight: '600', color: colors.muted }}>€</Text>
              </View>
            </Card>

            <Micro style={s.label}>{t.paidByLabel}</Micro>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {members.map(m => {
                const on = m.id === paidBy;
                return (
                  <Pressable key={m.id} onPress={() => setPaidBy(m.id)} style={{ flex: 1 }}>
                    <Card padding={0} accent={on ? m.color : undefined} style={s.payer}>
                      <Avatar initial={m.initial} color={m.color} photo={m.avatar_url} size={28} />
                      <Text style={font.row}>{m.first_name}</Text>
                    </Card>
                  </Pressable>
                );
              })}
            </View>

            <Micro style={s.label}>{t.dateLabel}</Micro>
            <View style={s.chips}>
              <Chip label={t.dateToday} on={dayOffset === 0} onPress={() => setDayOffset(0)} />
              <Chip label={t.dateYesterday} on={dayOffset === 1} onPress={() => setDayOffset(1)} />
            </View>
          </ScrollView>

          <Footer bottom={Math.max(insets.bottom, space.footerBottom)}><CTAPrimary label={t.cta} disabled={!valid || busy} onPress={submit} /></Footer>
        </View>
    </View>
  );
}

const s = StyleSheet.create({
  sheet: { backgroundColor: colors.card, paddingTop: 10 },
  header: { paddingTop: 6, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { marginTop: 18, marginBottom: 9 },
  input: { paddingVertical: 15, paddingHorizontal: 18, fontSize: 17, fontWeight: '600', color: colors.ink },
  amount: { flex: 1, paddingHorizontal: 0, fontSize: 24, fontWeight: '700', letterSpacing: -1.2, fontVariant: ['tabular-nums'] },
  payer: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12, borderRadius: radius.card },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
