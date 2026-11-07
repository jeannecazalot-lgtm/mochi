// Filet de sécurité des écrans (8 nov 2026, Jeanne : « le Planning est tout blanc ») : au lieu d'un écran vide,
// on affiche un message, le texte de l'erreur (pour la capture), et un bouton pour réessayer.
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTokens, type, layout } from '../theme-v3';
import copy from '../data/copy.json';

export function RouteError({ error, retry }) {
  const T = useTokens(); const t = copy.common;
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: layout.x, justifyContent: 'center', gap: 12 }}>
        <Text style={[type.name, { color: T.ink }]}>{t.errorTitle}</Text>
        <Text style={[type.sub, { color: T.muted }]}>{t.errorSub}</Text>
        <Text selectable style={[type.label, { color: T.muted, marginTop: 8 }]}>{String(error?.message || error || '')}</Text>
        <Pressable onPress={retry} style={{ marginTop: 18, alignSelf: 'flex-start', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 999, backgroundColor: T.ink }}><Text style={[type.body, { color: T.bg, fontWeight: '600' }]}>{t.retry}</Text></Pressable>
      </SafeAreaView>
    </View>
  );
}
