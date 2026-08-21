// Tab bar façon Airbnb : Accueil · Planning · [FAB +] · Balance · Budget
// Le FAB ouvre le sheet d'ajout (tâche / événement / dépense / pense-bête).
import React from 'react';
import { Tabs } from 'expo-router';
import TabBar from '../../src/components/TabBar';
import FabSheet, { useFabSheet } from '../../src/components/FabSheet';

export default function TabsLayout() {
  const fab = useFabSheet();
  return (
    <>
      <Tabs tabBar={props => <TabBar {...props} onFab={fab.toggle} />} screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="planning" />
        <Tabs.Screen name="balance" />
        <Tabs.Screen name="budget" />
      </Tabs>
      <FabSheet open={fab.open} onClose={fab.hide} />
    </>
  );
}
