// Récap de la semaine rouvert à la demande (Balance › Récap de la semaine, notification du dimanche) — 13 nov 2026.
// Montre le dernier `week_closed` du foyer ; s'il n'est pas encore vu, il est marqué vu en fermant.
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { WeekRecap } from '../src/components/recap/week-recap';
import { read } from '../src/store';
import { markSeen, closeWeekIfNeeded } from '../src/mochi-state';
import { getUid } from '../src/identity';
import { setup, loadSetup } from '../src/setup-state';
import { useTokens, type, layout } from '../src/theme-v3';
import { CTAPrimary } from '../src/components/ui';
import copy from '../src/copy';

export default function Recap() {
  const T = useTokens();
  const { demo } = useLocalSearchParams();
  const [ev, setEv] = useState(demo ? { type: 'week_closed', payload: { healthy: true, counts: true, done_pct: 86, gap_pct: 6, sick: false } } : undefined);
  useEffect(() => {
    if (demo) return;
    (async () => {
      await loadSetup().catch(() => {});
      await closeWeekIfNeeded().catch(() => {}); // ouverte par la notification de 20 h : la semaine se clôt ici si l'Accueil n'est pas passé avant
      const evs = await read('mochi_events').catch(() => []);
      const last = evs.filter(e => e.type === 'week_closed' && (!setup.householdId || e.household_id === setup.householdId)).sort((a, b) => String(b.payload?.week_start).localeCompare(String(a.payload?.week_start)))[0];
      setEv(last || null);
    })();
  }, []);
  const close = async () => {
    const uid = getUid();
    if (ev && !demo && uid && !(ev.seen_by || []).includes(uid)) await markSeen(ev).catch(() => {});
    if (router.canGoBack()) router.back(); else router.replace('/(tabs)');
  };
  if (ev === undefined) return <View style={{ flex: 1, backgroundColor: T.bg }} />;
  if (!ev) return (
    <View style={{ flex: 1, backgroundColor: T.bg, justifyContent: 'center', paddingHorizontal: layout.x }}>
      <Text style={[type.sub, { color: T.muted, textAlign: 'center' }]}>{copy.recap.none}</Text>
      <View style={{ marginTop: 20 }}><CTAPrimary label={copy.recap.close} onPress={close} /></View>
    </View>
  );
  return <WeekRecap ev={ev} demo={!!demo} onDone={close} />;
}
