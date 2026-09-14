// Proto · les 10 animations proposées par ChatGPT (revue du 14 sept 2026), à valider une par une par Jeanne.
// Source : design/mochi-personnage/revue-2026-09-14/retour-chatgpt.md §4. URL : /proto-anim, ou /proto-anim?n=3 pour une seule.
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, ScreenTitle, Secondary, Micro } from '../src/components/ui';
import { colors, space, font } from '../src/theme';
import { Demo1, Demo2, Demo3, Demo4, Demo5 } from '../src/components/proto-anim/demos-a';
import { Demo6, Demo7, Demo8, Demo9, Demo10 } from '../src/components/proto-anim/demos-b';

const SECTIONS = [
  ['Coche d’une tâche', 'Task Row · très forte', 'Le cercle se remplit, le check apparaît avec un léger overshoot ; la ligne passe à 65 % puis se compacte et rejoint « Fait ». Petit haptique. Check 160-200 ms, ligne 240 ms.', Demo1],
  ['Mochi réagit à la charge', 'Balance / Accueil · très forte', 'Après chaque action, Mochi se déplace de quelques pixels et s’incline du côté chargé, sa base se comprime puis revient. Le mouvement part de la balance précédente. 280-380 ms, spring.', Demo2],
  ['Changement d’assignation', 'Dispatch · très forte', 'Au tap sur Lea, Kima ou Alterné, l’avatar glisse vers son emplacement et le filet de la ligne prend sa couleur. Micro-déplacement de Mochi. 230 ms.', Demo3],
  ['Ajout d’une tâche', 'Liste · forte', 'La nouvelle ligne apparaît depuis 8 px plus bas en fondu ; les suivantes se repositionnent sans saut. Pas de rebond. 250 ms.', Demo4],
  ['Bottom sheet', 'Tâche / réglages / filtres · forte', 'Montée en spring, fond atténué ; au swipe vers le bas la feuille suit le doigt et se referme. 300-380 ms.', Demo5],
  ['Navigation entre onglets', 'Tab bar · forte', 'Fondu croisé du contenu avec un déplacement de 6 px dans le sens du mouvement ; l’icône active change sans rebond. 200 ms.', Demo6],
  ['Changement de jour', 'Planning · moyenne / forte', 'Les cards sortent dans le sens du swipe, les nouvelles prennent leur place ; le jour sélectionné glisse sous le doigt. 260 ms.', Demo7],
  ['Franchissement d’un seuil', 'Balance · moyenne', 'Le trait central se décale, Mochi suit avec 70 ms de retard ; le visage ne change qu’à la fin. 350-450 ms.', Demo8],
  ['Mochi calcule', 'Fin du setup / recalcul · moyenne', 'Mochi se comprime, deux anneaux fins partent de lui ; au résultat ils disparaissent et Mochi prend son inclinaison finale. Pas de barre. 800 ms.', Demo9],
  ['Célébration rare', 'Duo formé / streak / jalon · faible', 'Avatars, pop de Mochi, dix particules aux couleurs de l’app, stabilisation. Environ 1 s, jamais en boucle.', Demo10],
];

export default function ProtoAnim() {
  const { n } = useLocalSearchParams();
  const only = n ? Number(n) : null;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <GlowBg />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: space.screenX, paddingBottom: 60 }}>
          <View style={{ paddingHorizontal: 5, paddingTop: 14, marginBottom: 6 }}>
            <ScreenTitle>Animations · {only ? `piste ${only}` : '10 pistes'}</ScreenTitle>
            <Secondary style={{ marginTop: 4 }}>Propositions ChatGPT du 14 septembre. Chaque animation se rejoue au tap. Dis oui ou non pour chacune.</Secondary>
          </View>
          {SECTIONS.map(([title, where, spec, Demo], i) => (only && only !== i + 1) ? null : (
            <View key={title} style={{ marginTop: 26 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', paddingHorizontal: 5 }}>
                <Text style={[font.hero, { fontSize: 26, marginRight: 10 }]}>{i + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={font.sectionTitle}>{title}</Text>
                  <Micro style={{ marginTop: 2 }}>{where}</Micro>
                </View>
              </View>
              <Secondary style={{ paddingHorizontal: 5, marginTop: 6, marginBottom: 12 }}>{spec}</Secondary>
              <Demo />
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
