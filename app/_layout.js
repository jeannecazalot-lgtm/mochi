// Racine de la navigation : push iOS standard ; les sheets (ping, FAB→ajouts,
// événement) en présentation modale transparente ; les moments (wrapped,
// célébration) en plein écran fondu.
import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { colors, motion } from '../src/theme';

const base = { headerShown: false, contentStyle: { backgroundColor: colors.bg }, animationDuration: motion.screen };
const sheet = { presentation: 'transparentModal', animation: 'fade', contentStyle: { backgroundColor: 'transparent' } };
const full = { presentation: 'fullScreenModal', animation: 'fade' };

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <Stack screenOptions={base}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(setup)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding/index" options={{ animation: 'fade' }} />
        <Stack.Screen name="ping" options={sheet} />
        <Stack.Screen name="event" options={sheet} />
        <Stack.Screen name="depense" options={sheet} />
        <Stack.Screen name="mood" options={sheet} />
        <Stack.Screen name="wrapped" options={full} />
        <Stack.Screen name="celebration" options={full} />
        <Stack.Screen name="plan" options={{ presentation: 'modal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
