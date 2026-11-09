// Étape 4 · Qui invite qui (validé par Jeanne le 9 nov 2026).
// Le lien d'invitation ne survit pas à l'installation depuis l'App Store : la personne invitée
// arrivait sur « Invite {partner}. » et créait un deuxième foyer. Ici rien n'est créé avant le choix.
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, SetupHeader } from '../../src/components/ui';
import { Egg } from '../../src/components/mochi/scene';
import { useTokens, layout } from '../../src/theme-v3';
import copy from '../../src/data/copy.json';

const t = copy.setup;
const ICON = { invite: require('../../assets/icones/mail.png'), join: require('../../assets/icones/key.png') };

function Door({ icon, title, sub, onPress, T }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.door, { backgroundColor: T.card || T.bg, borderColor: T.line }, pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }]}>
      <Image source={icon} style={{ width: 52, height: 52 }} resizeMode="contain" />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: 19, fontWeight: '600', color: T.ink }}>{title}</Text>
        <Text style={{ fontSize: 14.5, color: T.muted, marginTop: 4, lineHeight: 20 }}>{sub}</Text>
      </View>
      <Text style={{ fontSize: 22, color: T.muted }}>›</Text>
    </Pressable>
  );
}

export default function InviteChoix() {
  const T = useTokens();
  const { from } = useLocalSearchParams(); // leave : après avoir quitté un foyer, pas d'étape affichée
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <SetupHeader hero={<Egg T={T} />} step={from ? undefined : 4} total={4} title={t.choiceTitle} sub={t.choiceSub} />
        <View style={{ paddingHorizontal: layout.x, gap: 14, marginTop: 36 }}>
          <Door T={T} icon={ICON.invite} title={t.choiceInvite} sub={t.choiceInviteSub} onPress={() => router.push(from ? `/(setup)/invite?from=${from}` : '/(setup)/invite')} />
          <Door T={T} icon={ICON.join} title={t.choiceJoin} sub={t.choiceJoinSub} onPress={() => router.push('/rejoindre')} />
        </View>
      </SafeAreaView>
    </View>
  );
}
const s = StyleSheet.create({ door: { flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: StyleSheet.hairlineWidth, borderRadius: 20, paddingVertical: 20, paddingHorizontal: 18 } });
