// Proposition « balade par la fenêtre » (7 nov 2026) : Partir / Rentrer sur une scène de démo
import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Scene } from '../src/components/mochi/scene';
import { useTokens, type, layout } from '../src/theme-v3';
export default function ProtoBalade() {
  const T = useTokens();
  const [away, setAway] = useState(false); const [souv, setSouv] = useState(2); const [n, setN] = useState(0);
  const btn = (label, on) => <Pressable onPress={on} style={{ paddingVertical: 14, paddingHorizontal: 22, borderRadius: 999, backgroundColor: T.ink }}><Text style={[type.body, { color: T.bg, fontWeight: '600' }]}>{label}</Text></Pressable>;
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Scene T={T} stage="mochi" items={['cheval', 'lave', 'cadre']} outfit="beret" souvenirs={souv} away={away} place={n % 2 ? 'riviere' : 'jardin'} height={layout.scene + 60} />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <Text style={[type.sub, { color: T.muted, textAlign: 'center', paddingHorizontal: 32 }]}>{away ? 'Mochi est en balade : la fenêtre montre le lieu du jour, et lui qui s\u2019y promène.' : 'Appuie sur Partir : Mochi met son sac et sort par le côté.'}</Text>
          {away ? btn('Rentrer (avec un souvenir)', () => { setAway(false); setSouv(k => k + 1); setN(k => k + 1); }) : btn('Partir en balade', () => setAway(true))}
          <Pressable onPress={() => router.back()} hitSlop={10}><Text style={[type.label, { color: T.muted }]}>Fermer</Text></Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
