// Écran Semaine (10 nov 2026) — sans Mochi+, les missions ne se reconduisent pas toutes seules (Jeanne :
// « en gratuit on repart de zéro chaque semaine, en payant tout est pré-rempli »). Ici, on relance la semaine
// en un geste : les tâches de la semaine passée sont déjà cochées, on décoche ce qui ne revient pas.
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { CTAPrimary } from '../src/components/ui';
import { CheckDot } from '../src/components/setup/extra';
import { TaskIcon } from '../src/components/task-icon';
import { extendHorizon, restartableTasks, restartWindow } from '../src/horizon';
import { pushToPartner } from '../src/push';
import { occStore } from '../src/demo-core';
import { useTokens, type, layout } from '../src/theme-v3';
import copy from '../src/copy';

const t = copy.semaine;
const fill = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '');

export default function Semaine() {
  const T = useTokens();
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState(null);
  const [on, setOn] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  useEffect(() => { restartableTasks().then(ts => { setTasks(ts); setOn(ts.map(x => x.id)); }).catch(() => setTasks([])); }, []);
  const toggle = id => setOn(o => (o.includes(id) ? o.filter(x => x !== id) : [...o, id]));
  const launch = async () => {
    setBusy(true);
    const n = await extendHorizon({ manual: true, force: true, only: on, ...restartWindow() }).catch(() => 0); // une semaine calendaire (src/week.js)
    setBusy(false); occStore.bump();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    pushToPartner('weekRestarted', { n }, '/(tabs)/planning');
    setMsg(fill(t.done, { n }));
    setTimeout(() => router.back(), 900);
  };
  const X = layout.x;
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: X, paddingTop: 24, paddingBottom: 30 }}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={{ alignSelf: 'flex-end', marginBottom: 6 }}><Text style={{ fontSize: 20, color: T.ink }}>×</Text></Pressable>
        <Text style={[type.name, { color: T.ink }]}>{t.title}</Text>
        <Text style={[type.sub, { color: T.muted, marginTop: 6 }]}>{t.sub}</Text>
        <View style={{ marginTop: 16 }}>
          {tasks && !tasks.length ? <Text style={[type.sub, { color: T.muted }]}>{t.none}</Text> : null}
          {(tasks || []).map(x => (
            <Pressable key={x.id} onPress={() => toggle(x.id)} style={[s.row, { borderColor: T.line }]}>
              <TaskIcon emoji={x.emoji} size={22} />
              <Text style={[type.body, { color: T.ink, flex: 1 }]}>{x.title}</Text>
              <CheckDot on={on.includes(x.id)} onPress={() => toggle(x.id)} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: X, paddingBottom: insets.bottom + 10, paddingTop: 8 }}>
        {msg ? <Text style={[type.sub, { color: T.ok, textAlign: 'center', marginBottom: 8 }]}>{msg}</Text> : null}
        <CTAPrimary big label={fill(t.cta, { n: on.length })} onPress={launch} disabled={busy || !on.length} />
        <Pressable onPress={() => router.push('/paywall')} hitSlop={8} style={{ marginTop: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 13.5, color: T.muted, textAlign: 'center' }}>{t.plus} <Text style={{ color: T.accent, fontWeight: '600' }}>{t.plusCta}</Text></Text>
        </Pressable>
      </View>
    </View>
  );
}
const s = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth } });
