// Écran 08 · Setup C — Préférences. Recette : docs/recettes/08-prefs.md
// L'éditeur (légende + chips à bascule) vit dans src/components/setup/editors.js,
// partagé avec la page « Mes dispos & préférences » du profil (8 sept 2026).
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, SetupHeader, Card, CTAPrimary } from '../../src/components/ui';
import { LiveMochi } from '../../src/components/motion';
import { SectionLabel } from '../../src/components/setup/extra';
import { PrefsEditor } from '../../src/components/setup/editors';
import { reminderTimes } from '../../src/demo-setup';
import { savePrefs, loadSetup, setup, isJoiner } from '../../src/setup-state';
import { syncJoinerPrefs, syncMyPains } from '../../src/sync-setup';
import { askNotificationPermission } from '../../src/notifications';
import { registerPushToken } from '../../src/push';
import copy from '../../src/data/copy.json';
import { colors, space, alpha } from '../../src/theme';

const t = copy.setup;

// sélecteur d'heure « HH:MM » (heure exacte, retour Jeanne 7 sept 2026) — réutilisé par l'écran Notifications
export function TimeStepper({ time, onChange }) {
  const [h, m] = time.split(':').map(Number);
  const bump = (k, d) => {
    let nh = h, nm = m;
    if (k === 'h') nh = (h + d + 24) % 24; else { nm = m + d; if (nm >= 60) { nm -= 60; nh = (h + 1) % 24; } if (nm < 0) { nm += 60; nh = (h + 23) % 24; } }
    onChange(`${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`);
    Haptics.selectionAsync().catch(() => {});
  };
  return (
    <View style={s.timePicker}>
      {[['h', t.reminderHours, 1], ['m', t.reminderMinutes, 5]].map(([k, label, step]) => (
        <View key={k} style={s.timeRow}>
          <Text style={s.timeLabel}>{label}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Pressable onPress={() => bump(k, -step)} hitSlop={8} style={s.stepBtn}><Text style={s.stepTxt}>−</Text></Pressable>
            <Text style={s.stepVal}>{k === 'h' ? `${h} h` : String(m).padStart(2, '0')}</Text>
            <Pressable onPress={() => bump(k, step)} hitSlop={8} style={s.stepBtn}><Text style={s.stepTxt}>+</Text></Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

export default function Prefs() {
  const [prefs, setPrefs] = useState({});
  const [time, setTime] = useState(reminderTimes[0]);
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

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Retour Jeanne (1er sept 2026) : plus de sous-titre ni de phrase d'aide —
            la légende porte tout (code couleur + « 1 tap / 2 taps »), écran aéré. */}
        <SetupHeader hero={<LiveMochi size={96} />} step={settings ? undefined : 3} total={settings ? undefined : 4} title={t.prefsTitle} />

        <View style={{ paddingHorizontal: space.headerX, paddingTop: 26 }}>
          <PrefsEditor prefs={prefs} onChange={setPrefs} />

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
            {timeOpen ? <TimeStepper time={time} onChange={setTime} /> : null}
          </Card>
        </View>

        <View style={s.ctaWrap}>
          {/* préférences + heure de rappel enregistrées ; permission notifications demandée ICI,
              au moment utile. Rejoignant·e (décision Jeanne 5 sept) : → Accueil, pas d'écran 09 */}
          <CTAPrimary label={settings ? copy.common.save : t.letsGo} onPress={async () => {
            savePrefs({ prefs, reminder: time });
            askNotificationPermission().then(ok => { if (ok) registerPushToken(); }).catch(() => {});
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
