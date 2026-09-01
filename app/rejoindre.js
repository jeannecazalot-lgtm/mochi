// Rejoindre un foyer avec un code (le 2e téléphone du duo, écran 09 côté invité).
// RPC accept_invitation puis rapatriement des données du foyer.
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Card, Micro, CTAPrimary } from '../src/components/ui';
import { SheetHandle } from '../src/components/social/extra';
import { joinWithCode } from '../src/invite-actions';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, alpha } from '../src/theme';

export default function Rejoindre() {
  const insets = useSafeAreaInsets();
  const t = copy.join;
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const join = async () => {
    setBusy(true); setError(null);
    const r = await joinWithCode(code);
    setBusy(false);
    if (r.ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.dismissAll?.();
      router.replace('/(setup)/duo-forme'); // célébration, puis choix des tâches ensemble
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      setError(/invalid/.test(r.reason || '') ? t.errInvalid : /already/.test(r.reason || '') ? t.errAlready : t.errNetwork);
    }
  };

  return (
    <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]}>
      <SheetHandle />
      <Text style={s.title}>{t.title}</Text>
      <Text style={s.sub}>{t.sub}</Text>
      {/* pas d'autoFocus : il gèle l'écran entier (leçon du 22 août 2026) */}
      <Card r={radius.row} padding={0} style={{ marginTop: 14, marginBottom: 10 }}>
        <TextInput
          value={code} onChangeText={v => setCode(v.toUpperCase())} placeholder={t.placeholder}
          placeholderTextColor={alpha(colors.ink, 0.3)} autoCapitalize="characters" autoCorrect={false}
          maxLength={6} returnKeyType="go" onSubmitEditing={join}
          cursorColor={colors.coral} selectionColor={colors.coral} style={s.input}
        />
      </Card>
      {error ? <Text style={s.error}>{error}</Text> : null}
      <CTAPrimary label={busy ? t.joining : t.cta} disabled={code.trim().length < 6 || busy} onPress={join} big />
    </View>
  );
}

const s = StyleSheet.create({
  sheet: { backgroundColor: colors.card, paddingTop: 10, paddingHorizontal: space.screenX },
  title: { fontSize: 19, fontWeight: '600', letterSpacing: -0.5, color: colors.ink, marginTop: 6 },
  sub: { ...font.secondary, marginTop: 4 },
  input: { paddingVertical: 15, paddingHorizontal: 18, fontSize: 24, fontWeight: '700', letterSpacing: 8, textAlign: 'center', color: colors.ink },
  error: { fontSize: 13, fontWeight: '500', color: colors.coralDeep, textAlign: 'center', marginBottom: 10 },
});
