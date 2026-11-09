// Écran de capture (App Store, 10 nov 2026) : la pièce de Mochi seule, en plein écran, sans interface.
// mochi://scene-capture?mood=sad&items=cheval,lave&outfit=beret&lvl=1&nuit=1 — sert uniquement aux visuels du Store.
import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Scene } from '../src/components/mochi/scene';
import { TOKENS } from '../src/theme-v3';

const POS = { cheval: { x: 0.17, y: 0.78 } };
export default function SceneCapture() {
  const q = useLocalSearchParams();
  const T = q.nuit ? TOKENS.nuit : TOKENS.jour; // le jour par défaut : c'est la pièce que montre le Store
  const { width: W } = useWindowDimensions();
  const items = q.items != null ? String(q.items).split(',').filter(Boolean) : ['cheval', 'aquarium', 'lave'];
  return (
    <View style={{ flex: 1, backgroundColor: T.bg, justifyContent: 'center' }}>
      <Scene key={JSON.stringify(q)} T={T} stage="mochi" mood={q.mood || 'happy'} lvl={Number(q.lvl || 2)} height={W * 1.05} items={items} outfit={q.outfit === 'none' ? null : (q.outfit || 'beret')} souvenirs={3} positions={POS} />
    </View>
  );
}
