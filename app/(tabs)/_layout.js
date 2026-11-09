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
import { loadThresholds } from '../../src/thresholds';
import { sweepMissed } from '../../src/malus-actions';
import { pull } from '../../src/store';
import { occStore } from '../../src/demo-core';
import { registerPushToken } from '../../src/push';
import { askNotificationPermission } from '../../src/notifications';
import { read } from '../../src/store';
import { loadNightMode } from '../../src/theme-v3';

export default function TabsLayout() {
  const fab = useFabSheet();
  // temps réel + binôme réel + balayage des tâches ratées (malus), dès qu'on connaît le foyer
  React.useEffect(() => {
    // rapatriement complet à l'ouverture et à chaque retour au premier plan — sans ça une
    // occurrence pouvait arriver sans sa tâche (« … » dans le Planning, retour test n°2 7 sept 2026)
    const refresh = async () => {
      const hid = setup.householdId;
      if (!hid) return;
      try { await Promise.all(['tasks', 'occurrences', 'task_pains', 'swap_requests', 'malus', 'expenses', 'activity', 'events', 'household_members', 'setup_drafts', 'mochi_state', 'mochi_events', 'mochi_inventory'].map(tb => pull(tb, hid))); } catch (e) { /* hors ligne */ }
      occStore.bump();
      loadPartner(hid); // un binôme arrivé pendant que l'app dormait
      sweepMissed().catch(() => {});
    };
    loadNightMode(); // réglage de la personne (auto / toujours / jamais)
    loadSetup().then(async () => {
      if (!setup.householdId) return;
      try { const hh = (await read('households')).find(x => x.id === setup.householdId); if (hh?.bedtime) loadNightMode(String(hh.bedtime).slice(0, 5)); } catch (e) { /* 22 h par défaut */ }
      startRealtime(setup.householdId);
      loadPartner(setup.householdId);
      loadThresholds(setup.householdId); // seuils d'alerte du duo
      registerPushToken().then(tok => { if (!tok) askNotificationPermission().then(ok => { if (ok) registerPushToken(); }).catch(() => {}); }); // jeton push → mon profil ; permission demandée si jamais posée (9 nov 2026 : aucune notification entre Jeanne et Ketley)
      refresh();
    });
    const sub = AppState.addEventListener('change', st => { if (st === 'active') loadSetup().then(refresh); });
    return () => sub.remove();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Tabs tabBar={props => <TabBar {...props} onFab={fab.toggle} />} screenOptions={{ headerShown: false, freezeOnBlur: false, animation: 'shift' /* ChatGPT n°6, validée 14 sept 2026 : fondu + léger décalage entre onglets */ }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="planning" />
        <Tabs.Screen name="balance" />
        <Tabs.Screen name="budget" />
      </Tabs>
      <FabSheet open={fab.open} onClose={fab.hide} />
    </View>
  );
}
