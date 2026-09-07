// Écran 08 · Setup C — Préférences. Recette : docs/recettes/08-prefs.md
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, SetupHeader, Card, CTAPrimary } from '../../src/components/ui';
import { LiveMochi, FadeInDown, Animated } from '../../src/components/motion';
import { SectionLabel, setupTokens, LegendChip } from '../../src/components/setup/extra';
import { prefsPool, prefsMax, reminderTimes } from '../../src/demo-setup';
import { savePrefs, loadSetup, setup, isJoiner } from '../../src/setup-state';
import { syncJoinerPrefs, syncMyPains } from '../../src/sync-setup';
import { askNotificationPermission } from '../../src/notifications';
import copy from '../../src/data/copy.json';
import { colors, space, alpha } from '../../src/theme';

const t = copy.setup;
const onColor = { like: setupTokens.chipLike, hate: setupTokens.chipHate };

// 08 v2 (retour Jeanne, 22 août 2026) : UNE seule liste — chaque tâche cycle
// neutre → j'aime → je déteste → neutre. Secousse si le côté visé est plein.
function Chip({ c, state, onCycle }) {
  const bg = state === 'like' ? onColor.like : state === 'hate' ? onColor.hate : null;
  return (
    <Pressable
      onPress={() => { if (!onCycle(c.id)) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {}); }}
      style={[s.chip, bg ? { backgroundColor: bg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline } : s.chipOff]}>
      <Text style={s.chipTxt}>{c.emoji} {c.label}</Text>
    </Pressable>
  );
}

export default function Prefs() {
  // Aucun état pré-rempli ; cycle neutre → j'aime → je déteste → neutre.
  const [prefs, setPrefs] = useState({});
  const [time, setTime] = useState(reminderTimes[0]); // 'HH:MM' — heure exacte (retour Jeanne 7 sept 2026)
  const [timeOpen, setTimeOpen] = useState(false);
  // ?mode=settings : ouvert depuis le profil (6 sept 2026) ; déjà saisi → pré-rempli
  const { mode } = useLocalSearchParams();
  const settings = mode === 'settings';
  useEffect(() => {
    loadSetup().then(() => {
      if (setup.prefs) setPrefs({ ...setup.prefs });
      if (setup.reminder) setTime(setup.reminder);
    });
  }, []);
  const count = tone => Object.values(prefs).filter(v => v === tone).length;

  // Cycle neutre → j'aime → je déteste → neutre. Si l'état visé est plein,
  // on SAUTE au suivant (retour Jeanne, 23 août 2026 : 3 « j'aime » posés ne
  // doivent pas empêcher de marquer « je déteste »). Vibre seulement si rien
  // ne peut changer.
  const cycle = (id) => {
    const order = [undefined, 'like', 'hate'];
    const cur = prefs[id];
    let i = order.indexOf(cur);
    for (let step = 0; step < order.length; step++) {
      i = (i + 1) % order.length;
      const next = order[i];
      if (next === undefined || count(next) < prefsMax) {
        if (next === cur) break;
        setPrefs(p => ({ ...p, [id]: next }));
        return true;
      }
    }
    return false;
  };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Retour Jeanne (1er sept 2026) : plus de sous-titre ni de phrase d'aide —
            la légende porte tout (code couleur + « 1 tap / 2 taps »), écran aéré. */}
        <SetupHeader hero={<LiveMochi size={96} />} step={settings ? undefined : 3} total={settings ? undefined : 4} title={t.prefsTitle} />

        <View style={{ paddingHorizontal: space.headerX, paddingTop: 26 }}>
          <View style={s.legendTop}>
            <LegendChip state={0} label={t.prefsLegendNeutral} />
            <View style={[s.legendPill, { backgroundColor: onColor.like }]}><Text style={s.legendPillTxt}>💚 {t.prefsLegendLike}</Text></View>
            <View style={[s.legendPill, { backgroundColor: onColor.hate }]}><Text style={s.legendPillTxt}>🙅 {t.prefsLegendHate}</Text></View>
          </View>
          <View style={s.wrap}>
            {prefsPool.map((c, i) => (
              <Chip key={c.id} c={c} state={prefs[c.id]} onCycle={cycle} />
            ))}
          </View>

          <SectionLabel style={{ marginTop: 30 }}>{t.reminderLabel}</SectionLabel>
          <Card padding={0} r={16}>
            <View style={s.remRow}>
              <Text style={{ fontSize: 19 }}>🔔</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.remTitle}>{t.reminderTitle}</Text>
                <Text style={s.remSub}>{t.reminderSub}</Text>
              </View>
              <Pressable onPress={() => setTimeOpen(o => !o)} style={[s.time, timeOpen && { backgroundColor: colors.ink }]}>
                <Text style={[s.timeTxt, timeOpen && { color: colors.card }]}>{time}</Text>
              </Pressable>
            </View>
            {timeOpen ? (
              <View style={s.timePicker}>
                {[['h', t.reminderHours, 1, 60], ['m', t.reminderMinutes, 5, 5]].map(([k, label, step]) => {
                  const [h, m] = time.split(':').map(Number);
                  const bump = d => {
                    let nh = h, nm = m;
                    if (k === 'h') nh = (h + d + 24) % 24; else { nm = m + d; if (nm >= 60) { nm -= 60; nh = (h + 1) % 24; } if (nm < 0) { nm += 60; nh = (h + 23) % 24; } }
                    setTime(`${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`);
                    Haptics.selectionAsync().catch(() => {});
                  };
                  return (
                    <View key={k} style={s.timeRow}>
                      <Text style={s.timeLabel}>{label}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Pressable onPress={() => bump(-step)} hitSlop={8} style={s.stepBtn}><Text style={s.stepTxt}>−</Text></Pressable>
                        <Text style={s.stepVal}>{k === 'h' ? `${h} h` : String(m).padStart(2, '0')}</Text>
                        <Pressable onPress={() => bump(step)} hitSlop={8} style={s.stepBtn}><Text style={s.stepTxt}>+</Text></Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : null}
          </Card>
        </View>

        <View style={s.ctaWrap}>
          {/* branchement réel (1er sept 2026) : préférences + heure de rappel enregistrées ;
              permission notifications demandée ICI, au moment utile (règle CLAUDE.md) */}
          {/* celui qui a REJOINT un foyer (décision Jeanne 5 sept 2026) : ses dispos et
              préférences partent au foyer et il atterrit à l'Accueil — pas d'écran 09 */}
          <CTAPrimary label={settings ? copy.common.save : t.letsGo} onPress={async () => {
            savePrefs({ prefs, reminder: time });
            askNotificationPermission().catch(() => {});
            await loadSetup();
            if (settings) { syncMyPains().catch(() => {}); router.back(); }
            else if (isJoiner()) { syncJoinerPrefs().catch(() => {}); router.replace('/(tabs)'); }
            else router.push('/(setup)/invite');
          }} big />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  legendTop: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 18 },
  legendPill: { paddingVertical: 7, paddingHorizontal: 11, borderRadius: 999, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  legendPillTxt: { fontSize: 12.5, fontWeight: '500', color: colors.ink },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  chip: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 999 },
  chipOff: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: alpha(colors.ink, 0.10) },
  chipTxt: { fontSize: 14, fontWeight: '500', color: colors.ink },
  remRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14, paddingHorizontal: 18 },
  remTitle: { fontSize: 15.5, fontWeight: '600', color: colors.ink },
  remSub: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 3 },
  time: { backgroundColor: alpha(colors.ink, 0.06), borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  timeTxt: { fontSize: 17, fontWeight: '600', color: colors.ink, fontVariant: ['tabular-nums'] },
  timePicker: { borderTopWidth: 1, borderTopColor: colors.line, paddingHorizontal: 18, paddingVertical: 6 },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  timeLabel: { fontSize: 14, fontWeight: '500', color: colors.muted },
  stepBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: alpha(colors.ink, 0.06), alignItems: 'center', justifyContent: 'center' },
  stepTxt: { fontSize: 16, fontWeight: '600', color: colors.ink, lineHeight: 18 },
  stepVal: { fontSize: 16, fontWeight: '600', color: colors.ink, minWidth: 44, textAlign: 'center', fontVariant: ['tabular-nums'] },
  ctaWrap: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 26 },
});
