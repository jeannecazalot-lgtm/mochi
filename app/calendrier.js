// Écran 35 · Calendrier mois (Duo+). Recette : docs/recettes/35-calendrier.md
import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, Avatar, Divider } from '../src/components/ui';
import { BackButton, RoundButton, PremiumGate, premiumTokens } from '../src/components/premium/extra';
import { members, byId, today } from '../src/demo';
import { monthOccurrences, isPremium } from '../src/demo-premium';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, alpha } from '../src/theme';

const t = copy.calendar;
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export default function Calendrier() {
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today);
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const days = useMemo(() => monthOccurrences(year, month), [year, month]);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // lundi = 0
  const cells = Array.from({ length: Math.ceil((firstDow + daysInMonth) / 7) * 7 }, (_, i) => { const d = i - firstDow + 1; return d >= 1 && d <= daysInMonth ? d : null; });

  const shift = n => { const c = new Date(year, month + n, 1); setCursor(c); };
  const sel = selected.getFullYear() === year && selected.getMonth() === month ? days[selected.getDate()] : null;
  const selIsToday = sameDay(selected, today);
  const selLabel = `${t.dowsLong[(selected.getDay() + 6) % 7]} ${selected.getDate()}${selIsToday ? ` · ${t.today}` : ''}`.toUpperCase();

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={s.header}>
            <BackButton label={copy.common.back} />
            <View style={{ flex: 1 }}>
              <View style={{ marginBottom: 6 }}><PillLabel color={colors.butter}>{t.pill}</PillLabel></View>
              <Text style={s.month}>{t.months[month]}{year !== today.getFullYear() ? ` ${year}` : ''}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <RoundButton icon="prev" onPress={() => shift(-1)} label={t.prev} />
              <RoundButton icon="next" onPress={() => shift(1)} label={t.next} />
            </View>
          </View>

          {!isPremium() && <PremiumGate title={t.gateTitle} sub={t.gateSub} cta={t.gateCta} style={{ marginBottom: 11 }} />}

          <View style={{ paddingHorizontal: space.screenX }}>
            <View style={s.grid}>
              {t.dows.map((d, i) => <Text key={i} style={s.dow}>{d}</Text>)}
            </View>
            <View style={s.grid}>
              {cells.map((d, i) => {
                if (!d) return <View key={i} style={s.cell} />;
                const date = new Date(year, month, d);
                const isToday = sameDay(date, today), isSel = sameDay(date, selected);
                const info = days[d];
                return (
                  <View key={i} style={s.cell}>
                    <Pressable onPress={() => setSelected(date)} style={[s.day, isToday && s.today, isToday && premiumTokens.todayShadow, info?.missed && s.missed, isSel && !isToday && s.selected]}>
                      <Text style={[s.dayNum, isToday && { color: colors.card }]}>{d}</Text>
                      <View style={{ flexDirection: 'row', gap: 5, height: 4 }}>
                        {(info?.assignees || []).map(id => <View key={id} style={[s.dot, { backgroundColor: isToday ? colors.butterLight : byId(id).color }]} />)}
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
            <View style={s.legend}>
              {members.map(m => <Text key={m.id} style={s.legendItem}><Text style={{ color: m.color }}>● </Text>{m.first_name}</Text>)}
              <Text style={s.legendItem}><Text style={{ color: colors.coral }}>◻ </Text>{t.legendMissed}</Text>
            </View>
          </View>

          <View style={{ paddingHorizontal: 22 }}>
            <Card padding={0} r={radius.card} style={{ paddingVertical: 13, paddingHorizontal: 16 }}>
              <Text style={[font.micro, { marginBottom: 9 }]}>{selLabel}</Text>
              {sel?.items?.length ? sel.items.map((o, i) => {
                const who = o.assignee_id ? byId(o.assignee_id) : null;
                return (
                  <View key={o.id}>
                    {i > 0 && <Divider />}
                    <View style={s.row}>
                      <Text style={{ fontSize: 17 }}>{o.task.emoji}</Text>
                      <Text style={s.rowLabel}>{o.task.title}{o.time ? ` · ${o.time}` : ''}</Text>
                      {who ? <Avatar initial={who.initial} color={who.color} size={22} /> : null}
                    </View>
                  </View>
                );
              }) : <Text style={font.secondary}>{t.empty}</Text>}
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 14, paddingHorizontal: space.headerX, marginBottom: 11, flexDirection: 'row', alignItems: 'center', gap: 12 },
  month: { fontSize: 22, fontWeight: '600', letterSpacing: -1.2, lineHeight: 24, color: colors.ink },
  // 7 colonnes exactes (1/7), gouttière 5 obtenue par 2,5 de chaque côté de la cellule (l'artboard : grid gap 5)
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -2.5, marginBottom: 6 },
  dow: { width: '14.2857%', textAlign: 'center', fontSize: 10.5, letterSpacing: 1, fontWeight: '600', color: colors.muted },
  cell: { width: '14.2857%', height: 44, paddingHorizontal: 2.5, marginBottom: 5 },
  day: { flex: 1, borderRadius: 10, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center', gap: 5 },
  today: { backgroundColor: colors.ink, borderWidth: 0 },
  missed: { borderWidth: 1.5, borderColor: colors.coral },
  selected: { borderWidth: 1.5, borderColor: alpha(colors.ink, 0.22) },
  dayNum: { fontSize: 14, fontWeight: '600', color: colors.ink, fontVariant: ['tabular-nums'] },
  dot: { width: 4, height: 4, borderRadius: 2 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 10, marginBottom: 12 },
  legendItem: { fontSize: 12, fontWeight: '500', color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 },
  rowLabel: { flex: 1, fontSize: 14.5, fontWeight: '500', color: colors.ink },
});
