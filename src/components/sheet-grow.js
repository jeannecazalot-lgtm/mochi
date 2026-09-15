// ═══════════════════════════════════════════════════════════════════
// useSheetGrow — une sheet native « fitToContents » dont une section se déplie.
// Historique : 9 sept (plus de saut à 92 %), 13 sept (détente immédiate pour que les touches passent),
// 15 sept 2026 : Jeanne a eu une sheet qui « vibrait » sans s'arrêter tant qu'elle ne la fermait pas —
// boucle mesure → détente → nouvelle mesure. Désormais UNE seule mesure par changement d'état :
// quand `grown` bascule, la première mesure qui suit fixe la détente, puis plus rien ne bouge
// jusqu'au prochain basculement. Aucune boucle possible.
// Usage : const onLayout = useSheetGrow(grown, tall, min); … <View onLayout={onLayout}>
// ═══════════════════════════════════════════════════════════════════
import { useEffect, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const CREATE_SHEET_MIN = 0.5;
export function useSheetGrow(grown, tall = false, min = null) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();
  const pending = useRef(false); // une mesure attendue après un basculement
  const fraction = h => Math.max(min || 0, Math.min(0.92, (h + 12) / (winH - insets.top - 10)));
  useEffect(() => {
    if (tall) { pending.current = false; navigation.setOptions({ sheetAllowedDetents: [0.92] }); return; }
    if (!grown) { pending.current = !!min; if (!min) navigation.setOptions({ sheetAllowedDetents: 'fitToContents' }); return; }
    pending.current = true; // section dépliée : la prochaine mesure fixe la hauteur, une fois
  }, [grown, tall, min]);
  return e => {
    if (!pending.current) return;
    pending.current = false;
    navigation.setOptions({ sheetAllowedDetents: [fraction(e.nativeEvent.layout.height)] });
  };
}
