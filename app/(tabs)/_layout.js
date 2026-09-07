// Tab bar façon Airbnb : Accueil · Planning · [FAB +] · Balance · Budget
// Le FAB ouvre le sheet d'ajout (tâche / événement / dépense / pense-bête).
import React from 'react';
import { View, AppState } from 'react-native';
import { Tabs } from 'expo-router';
import TabBar from '../../src/components/TabBar';
import FabSheet, { useFabSheet } from '../../src/components/FabSheet';
import { loadSetup, setup } from '../../src/setup-state';
import { startRealtime } from '../../src/realtime';
import { loadPartner } from '../../src/identity';
import { sweepMissed } from '../../src/malus-actions';
import { pull } from '../../src/store';
import { occStore } from '../../src/demo-core';
import { registerPushToken } from '../../src/push';

export default function TabsLayout() {
  const fab = useFabSheet();
  // temps réel + binôme réel + balayage des tâches ratées (malus), dès qu'on connaît le foyer
  React.useEffect(() => {
    // rapatriement complet à l'ouverture et à chaque retour au premier plan — sans ça une
    // occurrence pouvait arriver sans sa tâche (« … » dans le Planning, retour test n°2 7 sept 2026)
    const refresh = async () => {
      const hid = setup.householdId;
      if (!hid) return;
      try { await Promise.all(['tasks', 'occurrences', 'task_pains', 'swap_requests', 'malus', 'expenses', 'activity', 'events'].map(tb => pull(tb, hid))); } catch (e) { /* hors ligne */ }
      occStore.bump();
      sweepMissed().catch(() => {});
    };
    loadSetup().then(() => {
      if (!setup.householdId) return;
      startRealtime(setup.householdId);
      loadPartner(setup.householdId);
      registerPushToken(); // jeton push → mon profil (téléphone réel)
      refresh();
    });
    const sub = AppState.addEventListener('change', st => { if (st === 'active') loadSetup().then(refresh); });
    return () => sub.remove();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Tabs tabBar={props => <TabBar {...props} onFab={fab.toggle} />} screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="planning" />
        <Tabs.Screen name="balance" />
        <Tabs.Screen name="budget" />
      </Tabs>
      <FabSheet open={fab.open} onClose={fab.hide} />
    </View>
  );
}
