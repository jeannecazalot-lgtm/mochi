// Sheet « Nom de Mochi » (4 nov 2026) : le nom choisi à l'onboarding se change ici, partagé par le foyer.
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CTAPrimary } from '../src/components/ui';
import { LiveMochiImage, mochiReact } from '../src/components/mochi-img';
import { useTokens, type, layout } from '../src/theme-v3';
import { getMochi, renameMochi, mochiStore } from '../src/mochi-state';
import copy from '../src/data/copy.json';

export default function NomMochi() {
  const t = copy.nomMochi;
  const T = useTokens();
  const [name, setName] = useState('');
  useEffect(() => { getMochi().then(m => setName(m?.name || 'Mochi')).catch(() => setName('Mochi')); }, []);
  const save = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    mochiReact();
    await renameMochi(name).catch(() => {}); mochiStore.bump();
    setTimeout(() => router.back(), 350);
  };
  const X = layout.x;
  return (
    <View style={{ backgroundColor: T.bg, paddingBottom: 34 }}>
      <View style={{ paddingHorizontal: X, paddingTop: 14, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: T.seg }}><Text style={{ color: T.ink, fontSize: 16, lineHeight: 18 }}>×</Text></Pressable>
      </View>
      <View style={{ alignItems: 'center' }}><LiveMochiImage size={110} lean={0} mood={T.night ? 'sleeping' : undefined} /></View>
      <View style={{ paddingHorizontal: X, marginTop: 14 }}>
        <Text style={[type.name, { color: T.ink, fontSize: 24 }]}>{t.title}</Text>
        <Text style={[type.sub, { color: T.muted, marginTop: 6 }]}>{t.sub}</Text>
        <View style={{ marginTop: 18, borderBottomWidth: 1.5, borderColor: T.ink, paddingBottom: 6 }}>
          <TextInput value={name} onChangeText={v => { setName(v); mochiReact(); }} maxLength={18} returnKeyType="done" onSubmitEditing={save} style={[type.name, { color: T.ink, padding: 0 }]} />
        </View>
        <View style={{ marginTop: 18 }}><CTAPrimary big label={t.cta} onPress={save} disabled={!name.trim()} /></View>
      </View>
    </View>
  );
}
