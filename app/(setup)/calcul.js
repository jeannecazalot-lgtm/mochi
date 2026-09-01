// Écran 11 · Mochi calcule — grosse animation ~4 s puis passage auto à 12.
// Recette : docs/recettes/11-calcul.md (retours Jeanne 22 août 2026 : Mochi 150 qui
// penche gauche/droite, étapes qui défilent, barre lente, ~4 s ; court si animations réduites)
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { GlowBg, Card } from '../../src/components/ui';
import { LiveMochi, Animated, FadeInDown, FadeIn, prefersReducedMotion } from '../../src/components/motion';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { SetupProgress } from '../../src/components/setup/extra';
import { me, partner } from '../../src/demo';
import { computeDispatch } from '../../src/dispatch';
import { loadSetup, setup, saveResult } from '../../src/setup-state';
import copy from '../../src/data/copy.json';
import { colors, alpha } from '../../src/theme';

const t = copy.setup;
const STEPS = ['calcStep1', 'calcStep2', 'calcStep3'];
const HOLD = 5000, HOLD_REDUCED = 1200;   // durée totale avant dispatch
const FINALE_AT = 3700;                   // début du final « majestueux » (retour Jeanne, 23 août 2026)
const STEP_MS = 1300;                     // cadence des étapes qui défilent
const LEAN_MS = 900;                      // cadence du penchement gauche/droite
const SIZE = 230, C = SIZE / 2, R = 112, R2 = 84;

export default function Calcul() {
  const reduced = prefersReducedMotion();
  const [step, setStep] = useState(reduced ? STEPS.length - 1 : 0);
  const [lean, setLean] = useState(0);
  const [done, setDone] = useState(false);

  // Final majestueux : Mochi se redresse et grandit en ressort, deux anneaux
  // jaillissent et s'évanouissent, le titre devient « C'est prêt. »
  const scale = useSharedValue(1);
  const burst1 = useSharedValue(0);
  const burst2 = useSharedValue(0);
  const mochiStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ring = v => useAnimatedStyle(() => ({ opacity: v.value === 0 ? 0 : 0.85 * (1 - v.value), transform: [{ scale: 1 + v.value * 0.65 }] }));
  const ring1 = ring(burst1);
  const ring2 = ring(burst2);
  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => {
      setDone(true); setLean(0);
      scale.value = withSpring(1.16, { damping: 12, stiffness: 140 });
      burst1.value = withTiming(1, { duration: 750, easing: Easing.out(Easing.quad) });
      burst2.value = withDelay(160, withTiming(1, { duration: 750, easing: Easing.out(Easing.quad) }));
    }, FINALE_AT);
    return () => clearTimeout(id);
  }, []);

  // calcul RÉEL pendant l'animation (1er sept 2026) : dispos (07) + préférences (08)
  // + tâches (10) → computeDispatch. Binôme simulé au même budget tant que
  // l'invitation réelle n'existe pas. Rien de saisi → le 12 garde sa démo.
  useEffect(() => {
    (async () => {
      await loadSetup();
      if (!setup.tasks?.length) return;
      // slider jamais touché → null → aucune contrainte de temps (l'algo met l'infini)
      const weekly = setup.weekly_minutes ?? undefined;
      const members = [{ id: me.id, weekly_minutes: weekly }, { id: partner.id, weekly_minutes: weekly }];
      const pains = Object.fromEntries(Object.entries(setup.prefs || {}).map(([tid, v]) => [tid, { [me.id]: v }]));
      saveResult(computeDispatch({ members, tasks: setup.tasks, pains }));
    })();
  }, []);

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
    const stop = setTimeout(() => clearInterval(id), FINALE_AT);
    return () => { clearInterval(id); clearTimeout(stop); };
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
            <Animated.View pointerEvents="none" style={[s.burst, { borderColor: colors.butter }, ring1]} />
            <Animated.View pointerEvents="none" style={[s.burst, { borderColor: colors.sage }, ring2]} />
            <Animated.View style={mochiStyle}><LiveMochi size={150} mood={done ? 'wink' : 'happy'} lean={done ? 0 : lean} /></Animated.View>
          </View>

          {done
            ? <Animated.Text entering={FadeIn.duration(280)} style={s.title}>{t.calcDone}</Animated.Text>
            : <Text style={s.title}>{t.calcTitle}</Text>}
          <Text style={[s.sub, done && { opacity: 0 }]}>{t.calcSub}</Text>

          <Card padding={0} r={14} style={{ marginTop: 29, width: 260 }}>
            <View style={{ paddingVertical: 14, paddingHorizontal: 18, gap: 8 }}>
              {STEPS.map((k, i) => {
                if (i > step) return null;
                const doing = i === step && !reduced && !done;
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
  burst: { position: 'absolute', width: 224, height: 224, borderRadius: 112, borderWidth: 2, alignSelf: 'center', top: 3 },
  title: { fontSize: 22, fontWeight: '600', letterSpacing: -1, lineHeight: 22, textAlign: 'center', color: colors.ink },
  sub: { fontSize: 15, fontWeight: '400', color: colors.muted, marginTop: 10, textAlign: 'center', maxWidth: 240, lineHeight: 22 },
  log: { fontSize: 13, color: colors.inkSoft, fontVariant: ['tabular-nums'] },
});
