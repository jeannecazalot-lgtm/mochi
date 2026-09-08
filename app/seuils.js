// Profil · Seuils d'alerte (sheet) — communs au duo, enregistrés sur le foyer
// (retour Jeanne, 8 sept 2026 : « rien n'est cliquable »). Deux curseurs :
// « ça penche » à partir de X %, « alerte » à partir de Y % (X < Y).
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Card, CTAPrimary } from '../src/components/ui';
import { SheetHandle } from '../src/components/social/extra';
import { loadSetup, thresholdsOf } from '../src/setup-state';
import { saveThresholdsEverywhere } from '../src/thresholds';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, alpha } from '../src/theme';

const t = copy.seuils;
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

function Row({ label, value, onMinus, onPlus, first }) {
  return (
    <View style={[s.row, !first && s.rowLine]}>
      <Text style={s.label}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable onPress={onMinus} hitSlop={8} style={s.stepBtn}><Text style={s.stepTxt}>−</Text></Pressable>
        <Text style={s.val}>{value} %</Text>
        <Pressable onPress={onPlus} hitSlop={8} style={s.stepBtn}><Text style={s.stepTxt}>+</Text></Pressable>
      </View>
    </View>
  );
}

export default function Seuils() {
  const insets = useSafeAreaInsets();
  const [warn, setWarn] = useState(10);
  const [alert, setAlert] = useState(25);
  useEffect(() => { loadSetup().then(() => { const th = thresholdsOf(); setWarn(th.warn); setAlert(th.alert); }); }, []);
  const tick = () => Haptics.selectionAsync().catch(() => {});
  const setW = d => { const v = Math.min(alert - 5, Math.max(5, warn + d)); if (v !== warn) { setWarn(v); tick(); } };
  const setA = d => { const v = Math.max(warn + 5, Math.min(50, alert + d)); if (v !== alert) { setAlert(v); tick(); } };
  const save = () => { saveThresholdsEverywhere({ warn, alert }).catch(() => {}); router.back(); };
  return (
    <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]}>
      <SheetHandle />
      <Text style={s.title}>{t.title}</Text>
      <Text style={s.sub}>{fill(t.sub, { warn, alert })}</Text>
      <Card r={radius.row} padding={0} style={{ marginTop: 14, marginBottom: 14 }}>
        <Row first label={t.warnLabel} value={warn} onMinus={() => setW(-5)} onPlus={() => setW(5)} />
        <Row label={t.alertLabel} value={alert} onMinus={() => setA(-5)} onPlus={() => setA(5)} />
      </Card>
      <CTAPrimary label={copy.common.save} onPress={save} big />
    </View>
  );
}

const s = StyleSheet.create({
  sheet: { backgroundColor: colors.card, paddingTop: 10, paddingHorizontal: space.screenX },
  title: { fontSize: 19, fontWeight: '600', letterSpacing: -0.5, color: colors.ink, marginTop: 6 },
  sub: { ...font.secondary, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13, paddingHorizontal: 16 },
  rowLine: { borderTopWidth: 1, borderTopColor: colors.line },
  label: { fontSize: 15, fontWeight: '500', color: colors.ink },
  val: { fontSize: 16, fontWeight: '600', color: colors.ink, minWidth: 52, textAlign: 'center', fontVariant: ['tabular-nums'] },
  stepBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: alpha(colors.ink, 0.06), alignItems: 'center', justifyContent: 'center' },
  stepTxt: { fontSize: 16, fontWeight: '600', color: colors.ink, lineHeight: 18 },
});
