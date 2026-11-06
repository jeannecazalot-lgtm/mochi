// Porte d'entrée. Parcours « anonyme d'abord » (décision du 21 août 2026) :
//  · pas de session, ou profil sans prénom → setup (écran 06), la session
//    anonyme est créée au moment d'enregistrer ;
//  · profil complet → onglets. (Le foyer et l'onboarding viendront s'intercaler.)
// L'écran de connexion (lien e-mail / Apple) sert à relier un compte, plus tard.
import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSession, isRealUser } from '../src/auth';
import { loadProfile } from '../src/profile';
import { SUPABASE_READY } from '../src/supabase';
import { colors } from '../src/theme';
import { styles as v3Styles, currentTokens as tk } from '../src/theme-v3';

export default function Index() {
  const session = useSession();
  const [profile, setProfile] = useState(undefined);
  const [guest, setGuest] = useState(undefined);
  const [onboarded, setOnboarded] = useState(undefined); // premier lancement → onboarding (6 nov 2026 : une install neuve allait droit à la connexion)
  useEffect(() => {
    AsyncStorage.getItem('mochi:guest').then(v => setGuest(v === '1')).catch(() => setGuest(false));
    AsyncStorage.getItem('mochi:onboarded').then(v => setOnboarded(v === '1')).catch(() => setOnboarded(false));
  }, []);

  useEffect(() => {
    if (session === undefined) return;
    if (!session) { setProfile(null); return; }
    loadProfile().then(setProfile).catch(() => setProfile(null));
  }, [session]);

  // Phase « app navigable » : en dev, on entre par le Plan des écrans (données de démo)
  if (__DEV__) return <Redirect href="/plan" />;
  if (!SUPABASE_READY) return <Redirect href="/(setup)/identite" />;
  if (session === undefined || profile === undefined || guest === undefined || onboarded === undefined) {
    return <View style={{ flex: 1, backgroundColor: tk().bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  }
  // compte d'abord (13 sept 2026) : sans session vraie (nulle ou anonyme) → connexion ; puis prénom ; puis l'app
  // jamais vu l'onboarding et pas encore de compte ni de prénom → l'onboarding d'abord
  if (!onboarded && !isRealUser(session) && !guest && !profile?.first_name) return <Redirect href="/onboarding" />;
  if (!isRealUser(session) && !guest) return <Redirect href="/(auth)/login" />; // invité : on avance sans compte
  return <Redirect href={profile?.first_name ? '/(tabs)' : '/(setup)/identite'} />;
}
