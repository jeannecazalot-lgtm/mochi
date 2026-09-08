// Profil · Notifications — les VRAIS réglages (8 sept 2026 : l'ancien écran était une
// fausse capture d'écran verrouillé, « c'est bizarre »). Trois choses, rien d'autre :
// l'heure du récap du jour, les notifications entre vous (permission), le rappel croisé.
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { GlowBg, Card, PillLabel } from '../src/components/ui';
import { ScreenHeader } from '../src/components/balance/extra';
import { SectionLabel } from '../src/components/setup/extra';
import { TimeStepper } from './(setup)/prefs';
import { partner } from '../src/demo';
import { useIdentity } from '../src/identity';
import { loadSetup, setup, savePrefs, saveCrossReminder } from '../src/setup-state';
import { rescheduleReminders } from '../src/reminders';
import { askNotificationPermission } from '../src/notifications';
import { registerPushToken } from '../src/push';
import copy from '../src/data/copy.json';
import { colors, space, font, alpha } from '../src/theme';

const t = copy.notifSettings;
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export default function Notifs() {
  useIdentity();
  const [time, setTime] = useState('19:30');
  const [open, setOpen] = useState(false);
  const [cross, setCross] = useState(false);
  const [granted, setGranted] = useState(null); // null = inconnu
  useEffect(() => {
    loadSetup().then(() => { if (setup.reminder) setTime(setup.reminder); setCross(!!setup.crossReminder); });
    Notifications.getPermissionsAsync().then(p => setGranted(p.status === 'granted')).catch(() => setGranted(false));
  }, []);
  const changeTime = v => { setTime(v); savePrefs({ prefs: setup.prefs, reminder: v }); rescheduleReminders().catch(() => {}); };
  const allow = async () => { const ok = await askNotificationPermission().catch(() => false); setGranted(ok); if (ok) registerPushToken().catch(() => {}); };
  const toggleCross = v => { setCross(v); saveCrossReminder(v); };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeader title={t.title} onBack={() => router.back()} />
        <View style={{ paddingHorizontal: space.headerX, paddingTop: 6 }}>
          <SectionLabel style={{ marginBottom: 8 }}>{t.dailySection}</SectionLabel>
          <Card padding={0} r={16} style={{ marginBottom: 22 }}>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={s.title}>{t.dailyTitle}</Text>
                <Text style={s.sub}>{t.dailySub}</Text>
              </View>
              <Pressable onPress={() => setOpen(o => !o)} style={[s.time, open && { backgroundColor: colors.ink }]}>
                <Text style={[s.timeTxt, open && { color: colors.card }]}>{time}</Text>
              </Pressable>
            </View>
            {open ? <TimeStepper time={time} onChange={changeTime} /> : null}
          </Card>

          <SectionLabel style={{ marginBottom: 8 }}>{t.duoSection}</SectionLabel>
          <Card padding={0} r={16}>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={s.title}>{fill(t.pushTitle, { name: partner.first_name })}</Text>
                <Text style={s.sub}>{fill(t.pushSub, { name: partner.first_name })}</Text>
              </View>
              {granted ? <PillLabel color={colors.sageDeep}>{t.pushOn}</PillLabel>
                : <Pressable onPress={allow} style={s.allow}><Text style={s.allowTxt}>{t.pushAsk}</Text></Pressable>}
            </View>
            <View style={[s.row, s.rowLine]}>
              <View style={{ flex: 1 }}>
                <Text style={s.title}>{t.crossTitle}</Text>
                <Text style={s.sub}>{fill(t.crossSub, { name: partner.first_name })}</Text>
              </View>
              <Switch value={cross} onValueChange={toggleCross} trackColor={{ true: colors.sage, false: alpha(colors.ink, 0.12) }} ios_backgroundColor={alpha(colors.ink, 0.12)} />
            </View>
          </Card>
          <Text style={s.note}>{t.note}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14, paddingHorizontal: 18 },
  rowLine: { borderTopWidth: 1, borderTopColor: colors.line },
  title: { fontSize: 15.5, fontWeight: '600', color: colors.ink },
  sub: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 3 },
  time: { backgroundColor: alpha(colors.ink, 0.06), borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  timeTxt: { fontSize: 17, fontWeight: '600', color: colors.ink, fontVariant: ['tabular-nums'] },
  allow: { backgroundColor: colors.ink, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  allowTxt: { fontSize: 13.5, fontWeight: '600', color: colors.card },
  note: { ...font.caption, textAlign: 'center', marginTop: 16, paddingHorizontal: 12 },
});
