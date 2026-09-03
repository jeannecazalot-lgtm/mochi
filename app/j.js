// Porte d'entrée des liens d'invitation universels (3 sept 2026) :
// https://jeannecazalot-lgtm.github.io/j/?code=XXXXXX ouvre l'app ici.
// Façon Tricount (demande Jeanne) : on rejoint le foyer DIRECTEMENT — pas de
// code à taper — puis Duo formé. En cas d'échec, la sheet « Rejoindre »
// s'ouvre pré-remplie pour voir l'erreur et réessayer.
import React, { useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { GlowBg } from '../src/components/ui';
import { joinWithCode } from '../src/invite-actions';
import copy from '../src/data/copy.json';
import { colors } from '../src/theme';

export default function LienInvitation() {
  const { code } = useLocalSearchParams();
  const clean = String(code || '').toUpperCase().replace(/[^A-Z2-9]/g, '').slice(0, 6);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (clean.length === 6) {
        const r = await joinWithCode(clean);
        if (!alive) return;
        if (r.ok) { router.replace('/(setup)/duo-forme'); return; }
      }
      router.replace(clean ? `/rejoindre?code=${clean}` : '/rejoindre');
    })();
    return () => { alive = false; };
  }, []);

  return (
    <View style={s.wrap}>
      <GlowBg intensity="strong" />
      <ActivityIndicator color={colors.ink} />
      <Text style={s.txt}>{copy.join.linkJoining}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, backgroundColor: colors.bg },
  txt: { fontSize: 14.5, fontWeight: '500', color: colors.muted },
});
