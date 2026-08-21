// Tab bar façon Airbnb : Accueil · Planning · [FAB +] · Balance · Budget
import React from 'react';
import { Tabs } from 'expo-router';
import TabBar from '../../src/components/TabBar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={props => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="planning" />
      <Tabs.Screen name="balance" />
      <Tabs.Screen name="budget" />
    </Tabs>
  );
}
