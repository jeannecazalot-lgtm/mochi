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
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ alignItems: 'center', paddingTop: 18 }}>
          <LiveMochi size={96} mood="happy" />
        </View>
        <SetupHeader step={1} total={4} title={t.identityTitle} sub={t.identitySub} />

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
          <Pressable onPress={pickPhoto}>
            <Card padding={0}>
              <View style={s.photoRow}>
                {photo
                  ? <Image source={{ uri: photo }} style={s.photo} />
                  : (
                    <View style={s.photoEmpty}>
                      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.muted} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z" /><Circle cx="12" cy="13" r="4" />
                      </Svg>
                    </View>
                  )}
                <View style={{ flex: 1 }}>
                  <Text style={s.photoTitle}>{photo ? t.photoChange : t.photoAdd}</Text>
                  <Text style={s.photoHint}>{t.photoHint}</Text>
                </View>
                <Text style={{ fontSize: 16, color: colors.muted }}>›</Text>
              </View>
            </Card>
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
  photo: { width: 72, height: 72, borderRadius: 36 },
  photoEmpty: { width: 72, height: 72, borderRadius: 36, backgroundColor: alpha(colors.ink, 0.04), borderWidth: 1.5, borderStyle: 'dashed', borderColor: alpha(colors.ink, 0.22), alignItems: 'center', justifyContent: 'center' },
  photoTitle: { fontSize: 15.5, fontWeight: '600', color: colors.ink },
  photoHint: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 3, lineHeight: 18 },
  ctaWrap: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 26 },
});
