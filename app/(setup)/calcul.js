// Écran 11 · Mochi calcule — passage auto à 12 après ~2 s. Recette : docs/recettes/11-calcul.md
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { GlowBg, Card } from '../../src/components/ui';
import { LiveMochi, ProgressBar } from '../../src/components/motion';
import { fill } from '../../src/components/setup/extra';
import { catalogue, disposDefault, countSlots } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, alpha } from '../../src/theme';

const t = copy.setup;
const HOLD = 2000;
const R = 98, R2 = 72, C = 100;

export default function Calcul() {
  useEffect(() => { const id = setTimeout(() => router.replace('/(setup)/dispatch'), HOLD); return () => clearTimeout(id); }, []);
  const nTasks = catalogue.filter(c => c.on).length;
  const nSlots = countSlots(disposDefault);
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingTop: 114, paddingHorizontal: 24, alignItems: 'center' }}>
          <View style={{ width: 200, height: 200, marginBottom: 29, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={200} height={200} viewBox="0 0 200 200" style={StyleSheet.absoluteFill}>
              <Circle cx={C} cy={C} r={R} stroke={alpha(colors.butter, 0.20)} strokeWidth={2} fill="none" />
              <Circle cx={C} cy={C} r={R} stroke={colors.butter} strokeWidth={2} fill="none" strokeDasharray={`${Math.PI * R / 2} ${Math.PI * R * 2}`} strokeLinecap="round" transform={`rotate(135 ${C} ${C})`} />
              <Circle cx={C} cy={C} r={R2} stroke={alpha(colors.sage, 0.20)} strokeWidth={2} fill="none" />
              <Circle cx={C} cy={C} r={R2} stroke={colors.sage} strokeWidth={2} fill="none" strokeDasharray={`${Math.PI * R2 / 2} ${Math.PI * R2 * 2}`} strokeLinecap="round" transform={`rotate(45 ${C} ${C})`} />
            </Svg>
            <LiveMochi size={130} mood="happy" />
          </View>

          <Text style={s.title}>{t.calcTitle}</Text>
          <Text style={s.sub}>{t.calcSub}</Text>

          <Card padding={0} r={14} style={{ marginTop: 29, width: 260 }}>
            <View style={{ paddingVertical: 14, paddingHorizontal: 18, gap: 8 }}>
              <Text style={s.log}>{fill(t.calcTasks, { n: nTasks })}</Text>
              <Text style={s.log}>{fill(t.calcSlots, { n: nSlots })}</Text>
              <Text style={[s.log, { color: colors.coral, fontWeight: '500' }]}>{t.calcOptim}</Text>
              <ProgressBar ratio={1} color={colors.coral} track={alpha(colors.ink, 0.08)} height={4} style={{ marginTop: 4 }} />
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
