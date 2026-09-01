// Écran 09 · Inviter son binôme. Recette : docs/recettes/09-invite.md
// Retours Jeanne 22 août 2026 : DA alignée sur 06-08 (SetupHeader points+titre,
// pas de Mochi héros ici : le hero est la carte d'invitation), actions façon Tricount.
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, Share, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { GlowBg, Card, Avatar, CTAPrimary, SetupHeader } from '../../src/components/ui';
import { LiveMochi, Animated, prefersReducedMotion } from '../../src/components/motion';
import { SkipLink, ActionPill, ShareIcon, QRIcon, AvatarPlaceholder, fill } from '../../src/components/setup/extra';
import { me } from '../../src/demo';
import { inviteLink } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space } from '../../src/theme';

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
  // Retour Jeanne (1er sept 2026) : petite animation — la place vide du binôme
  // « respire » doucement (scale 1 → 1,07, boucle lente) tant qu'on attend.
  const reduced = prefersReducedMotion();
  const breath = useSharedValue(1);
  useEffect(() => {
    if (reduced) return;
    breath.value = withRepeat(withSequence(
      withTiming(1.07, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
    ), -1);
  }, []);
  const breathe = useAnimatedStyle(() => ({ transform: [{ scale: breath.value }] }));
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <SetupHeader hero={<LiveMochi size={96} />} step={4} total={4} title={fill(t.inviteTitle, { partner: copy.common.partner })} sub={t.inviteSub} />
          <SkipLink onPress={next} />
        </View>

        {/* Retour Jeanne (1er sept 2026) : la carte était centrée dans l'espace restant
            et tombait trop bas — elle vient maintenant se poser sous le titre. */}
        <View style={{ flex: 1, paddingTop: 34, paddingHorizontal: space.headerX }}>
          <Card padding={0} r={22}>
            <View style={{ paddingTop: 28, paddingHorizontal: 24, paddingBottom: 24, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                <Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={54} ring />
                <Animated.View style={breathe}><AvatarPlaceholder size={54} /></Animated.View>
              </View>
              <Text style={s.cardTitle}>{t.inviteCardTitle}</Text>
              <Text style={s.cardSub}>{t.inviteCardSub}</Text>
              {/* Retour Jeanne (1er sept 2026) : le lien n'est plus affiché — le bouton « Envoyer le lien » suffit. */}
            </View>
          </Card>
        </View>

        {/* Retour Jeanne (1er sept 2026) : « Envoyer le lien » exactement à la place
            du CTA des écrans précédents (pleine largeur, bas 26) ; QR / partage /
            « Inviter plus tard » regroupés juste au-dessus. */}
        <View style={s.bottom}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 15 }}>
            <ActionPill round icon={<QRIcon />} accessibilityLabel={t.qr} />
            <ActionPill round icon={<ShareIcon />} onPress={shareOnly} accessibilityLabel={t.share} />
            <Pressable onPress={next} hitSlop={8}>
              <Text style={s.later}>{t.inviteLater}</Text>
            </Pressable>
          </View>
          <CTAPrimary label={t.sendLink} onPress={send} big />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  cardTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3, color: colors.ink },
  cardSub: { fontSize: 13.5, fontWeight: '400', color: colors.muted, marginTop: 3, textAlign: 'center' },
  later: { fontSize: 13.5, fontWeight: '500', color: colors.muted, paddingHorizontal: 6 },
  bottom: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 26 },
});
