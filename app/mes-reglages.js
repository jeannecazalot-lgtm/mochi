// Profil · « Mes dispos & préférences » — une seule page pour ce que je saisis sur moi
// (retour Jeanne, 8 sept 2026 : « préférences et disponibilités sur la même page »).
// Réutilise les éditeurs du setup 07/08 ; Enregistrer pousse ma ligne membre + mes pénibilités.
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, CTAPrimary } from '../src/components/ui';
import { ScreenHeader } from '../src/components/balance/extra';
import { SectionLabel } from '../src/components/setup/extra';
import { DisposEditor, PrefsEditor } from '../src/components/setup/editors';
import { disposEmpty, cycleSlot } from '../src/demo-setup';
import { saveDispos, savePrefs, loadSetup, setup } from '../src/setup-state';
import { syncMyAvailability, syncMyPains } from '../src/sync-setup';
import copy from '../src/data/copy.json';
import { space } from '../src/theme';

const t = copy.mesReglages;

export default function MesReglages() {
  const [grid, setGrid] = useState(disposEmpty);
  const [hours, setHours] = useState(2);
  const [hoursTouched, setHoursTouched] = useState(false);
  const [prefs, setPrefs] = useState({});
  useEffect(() => {
    loadSetup().then(() => {
      if (setup.availability?.morning && setup.availability?.evening) setGrid({ morning: [...setup.availability.morning], evening: [...setup.availability.evening] });
      if (setup.weekly_minutes) { setHours(Math.min(8, Math.max(2, setup.weekly_minutes / 60))); setHoursTouched(true); }
      if (setup.prefs) setPrefs({ ...setup.prefs });
    });
  }, []);
  const tap = (row, i) => setGrid(g => ({ ...g, [row]: g[row].map((v, j) => (j === i ? cycleSlot(v) : v)) }));
  const save = () => {
    saveDispos({ availability: grid, weekly_minutes: hoursTouched ? hours * 60 : null });
    savePrefs({ prefs, reminder: setup.reminder }); // l'heure du récap se règle dans Notifications
    syncMyAvailability().catch(() => {});
    syncMyPains().catch(() => {});
    router.back();
  };
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeader title={t.title} onBack={() => router.back()} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: space.headerX, paddingTop: 6, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          <SectionLabel style={{ marginBottom: 8 }}>{t.disposSection}</SectionLabel>
          <DisposEditor grid={grid} onTap={tap} hours={hours} onHours={v => { setHours(v); setHoursTouched(true); }} />
          <SectionLabel style={{ marginTop: 26, marginBottom: 12 }}>{t.prefsSection}</SectionLabel>
          <PrefsEditor prefs={prefs} onChange={setPrefs} />
        </ScrollView>
        <View style={s.ctaWrap}><CTAPrimary label={copy.common.save} onPress={save} big /></View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  ctaWrap: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 26 },
});
