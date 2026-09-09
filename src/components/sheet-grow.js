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

export function useSheetGrow(grown) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();
  const [contentH, setContentH] = useState(0);
  useEffect(() => {
    if (!grown) { navigation.setOptions({ sheetAllowedDetents: 'fitToContents' }); return; }
    const id = setTimeout(() => { if (contentH) navigation.setOptions({ sheetAllowedDetents: [Math.min(0.92, (contentH + 12) / (winH - insets.top - 10))] }); }, 450);
    return () => clearTimeout(id);
  }, [grown, contentH]);
  return e => setContentH(e.nativeEvent.layout.height);
}
