// Écran 38 · Profil & réglages (accès par l'avatar). Recette : docs/recettes/38-profil.md
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, Switch, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, Avatar } from '../src/components/ui';
import { BackButton, SectionMicro, SettingRow } from '../src/components/premium/extra';
import { me, partner, household, streak, balance } from '../src/demo';
import { duoSince, daysSince, lifetime, duoRules, prefs, isPremium } from '../src/demo-premium';
import { signOut } from '../src/auth';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, slotColors, alpha } from '../src/theme';

const t = copy.profil;
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const fmtDate = d => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(d));

export default function Profil() {
  const [cross, setCross] = useState(prefs.cross_reminder);
  const premium = isPremium();
  // « En duo avec {name} · depuis {n} jours » : le prénom du binôme est rendu à part, en couleur
  const duoParts = t.duoWith.split('{name}').map(part => fill(part, { n: daysSince(duoSince) }));
  const stats = [
    { k: t.statStreak, v: fill(t.days, { n: streak.days }) },
    { k: t.statTasks, v: String(lifetime.tasks_done) },
    { k: t.statBalance, v: `${balance.me}%` },
  ];
  const onLogout = async () => { try { await signOut(); } catch (e) { /* mode démo */ } router.replace('/'); };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={s.header}>
            <BackButton label={copy.common.back} />
            <Avatar initial={me.initial} color={me.color} size={58} />
            <View style={{ flex: 1 }}>
              <Text style={font.cardTitle}>{me.first_name}</Text>
              <Text style={[font.secondary, { marginTop: 3 }]}>
                {duoParts[0]}<Text style={{ color: slotColors[partner.slot].deep, fontWeight: '600' }}>{partner.first_name}</Text>{duoParts[1]}
              </Text>
            </View>
            {premium ? <PillLabel color={colors.butter}>{t.pillPremium}</PillLabel> : null}
          </View>

          <View style={{ paddingHorizontal: 22, flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            {stats.map(st => (
              <Card key={st.k} padding={13} r={radius.row} style={{ flex: 1 }}>
                <Text style={s.statKey}>{st.k}</Text>
                <Text style={s.statVal}>{st.v}</Text>
              </Card>
            ))}
          </View>

          <View style={{ paddingHorizontal: 22 }}>
            <SectionMicro>{t.sectionMine}</SectionMicro>
            <View style={{ gap: 6 }}>
              <SettingRow emoji="🔔" title={t.notifs} sub={fill(t.notifsSub, { n: duoRules.reminder_before_min })} onPress={() => router.push('/notifs')} />
              <SettingRow emoji="🗓" title={t.dispos} sub={t.disposSub} onPress={() => router.push('/(setup)/dispos')} />
              <SettingRow emoji="🔁" title={t.crossReminder} sub={t.crossReminderSub} right={<Switch value={cross} onValueChange={setCross} trackColor={{ true: colors.sage, false: alpha(colors.ink, 0.12) }} ios_backgroundColor={alpha(colors.ink, 0.12)} />} />
              <SettingRow emoji="⬇️" title={t.export} sub={t.exportSub} onPress={() => {}} />
            </View>

            <SectionMicro style={{ marginTop: 16 }}>{t.sectionDuo}</SectionMicro>
            <View style={{ gap: 6 }}>
              <SettingRow emoji="⚖️" title={t.thresholds} sub={fill(t.thresholdsSub, { warn: duoRules.threshold_warn_pct, alert: duoRules.threshold_alert_pct })}
                right={<Text style={s.value}>{fill(t.thresholdsValue, { warn: duoRules.threshold_warn_pct, alert: duoRules.threshold_alert_pct })}</Text>} />
              <SettingRow emoji="🎯" title={t.malus} sub={t.malusSub} onPress={() => router.push('/point-hebdo')} />
              <SettingRow emoji="💳" title={t.subscription} sub={premium ? fill(t.subscriptionOn, { date: fmtDate(household.premium_until) }) : t.subscriptionOff} onPress={() => router.push('/paywall')} />
              <SettingRow emoji="🗺" title={t.plan} sub={t.planSub} onPress={() => router.push('/plan')} />
            </View>

            <Pressable onPress={onLogout} style={({ pressed }) => ({ paddingVertical: 10, alignItems: 'center', opacity: pressed ? 0.6 : 1 })}>
              <Text style={s.logout}>{t.logout}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 19, paddingHorizontal: space.headerX, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  statKey: { fontSize: 10.5, letterSpacing: 1.2, fontWeight: '500', textTransform: 'uppercase', color: colors.muted, marginBottom: 6 },
  statVal: { fontSize: 21, fontWeight: '600', letterSpacing: -0.6, color: colors.ink, fontVariant: ['tabular-nums'] },
  value: { fontSize: 13.5, fontWeight: '600', color: colors.ink, fontVariant: ['tabular-nums'] },
  logout: { fontSize: 14.5, fontWeight: '600', color: colors.coralDeep },
});
