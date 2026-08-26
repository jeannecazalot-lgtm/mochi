// Écran 06 · Profil — PROPOSITION A appliquée (choix « teste la A », 23 août 2026) :
// titre centré, capsule photo en vedette, pilule prénom, CTA en bas.
// Recette : docs/recettes/06-identite.md (section Retours Jeanne).
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path, Circle } from 'react-native-svg';
import { GlowBg, SetupHeader, CTAPrimary } from '../../src/components/ui';
import { saveIdentity, loadProfile } from '../../src/profile';
import copy from '../../src/data/copy.json';
import { colors, space, alpha, radius } from '../../src/theme';

const t = copy.setup;

const CameraIcon = ({ size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" /><Circle cx="12" cy="13" r="4" />
  </Svg>
);

export default function Identite() {
  const [firstName, setFirstName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProfile().then(p => { if (p) { setFirstName(p.first_name || ''); setPhoto(p.avatar_url || null); } }).catch(() => {}); }, []);

  const pickPhoto = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!r.canceled) setPhoto(r.assets[0].uri);
  };

  const onContinue = async () => {
    // La sauvegarde ne bloque jamais le parcours (décision Jeanne, 22 août 2026).
    setSaving(true);
    try { await saveIdentity({ firstName, photoUri: photo }); }
    catch (e) { console.warn('[06] saveIdentity a échoué (on avance quand même) :', e?.message || e); }
    finally { setSaving(false); router.push('/(setup)/dispos'); }
  };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }}>
        <SetupHeader step={1} total={4} title="" sub="" />
        <Text style={s.title}>{t.identityTitleA}</Text>

        <Pressable onPress={pickPhoto} style={({ pressed }) => [s.capsule, { opacity: pressed ? 0.85 : 1 }]}>
          {photo
            ? <Image source={{ uri: photo }} style={s.photo} />
            : <CameraIcon />}
        </Pressable>

        <View style={s.pill}>
          <TextInput
            value={firstName} onChangeText={setFirstName} placeholder={t.firstNamePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)}
            autoCorrect={false} autoCapitalize="words" returnKeyType="done" textAlign="center"
            cursorColor={colors.coral} selectionColor={colors.coral} style={s.input} />
        </View>

        <View style={{ flex: 1 }} />
        <View style={{ paddingBottom: 26 }}>
          <CTAPrimary label={copy.common.continue} disabled={!firstName.trim() || saving} onPress={onContinue} big />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700', letterSpacing: -0.8, color: colors.ink, textAlign: 'center', marginTop: 18, marginBottom: 28 },
  capsule: { alignSelf: 'center', width: 116, height: 148, borderRadius: 70, backgroundColor: colors.butterLight, alignItems: 'center', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, overflow: 'hidden' },
  photo: { width: '100%', height: '100%' },
  pill: { marginTop: 26, height: 54, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, justifyContent: 'center' },
  input: { fontSize: 17, fontWeight: '500', color: colors.ink, paddingHorizontal: 18 },
});
