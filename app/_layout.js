// Racine de la navigation : push iOS standard ; les sheets (ping, FAB→ajouts,
// événement) en présentation modale transparente ; les moments (wrapped,
// célébration) en plein écran fondu.
import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { router, usePathname } from 'expo-router';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { colors, motion, radius, alpha } from '../src/theme';

const base = { headerShown: false, contentStyle: { backgroundColor: colors.bg }, animationDuration: motion.screen };
// sheets natives iOS (formSheet) : fond assombri, coins 26, montée native, touches garanties
const sheet = { presentation: 'formSheet', sheetAllowedDetents: 'fitToContents', sheetCornerRadius: radius.sheet, sheetGrabberVisible: false, contentStyle: { backgroundColor: colors.card } };
const tallSheet = { ...sheet, sheetAllowedDetents: [0.92] };
const full = { presentation: 'fullScreenModal', animation: 'fade' };

// ─── Badge dev : numéro d'artboard en haut à droite (demande Jeanne, 1er sept
// 2026, pour simplifier les retours). À RETIRER avant tout build de production.
// Les sheets natives (mission, ping…) passent au-dessus : pas de badge dessus.
const SCREEN_NO = {
  '/': '17', '/planning': '19', '/balance': '21', '/budget': '23',
  '/identite': '06', '/dispos': '07', '/prefs': '08', '/invite': '09', '/duo-forme': '09b',
  '/taches': '10', '/calcul': '11', '/dispatch': '12', '/reattribuer': '13',
  '/afaire': '20-21', '/activite': '22', '/balance-detail': '22', '/point-hebdo': '23',
  '/onboarding': '01-05', '/wrapped': '24-25', '/bilan': '26', '/celebration': '28',
  '/event': '30', '/pense-bete': '32', '/mood': '33', '/notifs': '34',
  '/calendrier': '35', '/analyse': '36', '/paywall': '37', '/profil': '38',
};
const screenNo = path => {
  if (path.startsWith('/task/edit')) return '14';
  if (path.startsWith('/task/mentale')) return '15';
  if (path.startsWith('/task/')) return '16';
  return SCREEN_NO[path] || null;
};
function ScreenBadge() {
  const n = screenNo(usePathname());
  if (!n) return null;
  return (
    <View pointerEvents="none" style={s.badge}>
      <Text style={s.badgeTxt}>{n}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  badge: { position: 'absolute', top: 62, right: 6, zIndex: 9999, backgroundColor: alpha(colors.ink, 0.45), borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1.5 },
  badgeTxt: { color: colors.card, fontSize: 10, fontWeight: '600', letterSpacing: 0.3, fontVariant: ['tabular-nums'] },
});

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
        <Stack.Screen name="mission" options={sheet} />
        <Stack.Screen name="jour" options={sheet} />
        {/* Retour Jeanne (1er sept 2026) : la fiche tâche monte en pop-up, comme sa maquette */}
        <Stack.Screen name="task/edit" options={tallSheet} />
        <Stack.Screen name="event" options={tallSheet} />
        <Stack.Screen name="depense" options={tallSheet} />
        <Stack.Screen name="mood" options={sheet} />
        <Stack.Screen name="wrapped" options={full} />
        <Stack.Screen name="celebration" options={full} />
        <Stack.Screen name="plan" />
      </Stack>
      <ScreenBadge />
    </GestureHandlerRootView>
  );
}

