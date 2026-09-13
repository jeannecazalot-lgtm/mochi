// ═══════════════════════════════════════════════════════════════════
// DateGrid — calendrier compact partagé (événement, dépense « autre date ») : même recette
// que la vue Mois du Planning. `allowPast` : une dépense peut dater d'il y a quelques jours
// (retour Ketley 12 sept 2026 : « je peux me rappeler d'une dépense quelques jours après »).
// ═══════════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Micro } from './ui';
import { localIso } from '../dates';
import copy from '../data/copy.json';
import { colors } from '../theme';

export function DateGrid({ value, onChange, allowPast = false }) {
  const tc = copy.calendar;
  const [offset, setOffset] = useState(0);
  const base = new Date();
  const first = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const year = first.getFullYear(), month = first.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (first.getDay() + 6) % 7;
  const cells = Array.from({ length: Math.ceil((firstDow + daysInMonth) / 7) * 7 }, (_, i) => { const d = i - firstDow + 1; return d >= 1 && d <= daysInMonth ? d : null; });
  const todayIso = localIso();
  return (
    <View style={s.grid}>
      <View style={s.monthHead}>
        <Pressable onPress={() => setOffset(o => o - 1)} hitSlop={10}><Text style={s.monthArrow}>‹</Text></Pressable>
        <Micro>{tc.months[month].toUpperCase()}{year !== base.getFullYear() ? ` ${year}` : ''}</Micro>
        <Pressable onPress={() => setOffset(o => o + 1)} hitSlop={10}><Text style={s.monthArrow}>›</Text></Pressable>
      </View>
      <View style={s.gridRow}>{tc.dows.map((d, i) => <Text key={i} style={s.dow}>{d}</Text>)}</View>
      <View style={s.gridRow}>
        {cells.map((d, i) => {
          if (!d) return <View key={i} style={s.cell} />;
          const iso = localIso(new Date(year, month, d));
          const on = iso === value, off = allowPast ? iso > todayIso : iso < todayIso;
          return (
            <View key={i} style={s.cell}>
              <Pressable disabled={off} onPress={() => onChange(iso)} style={[s.day, on && s.dayOn, off && { opacity: 0.3 }]}>
                <Text style={[s.dayNum, on && { color: colors.card }]}>{d}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  grid: { paddingHorizontal: 12, paddingBottom: 12 },
  monthHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingBottom: 6 },
  monthArrow: { fontSize: 22, lineHeight: 24, color: colors.ink, paddingHorizontal: 8 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap' },
  dow: { width: '14.2857%', textAlign: 'center', fontSize: 10.5, letterSpacing: 1, fontWeight: '600', color: colors.muted, marginBottom: 4 },
  cell: { width: '14.2857%', height: 36, padding: 2 },
  day: { flex: 1, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  dayOn: { backgroundColor: colors.ink },
  dayNum: { fontSize: 13.5, fontWeight: '600', color: colors.ink, fontVariant: ['tabular-nums'] },
});
