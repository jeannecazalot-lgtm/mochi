// Écran connexion — squelette câblé (lien magique e-mail). Apple à brancher.
import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, ScreenTitle, CTAPrimary, Footer, Card, Secondary } from '../../src/components/ui';
import { signInWithEmail } from '../../src/auth';
import copy from '../../src/data/copy.json';
import { colors, space, font } from '../../src/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      <GlowBg />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: space.headerX, paddingTop: 14 }}>
          <ScreenTitle>{copy.auth.title}</ScreenTitle>
          <Card style={{ marginTop: 24 }}>
            <TextInput value={email} onChangeText={setEmail} placeholder={copy.auth.emailPlaceholder} placeholderTextColor={colors.muted}
              autoCapitalize="none" keyboardType="email-address" style={[font.body, { paddingVertical: 6 }]} />
          </Card>
          {sent ? <Secondary style={{ marginTop: 12 }}>{copy.auth.linkSent}</Secondary> : null}
        </View>
        <Footer bottom={8}>
          <CTAPrimary label={copy.auth.sendLink} disabled={!email.includes('@')} onPress={async () => { const r = await signInWithEmail(email.trim()); setSent(r.ok); }} />
        </Footer>
      </SafeAreaView>
    </View>
  );
}
