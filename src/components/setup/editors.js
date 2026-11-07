// ═══════════════════════════════════════════════════════════════════
// editors.js — les deux éditeurs du setup, réutilisables : la grille de dispos
// + slider (07) et les préférences aimées/détestées (08). Partagés par les écrans
// de setup et par la page « Mes dispos & préférences » du profil (retour Jeanne,
// 8 sept 2026 : « préférences et disponibilités sur la même page »).
// ═══════════════════════════════════════════════════════════════════
import React, { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Card } from '../ui';
import { Animated } from '../motion';
import { useTogglePop, LegendChip, setupTokens } from './extra';
import { prefsPool, prefsMax } from '../../demo-setup';
import copy from '../../data/copy.json';
import { colors, alpha } from '../../theme';
import { styles as v3Styles, currentTokens as tk } from '../../theme-v3';
import { TaskIcon } from '../task-icon';

const t = copy.setup;

// onde de « tap » : un rond qui s'élargit et s'efface sur la case, comme un doigt qui vient d'appuyer (démo, 8 nov 2026)
function TapRipple({ tick }) {
  const sc = useSharedValue(0.4), op = useSharedValue(0);
  useEffect(() => { if (tick == null) return; sc.value = 0.4; op.value = 0.9; sc.value = withTiming(1.6, { duration: 520 }); op.value = withSequence(withTiming(0.9, { duration: 60 }), withTiming(0, { duration: 460 })); }, [tick]);
  const st = useAnimatedStyle(() => ({ opacity: op.value, transform: [{ scale: sc.value }] }));
  return <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: '50%', top: '50%', marginLeft: -18, marginTop: -18, width: 36, height: 36, borderRadius: 18, borderWidth: 3, borderColor: tk().bg, backgroundColor: 'transparent' }, st]} />;
}
function Cell({ v, onPress, demoTick = null }) {
  const pop = useTogglePop(v); // petit spring d'échelle à chaque bascule
  return (
    <Animated.View style={[{ flex: 1 }, pop]}>
      <Pressable onPress={onPress} style={[s.cell, v === 2 ? s.cellFull : v === 1 ? s.cellLight : s.cellEmpty]}>
        <Text style={[s.cellTxt, { color: v === 2 ? tk().ink : tk().ok }]}>{v === 2 ? '●' : v === 1 ? '○' : ''}</Text>
        {demoTick != null ? <TapRipple tick={demoTick} /> : null}
      </Pressable>
    </Animated.View>
  );
}

// grille matin/soir × 7 jours + temps dispo par semaine
// demoV / demoCell : la démo pédagogique du 07 joue une case ; hint : phrase d'aide (nœud)
export function DisposEditor({ grid, onTap, demoV = null, demoCell = null, hint = null, legendOn = null }) {
  return (
    <View>
      <Card padding={0} r={18} style={{ marginBottom: 10 }}>
        <View style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
          <View style={s.legendTop}>
            <LegendChip state={0} label={t.legendNone} on={legendOn === 0} />
            <LegendChip state={1} label={t.legendLightShort} on={legendOn === 1} />
            <LegendChip state={2} label={t.legendFullShort} on={legendOn === 2} />
          </View>
          {hint || <Text style={s.tapHint}>{t.tapHint}</Text>}
          <View style={s.row}>
            <View style={s.rowLabel} />
            {t.days.map((d, i) => <Text key={i} style={[s.day, { color: i >= 5 ? tk().ink : tk().muted }]}>{d}</Text>)}
          </View>
          {['morning', 'evening'].map(row => (
            <View key={row} style={[s.row, { marginTop: 5 }]}>
              <Text style={[s.rowLabel, s.rowTxt]}>{t[row].toUpperCase()}</Text>
              {grid[row].map((v, i) => (
                <Cell key={i} v={demoCell && demoCell.row === row && demoCell.col === i && demoV !== null ? demoV : v} demoTick={demoCell && demoCell.row === row && demoCell.col === i && demoV !== null ? demoV : null} onPress={() => onTap(row, i)} />
              ))}
            </View>
          ))}
        </View>
      </Card>
      {/* slider « Temps dispo par semaine » retiré (décision Jeanne 9 sept 2026) : la grille suffit */}
    </View>
  );
}

// Cycle neutre → j'aime → je déteste → neutre. Si l'état visé est plein, on SAUTE
// au suivant (retour Jeanne, 23 août 2026). Renvoie le nouvel objet, ou null si rien ne peut changer.
export function cyclePref(prefs, id) {
  const count = tone => Object.values(prefs).filter(v => v === tone).length;
  const order = [undefined, 'like', 'hate'];
  const cur = prefs[id];
  let i = order.indexOf(cur);
  for (let step = 0; step < order.length; step++) {
    i = (i + 1) % order.length;
    const next = order[i];
    if (next === undefined || count(next) < prefsMax) {
      if (next === cur) return null;
      return { ...prefs, [id]: next };
    }
  }
  return null;
}

// couleurs de la DA (8 nov 2026, Jeanne : « pas les mêmes partout ») : j'aime = vert de l'app, je déteste = carmin de l'app ; pictos de l'app, plus d'emoji
function Chip({ c, state, onPress }) {
  const T = tk(); const bg = state === 'like' ? T.ok : state === 'hate' ? T.accent : null; const fg = state === 'hate' ? T.bg : T.ink;
  return (
    <Pressable onPress={onPress} style={[s.chip, { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 12 }, bg ? { backgroundColor: bg, borderWidth: 1.5, borderColor: bg } : s.chipOff]}>
      <TaskIcon emoji={c.emoji} size={11} />
      <Text style={[s.chipTxt, { color: fg }]}>{c.label}</Text>
    </Pressable>
  );
}
function PrefSwatch({ kind, label }) {
  const T = tk();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
      <View style={{ width: 22, height: 22, borderRadius: 7, backgroundColor: kind === 'like' ? T.ok : kind === 'hate' ? T.accent : T.bg, borderWidth: kind ? 0 : 1.5, borderColor: T.seg }} />
      <Text style={{ fontSize: 12.5, fontWeight: '500', color: T.ink }}>{label}</Text>
    </View>
  );
}

// légende + liste unique de chips à bascule (08 v2)
export function PrefsEditor({ prefs, onChange }) {
  const tap = id => {
    const next = cyclePref(prefs, id);
    if (next) onChange(next); else Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  };
  return (
    <View>
      <View style={[s.legendPrefs, { marginBottom: 8, gap: 18 }]}>
        <PrefSwatch kind={null} label={t.prefsLegendNeutral} />
        <PrefSwatch kind="like" label={t.prefsLegendLike} />
        <PrefSwatch kind="hate" label={t.prefsLegendHate} />
      </View>
      <Text style={s.tapHint}>{t.prefsTapHint}</Text>
      <View style={s.wrap}>
        {prefsPool.map(c => <Chip key={c.id} c={c} state={prefs[c.id]} onPress={() => tap(c.id)} />)}
      </View>
    </View>
  );
}

const s = v3Styles(T => StyleSheet.create({
  legendTop: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 8 },
  tapHint: { textAlign: 'center', fontSize: 12, fontWeight: '400', color: T.muted, marginBottom: 12 },
  sliderValue: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5, color: T.ink, textAlign: 'center', fontVariant: ['tabular-nums'] },
  sliderUnit: { fontSize: 13, fontWeight: '400', color: T.muted, letterSpacing: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  rowLabel: { width: 44 },
  rowTxt: { fontSize: 11, letterSpacing: 0.8, fontWeight: '600', color: T.muted },
  day: { flex: 1, textAlign: 'center', fontSize: 10.5, letterSpacing: 1, fontWeight: '600' },
  cell: { height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cellFull: { backgroundColor: T.ok, borderWidth: StyleSheet.hairlineWidth, borderColor: T.line },
  cellLight: { backgroundColor: T.ok, borderWidth: StyleSheet.hairlineWidth, borderColor: T.line },
  cellEmpty: { backgroundColor: T.bg, borderWidth: 1.5, borderColor: T.seg },
  cellTxt: { fontSize: 14, fontWeight: '700' },
  legendPrefs: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 18 },
  legendPill: { paddingVertical: 7, paddingHorizontal: 11, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth, borderColor: T.line },
  legendPillTxt: { fontSize: 12.5, fontWeight: '500', color: T.ink },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 999 },
  chipOff: { backgroundColor: T.bg, borderWidth: 1.5, borderColor: T.seg },
  chipTxt: { fontSize: 13.5, fontWeight: '500', color: T.ink },
}));
