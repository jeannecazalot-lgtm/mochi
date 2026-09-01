// Écran 07 · Setup B — Dispos & énergie. Recette : docs/recettes/07-dispos.md
import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { saveDispos } from '../../src/setup-state';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, SetupHeader, Card, CTAPrimary } from '../../src/components/ui';
import { LiveMochi, FadeInDown, Animated, prefersReducedMotion } from '../../src/components/motion';
import { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import { SectionLabel, useTogglePop, HourSlider, LegendChip } from '../../src/components/setup/extra';
import { disposEmpty, cycleSlot } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space, alpha } from '../../src/theme';

const t = copy.setup;
// Démo pédagogique (spec Jeanne, 23 août 2026) : case LUN/MATIN, première visite seulement.
const DEMO_ROW = 'morning', DEMO_COL = 0;
const SEEN_KEY = 'mochi:demo:dispos-vue';

function Cell({ v, onPress, delay }) {
  const pop = useTogglePop(v); // petit spring d'échelle à chaque bascule (démo comprise)
  return (
    <Animated.View style={[{ flex: 1 }, pop]}>
      <Pressable onPress={onPress} style={[s.cell, v === 2 ? s.cellFull : v === 1 ? s.cellLight : s.cellEmpty]}>
        <Text style={[s.cellTxt, { color: v === 2 ? colors.ink : colors.sageDeep }]}>{v === 2 ? '●' : v === 1 ? '○' : ''}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function Dispos() {
  // Retour Jeanne (22 août 2026) : la grille démarre VIDE et aucun temps n'est
  // pré-sélectionné ; le CTA reste actif quoi qu'il arrive.
  const [grid, setGrid] = useState(disposEmpty);
  const [hours, setHours] = useState(2); // slider 2→8 h — démarre au minimum : rien de pré-rempli (règle Jeanne, 23 août 2026)
  // slider jamais touché = « pas de contrainte de temps » (null), PAS « 2 h » —
  // sinon l'algo croit qu'on n'a presque pas de temps (retour Jeanne, 1er sept 2026)
  const [hoursTouched, setHoursTouched] = useState(false);
  const [demoV, setDemoV] = useState(null);  // valeur jouée sur la case d'exemple (démo seulement)
  const hintO = useSharedValue(1);
  const hintStyle = useAnimatedStyle(() => ({ opacity: hintO.value }));
  const hintPulse = () => { hintO.value = withSequence(withTiming(0.35, { duration: 220 }), withTiming(1, { duration: 320 })); };
    const timers = useRef([]);

  // Démo pédagogique — spec Jeanne (23 août 2026) :
  // 0-350 ms entrée douce · 500-1200 ms la case LUN/MATIN cycle 0→○→●→0 avec
  // pulse de la phrase d'aide · 1400-2200 ms le slider glisse 2→5→2 h.
  // Première visite seulement (drapeau local) ; tout toucher annule la démo.
  const raf = useRef(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (prefersReducedMotion()) return;
      const seen = await AsyncStorage.getItem(SEEN_KEY).catch(() => null);
      if (seen || cancelled) return;
      AsyncStorage.setItem(SEEN_KEY, '1').catch(() => {});
      const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
      // 2 · la case cycle, la phrase pulse
      at(500, () => { setDemoV(1); hintPulse(); });
      at(733, () => setDemoV(2));
      at(966, () => setDemoV(0));
      at(1200, () => setDemoV(null));
      // 3 · le slider glisse réellement 2 → 5 → 2
      at(1400, () => {
        const start = Date.now(), D = 800;
        const tick = () => {
          const p = Math.min(1, (Date.now() - start) / D);
          const v = p < 0.5 ? 2 + 3 * (p / 0.5) : 5 - 3 * ((p - 0.5) / 0.5);
          setHours(Math.round(v * 2) / 2);
          if (p < 1) raf.current = requestAnimationFrame(tick); else setHours(2);
        };
        raf.current = requestAnimationFrame(tick);
      });
    })();
    return () => { cancelled = true; timers.current.forEach(clearTimeout); if (raf.current) cancelAnimationFrame(raf.current); };
  }, []);

  // dès que Jeanne touche la grille, la démo s'arrête (l'état réel reste intact)
  const stopDemo = () => { timers.current.forEach(clearTimeout); if (raf.current) cancelAnimationFrame(raf.current); setDemoV(null); };
  const tap = (row, i) => { stopDemo(); setGrid(g => ({ ...g, [row]: g[row].map((v, j) => (j === i ? cycleSlot(v) : v)) })); };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <SetupHeader hero={<LiveMochi size={96} />} step={2} total={4} title={t.disposTitle} sub={t.disposSub2} />

        <Animated.View entering={prefersReducedMotion() ? undefined : FadeInDown.duration(350).withInitialValues({ opacity: 0, transform: [{ translateY: 10 }] })} onTouchStart={stopDemo} style={{ paddingHorizontal: space.headerX, paddingTop: 18 }}>
          <Card padding={0} r={18} style={{ marginBottom: 10 }}>
            <View style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
              <View style={s.legendTop}>
                <LegendChip state={0} label={t.legendNone} on={demoV === 0} />
                <LegendChip state={1} label={t.legendLightShort} on={demoV === 1} />
                <LegendChip state={2} label={t.legendFullShort} on={demoV === 2} />
              </View>
              <Animated.Text style={[s.tapHint, hintStyle]}>{t.tapHint}</Animated.Text>
              <View style={s.row}>
                <View style={s.rowLabel} />
                {t.days.map((d, i) => <Text key={i} style={[s.day, { color: i >= 5 ? colors.ink : colors.muted }]}>{d}</Text>)}
              </View>
              {['morning', 'evening'].map((row, r) => (
                <View key={row} style={[s.row, { marginTop: 5 }]}>
                  <Text style={[s.rowLabel, s.rowTxt]}>{t[row].toUpperCase()}</Text>
                  {grid[row].map((v, i) => (
                    <Cell
                      key={i}
                      v={row === DEMO_ROW && i === DEMO_COL && demoV !== null ? demoV : v}
                      onPress={() => tap(row, i)}
                      delay={(r * 7 + i) * 25}
                    />
                  ))}
                </View>
              ))}
            </View>
          </Card>

          <SectionLabel style={{ marginTop: 8, marginBottom: 8 }}>{t.weeklyTimeLabel}</SectionLabel>
          <Card padding={0} r={16}>
            <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
              <Text style={s.sliderValue}>{hours >= 8 ? '8+' : String(hours).replace('.', ',')} <Text style={s.sliderUnit}>{t.perWeek}</Text></Text>
              <HourSlider value={hours} onChange={v => { stopDemo(); setHours(v); setHoursTouched(true); }} />
            </View>
          </Card>
        </Animated.View>

        <View style={s.ctaWrap}>
          {/* branchement réel (1er sept 2026) : la grille et le temps/sem sont enregistrés */}
          <CTAPrimary label={copy.common.continue} onPress={() => { saveDispos({ availability: grid, weekly_minutes: hoursTouched ? hours * 60 : null }); router.push('/(setup)/prefs'); }} big />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  legendTop: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 8 },
  tapHint: { textAlign: 'center', fontSize: 12, fontWeight: '400', color: colors.muted, marginBottom: 12 },
  sliderValue: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5, color: colors.ink, textAlign: 'center', fontVariant: ['tabular-nums'] },
  sliderUnit: { fontSize: 13, fontWeight: '400', color: colors.muted, letterSpacing: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  rowLabel: { width: 44 },
  rowTxt: { fontSize: 11, letterSpacing: 0.8, fontWeight: '600', color: colors.muted },
  day: { flex: 1, textAlign: 'center', fontSize: 10.5, letterSpacing: 1, fontWeight: '600' },
  cell: { height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cellFull: { backgroundColor: colors.sage, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  cellLight: { backgroundColor: alpha(colors.sage, 0.35), borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  cellEmpty: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: alpha(colors.ink, 0.10) },
  cellTxt: { fontSize: 14, fontWeight: '700' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: 11 },
  legendTxt: { fontSize: 11.5, fontWeight: '500', color: colors.muted },
  opt: { borderRadius: 12, paddingVertical: 13, paddingHorizontal: 10, alignItems: 'center' },
  optOn: { backgroundColor: colors.ink, shadowColor: colors.ink, shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  optBig: { fontSize: 19, fontWeight: '700', letterSpacing: -0.4, fontVariant: ['tabular-nums'] },
  optSub: { fontSize: 11, fontWeight: '500', opacity: 0.6, marginTop: 3 },
  ctaWrap: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 26 },
});
