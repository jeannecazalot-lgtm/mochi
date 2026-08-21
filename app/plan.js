// Plan des écrans — écran de navigation pour Jeanne (dev). Un item = un artboard.
import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { GlowBg, ScreenTitle, Card, Divider, Micro, Secondary } from '../src/components/ui';
import { colors, space, font } from '../src/theme';

const GROUPS = [
  ['Onboarding', [['01-05 · Onboarding', '/onboarding']]],
  ['Setup', [['06 · Identité', '/(setup)/identite'], ['07 · Dispos & énergie', '/(setup)/dispos'], ['08 · Préférences', '/(setup)/prefs'], ['09 · Inviter son binôme', '/(setup)/invite'], ['09b · Duo formé', '/(setup)/duo-forme'], ['10 · Choisir les tâches', '/(setup)/taches'], ['11 · Mochi calcule', '/(setup)/calcul'], ['12 · Proposition de dispatch', '/(setup)/dispatch'], ['13 · Réattribuer', '/(setup)/reattribuer']]],
  ['Onglets', [['17 · Accueil', '/(tabs)'], ['19 · Planning', '/(tabs)/planning'], ['21 · Balance', '/(tabs)/balance'], ['23 · Budget', '/(tabs)/budget']]],
  ['Tâches', [['14 · Fiche tâche', '/task/edit?id=t-courses'], ['15 · Tâche mentale', '/task/mentale'], ['16 · Détail tâche', '/task/t-pediatre'], ['20-21 · À faire', '/afaire']]],
  ['Social', [['18 · Ping (sheet)', '/ping?occ=o2'], ['22 · Fil Activité', '/activite']]],
  ['Balance', [['22 · Balance détail', '/balance-detail'], ['23 · Point hebdo · malus', '/point-hebdo']]],
  ['Ajout', [['Dépense', '/depense'], ['30 · Événement social', '/event'], ['32 · Pense-bête', '/pense-bete'], ['33 · Mood check-in', '/mood'], ['34 · Notifs lockscreen', '/notifs']]],
  ['Moments', [['24-25 · Wrapped', '/wrapped'], ['26 · Bilan mensuel', '/bilan'], ['28 · Streak célébration', '/celebration']]],
  ['Premium', [['35 · Calendrier mois', '/calendrier'], ['36 · Analyse charge mentale', '/analyse'], ['37 · Paywall Duo+', '/paywall'], ['38 · Profil & réglages', '/profil']]],
  ['Compte', [['Connexion (lien e-mail)', '/(auth)/login']]],
];

export default function Plan() {
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: space.screenX, paddingBottom: 40 }}>
          <View style={{ paddingHorizontal: 5, paddingTop: 14, marginBottom: 14 }}>
            <ScreenTitle>Plan des écrans</ScreenTitle>
            <Secondary style={{ marginTop: 4 }}>Navigation de développement · données de démo</Secondary>
          </View>
          {GROUPS.map(([title, items]) => (
            <View key={title} style={{ marginBottom: 14 }}>
              <Micro style={{ marginBottom: 7, paddingHorizontal: 5 }}>{title}</Micro>
              <Card padding={0}>
                {items.map(([label, href], i) => (
                  <View key={href}>
                    {i > 0 ? <Divider /> : null}
                    <Pressable onPress={() => router.push(href)} style={({ pressed }) => ({ paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', opacity: pressed ? 0.6 : 1 })}>
                      <Text style={[font.row, { flex: 1 }]}>{label}</Text>
                      <Text style={{ color: colors.muted, fontSize: 16 }}>›</Text>
                    </Pressable>
                  </View>
                ))}
              </Card>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
