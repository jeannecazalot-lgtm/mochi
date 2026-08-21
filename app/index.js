// Gate : session Supabase ? → onglets ; sinon → connexion.
// Onboarding/setup viendront s'intercaler ici (écrans 01-13).
import React from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useSession } from '../src/auth';
import { SUPABASE_READY } from '../src/supabase';
import { colors } from '../src/theme';

export default function Index() {
  const session = useSession();
  if (!SUPABASE_READY) return <Redirect href="/(tabs)" />; // squelette sans .env : on montre les onglets
  if (session === undefined) return <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  return <Redirect href={session ? '/(tabs)' : '/(auth)/login'} />;
}
