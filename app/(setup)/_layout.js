import { Stack } from 'expo-router';
import { colors } from '../../src/theme';
// Retour Jeanne (1er sept 2026) : les fonds des écrans setup étant quasi
// identiques, le slide natif se voyait à peine — animation explicite et un
// peu plus longue pour que l'apparition d'écran soit perceptible.
// Retour Jeanne (2 sept 2026, test à deux) : PAS de swipe-retour sur le setup
// (on revenait au 06 sans le vouloir) — seul le chevron ramène en arrière.
export default function SetupLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right', animationDuration: 380, gestureEnabled: false }} />;
}
