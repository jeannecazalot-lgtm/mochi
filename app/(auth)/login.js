// Connexion — avant le prénom (décision Jeanne 13 sept 2026). Apple natif, ou e-mail + code à
// 6 chiffres. `?next=` = où aller après (par défaut : 06 si pas encore de prénom, sinon l'Accueil).
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Rect } from 'react-native-svg';
import { GlowBg, Card, Secondary, CTAPrimary } from '../../src/components/ui';
import { LiveMochi } from '../../src/components/motion';
import { sendEmailCode, verifyEmailCode, signInWithApple, appleAvailable } from '../../src/auth';
import { loadProfile } from '../../src/profile';
import { loadIdentity } from '../../src/identity';
import copy from '../../src/data/copy.json';
import { colors, font, radius, alpha } from '../../src/theme';

const t = copy.auth;

const MailIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="5" width="18" height="14" rx="2.5" /><Path d="M3.5 7l8.5 6 8.5-6" />
  </Svg>
);

export default function Login() {
  const { next, mode: modeParam } = useLocalSearchParams();
  const [mode, setMode] = useState(modeParam || 'choice'); // choice | email | code
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [linking, setLinking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);
  const [apple, setApple] = useState(false);
  useEffect(() => { appleAvailable().then(setApple); }, []);

  // après connexion : le prénom s'il manque, sinon la suite demandée (lien d'invitation) ou l'Accueil
  const done = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    await loadIdentity().catch(() => {});
    const p = await loadProfile().catch(() => null);
    if (next) { router.replace(String(next)); return; }
    router.replace(p?.first_name ? '/(tabs)' : '/(setup)/identite');
  };
  const onApple = async () => {
    setBusy(true); setNote(null);
    const r = await signInWithApple();
    setBusy(false);
    if (r.ok) return done();
    if (!r.canceled) setNote(t.errApple);
  };
  const onSend = async () => {
    setBusy(true); setNote(null);
    const r = await sendEmailCode(email.trim().toLowerCase());
    setBusy(false);
    if (r.ok) { setLinking(!!r.linking); setMode('sent'); } else setNote(t.errSend);
  };
  const onVerify = async () => {
    setBusy(true); setNote(null);
    const r = await verifyEmailCode(email.trim().toLowerCase(), code, linking);
    setBusy(false);
    if (r.ok) return done();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    setNote(t.errCode);
  };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, paddingHorizontal: 24 }}>
          <Pressable onPress={Keyboard.dismiss} accessible={false} style={{ flex: 1 }}>
            <View style={{ alignItems: 'center', paddingTop: 36 }}><LiveMochi size={110} /></View>
            <Text style={s.title}>{mode === 'choice' ? t.title2 : mode === 'email' ? t.emailTitle : mode === 'sent' ? t.sentTitle : t.codeTitle}</Text>
            <Secondary style={{ textAlign: 'center', marginTop: 8, lineHeight: 21 }}>{mode === 'choice' ? t.sub : mode === 'email' ? t.emailSub : (mode === 'sent' ? t.sentSub : t.codeSub).replace('{email}', email.trim())}</Secondary>

            {mode === 'choice' ? (
              <View style={{ marginTop: 34, gap: 12 }}>
                {apple ? (
                  <AppleAuthentication.AppleAuthenticationButton
                    buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                    cornerRadius={radius.row} style={{ height: 56 }} onPress={onApple} />
                ) : null}
                <Pressable onPress={() => { setNote(null); setMode('email'); }} style={({ pressed }) => [s.emailBtn, { opacity: pressed ? 0.85 : 1 }]}>
                  <MailIcon /><Text style={s.emailTxt}>{t.email}</Text>
                </Pressable>
                {note ? <Secondary style={{ textAlign: 'center' }}>{note}</Secondary> : null}
                <Text style={s.legal}>{t.legal}</Text>
              </View>
            ) : mode === 'email' ? (
              <View style={{ marginTop: 28 }}>
                <Card padding={0} style={{ marginBottom: 12 }}>
                  <TextInput value={email} onChangeText={setEmail} placeholder={t.emailPlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)}
                    autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" returnKeyType="go" onSubmitEditing={onSend}
                    cursorColor={colors.coral} selectionColor={colors.coral} style={s.input} />
                </Card>
                {note ? <Secondary style={{ marginBottom: 12, textAlign: 'center' }}>{note}</Secondary> : null}
                <CTAPrimary label={t.sendCode} disabled={!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()) || busy} big onPress={onSend} />
                <Pressable onPress={() => { setNote(null); setMode('choice'); }} hitSlop={8} style={{ alignSelf: 'center', marginTop: 16 }}><Text style={s.back}>{copy.common.back}</Text></Pressable>
              </View>
            ) : mode === 'sent' ? (
              <View style={{ marginTop: 28 }}>
                <Card padding={0} style={{ paddingVertical: 18, paddingHorizontal: 18, alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ fontSize: 34 }}>📬</Text>
                  <Text style={[font.secondary, { textAlign: 'center', marginTop: 8, lineHeight: 20 }]}>{t.sentHint}</Text>
                </Card>
                {note ? <Secondary style={{ marginBottom: 12, textAlign: 'center' }}>{note}</Secondary> : null}
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 22, marginTop: 8 }}>
                  <Pressable onPress={onSend} hitSlop={8}><Text style={s.back}>{t.resendLink}</Text></Pressable>
                  <Pressable onPress={() => { setNote(null); setMode('email'); }} hitSlop={8}><Text style={s.back}>{t.changeEmail}</Text></Pressable>
                </View>
              </View>
            ) : (
              <View style={{ marginTop: 28 }}>
                <Card padding={0} style={{ marginBottom: 12 }}>
                  <TextInput value={code} onChangeText={v => setCode(v.replace(/\D/g, '').slice(0, 6))} placeholder={t.codePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)}
                    keyboardType="number-pad" textContentType="oneTimeCode" returnKeyType="go" onSubmitEditing={onVerify}
                    cursorColor={colors.coral} selectionColor={colors.coral} style={[s.input, s.code]} />
                </Card>
                {note ? <Secondary style={{ marginBottom: 12, textAlign: 'center' }}>{note}</Secondary> : null}
                <CTAPrimary label={copy.common.continue} disabled={code.length !== 6 || busy} big onPress={onVerify} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 22, marginTop: 16 }}>
                  <Pressable onPress={onSend} hitSlop={8}><Text style={s.back}>{t.resend}</Text></Pressable>
                  <Pressable onPress={() => { setNote(null); setCode(''); setMode('email'); }} hitSlop={8}><Text style={s.back}>{t.changeEmail}</Text></Pressable>
                </View>
              </View>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '700', letterSpacing: -1.2, lineHeight: 36, color: colors.ink, textAlign: 'center', marginTop: 22 },
  emailBtn: { height: 56, borderRadius: radius.row, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  emailTxt: { fontSize: 16, fontWeight: '600', color: colors.ink },
  legal: { ...font.caption, textAlign: 'center', marginTop: 8, lineHeight: 17 },
  input: { paddingVertical: 17, paddingHorizontal: 18, fontSize: 17, fontWeight: '500', color: colors.ink },
  code: { textAlign: 'center', fontSize: 26, fontWeight: '700', letterSpacing: 8, fontVariant: ['tabular-nums'] },
  back: { fontSize: 13.5, fontWeight: '500', color: colors.muted },
});
