// Route DEV : `mochi://dev-seed` crée 5 tâches réelles dans MON foyer (avec leurs occurrences de la
// semaine) via createRealTask, comme si on les avait saisies une à une — pour vérifier Accueil /
// Planning sans passer par le setup (demande Jeanne, 9 sept 2026). Jamais en prod.
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { createRealTask } from '../src/task-actions';
import { dayKeys, me, partner } from '../src/demo-task';

const dow = off => dayKeys[((new Date().getDay() + 6) % 7 + off) % 7];
const SEED = [
  { title: 'Vaisselle', emoji: '🍽️', frequency: 'daily', window_days: dayKeys, duration_min: 15, assign_mode: 'alternate', pains: { [me.id]: 2 } },
  { title: 'Poubelles', emoji: '🗑️', frequency: 'twiceWeek', window_days: [dow(0), dow(3)], deadline: 'evening', duration_min: 5, assign_mode: 'auto', pains: { [me.id]: 2 } },
  { title: 'Courses', emoji: '🛒', frequency: 'weekly', window_days: [dow(1)], duration_min: 45, assign_mode: 'fixed', fixed_assignee: me.id, pains: { [me.id]: 3 } },
  { title: 'Lessive', emoji: '🧺', frequency: 'twiceWeek', window_days: [dow(0), dow(4)], deadline: 'morning', duration_min: 30, assign_mode: 'fixed', fixed_assignee: partner.id, pains: { [me.id]: 3 } },
  { title: 'Repas de la semaine', emoji: '📝', frequency: 'weekly', window_days: [dow(2)], duration_min: 20, mental_load: true, assign_mode: 'fixed', fixed_assignee: me.id, pains: { [me.id]: 4 } },
];

export default function DevSeed() {
  useEffect(() => {
    if (!__DEV__) { router.replace('/(tabs)'); return; }
    (async () => {
      for (const f of SEED) await createRealTask(f);
      router.replace('/(tabs)');
    })();
  }, []);
  return <View style={{ flex: 1 }} />;
}
