// Écran 09 · Inviter son binôme. Recette : docs/recettes/09-invite.md
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, Share, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, Avatar, CTAPrimary } from '../../src/components/ui';
import { LiveMochi } from '../../src/components/motion';
import { StepPillHeader, StepTitle, AvatarPlaceholder, fill } from '../../src/components/setup/extra';
import { me } from '../../src/demo';
import { inviteLink } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space, alpha } from '../../src/theme';

const t = copy.setup;
const next = () => router.push('/(setup)/duo-forme');

export default function Invite() {
  const [copied, setCopied] = useState(false);
  const send = async () => {
    try { await Share.share({ message: `https://${inviteLink}` }); } catch (e) {}
    next(); // démo : on simule l'acceptation du binôme
  };
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <StepPillHeader step={3} onSkip={next} />
        <StepTitle title={fill(t.inviteTitle, { partner: copy.common.partner })} sub={t.inviteSub} />

        <View style={{ paddingHorizontal: space.headerX, paddingTop: 19 }}>
          <Card padding={0} r={22} style={{ marginBottom: 16 }}>
            <View style={{ paddingTop: 22, paddingHorizontal: 20, paddingBottom: 18, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 11 }}>
                <Avatar initial={me.initial} color={me.color} size={54} ring />
                <View style={{ marginHorizontal: -6, zIndex: 2 }}><LiveMochi size={64} mood="happy" /></View>
                <AvatarPlaceholder size={54} />
              </View>
              <Text style={s.cardTitle}>{t.inviteCardTitle}</Text>
              <Text style={s.cardSub}>{t.inviteCardSub}</Text>
              <Pressable onPress={() => setCopied(true)} style={s.link}>
                <Text numberOfLines={1} style={s.linkTxt}>{inviteLink}</Text>
                <Text style={s.copy}>{copied ? t.copied : t.copy}</Text>
              </Pressable>
            </View>
          </Card>

          <CTAPrimary label={t.sendLink} onPress={send} big style={{ marginBottom: 10 }} />

          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[{ i: '▦', l: t.qr }, { i: '🔢', l: t.enterCode }].map(o => (
              <View key={o.l} style={s.glassBtn}>
                <Text style={{ fontSize: 16 }}>{o.i}</Text>
                <Text style={s.glassTxt}>{o.l}</Text>
              </View>
            ))}
          </View>
          <Text style={s.hint}>{t.inviteHint}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  cardTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3, color: colors.ink },
  cardSub: { fontSize: 13.5, fontWeight: '400', color: colors.muted, marginTop: 3, marginBottom: 14, textAlign: 'center' },
  link: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: alpha(colors.ink, 0.05), borderRadius: 12, paddingVertical: 11, paddingHorizontal: 14 },
  linkTxt: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.ink, textAlign: 'left' },
  copy: { fontSize: 13, fontWeight: '600', color: colors.sageDeep },
  glassBtn: { flex: 1, backgroundColor: colors.glass, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: 999, paddingVertical: 11, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  glassTxt: { fontSize: 14.5, fontWeight: '500', color: colors.ink },
  hint: { fontSize: 12, fontWeight: '400', color: colors.muted, textAlign: 'center', marginTop: 10, lineHeight: 18 },
});
