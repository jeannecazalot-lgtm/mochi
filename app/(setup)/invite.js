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
import { ActionPill, ShareIcon, QRIcon, AvatarPlaceholder, fill } from '../../src/components/setup/extra';
import { me } from '../../src/demo';
import { inviteLink } from '../../src/demo-setup';
import { createInvitation, inviteUrl } from '../../src/invite-actions';
import { loadSetup, setup } from '../../src/setup-state';
import { loadPartner, useIdentity } from '../../src/identity';
import QRCode from 'react-native-qrcode-svg';
import copy from '../../src/data/copy.json';
import { Egg } from '../../src/components/mochi/scene';
import { useTokens as useT3, layout } from '../../src/theme-v3';
const EggHero = () => <Egg T={useT3()} />;
import { colors, space } from '../../src/theme';
import { styles as v3Styles, currentTokens as tk } from '../../src/theme-v3';

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
  const next = () => router.push(realCode ? '/(setup)/avant-taches' : '/(setup)/duo-forme');
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
  // Lien universel façon Tricount (demande Jeanne, 3 sept 2026) : le tap sur le
  // lien fait entrer directement dans le foyer ; la page web montre le code sinon.
  const message = realCode ? fill(t.shareMsg, { name: me.first_name, link: inviteUrl(realCode) }) : `https://${inviteLink}`;
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
          <SetupHeader hero={<EggHero />} why={t.whyInvite} step={2} total={2} title={fill(t.inviteTitle, { partner: copy.common.partner })} sub={t.inviteSub} />
          {/* « Passer » retiré (9 sept 2026) : même porte de sortie qu'« Inviter plus tard » */}
        </View>

        {/* DA v3 (7 nov 2026, retour Jeanne « pas très moderne ») : ta photo et la place vide en haut, le CODE en très grand
            au centre (c'est l'objet de l'écran), un seul bouton principal, les autres actions en liens discrets */}
        <View style={{ flex: 1, paddingHorizontal: layout.x, alignItems: 'center', paddingTop: 44 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={64} ring />
            <Animated.View style={[breathe, { marginLeft: -10 }]}><View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: tk().seg, borderWidth: 3, borderColor: tk().bg, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 24, fontWeight: '600', color: tk().muted }}>?</Text></View></Animated.View>
          </View>
          <Text style={{ fontSize: 15, fontWeight: '500', color: tk().muted, marginTop: 28 }}>{waiting ? t.waitingTitle : t.codeLabel}</Text>
          {realCode ? <Text style={{ fontSize: 44, fontWeight: '600', letterSpacing: 10, color: tk().ink, marginTop: 6, fontVariant: ['tabular-nums'] }}>{realCode}</Text> : null}
          <Text style={{ fontSize: 13.5, color: tk().muted, marginTop: 10, textAlign: 'center', maxWidth: 300 }}>{waiting ? t.waitingSub : t.inviteCardSub}</Text>
          <View style={{ flexDirection: 'row', gap: 22, marginTop: 22 }}>
            <Pressable onPress={() => setQrOpen(true)} hitSlop={8}><Text style={{ fontSize: 15, fontWeight: '600', color: tk().ink }}>{t.showQr}</Text></Pressable>
            <Pressable onPress={() => router.push('/rejoindre')} hitSlop={8}><Text style={{ fontSize: 15, fontWeight: '600', color: tk().ink }}>{t.enterCode}</Text></Pressable>
          </View>
          {waiting ? <Pressable onPress={next} hitSlop={8} style={{ marginTop: 18 }}><Text style={s.later}>{t.continueMeanwhile}</Text></Pressable> : null}
        </View>

        <View style={s.bottom}>
          <CTAPrimary label={waiting ? t.resendLink : t.sendLink} onPress={send} big />
        </View>

        {/* QR du code (retour test à deux : le bouton ne faisait rien) — la caméra
            de l'autre iPhone ouvre mochi directement sur « Rejoindre » pré-rempli */}
        {qrOpen ? (
          <Pressable style={s.qrScrim} onPress={() => setQrOpen(false)}>
            <View style={s.qrBox}>
              <Text style={s.qrTitle}>{t.qrTitle}</Text>
              <View style={s.qrFrame}>
                <QRCode value={realCode ? inviteUrl(realCode) : `https://${inviteLink}`} size={180} backgroundColor="#FFFFFF" color={tk().ink} />
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

const s = v3Styles(T => StyleSheet.create({
  cardTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.3, color: T.ink },
  cardSub: { fontSize: 13.5, fontWeight: '400', color: T.muted, marginTop: 3, textAlign: 'center' },
  later: { fontSize: 13.5, fontWeight: '500', color: T.muted, paddingHorizontal: 6 },
  bottom: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 26 },
  codePill: { marginTop: 14, backgroundColor: T.bg, borderRadius: 12, paddingVertical: 9, paddingHorizontal: 22, borderWidth: StyleSheet.hairlineWidth, borderColor: T.line },
  codeTxt: { fontSize: 22, fontWeight: '700', letterSpacing: 6, color: T.ink, fontVariant: ['tabular-nums'] },
  qrScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(35,32,28,0.5)', alignItems: 'center', justifyContent: 'center' },
  qrBox: { backgroundColor: T.bg, borderRadius: 26, paddingVertical: 24, paddingHorizontal: 28, alignItems: 'center', gap: 13, marginHorizontal: 40, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 24, shadowOffset: { width: 0, height: 10 } },
  qrTitle: { fontSize: 17, fontWeight: '600', letterSpacing: -0.4, color: T.ink },
  qrFrame: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: T.line },
  qrCode: { fontSize: 22, fontWeight: '700', letterSpacing: 6, color: T.ink, fontVariant: ['tabular-nums'] },
  qrHint: { fontSize: 12.5, fontWeight: '400', color: T.muted, textAlign: 'center', maxWidth: 210, lineHeight: 17 },
  qrClose: { fontSize: 12.5, fontWeight: '500', color: T.muted, marginTop: 2 },
}));
