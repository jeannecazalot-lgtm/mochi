// Route DEV : `mochi://dev-seed` crée 5 tâches réelles dans MON foyer (avec leurs occurrences de la
// semaine) via createRealTask, comme si on les avait saisies une à une — pour vérifier Accueil /
// Planning sans passer par le setup (demande Jeanne, 9 sept 2026). Jamais en prod.
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { createRealTask } from '../src/task-actions';
import { dayKeys, me, partner } from '../src/demo-task';
import { read, mutate, uuid, drain } from '../src/store';
import { loadSetup, setup } from '../src/setup-state';
import { getUid, getPartnerUid } from '../src/identity';
import { addDaysIso } from '../src/dates';
import { occStore } from '../src/demo-core';

// `?late=1` : trois occurrences d'HIER (une à moi, une à l'autre, une commune) sur des tâches
// existantes du foyer → section « En retard » du Planning à vérifier (Jeanne, 10 sept 2026)
async function seedLate() {
  await loadSetup();
  const uid = getUid(), puid = getPartnerUid(), hid = setup.householdId;
  const tasks = await read('tasks');
  if (!hid || !uid || !tasks.length) return `rien : hid=${!!hid} uid=${!!uid} tasks=${tasks.length}`;
  const pick = (title, i) => tasks.find(tk => tk.title === title) || tasks[i % tasks.length];
  const rows = [[pick('Vaisselle', 0), uid], [pick('Lessive', 1), puid], [pick('Poubelles', 2), null]];
  for (const [tk, who] of rows) {
    await mutate('occurrences', { id: uuid(), household_id: hid, task_id: tk.id, kind: tk.mental_load ? 'plan' : 'exec', due_date: addDaysIso(-1), assignee_id: who, status: 'pending' });
  }
  const ok = await drain();
  occStore.bump();
  const after = (await read('occurrences')).filter(o => o.due_date < addDaysIso(0));
  return `3 posées (${rows.map(([tk]) => tk.title).join(', ')}) · drain=${ok} · en cache avant aujourd'hui : ${after.map(o => `${o.due_date} ${o.status}`).join(' | ')}`;
}

const dow = off => dayKeys[((new Date().getDay() + 6) % 7 + off) % 7];
const SEED = [
  { title: 'Vaisselle', emoji: '🍽️', frequency: 'daily', window_days: dayKeys, duration_min: 15, assign_mode: 'alternate', pains: { [me.id]: 2 } },
  { title: 'Poubelles', emoji: '🗑️', frequency: 'twiceWeek', window_days: [dow(0), dow(3)], deadline: 'evening', duration_min: 5, assign_mode: 'auto', pains: { [me.id]: 2 } },
  { title: 'Courses', emoji: '🛒', frequency: 'weekly', window_days: [dow(1)], duration_min: 45, assign_mode: 'fixed', fixed_assignee: me.id, pains: { [me.id]: 3 } },
  { title: 'Lessive', emoji: '🧺', frequency: 'twiceWeek', window_days: [dow(0), dow(4)], deadline: 'morning', duration_min: 30, assign_mode: 'fixed', fixed_assignee: partner.id, pains: { [me.id]: 3 } },
  { title: 'Repas de la semaine', emoji: '📝', frequency: 'weekly', window_days: [dow(2)], duration_min: 20, mental_load: true, assign_mode: 'fixed', fixed_assignee: me.id, pains: { [me.id]: 4 } },
];

export default function DevSeed() {
  const { late } = useLocalSearchParams();
  const [msg, setMsg] = useState('…');
  useEffect(() => {
    if (!__DEV__) { router.replace('/(tabs)'); return; }
    (async () => {
      try {
        if (late === '1') setMsg(await seedLate());
        else { for (const f of SEED) await createRealTask(f); setMsg('5 tâches créées'); }
      } catch (e) { setMsg(`erreur : ${e?.message || e}`); }
      setTimeout(() => router.replace(late === '1' ? '/(tabs)/planning' : '/(tabs)'), late === '1' ? 6000 : 2500);
    })();
  }, []);
  return <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}><Text style={{ fontSize: 15 }}>{msg}</Text></View>;
}
