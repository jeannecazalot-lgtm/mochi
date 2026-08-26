// Écran 09 · Inviter son binôme. Recette : docs/recettes/09-invite.md
// Retours Jeanne 22 août 2026 : DA alignée sur 06-08 (SetupHeader points+titre,
// pas de Mochi héros ici : le hero est la carte d'invitation), actions façon Tricount.
import React from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, Share, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, Avatar, CTAPrimary, SetupHeader } from '../../src/components/ui';
import { LiveMochi } from '../../src/components/motion';
import { SkipLink, ActionPill, ShareIcon, QRIcon, AvatarPlaceholder, fill } from '../../src/components/setup/extra';
import { me } from '../../src/demo';
import { inviteLink } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space, alpha } from '../../src/theme';

const t = copy.setup;
const next = () => router.push('/(setup)/duo-forme');

export default function Invite() {
  const send = async () => {
    try { await Share.share({ message: `https://${inviteLink}` }); } catch (e) {}
    next(); // démo : on simule l'acceptation du binôme
  };
  const shareOnly = async () => {
    try { await Share.share({ message: `https://${inviteLink}` }); } catch (e) {}
  };
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <SetupHeader hero={<LiveMochi size={96} />} step={4} total={4} title={fill(t.inviteTitle, { partner: copy.common.partner })} sub={t.inviteSub} />
          <SkipLink onPress={next} />
        </View>

        {/* carte-aperçu centrée verticalement dans l'espace disponible */}
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: space.headerX }}>
          <Card padding={0} r={22}>
            <View style={{ paddingTop: 28, paddingHorizontal: 24, paddingBottom: 24, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                <Avatar initial={me.initial} color={me.color} size={54} ring />
                <AvatarPlaceholder size={54} />
              </View>
              <Text style={s.cardTitle}>{t.inviteCardTitle}</Text>
              <Text style={s.cardSub}>{t.inviteCardSub}</Text>
              <View style={s.link}>
                <Text numberOfLines={1} style={s.linkTxt}>{inviteLink}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* actions calquées sur le screenshot Tricount de Jeanne (23 août 2026) :
            une seule rangée — grande pilule à gauche, QR et partage ronds à droite —
            puis « Inviter plus tard » centré dessous. */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 26 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <CTAPrimary label={t.sendLink} onPress={send} big style={{ flex: 1 }} pill />
            <ActionPill round icon={<QRIcon />} accessibilityLabel={t.qr} />
            <ActionPill round icon={<ShareIcon />} onPress={shareOnly} accessibilityLabel={t.share} />
          </View>
          <Pressable onPress={next} hitSlop={8} style={{ alignSelf: 'center', marginTop: 18 }}>
            <Text style={s.later}>{t.inviteLater}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  cardTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3, color: colors.ink },
  cardSub: { fontSize: 13.5, fontWeight: '400', color: colors.muted, marginTop: 3, marginBottom: 16, textAlign: 'center' },
  link: { alignSelf: 'stretch', backgroundColor: alpha(colors.ink, 0.05), borderRadius: 12, paddingVertical: 11, paddingHorizontal: 14 },
  linkTxt: { fontSize: 14, fontWeight: '500', color: colors.ink, textAlign: 'center' },
  later: { fontSize: 13.5, fontWeight: '500', color: colors.muted },
});
