// Écran 09 · Inviter son binôme. Recette : docs/recettes/09-invite.md
// Retours Jeanne 22 août 2026 : DA alignée sur 06-08 (SetupHeader points+titre,
// pas de Mochi héros ici : le hero est la carte d'invitation), actions façon Tricount.
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, Share, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
import { GlowBg, Card, Avatar, CTAPrimary, SetupHeader } from '../../src/components/ui';
import { LiveMochi, Animated, prefersReducedMotion } from '../../src/components/motion';
import { SkipLink, ActionPill, ShareIcon, QRIcon, AvatarPlaceholder, fill } from '../../src/components/setup/extra';
import { me } from '../../src/demo';
import { inviteLink } from '../../src/demo-setup';
import { createInvitation } from '../../src/invite-actions';
import { loadSetup, setup } from '../../src/setup-state';
import { loadPartner, useIdentity } from '../../src/identity';
import QRCode from 'react-native-qrcode-svg';
import copy from '../../src/data/copy.json';
import { colors, space } from '../../src/theme';

const t = copy.setup;

export default function Invite() {
  // invitation RÉELLE (2 sept 2026) : code Supabase à 6 caractères, 7 jours.
  // Sans foyer (setup non terminé) ou hors ligne → démo comme avant.
  const [realCode, setRealCode] = useState(null);
  const [waiting, setWaiting] = useState(false); // lien envoyé, on attend le binôme
  const [qrOpen, setQrOpen] = useState(false);
  useEffect(() => { createInvitation().then(r => { if (r?.code) setRealCode(r.code); }); }, []);

  // Retours test à deux (2 sept) : en réel, « Envoyer » ne simule PLUS l'acceptation.
  // On reste ici en mode attente, et on guette l'arrivée du binôme (toutes les 4 s) ;
  // le 09b ne s'affiche que quand il a VRAIMENT rejoint. « Plus tard » → écran 10.
  const next = () => router.push(realCode ? '/(setup)/taches' : '/(setup)/duo-forme');
  useEffect(() => {
    if (!realCode) return;
    const id = setInterval(async () => {
      await loadSetup();
      const joined = await loadPartner(setup.householdId);
      if (joined) { clearInterval(id); router.replace('/(setup)/duo-forme'); }
    }, 4000);
    return () => clearInterval(id);
  }, [realCode]);

  useIdentity(); // mon prénom/photo dans la carte et le message
  const message = realCode ? fill(t.shareMsg, { name: me.first_name, code: realCode }) : `https://${inviteLink}`;
  const send = async () => {
    try { await Share.share({ message }); } catch (e) {}
    if (realCode) setWaiting(true); // réel : on attend — démo : on simule l'acceptation
    else next();
  };
  const shareOnly = async () => {
    try { await Share.share({ message }); } catch (e) {}
    if (realCode) setWaiting(true);
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
              <Text style={s.cardTitle}>{waiting ? t.waitingTitle : t.inviteCardTitle}</Text>
              <Text style={s.cardSub}>{waiting ? t.waitingSub : t.inviteCardSub}</Text>
              {/* Retour Jeanne (1er sept 2026) : le lien n'est plus affiché — le bouton « Envoyer le lien » suffit.
                  En mode réel, le CODE à 6 caractères s'affiche : c'est lui que l'autre saisit. */}
              {realCode ? (
                <View style={s.codePill}>
                  <Text style={s.codeTxt}>{realCode}</Text>
                </View>
              ) : null}
            </View>
          </Card>
        </View>

        {/* Retour Jeanne (1er sept 2026) : « Envoyer le lien » exactement à la place
            du CTA des écrans précédents (pleine largeur, bas 26) ; QR / partage /
            « Inviter plus tard » regroupés juste au-dessus. */}
        <View style={s.bottom}>
          {/* paddingLeft : le bouton dev « Plan des écrans » recouvrait le QR (test du 2 sept) */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 15, paddingLeft: 56 }}>
            <ActionPill round icon={<QRIcon />} onPress={() => setQrOpen(true)} accessibilityLabel={t.qr} />
            <ActionPill round icon={<ShareIcon />} onPress={shareOnly} accessibilityLabel={t.share} />
            <Pressable onPress={() => router.push('/rejoindre')} hitSlop={8}>
              <Text style={s.later}>{t.enterCode}</Text>
            </Pressable>
            <Pressable onPress={next} hitSlop={8}>
              <Text style={s.later}>{t.inviteLater}</Text>
            </Pressable>
          </View>
          <CTAPrimary label={waiting ? t.resendLink : t.sendLink} onPress={send} big />
        </View>

        {/* QR du code (retour test à deux : le bouton ne faisait rien) — la caméra
            de l'autre iPhone ouvre mochi directement sur « Rejoindre » pré-rempli */}
        {qrOpen ? (
          <Pressable style={s.qrScrim} onPress={() => setQrOpen(false)}>
            <View style={s.qrBox}>
              <Text style={s.qrTitle}>{t.qrTitle}</Text>
              <View style={s.qrFrame}>
                <QRCode value={realCode ? `mochi://rejoindre?code=${realCode}` : `https://${inviteLink}`} size={180} backgroundColor="#FFFFFF" color={colors.ink} />
              </View>
              {realCode ? <Text style={s.qrCode}>{realCode}</Text> : null}
              <Text style={s.qrHint}>{t.qrHint}</Text>
              <Text style={s.qrClose}>{t.qrClose}</Text>
            </View>
          </Pressable>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  cardTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3, color: colors.ink },
  cardSub: { fontSize: 13.5, fontWeight: '400', color: colors.muted, marginTop: 3, textAlign: 'center' },
  later: { fontSize: 13.5, fontWeight: '500', color: colors.muted, paddingHorizontal: 6 },
  bottom: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 26 },
  codePill: { marginTop: 14, backgroundColor: colors.bg, borderRadius: 12, paddingVertical: 9, paddingHorizontal: 22, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  codeTxt: { fontSize: 22, fontWeight: '700', letterSpacing: 6, color: colors.ink, fontVariant: ['tabular-nums'] },
  qrScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(35,32,28,0.5)', alignItems: 'center', justifyContent: 'center' },
  qrBox: { backgroundColor: colors.card, borderRadius: 26, paddingVertical: 24, paddingHorizontal: 28, alignItems: 'center', gap: 13, marginHorizontal: 40, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 24, shadowOffset: { width: 0, height: 10 } },
  qrTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.4, color: colors.ink },
  qrFrame: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  qrCode: { fontSize: 22, fontWeight: '700', letterSpacing: 6, color: colors.ink, fontVariant: ['tabular-nums'] },
  qrHint: { fontSize: 12.5, fontWeight: '400', color: colors.muted, textAlign: 'center', maxWidth: 210, lineHeight: 17 },
  qrClose: { fontSize: 12.5, fontWeight: '500', color: colors.muted, marginTop: 2 },
});
