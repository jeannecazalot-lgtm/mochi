// Écran 07 · Setup B — Dispos & énergie. Recette : docs/recettes/07-dispos.md
import React, { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, SetupHeader, Card, CTAPrimary } from '../../src/components/ui';
import { LiveMochi, FadeInDown, Animated, prefersReducedMotion } from '../../src/components/motion';
import { SectionLabel, PulseView, useTogglePop } from '../../src/components/setup/extra';
import { disposEmpty, cycleSlot, weeklyTimeOptions } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space, alpha } from '../../src/theme';

const t = copy.setup;
// case d'exemple de la démo d'entrée : mardi soir (retour Jeanne, 22 août 2026)
const DEMO_ROW = 'evening', DEMO_COL = 1;

function Cell({ v, onPress, delay }) {
  const pop = useTogglePop(v); // petit spring d'échelle à chaque bascule (démo comprise)
  return (
    <Animated.View entering={FadeInDown.duration(220).delay(delay)} style={[{ flex: 1 }, pop]}>
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
  const [hours, setHours] = useState(null);
  const [demoV, setDemoV] = useState(null);  // valeur jouée sur la case d'exemple (démo seulement)
  const [pulse, setPulse] = useState(false); // déclenche le pulse en cascade des 3 options
  const timers = useRef([]);

  // Démo d'entrée : ~700 ms après le montage, mardi soir cycle 0 → ○ → ● → 0
  // (300 ms entre chaque état), puis les options de temps pulsent en cascade.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
    at(700, () => setDemoV(1));
    at(1000, () => setDemoV(2));
    at(1300, () => setDemoV(0));
    at(1600, () => { setDemoV(null); setPulse(true); });
    return () => timers.current.forEach(clearTimeout);
  }, []);

  // dès que Jeanne touche la grille, la démo s'arrête (l'état réel reste intact)
  const stopDemo = () => { timers.current.forEach(clearTimeout); setDemoV(null); };
  const tap = (row, i) => { stopDemo(); setGrid(g => ({ ...g, [row]: g[row].map((v, j) => (j === i ? cycleSlot(v) : v)) })); };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ alignItems: 'center', paddingTop: 18 }}>
          <LiveMochi size={96} mood="happy" />
        </View>
        <SetupHeader step={2} title={t.disposTitle} sub={t.disposSub} />

        <View style={{ paddingHorizontal: space.headerX, paddingTop: 18 }}>
          <Card padding={0} r={18} style={{ marginBottom: 10 }}>
            <View style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
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
              <View style={s.legend}>
                <Text style={s.legendTxt}><Text style={{ color: colors.sageDeep }}>○</Text> {t.legendLight}</Text>
                <Text style={s.legendTxt}><Text style={{ color: colors.ink }}>●</Text> {t.legendFull}</Text>
              </View>
            </View>
          </Card>

          <SectionLabel style={{ marginTop: 8, marginBottom: 8 }}>{t.weeklyTimeLabel}</SectionLabel>
          <Card padding={0} r={16}>
            <View style={{ flexDirection: 'row', gap: 6, paddingVertical: 11, paddingHorizontal: 13 }}>
              {weeklyTimeOptions.map((o, i) => {
                const on = o.hours === hours;
                return (
                  <PulseView key={o.hours} trigger={pulse} delay={i * 120} style={{ flex: 1 }}>
                    <Pressable onPress={() => setHours(o.hours)} style={[s.opt, on && s.optOn]}>
                      <Text style={[s.optBig, { color: on ? colors.card : colors.ink }]}>{o.label}</Text>
                      <Text style={[s.optSub, { color: on ? colors.card : colors.ink }]}>{t[o.sub]}</Text>
                    </Pressable>
                  </PulseView>
                );
              })}
            </View>
          </Card>
        </View>

        <View style={s.ctaWrap}>
          <CTAPrimary label={copy.common.continue} onPress={() => router.push('/(setup)/prefs')} big />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
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
