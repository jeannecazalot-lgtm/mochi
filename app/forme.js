// Sheet « Forme de Mochi » (Jeanne, 13 nov 2026 : « appuyer sur Forme et comprendre pourquoi il est
// malade ou en bonne santé »). Trois blocs : son état · pourquoi (les derniers cœurs perdus / regagnés,
// lus dans mochi_events) · comment il remonte (les règles de mochi-state, dites simplement).
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SheetHandle } from '../src/components/social/extra';
import { Hearts, Label } from '../src/components/mochi/gauges';
import { useTokens, type } from '../src/theme-v3';
import { read } from '../src/store';
import { loadSetup, inRealMode } from '../src/setup-state';
import { getUid, useIdentity } from '../src/identity';
import { getMochi } from '../src/mochi-state';
import { partner } from '../src/demo';
import { fmtWeekday } from '../src/demo-task';
import { dayWord } from '../src/lang';
import copy from '../src/copy';

const fill = (str, vars) => String(str || '').replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export default function Forme() {
  const t = copy.forme;
  const T = useTokens();
  const insets = useSafeAreaInsets();
  useIdentity();
  const [m, setM] = useState(null);
  const [why, setWhy] = useState(null);

  useEffect(() => {
    (async () => {
      await loadSetup();
      if (!inRealMode()) { setM({ name: 'Mochi', hearts: 4 }); setWhy([]); return; }
      const [mo, evs, occs, tasks] = await Promise.all([getMochi(), read('mochi_events'), read('occurrences'), read('tasks')]);
      setM(mo);
      const occById = Object.fromEntries(occs.map(o => [o.id, o]));
      const title = id => (tasks.find(x => x.id === occById[id]?.task_id)?.title || '…').toLowerCase();
      const day = iso => dayWord(fmtWeekday(new Date(iso)));
      const uid = getUid();
      const lines = evs
        .filter(e => e.type === 'heart_lost' || e.type === 'heart_gained' || (e.type === 'week_closed' && e.payload?.healthy))
        .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
        .slice(0, 5)
        .map(e => ({
          id: e.id,
          minus: e.type === 'heart_lost',
          text: e.type === 'heart_lost'
            ? fill(t.lost, { task: title(e.occurrence_id), who: e.actor_id === uid ? t.you : partner.first_name, day: day(e.created_at) })
            : e.type === 'heart_gained' ? fill(t.gained, { task: title(e.occurrence_id), day: day(e.created_at) })
            : t.healthyWeek,
        }));
      setWhy(lines);
    })();
  }, []);

  if (!m) return <View style={{ height: 160, backgroundColor: T.bg }} />;
  const hearts = m.hearts ?? 5;
  return (
    <View style={[s.sheet, { backgroundColor: T.bg, paddingBottom: Math.max(insets.bottom, 31) }]}>
      <SheetHandle />
      <Text style={[s.title, { color: T.ink }]}>{fill(t.titles[hearts] || t.titles[0], { name: m.name || 'Mochi' })}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}><Hearts T={T} n={hearts} /></View>

      <Text style={[type.section, { color: T.ink, marginTop: 24 }]}>{t.whyTitle}</Text>
      {why && why.length ? why.map((w, i) => (
        <View key={w.id} style={[s.row, { borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: T.line }]}>
          <Text style={[s.delta, { color: w.minus ? T.accent : T.ok }]}>{w.minus ? '− 1' : '+ 1'}</Text>
          <Text style={[type.body, { color: T.ink, flex: 1 }]}>{w.text}</Text>
        </View>
      )) : <Text style={[type.sub, { color: T.muted, marginTop: 8 }]}>{hearts >= 5 ? t.whyNoneFull : t.whyNone}</Text>}

      <Text style={[type.section, { color: T.ink, marginTop: 24 }]}>{hearts >= 5 ? t.rulesTitle : t.howTitle}</Text>
      {t.rules.map((r, i) => (
        <View key={i} style={[s.row, { borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: T.line }]}>
          <Text style={[s.delta, { color: r.minus ? T.accent : T.ok }]}>{r.minus ? '− 1' : '+ 1'}</Text>
          <Text style={[type.body, { color: T.ink, flex: 1 }]}>{r.text}</Text>
        </View>
      ))}
      <Label T={T} style={{ marginTop: 10 }}>{t.floor}</Label>
    </View>
  );
}

const s = StyleSheet.create({
  sheet: { paddingTop: 10, paddingHorizontal: 24 },
  title: { fontSize: 22, fontWeight: '600', letterSpacing: -0.6, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 11 },
  delta: { width: 30, fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
