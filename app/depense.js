// Formulaire dépense (pas d'artboard, DNA 30) — présenté en transparentModal par app/_layout.js :
// scrim + sheet qui monte, fermeture router.back(). Recette : docs/recettes/30b-depense.md
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable, ScrollView, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenTitle, Micro, Card, Avatar, CTAPrimary, Footer } from '../src/components/ui';

import { Icon, ICON, Chip, RoundButton, SheetHandle } from '../src/components/core/extra';
import { me, members } from '../src/demo';
import { expenseCategories } from '../src/demo-core';
import copy from '../src/data/copy.json';
import { colors, space, font, alpha, radius, motion } from '../src/theme';

const t = copy.depense;
const parseAmount = s => Math.round(parseFloat(String(s).replace(',', '.')) * 100) || 0;

export default function Depense() {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(me.id);
  const [category, setCategory] = useState(expenseCategories[0]);
  const [dayOffset, setDayOffset] = useState(0);
  const valid = title.trim().length > 0 && parseAmount(amount) > 0;

  // persistance Supabase à brancher ; pour l'instant on ferme simplement
  const submit = () => { router.back(); };

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
                      <Avatar initial={m.initial} color={m.color} size={28} />
                      <Text style={font.row}>{m.first_name}</Text>
                    </Card>
                  </Pressable>
                );
              })}
            </View>

            <Micro style={s.label}>{t.categoryLabel}</Micro>
            <View style={s.chips}>
              {expenseCategories.map(c => <Chip key={c} label={t.categories[c]} on={c === category} onPress={() => setCategory(c)} />)}
            </View>

            <Micro style={s.label}>{t.dateLabel}</Micro>
            <View style={s.chips}>
              <Chip label={t.dateToday} on={dayOffset === 0} onPress={() => setDayOffset(0)} />
              <Chip label={t.dateYesterday} on={dayOffset === 1} onPress={() => setDayOffset(1)} />
            </View>
          </ScrollView>

          <Footer bottom={Math.max(insets.bottom, space.footerBottom)}><CTAPrimary label={t.cta} disabled={!valid} onPress={submit} /></Footer>
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
