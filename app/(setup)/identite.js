// Écran 06 · Setup A — Identité. Recette : docs/recettes/06-identite.md
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path, Circle } from 'react-native-svg';
import { GlowBg, SetupHeader, Card, Micro, CTAPrimary } from '../../src/components/ui';
import { LiveMochi } from '../../src/components/motion';
import { saveIdentity, loadProfile } from '../../src/profile';
import { setLocalIdentity } from '../../src/identity';
import copy from '../../src/data/copy.json';
import { colors, space, radius, alpha, font } from '../../src/theme';

export default function Identite() {
  const [firstName, setFirstName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const t = copy.setup;

  // pré-remplit si on revient sur l'écran
  useEffect(() => { loadProfile().then(p => { if (p) { setFirstName(p.first_name || ''); setPhoto(p.avatar_url || null); } }).catch(() => {}); }, []);

  const onContinue = async () => {
    // Décision Jeanne (22 août 2026) : la sauvegarde ne bloque JAMAIS le parcours.
    // En cas d'échec Supabase on avance quand même ; la cause est loguée pour debug.
    setSaving(true); setError(null);
    setLocalIdentity({ firstName, avatarUrl: photo }); // visible partout tout de suite
    try { await saveIdentity({ firstName, photoUri: photo }); }
    catch (e) { console.warn('[06] saveIdentity a échoué (on avance quand même) :', e?.message || e); }
    finally { setSaving(false); router.push('/(setup)/dispos'); }
  };

  const pickPhoto = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!r.canceled) setPhoto(r.assets[0].uri);
  };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <SetupHeader hero={<LiveMochi size={96} mood="happy" />} step={1} total={4} title={t.identityTitle} />

        <View style={{ paddingHorizontal: space.headerX, paddingTop: 24 }}>
          <Micro style={s.label}>{t.firstNameLabel}</Micro>
          <Card padding={0} style={{ marginBottom: 19 }}>
            <TextInput
              value={firstName} onChangeText={setFirstName} placeholder={t.firstNamePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)}
              autoCorrect={false} autoCapitalize="words" returnKeyType="done" cursorColor={colors.coral} selectionColor={colors.coral}
              style={s.input}
            />
          </Card>

          <Micro style={s.label}>{t.photoLabel}</Micro>
          {/* Façon Airbnb (retour Jeanne, 1er sept 2026) : grande photo centrée, pilule « Ajouter » à cheval sur le bas */}
          <Pressable onPress={pickPhoto} style={{ alignItems: 'center', marginTop: 6 }}>
            {photo
              ? <Image source={{ uri: photo }} style={s.photo} />
              : (
                <View style={s.photoEmpty}>
                  <Svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" /><Circle cx="12" cy="13" r="4" />
                  </Svg>
                </View>
              )}
            <View style={s.addPill}>
              <Svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={colors.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" /><Circle cx="12" cy="13" r="4" />
              </Svg>
              <Text style={s.addPillTxt}>{t.photoButton}</Text>
            </View>
          </Pressable>
        </View>


        <View style={s.ctaWrap}>
          {error ? <Text style={[font.caption, { color: colors.coralDeep, textAlign: 'center', marginBottom: 8 }]}>{error}</Text> : null}
          <CTAPrimary label={copy.common.continue} disabled={!firstName.trim() || saving} onPress={onContinue} big />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  label: { marginBottom: 9 },
  input: { paddingVertical: 17, paddingHorizontal: 18, fontSize: 19, fontWeight: '600', letterSpacing: -0.4, color: colors.ink },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 17, paddingHorizontal: 18 },
  // rond (retour Jeanne, 2 sept 2026 — annule le carré arrondi du 1er sept)
  photo: { width: 150, height: 150, borderRadius: 75 },
  photoEmpty: { width: 150, height: 150, borderRadius: 75, backgroundColor: alpha(colors.ink, 0.04), borderWidth: 1.5, borderStyle: 'dashed', borderColor: alpha(colors.ink, 0.22), alignItems: 'center', justifyContent: 'center' },
  addPill: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: -17, backgroundColor: colors.card, borderRadius: radius.pill, paddingVertical: 9, paddingHorizontal: 17, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  addPillTxt: { fontSize: 15, fontWeight: '600', color: colors.ink },
  ctaWrap: { position: 'absolute', left: 24, right: 24, bottom: 26 },
});
