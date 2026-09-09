// Écran 07 · Setup B — Dispos & énergie. Recette : docs/recettes/07-dispos.md
// L'éditeur (grille + slider) vit dans src/components/setup/editors.js, partagé avec
// la page « Mes dispos & préférences » du profil (8 sept 2026).
import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { saveDispos, loadSetup, setup } from '../../src/setup-state';
import { syncMyAvailability } from '../../src/sync-setup';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, SetupHeader, CTAPrimary } from '../../src/components/ui';
import { LiveMochi, FadeInDown, Animated, prefersReducedMotion } from '../../src/components/motion';
import { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import { DisposEditor } from '../../src/components/setup/editors';
import { disposEmpty, cycleSlot } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space } from '../../src/theme';

const t = copy.setup;
// Démo pédagogique (spec Jeanne, 23 août 2026) : case LUN/MATIN, première visite seulement.
const DEMO_CELL = { row: 'morning', col: 0 };
const SEEN_KEY = 'mochi:demo:dispos-vue';

export default function Dispos() {
  // ?mode=settings : ouvert depuis le profil (6 sept 2026) — pas de points d'étape,
  // « Enregistrer » renvoie au profil et pousse ma ligne membre au foyer
  const { mode } = useLocalSearchParams();
  const settings = mode === 'settings';
  // Retour Jeanne (22 août 2026) : la grille démarre VIDE et aucun temps n'est
  // pré-sélectionné ; le CTA reste actif quoi qu'il arrive.
  const [grid, setGrid] = useState(disposEmpty);
  const [demoV, setDemoV] = useState(null);  // valeur jouée sur la case d'exemple (démo seulement)
  // déjà saisi (rejoignante revenue ici, ou réglage) : on repart de ce qui existe (6 sept 2026)
  useEffect(() => {
    loadSetup().then(() => {
      if (setup.availability?.morning && setup.availability?.evening) setGrid({ morning: [...setup.availability.morning], evening: [...setup.availability.evening] });
    });
  }, []);
  const hintO = useSharedValue(1);
  const hintStyle = useAnimatedStyle(() => ({ opacity: hintO.value }));
  const hintPulse = () => { hintO.value = withSequence(withTiming(0.35, { duration: 220 }), withTiming(1, { duration: 320 })); };
  const timers = useRef([]);

  // Démo pédagogique — spec Jeanne (23 août 2026) :
  // 0-350 ms entrée douce · 500-1200 ms la case LUN/MATIN cycle 0→○→●→0 avec
  // pulse de la phrase d'aide.
  // Première visite seulement (drapeau local) ; tout toucher annule la démo.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (prefersReducedMotion() || settings) return;
      const seen = await AsyncStorage.getItem(SEEN_KEY).catch(() => null);
      if (seen || cancelled) return;
      AsyncStorage.setItem(SEEN_KEY, '1').catch(() => {});
      const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
      at(500, () => { setDemoV(1); hintPulse(); });
      at(733, () => setDemoV(2));
      at(966, () => setDemoV(0));
      at(1200, () => setDemoV(null));
    })();
    return () => { cancelled = true; timers.current.forEach(clearTimeout); };
  }, []);

  // dès que Jeanne touche la grille, la démo s'arrête (l'état réel reste intact)
  const stopDemo = () => { timers.current.forEach(clearTimeout); setDemoV(null); };
  const tap = (row, i) => { stopDemo(); setGrid(g => ({ ...g, [row]: g[row].map((v, j) => (j === i ? cycleSlot(v) : v)) })); };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <SetupHeader hero={<LiveMochi size={96} />} step={settings ? undefined : 2} total={settings ? undefined : 4} title={t.disposTitle} sub={t.disposSub2} />

        <Animated.View entering={prefersReducedMotion() ? undefined : FadeInDown.duration(350).withInitialValues({ opacity: 0, transform: [{ translateY: 10 }] })} onTouchStart={stopDemo} style={{ paddingHorizontal: space.headerX, paddingTop: 18 }}>
          <DisposEditor
            grid={grid} onTap={tap}
            demoV={demoV} demoCell={DEMO_CELL} legendOn={demoV}
            hint={<Animated.Text style={[s.tapHint, hintStyle]}>{t.tapHint}</Animated.Text>}
          />
        </Animated.View>

        <View style={s.ctaWrap}>
          {/* branchement réel (1er sept 2026) : la grille et le temps/sem sont enregistrés */}
          <CTAPrimary label={settings ? copy.common.save : copy.common.continue} onPress={() => {
            saveDispos({ availability: grid, weekly_minutes: null }); // plus de budget d'heures (9 sept 2026)
            if (settings) { syncMyAvailability().catch(() => {}); router.back(); }
            else router.push('/(setup)/prefs');
          }} big />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  tapHint: { textAlign: 'center', fontSize: 12, fontWeight: '400', color: colors.muted, marginBottom: 12 },
  ctaWrap: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 26 },
});
