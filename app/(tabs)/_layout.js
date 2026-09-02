// Tab bar façon Airbnb : Accueil · Planning · [FAB +] · Balance · Budget
// Le FAB ouvre le sheet d'ajout (tâche / événement / dépense / pense-bête).
import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import TabBar from '../../src/components/TabBar';
import FabSheet, { useFabSheet } from '../../src/components/FabSheet';
import { loadSetup, setup } from '../../src/setup-state';
import { startRealtime } from '../../src/realtime';
import { loadPartner } from '../../src/identity';
import { sweepMissed } from '../../src/malus-actions';

export default function TabsLayout() {
  const fab = useFabSheet();
  // temps réel + binôme réel + balayage des tâches ratées (malus), dès qu'on connaît le foyer
  React.useEffect(() => {
    loadSetup().then(() => {
      if (!setup.householdId) return;
      startRealtime(setup.householdId);
      loadPartner(setup.householdId);
      sweepMissed().catch(() => {});
    });
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
