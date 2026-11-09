// Écran 38 · Profil & réglages (accès par l'avatar). Recette : docs/recettes/38-profil.md
import { RouteError } from '../src/components/route-error';
import React, { useState, useEffect } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { leaveHousehold } from '../src/invite-actions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, Avatar } from '../src/components/ui';
import { BackButton, SettingRow } from '../src/components/premium/extra';
import { me, partner, household, streak, balance } from '../src/demo';
import { duoSince, daysSince, lifetime, duoRules, prefs, isPremium, ALL_FREE } from '../src/demo-premium';
import { signOut, currentAccount } from '../src/auth';
import { clearSetup, loadSetup, inRealMode, setup , thresholdsOf } from '../src/setup-state';
import { occStore } from '../src/demo-core';
import { resetIdentity, getUid, loadIdentity, useIdentity } from '../src/identity';
import { resetAll, read } from '../src/store';
import { computeRealBalance } from '../src/balance-real';
import { getNightMode, setNightMode, useTokens } from '../src/theme-v3';
import { getMochi } from '../src/mochi-state';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, slotColors, alpha } from '../src/theme';
import { styles as v3Styles, currentTokens as tk } from '../src/theme-v3';

const t = copy.profil;
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const fmtDate = d => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(d));

export default function Profil() {
  occStore.useVersion(); // seuils modifiés dans la sheet → ligne à jour
  useTokens(); const nightMode = getNightMode(); // re-rend quand le mode nuit change
  const th = thresholdsOf();
  const premium = isPremium();
  // Réel (5 sept 2026, audit QA) : streak, tâches faites et part d'équilibre calculés
  // sur les vraies occurrences — plus de « 6 j · 148 · 48 % » de démo. (Refonte du
  // profil au backlog ; en attendant, pas de faux chiffres.)
  useIdentity();
  const [real, setReal] = useState(null);
  const [mochiHw, setMochiHw] = useState(0); useEffect(() => { getMochi().then(m => setMochiHw(m?.healthy_weeks || 0)).catch(() => {}); }, []);
  const [account, setAccount] = useState(null); // { email, provider } du compte connecté
  useEffect(() => { currentAccount().then(setAccount).catch(() => {}); }, []);
  // sous-titres calculés depuis ce qui est vraiment saisi (6 sept 2026 : « Soirs + week-end » était de la démo)
  const [mine, setMine] = useState(null);
  const refreshMine = async () => {
    await loadSetup();
    const a = setup.availability;
    const slots = a ? [...(a.morning || []), ...(a.evening || [])].filter(v => v > 0).length : 0;
    const h = setup.weekly_minutes ? String(Math.round((setup.weekly_minutes / 60) * 2) / 2).replace('.', ',') : null;
    const likes = Object.values(setup.prefs || {}).filter(v => v === 'like').length;
    const hates = Object.values(setup.prefs || {}).filter(v => v === 'hate').length;
    setMine({ slots, h, likes, hates, hasPrefs: !!setup.prefs });
  };
  useFocusEffect(React.useCallback(() => { refreshMine(); }, [])); // retour des réglages → sous-titres à jour
  useEffect(() => {
    (async () => {
      await refreshMine();
      if (!inRealMode()) return;
      await loadIdentity();
      setReal(computeRealBalance(await read('occurrences'), getUid()));
    })();
  }, []);
  // « En duo avec {name} · depuis {n} jours » : le prénom du binôme est rendu à part, en couleur
  const duoParts = (real ? t.duoWithReal : t.duoWith).split('{name}').map(part => fill(part, { n: daysSince(duoSince) }));
  const stats = real ? [
    { k: t.statStreak, v: String(mochiHw) },
    { k: t.statTasks, v: String(real.parts.reduce((a, p) => a + p.tasks, 0)) },
    { k: t.statBalance, v: `${real.parts[0].pct}%` },
  ] : [
    { k: t.statStreak, v: '2' },
    { k: t.statTasks, v: String(lifetime.tasks_done) },
    { k: t.statBalance, v: `${balance.me}%` },
  ];
  // Déconnexion propre (retour Jeanne, 2 sept) : session fermée + données locales
  // purgées + retour à l'onboarding — plus d'Accueil fantôme avec les données périmées.
  // (Un écran de déconnexion dédié est au backlog ; l'onboarding fait l'accueil en attendant.)
  const onLeave = () => Alert.alert(t.leaveTitle, t.leaveBody, [
    { text: t.leaveCancel, style: 'cancel' },
    { text: t.leaveOk, style: 'destructive', onPress: async () => { const r = await leaveHousehold(); if (r.ok) { try { router.dismissAll(); } catch (e) { /* rien à fermer */ } router.replace('/(setup)/invite-choix?from=leave'); } } },
  ]);
  const onLogout = async () => {
    try { await signOut(); } catch (e) { /* mode démo */ }
    try {
      clearSetup();
      resetIdentity(); // uid, prénom/photo, binôme : tout à plat
      await resetAll(); // cache + filigranes de synchro + file de mutations (sinon l'ancien compte hante le nouveau)
    } catch (e) {}
    router.replace('/onboarding');
  };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={s.header}>
            <BackButton label={copy.common.back} />
            {/* tap → nom et photo en pop-up (Jeanne 13 sept 2026) */}
            <Pressable onPress={() => router.push('/moi')} hitSlop={6}><Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={58} /></Pressable>
            <View style={{ flex: 1 }}>
              <Pressable onPress={() => router.push('/moi')} hitSlop={6}><Text style={[font.cardTitle, { color: tk().ink }, { color: tk().ink }]}>{me.first_name}</Text></Pressable>
              <Text style={[font.secondary, { color: tk().muted }, { marginTop: 3 }]}>
                {duoParts[0]}<Text style={{ color: slotColors[partner.slot].deep, fontWeight: '600' }}>{partner.first_name}</Text>{duoParts[1]}
              </Text>
            </View>
            {premium && !ALL_FREE ? <PillLabel color={tk().scene.lamp}>{t.pillPremium}</PillLabel> : null}
          </View>

          {/* trois chiffres en ligne, hairlines (DA v3, 6 nov 2026) */}
          <View style={{ marginHorizontal: 24, marginBottom: 8, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: tk().line, flexDirection: 'row', paddingVertical: 14 }}>
            {stats.map((st, i) => (
              <View key={st.k} style={{ flex: 1, alignItems: i === 0 ? 'flex-start' : i === stats.length - 1 ? 'flex-end' : 'center' }}>
                <Text style={s.statVal}>{st.v}</Text>
                <Text style={s.statKey}>{st.k}</Text>
              </View>
            ))}
          </View>

          <View style={{ paddingHorizontal: 24 }}>
            <Text style={s.section}>{t.sectionMine}</Text>
            <View>
              <SettingRow emoji="👤" title={t.account} sub={account ? (account.provider === 'apple' ? fill(t.accountApple, { email: account.email || '' }) : account.email) : t.accountNone} onPress={() => (account ? null : router.push('/(auth)/login?link=1'))} />
              <SettingRow emoji="🔔" title={t.notifs} sub={real && setup.reminder ? fill(t.notifsSubReal, { time: String(setup.reminder).replace(':', ' h ') }) : fill(t.notifsSub, { n: duoRules.reminder_before_min })} onPress={() => router.push('/notifs')} />
              <SettingRow emoji="📌" title={t.penseBete} sub={t.penseBeteSub} onPress={() => router.push('/pense-bete')} />
              <SettingRow emoji="🗓" title={t.mesReglages}
                sub={!mine ? '' : [(!mine.slots && !mine.h) ? t.notSet : fill(mine.slots === 1 ? t.disposSubOne : t.disposSubReal, { n: mine.slots }) + (mine.h ? fill(t.disposSubHours, { h: mine.h }) : ''), !mine.hasPrefs ? t.notSet : fill(t.prefsSub, { like: mine.likes, hate: mine.hates, ls: mine.likes > 1 ? 's' : '', hs: mine.hates > 1 ? 's' : '' })].join(' · ')}
                onPress={() => router.push('/mes-reglages')} />
            </View>

            <Text style={[s.section, { marginTop: 22 }]}>{t.sectionDuo}</Text>
            <View>
              <SettingRow emoji="⚖️" title={t.thresholds} sub={fill(t.thresholdsSub, { warn: th.warn, alert: th.alert })}
                right={<Text style={s.value}>{fill(t.thresholdsValue, { warn: th.warn, alert: th.alert })}</Text>} onPress={() => router.push('/seuils')} />
              {/* Mochi qu'on élève (4 nov 2026) : le point hebdo laisse la place au mode nuit ; un tap fait tourner auto → toujours → jamais */}
              <SettingRow emoji="🍡" title={t.mochiName} sub={t.mochiNameSub} onPress={() => router.push('/nom-mochi')} />
              <SettingRow emoji="🌙" title={t.nightMode} sub={t.nightModeSub} right={<Text style={s.value}>{t.nightValues[nightMode]}</Text>} onPress={() => { const order = ['auto', 'on', 'off']; setNightMode(order[(order.indexOf(nightMode) + 1) % 3]); }} />
              <SettingRow emoji="💳" title={t.subscription} sub={ALL_FREE ? t.subscriptionFree : premium ? fill(t.subscriptionOn, { date: fmtDate(household.premium_until) }) : t.subscriptionOff} onPress={() => router.push('/paywall')} />
              {__DEV__ ? <SettingRow emoji="🗺" title={t.plan} sub={t.planSub} onPress={() => router.push('/plan')} /> : null}
            </View>

            {/* quitter le foyer (décision Jeanne 5 sept 2026) : confirmation, puis écran 09 */}
            {real ? (
              <Pressable onPress={onLeave} style={({ pressed }) => ({ paddingTop: 14, paddingBottom: 4, alignItems: 'center', opacity: pressed ? 0.6 : 1 })}>
                <Text style={s.leave}>{t.leave}</Text>
              </Pressable>
            ) : null}
            <Pressable onPress={onLogout} style={({ pressed }) => ({ paddingVertical: 10, alignItems: 'center', opacity: pressed ? 0.6 : 1 })}>
              <Text style={s.logout}>{t.logout}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = v3Styles(T => StyleSheet.create({
  header: { paddingTop: 19, paddingHorizontal: space.headerX, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  statKey: { fontSize: 12.5, fontWeight: '500', color: T.muted, marginTop: 4 },
  statVal: { fontSize: 26, fontWeight: '600', letterSpacing: -0.8, color: T.ink, fontVariant: ['tabular-nums'] },
  section: { fontSize: 15, fontWeight: '600', color: T.ink, marginBottom: 4 },
  value: { fontSize: 13.5, fontWeight: '600', color: T.ink, fontVariant: ['tabular-nums'] },
  logout: { fontSize: 14.5, fontWeight: '600', color: T.accent },
  leave: { fontSize: 14.5, fontWeight: '600', color: T.muted },
}));

// expo-router : une erreur de rendu affiche ce filet au lieu d'un écran vide
export function ErrorBoundary(props) { return <RouteError {...props} />; }
