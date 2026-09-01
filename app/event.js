// Écran 30 · Événement social (modal sheet). Recette : docs/recettes/30-event.md
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { PillLabel, Divider, Avatar } from '../src/components/ui';
import { ModalSheet, SectionLabel, EmbossedCard, CtaModal, extraColors } from '../src/components/modaux/extra';
import { me, partner, byId, fmtMin, fmtMoney } from '../src/demo';
import { demoEvent, fmtEventWhen } from '../src/demo-modaux';
import copy from '../src/data/copy.json';
import { colors, font, radius, alpha } from '../src/theme';

const ph = alpha(colors.ink, 0.3);

export default function Event() {
  const t = copy.event;
  const [title, setTitle] = useState(demoEvent.title);
  const [details, setDetails] = useState(fmtEventWhen(demoEvent));
  const [items, setItems] = useState(demoEvent.items);
  const [budget, setBudget] = useState(fmtMoney(demoEvent.budget_cents).replace(/\s/g, ''));
  const [dress, setDress] = useState(demoEvent.dress);
  const [dressNote, setDressNote] = useState(demoEvent.dress_note);

  const toggleWho = id => setItems(list => list.map(it => it.id === id ? { ...it, who: it.who === me.id ? partner.id : me.id } : it));

  return (
    <ModalSheet>
        <ScrollView contentInsetAdjustmentBehavior="never" automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="handled" contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
          <View style={s.eyebrow}>
            <PillLabel color={colors.lavender}>{t.eyebrow}</PillLabel>
            <Pressable onPress={() => router.back()} hitSlop={8}><Text style={s.cancel}>{copy.common.cancel}</Text></Pressable>
          </View>

          <EmbossedCard tint={colors.lavender} tintOpacity={0.45} offset={[4, 5]} r={radius.cardLg} padding={0} style={{ marginBottom: 14 }}>
            <View style={s.hero}>
              <View style={s.tile}><Text style={{ fontSize: 22 }}>{demoEvent.emoji}</Text></View>
              <View style={{ flex: 1 }}>
                <TextInput value={title} onChangeText={setTitle} placeholder={t.titlePlaceholder} placeholderTextColor={ph} style={s.heroTitle} cursorColor={colors.coral} selectionColor={colors.coral} />
                <TextInput value={details} onChangeText={setDetails} placeholder={t.detailsPlaceholder} placeholderTextColor={ph} style={s.heroSub} cursorColor={colors.coral} selectionColor={colors.coral} />
              </View>
            </View>
          </EmbossedCard>

          <SectionLabel>{t.whoLabel}</SectionLabel>
          <View style={[s.card, { marginBottom: 14 }]}>
            {items.map((it, i) => {
              const who = byId(it.who);
              return (
                <View key={it.id}>
                  {i > 0 && <Divider />}
                  <View style={s.row}>
                    <Pressable onPress={() => toggleWho(it.id)} hitSlop={8}><Avatar initial={who.initial} color={who.color} photo={who.avatar_url} size={24} /></Pressable>
                    <Text style={[font.row, { flex: 1 }]}>{it.label}</Text>
                    <Text style={s.minutes}>{fmtMin(it.minutes)}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={s.duo}>
            <EmbossedCard tint={colors.butter} tintOpacity={0.4} offset={[3, 4]} r={radius.row} padding={0} style={{ flex: 1 }}>
              <View style={s.small}>
                <Text style={s.smallLabel}>{t.budgetLabel}</Text>
                <TextInput value={budget} onChangeText={setBudget} keyboardType="numbers-and-punctuation" style={s.amount} cursorColor={colors.coral} selectionColor={colors.coral} />
                <Text style={s.smallHint}>{t.budgetHint}</Text>
              </View>
            </EmbossedCard>
            <EmbossedCard tint={colors.sky} tintOpacity={0.35} offset={[3, 4]} r={radius.row} padding={0} style={{ flex: 1 }}>
              <View style={s.small}>
                <Text style={s.smallLabel}>{t.dressLabel}</Text>
                <TextInput value={dress} onChangeText={setDress} placeholder={t.dressPlaceholder} placeholderTextColor={ph} style={s.dress} cursorColor={colors.coral} selectionColor={colors.coral} />
                <TextInput value={dressNote} onChangeText={setDressNote} placeholder={t.dressNotePlaceholder} placeholderTextColor={ph} style={[s.smallHint, { fontStyle: 'italic' }]} cursorColor={colors.coral} selectionColor={colors.coral} />
              </View>
            </EmbossedCard>
          </View>

          <CtaModal label={t.cta} disabled={!title.trim()} onPress={() => router.back()} />
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
  heroSub: { fontSize: 13.5, fontWeight: '400', color: colors.muted, marginTop: 4, padding: 0 },
  card: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, paddingVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 11, paddingHorizontal: 16 },
  minutes: { fontSize: 13, fontWeight: '500', color: colors.muted, fontVariant: ['tabular-nums'] },
  duo: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  small: { paddingVertical: 13, paddingHorizontal: 14 },
  smallLabel: { fontSize: 10.5, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', color: colors.muted, marginBottom: 6 },
  amount: { fontSize: 20, fontWeight: '700', letterSpacing: -0.8, color: colors.ink, fontVariant: ['tabular-nums'], padding: 0 },
  dress: { fontSize: 16, fontWeight: '600', letterSpacing: -0.2, color: colors.ink, padding: 0, lineHeight: 18 },
  smallHint: { fontSize: 11.5, fontWeight: '400', color: colors.muted, marginTop: 3, padding: 0 },
});
