// Écran 11 · Mochi calcule — grosse animation ~4 s puis passage auto à 12.
// Recette : docs/recettes/11-calcul.md (retours Jeanne 22 août 2026 : Mochi 150 qui
// penche gauche/droite, étapes qui défilent, barre lente, ~4 s ; court si animations réduites)
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { GlowBg, Card } from '../../src/components/ui';
import { LiveMochi, Animated, FadeInDown, prefersReducedMotion } from '../../src/components/motion';
import { SetupProgress } from '../../src/components/setup/extra';
import copy from '../../src/data/copy.json';
import { colors, alpha } from '../../src/theme';

const t = copy.setup;
const STEPS = ['calcStep1', 'calcStep2', 'calcStep3'];
const HOLD = 4000, HOLD_REDUCED = 1200;   // durée totale avant dispatch
const STEP_MS = 1300;                     // cadence des étapes qui défilent
const LEAN_MS = 900;                      // cadence du penchement gauche/droite
const SIZE = 230, C = SIZE / 2, R = 112, R2 = 84;

export default function Calcul() {
  const reduced = prefersReducedMotion();
  const [step, setStep] = useState(reduced ? STEPS.length - 1 : 0);
  const [lean, setLean] = useState(0);

  // passage auto vers la proposition de dispatch
  useEffect(() => {
    const id = setTimeout(() => router.replace('/(setup)/dispatch'), reduced ? HOLD_REDUCED : HOLD);
    return () => clearTimeout(id);
  }, []);
  // étapes qui défilent
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setStep(v => Math.min(v + 1, STEPS.length - 1)), STEP_MS);
    return () => clearInterval(id);
  }, []);
  // Mochi penche alternativement à gauche / à droite (−0.5 → +0.5, spring de LiveMochi)
  useEffect(() => {
    if (reduced) return;
    setLean(-0.5);
    const id = setInterval(() => setLean(v => (v >= 0 ? -0.5 : 0.5)), LEAN_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingTop: 90, paddingHorizontal: 24, alignItems: 'center' }}>
          <View style={{ width: SIZE, height: SIZE, marginBottom: 29, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={StyleSheet.absoluteFill}>
              <Circle cx={C} cy={C} r={R} stroke={alpha(colors.butter, 0.20)} strokeWidth={2} fill="none" />
              <Circle cx={C} cy={C} r={R} stroke={colors.butter} strokeWidth={2} fill="none" strokeDasharray={`${Math.PI * R / 2} ${Math.PI * R * 2}`} strokeLinecap="round" transform={`rotate(135 ${C} ${C})`} />
              <Circle cx={C} cy={C} r={R2} stroke={alpha(colors.sage, 0.20)} strokeWidth={2} fill="none" />
              <Circle cx={C} cy={C} r={R2} stroke={colors.sage} strokeWidth={2} fill="none" strokeDasharray={`${Math.PI * R2 / 2} ${Math.PI * R2 * 2}`} strokeLinecap="round" transform={`rotate(45 ${C} ${C})`} />
            </Svg>
            <LiveMochi size={150} mood="happy" lean={lean} />
          </View>

          <Text style={s.title}>{t.calcTitle}</Text>
          <Text style={s.sub}>{t.calcSub}</Text>

          <Card padding={0} r={14} style={{ marginTop: 29, width: 260 }}>
            <View style={{ paddingVertical: 14, paddingHorizontal: 18, gap: 8 }}>
              {STEPS.map((k, i) => {
                if (i > step) return null;
                const doing = i === step && !reduced;
                return (
                  <Animated.View key={k} entering={reduced ? undefined : FadeInDown.duration(240)}>
                    <Text style={[s.log, doing && { color: colors.coral, fontWeight: '500' }]}>{doing ? '→ ' : '✓ '}{t[k]}</Text>
                  </Animated.View>
                );
              })}
              <SetupProgress duration={HOLD - 400} color={colors.coral} track={alpha(colors.ink, 0.08)} height={4} style={{ marginTop: 4 }} />
            </View>
          </Card>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '600', letterSpacing: -1, lineHeight: 22, textAlign: 'center', color: colors.ink },
  sub: { fontSize: 15, fontWeight: '400', color: colors.muted, marginTop: 10, textAlign: 'center', maxWidth: 240, lineHeight: 22 },
  log: { fontSize: 13, color: colors.inkSoft, fontVariant: ['tabular-nums'] },
});
