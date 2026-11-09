// Écran de capture (App Store, 10 nov 2026) : la pièce de Mochi seule, en plein écran, sans interface.
// Accessible par mochi://scene-capture — sert uniquement à produire les visuels du Store.
import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Scene } from '../src/components/mochi/scene';
import { TOKENS } from '../src/theme-v3';

export default function SceneCapture() {
  const T = TOKENS.jour; // toujours le jour : c'est la pièce que montre le Store
  const { width: W } = useWindowDimensions();
  return (
    <View style={{ flex: 1, backgroundColor: T.bg, justifyContent: 'center' }}>
      <Scene T={T} stage="mochi" mood="happy" lvl={2} height={W * 1.05} items={['cheval', 'aquarium', 'lave']} outfit="beret" souvenirs={3} positions={{ cheval: { x: 0.17, y: 0.78 } }} />
    </View>
  );
}
