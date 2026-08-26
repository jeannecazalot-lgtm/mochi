// Connexion — mise en page façon Suno (retour Jeanne, 23 août 2026) :
// gros bouton Apple, séparateur « ou », carrés des autres méthodes (e-mail).
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { GlowBg, Card, Secondary, CTAPrimary } from '../../src/components/ui';
import { signInWithEmail } from '../../src/auth';
import copy from '../../src/data/copy.json';
import { colors, space, font, radius, alpha } from '../../src/theme';

const t = copy.auth;

const AppleLogo = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill={colors.card}>
    <Path d="M16.7 12.9c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.9-1.6 0-3.2 1-4 2.4-1.7 3-.4 7.5 1.2 9.9.8 1.2 1.8 2.5 3.1 2.4 1.2 0 1.7-.8 3.2-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.7-3.9zM14.4 5.6c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.8-1.5z" />
  </Svg>
);

const MailIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="5" width="18" height="14" rx="2.5" />
    <Path d="M3.5 7l8.5 6 8.5-6" />
  </Svg>
);

export default function Login() {
  const [mode, setMode] = useState('choice'); // choice | email
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [note, setNote] = useState(null);

  const apple = () => setNote(t.appleUnavailable); // brancher expo-apple-authentication + provider Supabase

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }}>
        <Text style={s.title}>{t.title2}</Text>

        {mode === 'choice' ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Pressable onPress={apple} style={({ pressed }) => [s.applePrimary, { opacity: pressed ? 0.85 : 1 }]}>
              <AppleLogo />
              <Text style={s.appleTxt}>{t.apple}</Text>
            </Pressable>
            {note ? <Secondary style={{ textAlign: 'center', marginTop: 10 }}>{note}</Secondary> : null}

            <View style={s.orRow}>
              <View style={s.orLine} /><Text style={s.orTxt}>{t.or}</Text><View style={s.orLine} />
            </View>

            <View style={s.squares}>
              <Pressable onPress={() => setMode('email')} accessibilityLabel={t.email}
                style={({ pressed }) => [s.square, { opacity: pressed ? 0.7 : 1 }]}>
                <MailIcon />
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={[font.cardTitle, { marginBottom: 14 }]}>{t.emailTitle}</Text>
            <Card padding={0} style={{ marginBottom: 12 }}>
              <TextInput
                value={email} onChangeText={setEmail} placeholder={t.emailPlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)}
                autoCapitalize="none" keyboardType="email-address" returnKeyType="done"
                cursorColor={colors.coral} selectionColor={colors.coral} style={s.input} />
            </Card>
            {sent ? <Secondary style={{ marginBottom: 12 }}>{t.linkSent}</Secondary> : null}
            <CTAPrimary label={t.sendLink} disabled={!email.includes('@')} big
              onPress={async () => { const r = await signInWithEmail(email.trim()); setSent(r.ok); }} />
            <Pressable onPress={() => setMode('choice')} hitSlop={8} style={{ alignSelf: 'center', marginTop: 16 }}>
              <Text style={s.back}>{copy.common.back}</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -1.4, lineHeight: 40, color: colors.ink, paddingTop: 24 },
  applePrimary: { height: 56, borderRadius: radius.row, backgroundColor: colors.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  appleTxt: { fontSize: 16, fontWeight: '600', color: colors.card },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 26 },
  orLine: { flex: 1, height: 1, backgroundColor: alpha(colors.ink, 0.10) },
  orTxt: { fontSize: 13, fontWeight: '500', color: colors.muted },
  squares: { flexDirection: 'row', gap: 10 },
  square: { flex: 1, maxWidth: 84, height: 60, borderRadius: 14, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' },
  input: { paddingVertical: 17, paddingHorizontal: 18, fontSize: 17, fontWeight: '500', color: colors.ink },
  back: { fontSize: 13.5, fontWeight: '500', color: colors.muted },
});
