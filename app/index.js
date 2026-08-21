// Porte d'entrée. Parcours « anonyme d'abord » (décision du 21 août 2026) :
//  · pas de session, ou profil sans prénom → setup (écran 06), la session
//    anonyme est créée au moment d'enregistrer ;
//  · profil complet → onglets. (Le foyer et l'onboarding viendront s'intercaler.)
// L'écran de connexion (lien e-mail / Apple) sert à relier un compte, plus tard.
import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useSession } from '../src/auth';
import { loadProfile } from '../src/profile';
import { SUPABASE_READY } from '../src/supabase';
import { colors } from '../src/theme';

export default function Index() {
  const session = useSession();
  const [profile, setProfile] = useState(undefined);

  useEffect(() => {
    if (session === undefined) return;
    if (!session) { setProfile(null); return; }
    loadProfile().then(setProfile).catch(() => setProfile(null));
  }, [session]);

  // Phase « app navigable » : en dev, on entre par le Plan des écrans (données de démo)
  if (__DEV__) return <Redirect href="/plan" />;
  if (!SUPABASE_READY) return <Redirect href="/(setup)/identite" />;
  if (session === undefined || profile === undefined) {
    return <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  }
  return <Redirect href={profile?.first_name ? '/(tabs)' : '/(setup)/identite'} />;
}
