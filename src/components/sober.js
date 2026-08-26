// ═══════════════════════════════════════════════════════════════════
// sober.js — repères graphiques sobres partagés (décision Jeanne du
// 23 août 2026 : plus aucun émoji dans l'interface). La pastille Dot
// remplace l'émoji comme repère visuel des rangées (couleur du membre
// assigné, ou accent de la card).
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View } from 'react-native';

// pastille ronde 9 px (8-10 selon le contexte via `size`)
export function Dot({ color, size = 9, style }) {
  return <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]} />;
}
