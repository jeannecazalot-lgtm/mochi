// ═══════════════════════════════════════════════════════════════════
// extra.js — composants partagés des écrans setup 07 → 13 (DNA Embossed).
// Complète ui.js sans le modifier. Tout style passe par theme.js.
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { PillLabel, CTAPrimary, CTASecondary } from '../ui';
import { colors, radius, space, font, alpha } from '../../theme';
import copy from '../../data/copy.json';

export const fill = (s, vars = {}) => Object.keys(vars).reduce((acc, k) => acc.split(`{${k}}`).join(String(vars[k])), s);

// ─── en-tête embossed : pastille « ÉTAPE n/4 » + « Passer » (09, 10, 13) ─
export function StepPillHeader({ step, total = 4, onSkip, pill }) {
  const label = pill ?? fill(copy.setup.stepOf, { n: step, total });
  return (
    <View style={s.pillHeader}>
      <PillLabel color={colors.coral}>{label}</PillLabel>
      {onSkip ? <Pressable onPress={onSkip} hitSlop={10}><Text style={s.skip}>{copy.setup.skip}</Text></Pressable> : <View />}
    </View>
  );
}

// ─── titre d'étape 22/600 + sous-titre 14/400 (padding 14 23 0) ────
export function StepTitle({ title, sub }) {
  return (
    <View style={{ paddingHorizontal: space.headerX, paddingTop: 14 }}>
      <Text style={[font.screenTitle, { letterSpacing: -1.1, lineHeight: 23 }]}>{title}</Text>
      {sub ? <Text style={[font.secondary, { fontSize: 14, marginTop: 6, lineHeight: 20 }]}>{sub}</Text> : null}
    </View>
  );
}

// ─── bloc CTA posé sur le fond (bottom 24–26, marges 18), 1 ou 2 boutons ─
export function BottomCTA({ primary, onPrimary, secondary, onSecondary, bottom = 24, disabled }) {
  if (secondary) {
    return (
      <View style={[s.bottom, { bottom, flexDirection: 'row', gap: 8 }]}>
        <CTASecondary label={secondary} onPress={onSecondary} style={{ flex: 1, paddingVertical: 14 }} />
        <CTAPrimary label={primary} onPress={onPrimary} disabled={disabled} style={{ flex: 1.6 }} />
      </View>
    );
  }
  return <View style={[s.bottom, { bottom }]}><CTAPrimary label={primary} onPress={onPrimary} disabled={disabled} big /></View>;
}

// ─── interrupteur 42×24 (10) ────────────────────────────────────────
export function Toggle({ on, onPress }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={[s.toggle, { backgroundColor: on ? colors.darkPill : alpha(colors.ink, 0.10) }]}>
      <View style={[s.knob, { left: on ? 20 : 2 }]} />
    </Pressable>
  );
}

// ─── place vide en pointillés « ? » (09) ────────────────────────────
export function AvatarPlaceholder({ size = 54 }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderStyle: 'dashed', borderColor: alpha(colors.ink, 0.25), backgroundColor: alpha(colors.ink, 0.03), alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.muted, fontSize: size * 0.39, fontWeight: '600' }}>?</Text>
    </View>
  );
}

// ─── micro-label de section avec couleur optionnelle ────────────────
export const SectionLabel = ({ children, color = colors.muted, style }) => (
  <Text style={[font.micro, { color, marginBottom: 9 }, style]}>{children}</Text>
);

const s = StyleSheet.create({
  pillHeader: { paddingHorizontal: space.headerX, paddingTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skip: { fontSize: 13, fontWeight: '500', color: colors.muted },
  bottom: { position: 'absolute', left: space.screenX, right: space.screenX },
  toggle: { width: 42, height: 24, borderRadius: 12 },
  knob: { position: 'absolute', top: 2, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.card, shadowColor: colors.ink, shadowOpacity: 0.18, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
});

// ─── tokens manquants dans theme.js (à y déplacer par l'intégrateur) ─
// teintes « on » des chips de préférences (08) : sage clair / pêche de l'artboard
export const setupTokens = { chipLike: '#C9E0C5', chipHate: '#F5A89A' };

// ═══ Retours Jeanne 22 août 2026 — primitives d'animation setup (07-08) ═══
// (imports hoistés par Babel ; durées locales à déplacer dans theme.motion par l'intégrateur)
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withSequence, withDelay } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { prefersReducedMotion } from '../motion';

// ─── pop d'échelle à chaque changement de `value` (cellules de la grille 07) ─
export function useTogglePop(value) {
  const s = useSharedValue(1);
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (prefersReducedMotion()) return;
    s.value = withSequence(withTiming(0.9, { duration: 80 }), withSpring(1, { damping: 10 }));
  }, [value]);
  return useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
}

// ─── pulse léger 1 → 1.04 → 1 quand `trigger` passe à vrai (options de temps 07) ─
export function PulseView({ trigger, delay = 0, style, children }) {
  const sc = useSharedValue(1);
  React.useEffect(() => {
    if (!trigger || prefersReducedMotion()) return;
    sc.value = withDelay(delay, withSequence(withTiming(1.04, { duration: 160 }), withTiming(1, { duration: 160 })));
  }, [trigger]);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

// ─── secousse horizontale ±6 px, 3 oscillations ~300 ms + haptique warning
//     (chip refusé quand le max est atteint, 08) ─
export function useShake() {
  const x = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const shake = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    if (prefersReducedMotion()) return;
    x.value = withSequence(
      withTiming(-6, { duration: 45 }), withTiming(6, { duration: 50 }),
      withTiming(-6, { duration: 50 }), withTiming(6, { duration: 50 }),
      withTiming(-6, { duration: 50 }), withTiming(0, { duration: 55 }),
    );
  };
  return { style, shake };
}

// ═══ Retours Jeanne 22 août 2026 — invitation (09) + planche props ═══
// (imports hoistés par Babel)
import Svg, { Path } from 'react-native-svg';

// ─── lien « Passer » discret 13/500 muted, aligné sur la flèche retour de
// SetupHeader. À poser DANS un wrapper relatif qui contient aussi <SetupHeader />.
export function SkipLink({ onPress, label }) {
  return (
    <Pressable onPress={onPress} hitSlop={12} style={s2.skipLink}>
      <Text style={s.skip}>{label ?? copy.setup.skip}</Text>
    </Pressable>
  );
}

// ─── icône partage système iOS (flèche qui sort de la boîte), outline 1.8 ─
export const ShareIcon = ({ size = 18, color = colors.ink }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 11v9a2 2 0 002 2h12a2 2 0 002-2v-9" />
    <Path d="M16 6l-4-4-4 4" />
    <Path d="M12 2v13" />
  </Svg>
);

// ─── icône QR code, outline 1.8 ─────────────────────────────────────
export const QRIcon = ({ size = 18, color = colors.ink }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
    <Path d="M14 14h3v3h-3zM17 17h3v3h-3z" />
  </Svg>
);

// ─── bouton secondaire rond/pilule (09) : glass + hairline, radius 999.
// Avec `label` → pilule icône + texte ; sans → rond icône seule (size × size).
export function ActionPill({ icon, label, onPress, size = 48, accessibilityLabel, style }) {
  return (
    <Pressable onPress={onPress} accessibilityLabel={accessibilityLabel || label} hitSlop={4}
      style={({ pressed }) => [s2.actionPill, { height: size }, label ? { paddingHorizontal: 20 } : { width: size }, { opacity: pressed && onPress ? 0.7 : 1 }, style]}>
      {icon}
      {label ? <Text style={s2.actionPillTxt}>{label}</Text> : null}
    </Pressable>
  );
}

const s2 = StyleSheet.create({
  skipLink: { position: 'absolute', right: space.screenX, top: 4, height: 30, justifyContent: 'center', zIndex: 2 },
  actionPill: { backgroundColor: colors.glass, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionPillTxt: { fontSize: 14.5, fontWeight: '500', color: colors.ink },
});
