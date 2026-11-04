// Bulle de parole de Mochi (onboarding v4, 4 nov 2026) : plate, hairline, queue vers le bas ; le texte
// arrive mot par mot (≈ 28 ms / mot) pour que la créature « parle » au lieu d'afficher une fiche.
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { type } from '../../theme-v3';

export function Bubble({ T, children, style, speed = 28 }) {
  const text = String(children || '');
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const words = text.split(' ');
    let i = 0;
    const id = setInterval(() => { i += 1; setN(i); if (i >= words.length) clearInterval(id); }, speed * 2);
    return () => clearInterval(id);
  }, [text]);
  const shown = text.split(' ').slice(0, n).join(' ');
  return (
    <Animated.View key={text} entering={FadeIn.duration(220)} exiting={FadeOut.duration(160)} style={[s.wrap, style]}>
      <View style={[s.box, { backgroundColor: T.bg, borderColor: T.line }]}>
        <Text style={[type.body, { color: T.ink, lineHeight: 22 }]}>{shown}<Text style={{ color: T.bg }}>{text.slice(shown.length)}</Text></Text>
      </View>
      <View style={[s.tail, { backgroundColor: T.bg, borderColor: T.line }]} />
    </Animated.View>
  );
}
const s = StyleSheet.create({
  wrap: { position: 'absolute', left: 24, right: 24, alignItems: 'center' },
  box: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, maxWidth: 380 },
  tail: { width: 14, height: 14, marginTop: -8, transform: [{ rotate: '45deg' }], borderRightWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth },
});
