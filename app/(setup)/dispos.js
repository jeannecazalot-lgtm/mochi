// Écran 07 · Setup B — Dispos & énergie : À FAIRE (placeholder de navigation)
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, SetupHeader } from '../../src/components/ui';

export default function Dispos() {
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <SetupHeader step={2} title="Tes dispos & ton énergie." sub="Écran 07 — à venir." />
      </SafeAreaView>
    </View>
  );
}
