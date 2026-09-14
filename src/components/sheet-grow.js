// ═══════════════════════════════════════════════════════════════════
// useSheetGrow — une sheet native « fitToContents » dont une section se déplie.
// Retour Jeanne 9 sept 2026 (« trop agressif comment le pop-up s'allonge ») : plus de
// saut à 92 %. On laisse iOS suivre le contenu ; en filet, 450 ms après le dépliage, on
// fixe une détente à la hauteur MESURÉE du contenu (jamais plus haut que nécessaire).
// Usage : const onLayout = useSheetGrow(grown); … <View onLayout={onLayout}>
// ═══════════════════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// `tall` (note ou champ texte ouvert, clavier visible) : détente haute tout de suite et plus AUCUNE
// re-mesure — retour Ketley 12 sept 2026 : « Je n'aurai pas le temps » scintillait et le clavier
// cachait le champ (la mesure et le clavier se répondaient en boucle).
// `min` (fraction d'écran) : hauteur plancher commune aux sheets de création (Jeanne 14 sept 2026 :
// « ce serait mieux si tous les pop-up faisaient la même taille ») — jamais plus bas, plus haut si besoin.
export const CREATE_SHEET_MIN = 0.62;
export function useSheetGrow(grown, tall = false, min = null) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();
  const [contentH, setContentH] = useState(0);
  useEffect(() => {
    if (tall) { navigation.setOptions({ sheetAllowedDetents: [0.92] }); return; }
    if (!grown) { navigation.setOptions({ sheetAllowedDetents: min ? [min] : 'fitToContents' }); return; }
    // tout de suite (13 sept 2026 : avec 450 ms d'attente, les jours du report ne recevaient pas les touches)
    if (contentH) navigation.setOptions({ sheetAllowedDetents: [Math.max(min || 0, Math.min(0.92, (contentH + 12) / (winH - insets.top - 10)))] });
  }, [grown, tall, contentH, min]);
  return e => { if (!tall) setContentH(e.nativeEvent.layout.height); };
}
