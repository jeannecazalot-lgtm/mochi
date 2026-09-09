// ═══════════════════════════════════════════════════════════════════
// editors.js — les deux éditeurs du setup, réutilisables : la grille de dispos
// + slider (07) et les préférences aimées/détestées (08). Partagés par les écrans
// de setup et par la page « Mes dispos & préférences » du profil (retour Jeanne,
// 8 sept 2026 : « préférences et disponibilités sur la même page »).
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Card } from '../ui';
import { Animated } from '../motion';
import { useTogglePop, LegendChip, setupTokens } from './extra';
import { prefsPool, prefsMax } from '../../demo-setup';
import copy from '../../data/copy.json';
import { colors, alpha } from '../../theme';

const t = copy.setup;

function Cell({ v, onPress }) {
  const pop = useTogglePop(v); // petit spring d'échelle à chaque bascule
  return (
    <Animated.View style={[{ flex: 1 }, pop]}>
      <Pressable onPress={onPress} style={[s.cell, v === 2 ? s.cellFull : v === 1 ? s.cellLight : s.cellEmpty]}>
        <Text style={[s.cellTxt, { color: v === 2 ? colors.ink : colors.sageDeep }]}>{v === 2 ? '●' : v === 1 ? '○' : ''}</Text>
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
            {t.days.map((d, i) => <Text key={i} style={[s.day, { color: i >= 5 ? colors.ink : colors.muted }]}>{d}</Text>)}
          </View>
          {['morning', 'evening'].map(row => (
            <View key={row} style={[s.row, { marginTop: 5 }]}>
              <Text style={[s.rowLabel, s.rowTxt]}>{t[row].toUpperCase()}</Text>
              {grid[row].map((v, i) => (
                <Cell key={i} v={demoCell && demoCell.row === row && demoCell.col === i && demoV !== null ? demoV : v} onPress={() => onTap(row, i)} />
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

const onColor = { like: setupTokens.chipLike, hate: setupTokens.chipHate };
function Chip({ c, state, onPress }) {
  const bg = state === 'like' ? onColor.like : state === 'hate' ? onColor.hate : null;
  return (
    <Pressable onPress={onPress} style={[s.chip, bg ? { backgroundColor: bg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline } : s.chipOff]}>
      <Text style={s.chipTxt}>{c.emoji} {c.label}</Text>
    </Pressable>
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
      <View style={s.legendPrefs}>
        <LegendChip state={0} label={t.prefsLegendNeutral} />
        <View style={[s.legendPill, { backgroundColor: onColor.like }]}><Text style={s.legendPillTxt}>💚 {t.prefsLegendLike}</Text></View>
        <View style={[s.legendPill, { backgroundColor: onColor.hate }]}><Text style={s.legendPillTxt}>🙅 {t.prefsLegendHate}</Text></View>
      </View>
      <View style={s.wrap}>
        {prefsPool.map(c => <Chip key={c.id} c={c} state={prefs[c.id]} onPress={() => tap(c.id)} />)}
      </View>
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
  legendPrefs: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 18 },
  legendPill: { paddingVertical: 7, paddingHorizontal: 11, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  legendPillTxt: { fontSize: 12.5, fontWeight: '500', color: colors.ink },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  chip: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 999 },
  chipOff: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: alpha(colors.ink, 0.10) },
  chipTxt: { fontSize: 14, fontWeight: '500', color: colors.ink },
});
