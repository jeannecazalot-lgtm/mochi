// ═══════════════════════════════════════════════════════════════════
// DateGrid — calendrier compact partagé (événement, dépense « autre date ») : même recette
// que la vue Mois du Planning. `allowPast` : une dépense peut dater d'il y a quelques jours
// (retour Ketley 12 sept 2026 : « je peux me rappeler d'une dépense quelques jours après »).
// ═══════════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Micro } from './ui';
import { localIso } from '../dates';
import copy from '../copy';
import { colors } from '../theme';
import { styles as v3Styles, currentTokens as tk } from '../theme-v3';

// `canPick` / `onLocked` : jours hors de la semaine gratuite (src/week.js) → visibles, grisés, ouvrent Mochi+
export function DateGrid({ value, onChange, allowPast = false, canPick = null, onLocked = null }) {
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
          const locked = !off && canPick && !canPick(iso);
          return (
            <View key={i} style={s.cell}>
              <Pressable disabled={off} onPress={() => (locked ? onLocked?.() : onChange(iso))} style={[s.day, on && s.dayOn, (off || locked) && { opacity: 0.3 }]}>
                <Text style={[s.dayNum, on && { color: tk().bg }]}>{d}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const s = v3Styles(T => StyleSheet.create({
  grid: { paddingHorizontal: 12, paddingBottom: 12 },
  monthHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingBottom: 6 },
  monthArrow: { fontSize: 22, lineHeight: 24, color: T.ink, paddingHorizontal: 8 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap' },
  dow: { width: '14.2857%', textAlign: 'center', fontSize: 10.5, letterSpacing: 1, fontWeight: '600', color: T.muted, marginBottom: 4 },
  cell: { width: '14.2857%', height: 36, padding: 2 },
  day: { flex: 1, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  dayOn: { backgroundColor: T.ink },
  dayNum: { fontSize: 13.5, fontWeight: '600', color: T.ink, fontVariant: ['tabular-nums'] },
}));
