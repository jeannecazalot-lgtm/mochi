// Mon profil (sheet) — retour Jeanne 13 sept 2026 : « quand j'appuie sur ma photo je devrais pouvoir
// changer mon nom et ma photo, sous forme de pop-up ». Même écriture que l'écran 06.
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Card, Avatar } from '../src/components/ui';
import { SheetHandle } from '../src/components/social/extra';
import { Row, Arrow } from '../src/components/task/proto';
import { me } from '../src/demo';
import { setLocalIdentity, useIdentity } from '../src/identity';
import { saveIdentity } from '../src/profile';
import copy from '../src/data/copy.json';
import { colors, space, font, alpha } from '../src/theme';

const t = copy.moi;

export default function Moi() {
  useIdentity();
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState(me.first_name || '');
  const [photo, setPhoto] = useState(me.avatar_url || null);
  const [saving, setSaving] = useState(false);
  const pickPhoto = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!r.canceled) setPhoto(r.assets[0].uri);
  };
  const save = async () => {
    if (!firstName.trim() || saving) return;
    setSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setLocalIdentity({ firstName, avatarUrl: photo }); // visible partout tout de suite
    try { await saveIdentity({ firstName, photoUri: photo }); } catch (e) { /* hors ligne : le local reste */ }
    router.back();
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]}>
      <Pressable onPress={Keyboard.dismiss} accessible={false}>
        <SheetHandle />
        <View style={s.head}>
          <Pressable onPress={pickPhoto} hitSlop={8}><Avatar initial={(firstName || me.initial || '?')[0].toUpperCase()} color={me.color} photo={photo} size={64} ring /></Pressable>
          <View style={{ flex: 1 }}>
            <TextInput value={firstName} onChangeText={setFirstName} placeholder={copy.setup.firstNamePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)} autoCorrect={false} returnKeyType="done" onSubmitEditing={Keyboard.dismiss} cursorColor={colors.coral} selectionColor={colors.coral} style={s.name} />
            <Pressable onPress={pickPhoto} hitSlop={6}><Text style={s.link}>{t.changePhoto}</Text></Pressable>
          </View>
        </View>
        <Card r={16} padding={0}>
          <Row first strong label={copy.common.save} sub={firstName.trim() ? null : copy.setup.firstNamePlaceholder} right={<Arrow />} onPress={firstName.trim() ? save : undefined} />
        </Card>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  sheet: { backgroundColor: colors.card, paddingTop: 10, paddingHorizontal: space.screenX },
  head: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 4, marginBottom: 14, paddingHorizontal: 2 },
  name: { ...font.cardTitle, padding: 0 },
  link: { fontSize: 13, fontWeight: '600', color: colors.muted, marginTop: 4 },
});
