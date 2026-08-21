// Écran planning — vide pour l'instant (squelette). Voir TODO.md.
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, ScreenTitle } from '../../src/components/ui';
import copy from '../../src/data/copy.json';
import { space } from '../../src/theme';

export default function Screen() {
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: space.headerX, paddingTop: 14 }}>
          <ScreenTitle>{copy.tabs.planning}</ScreenTitle>
        </View>
      </SafeAreaView>
    </View>
  );
}
