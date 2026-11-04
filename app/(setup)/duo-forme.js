// Écran 09b · Duo formé — l'autre a accepté. Refait le 4 nov 2026 (retour Jeanne : « l'animation est cheap ») :
// l'œuf arrive dans la pièce (c'est le moment où Mochi existe), vos deux avatars dessous, pas de particules.
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Avatar, CTAPrimary } from '../../src/components/ui';
import { Scene } from '../../src/components/mochi/scene';
import { Bubble } from '../../src/components/mochi/bubble';
import { Label } from '../../src/components/mochi/gauges';
import { fill } from '../../src/components/setup/extra';
import { me, partner } from '../../src/demo';
import { loadSetup, isJoiner, setup } from '../../src/setup-state';
import { syncJoinerPrefs } from '../../src/sync-setup';
import { useIdentity } from '../../src/identity';
import { useTokens, type, layout } from '../../src/theme-v3';
import copy from '../../src/data/copy.json';

const t = copy.setup;

export default function DuoForme() {
  const T = useTokens();
  const insets = useSafeAreaInsets();
  const realMe = useIdentity();
  const [joiner, setJoiner] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => { loadSetup().then(() => { setJoiner(isJoiner()); setReady(true); }); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); }, []);
  const prefilled = !!(realMe?.first_name && setup.availability && setup.prefs);
  const title = fill(joiner ? t.duoTitleJoiner : t.duoTitle, { name: partner.first_name }).replace('\n', ' ');
  const sub = fill(joiner ? (prefilled ? t.duoSubJoinerReady : t.duoSubJoiner) : t.duoSub, { name: partner.first_name });
  const sceneH = layout.scene + insets.top;
  const go = () => {
    if (!joiner) { router.push('/(setup)/avant-taches'); return; }
    if (prefilled) { syncJoinerPrefs().catch(() => {}); router.replace('/(setup)/taches'); } else router.push('/(setup)/identite');
  };
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View>
        <Scene T={T} stage="egg" lvl={1} height={sceneH} />
        <Bubble T={T} style={{ top: insets.top + 54 }}>{t.duoSay}</Bubble>
      </View>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Animated.View entering={FadeInDown.delay(200).duration(320)} style={{ paddingHorizontal: layout.x, paddingTop: 22, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={34} />
          <Avatar initial={partner.initial} color={partner.color} photo={partner.avatar_url} size={34} />
          <Label T={T} style={{ marginLeft: 4 }}>{t.duoPill}</Label>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(320).duration(320)} style={{ paddingHorizontal: layout.x, paddingTop: 16 }}>
          <Text style={[type.name, { color: T.ink }]}>{title}</Text>
          <Text style={[type.sub, { color: T.muted, marginTop: 10, maxWidth: 380 }]}>{sub}</Text>
        </Animated.View>
        <View style={{ flex: 1 }} />
        <Animated.View entering={FadeIn.delay(500)} style={{ paddingHorizontal: layout.x, paddingBottom: 16 }}>
          <CTAPrimary big label={joiner ? copy.common.continue : t.chooseTasks} onPress={ready ? go : undefined} />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
