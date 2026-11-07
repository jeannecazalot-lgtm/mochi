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
import { loadSetup, setup, saveDispos, savePrefs, isJoiner } from '../../src/setup-state';
import { syncJoinerPrefs } from '../../src/sync-setup';
import { me } from '../../src/demo';
import copy from '../../src/data/copy.json';
import { Egg } from '../../src/components/mochi/scene';
import { useTokens as useT3, layout } from '../../src/theme-v3';
const EggHero = () => <Egg T={useT3()} />;
import { colors, space, radius, alpha, font } from '../../src/theme';
import { styles as v3Styles, currentTokens as tk } from '../../src/theme-v3';

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
    finally {
      setSaving(false);
      // setup court (Jeanne 6 nov 2026) : dispos et préférences par défaut, réglables dans Profil › Mes dispos & préférences
      await loadSetup();
      router.push('/(setup)/dispos'); // tout le monde passe par ses dispos et ses préférences (Jeanne, 8 nov 2026 : « je n'ai pas rempli mes disponibilités, mon énergie »)
    }
  };

  const pickPhoto = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!r.canceled) setPhoto(r.assets[0].uri);
  };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <SetupHeader hero={<EggHero />} why={t.whyIdentity} step={1} total={4} title={t.identityTitle} backFallback="/onboarding" />

        {/* DA v3 (7 nov 2026, retours Jeanne) : la photo est l'élément central — grand cercle avec l'initiale en couleur,
            bouton rond + accroché dessus, puis le prénom en grand. La photo choisie remplit le cercle. */}
        <View style={{ paddingHorizontal: layout.x, paddingTop: 26, alignItems: 'center' }}>
          <Pressable onPress={pickPhoto} style={({ pressed }) => [{ width: 132, height: 132, opacity: pressed ? 0.8 : 1 }]}>
            {photo
              ? <Image source={{ uri: photo }} style={{ width: 132, height: 132, borderRadius: 66 }} />
              : <View style={{ width: 132, height: 132, borderRadius: 66, backgroundColor: me.color, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 56, fontWeight: '600', letterSpacing: -2, color: '#FFFFFF' }}>{(firstName.trim()[0] || '?').toUpperCase()}</Text></View>}
            <View style={{ position: 'absolute', right: -2, bottom: -2, width: 40, height: 40, borderRadius: 20, backgroundColor: tk().ink, borderWidth: 3, borderColor: tk().bg, alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={tk().bg} strokeWidth={2.4} strokeLinecap="round"><Path d="M12 5v14M5 12h14" /></Svg>
            </View>
          </Pressable>
          <Text style={{ fontSize: 12.5, color: tk().muted, marginTop: 12 }}>{photo ? t.photoChange : t.photoHint.replace('{name}', 'Ton binôme')}</Text>
          <TextInput
            value={firstName} onChangeText={setFirstName} placeholder={t.firstNamePlaceholder} placeholderTextColor={tk().muted}
            autoCorrect={false} autoCapitalize="words" returnKeyType="done" cursorColor={tk().accent} selectionColor={tk().accent} textAlign="center"
            style={{ fontSize: 34, fontWeight: '600', letterSpacing: -1, color: tk().ink, paddingVertical: 10, marginTop: 22, alignSelf: 'stretch', borderBottomWidth: 1.5, borderColor: tk().ink }}
          />
        </View>

        <View style={s.ctaWrap}>
          {error ? <Text style={[font.caption, { color: tk().muted }, { color: tk().accent, textAlign: 'center', marginBottom: 8 }]}>{error}</Text> : null}
          <CTAPrimary label={copy.common.continue} disabled={!firstName.trim() || saving} onPress={onContinue} big />
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = v3Styles(T => StyleSheet.create({
  label: { marginBottom: 9 },
  input: { paddingVertical: 17, paddingHorizontal: 18, fontSize: 19, fontWeight: '600', letterSpacing: -0.4, color: T.ink },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 17, paddingHorizontal: 18 },
  // rond (retour Jeanne, 2 sept 2026 — annule le carré arrondi du 1er sept)
  photo: { width: 150, height: 150, borderRadius: 75 },
  photoEmpty: { width: 150, height: 150, borderRadius: 75, backgroundColor: T.seg, borderWidth: 1.5, borderStyle: 'dashed', borderColor: T.seg, alignItems: 'center', justifyContent: 'center' },
  addPill: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: -17, backgroundColor: T.bg, borderRadius: radius.pill, paddingVertical: 9, paddingHorizontal: 17, borderWidth: StyleSheet.hairlineWidth, borderColor: T.line, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  addPillTxt: { fontSize: 15, fontWeight: '600', color: T.ink },
  ctaWrap: { position: 'absolute', left: 24, right: 24, bottom: 26 },
}));
