// Retour du lien de connexion e-mail (mochi://auth#access_token=…) : la session s'installe, puis
// le prénom s'il manque, sinon l'Accueil. (13-14 sept 2026 — compte avant le prénom.)
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { GlowBg } from '../src/components/ui';
import { sessionFromUrl } from '../src/auth';
import { loadProfile } from '../src/profile';
import { loadIdentity } from '../src/identity';
import copy from '../src/data/copy.json';
import { colors } from '../src/theme';

export default function AuthReturn() {
  const url = Linking.useURL();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    (async () => {
      const u = url || (await Linking.getInitialURL());
      const r = await sessionFromUrl(u);
      if (!alive) return;
      if (!r.ok) { setFailed(true); setTimeout(() => router.replace('/(auth)/login?mode=email'), 1800); return; }
      await loadIdentity().catch(() => {});
      const p = await loadProfile().catch(() => null);
      router.replace(p?.first_name ? '/(tabs)' : '/(setup)/identite');
    })();
    return () => { alive = false; };
  }, [url]);
  return (
    <View style={s.wrap}>
      <GlowBg intensity="strong" />
      {failed ? null : <ActivityIndicator color={colors.ink} />}
      <Text style={s.txt}>{failed ? copy.auth.linkFailed : copy.auth.linkOpening}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, backgroundColor: colors.bg },
  txt: { fontSize: 14.5, fontWeight: '500', color: colors.muted, textAlign: 'center', paddingHorizontal: 32 },
});
