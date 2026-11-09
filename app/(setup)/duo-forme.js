// Écran 09b · Duo formé — l'autre a accepté. Refait le 4 nov 2026 (retour Jeanne : « l'animation est cheap ») :
// l'œuf arrive dans la pièce (c'est le moment où Mochi existe), vos deux avatars dessous, pas de particules.
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Avatar, CTAPrimary } from '../../src/components/ui';
import { Scene } from '../../src/components/mochi/scene';
import { tick } from '../../src/mochi-state';
import { Bubble } from '../../src/components/mochi/bubble';
import { Label } from '../../src/components/mochi/gauges';
import { fill } from '../../src/components/setup/extra';
import { me, partner } from '../../src/demo';
import { loadSetup, isJoiner, setup } from '../../src/setup-state';
import { syncJoinerPrefs } from '../../src/sync-setup';
import { useIdentity, loadPartner } from '../../src/identity';
import { useTokens, type, layout } from '../../src/theme-v3';
import copy from '../../src/data/copy.json';

const t = copy.setup;

export default function DuoForme() {
  const T = useTokens();
  const insets = useSafeAreaInsets();
  const realMe = useIdentity();
  const [joiner, setJoiner] = useState(false);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState('cracking'); // cracking → hatching → hatched (éclosion = duo formé)
  const hatched = phase === 'hatched';
  useEffect(() => {
    loadSetup().then(() => { setJoiner(isJoiner()); setReady(true); if (setup.householdId) loadPartner(setup.householdId); }); // le prénom de l'autre, tout de suite (9 nov 2026 : « ton binôme est là »)
    const id = setTimeout(() => setPhase('hatching'), 1200);
    return () => clearTimeout(id);
  }, []);
  const prefilled = !!(realMe?.first_name && setup.availability && setup.prefs);
  const title = fill(joiner ? t.duoTitleJoiner : t.duoTitle, { name: partner.first_name }).replace('\n', ' ');
  const sub = fill(joiner ? (prefilled ? t.duoSubJoinerReady : t.duoSubJoiner) : t.duoSub, { name: partner.first_name });
  const { height: SH } = useWindowDimensions();
  const sceneH = Math.round(SH * 0.48);
  const go = () => {
    if (!joiner) { router.push('/(setup)/avant-taches'); return; }
    // celui qui rejoint passe TOUJOURS par ses dispos, ses préférences et le choix des missions (Jeanne, 8 nov 2026 :
    // « il faut que ce soit fait à chaque fois, même quand on change de foyer ») ; le prénom seulement s'il manque
    // déjà rempli par la personne avant de saisir le code (plus de valeurs par défaut depuis le 8 nov) : on ne redemande pas, on va au choix à deux
    if (realMe?.first_name && setup.availability && setup.prefs) { syncJoinerPrefs().catch(() => {}); router.replace('/(setup)/taches'); return; }
    router.push(realMe?.first_name ? '/(setup)/dispos' : '/(setup)/identite');
  };
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View>
        <Scene T={T} stage={hatched ? 'mini' : 'egg'} cracking={phase === 'cracking'} hatching={phase === 'hatching'} onHatched={() => { setPhase('hatched'); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); tick().catch(() => {}); }} mood={hatched ? 'wink' : undefined} lvl={1} height={sceneH} />
        {hatched ? <Bubble T={T} style={{ top: insets.top + 24 }}>{t.duoSay}</Bubble> : null}
      </View>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        {/* le texte occupe l'espace restant, centré : plus de trou entre le texte et le bouton */}
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: layout.x, paddingBottom: 12 }}>
          <Animated.View entering={FadeInDown.delay(200).duration(320)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            <Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={40} />
            <Avatar initial={partner.initial} color={partner.color} photo={partner.avatar_url} size={40} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(320).duration(320)} style={{ alignItems: 'center', marginTop: 18 }}>
            <Label T={T}>{t.duoPill}</Label>
            <Text style={{ fontSize: 28, fontWeight: '600', letterSpacing: -0.8, lineHeight: 34, color: T.ink, textAlign: 'center', marginTop: 8 }}>{title}</Text>
            <Text style={{ fontSize: 17, lineHeight: 24, color: T.muted, textAlign: 'center', marginTop: 12, maxWidth: 340 }}>{sub}</Text>
          </Animated.View>
        </View>
        <Animated.View entering={FadeIn.delay(500)} style={{ paddingHorizontal: layout.x, paddingBottom: 16 }}>
          <CTAPrimary big label={joiner ? copy.common.continue : t.chooseTasks} onPress={ready ? go : undefined} />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
