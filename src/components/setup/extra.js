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
  bottom: { position: 'absolute', left: 24, right: 24 },
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

// ═══ Retours Jeanne 22 août 2026 — fin de setup (10-12) ═══
// (imports hoistés par Babel ; durées locales à déplacer dans theme.motion par l'intégrateur)
import { useCheckPop } from '../motion';
import { withTiming as wTiming, Easing as REasing } from 'react-native-reanimated';

// ─── rond de sélection 26 (10) : anneau `checkRing` off, plein `darkPill` + ✓ crème on.
// Pop via useCheckPop au cochage ; l'haptique légère est déclenchée par l'écran.
export function CheckDot({ on, onPress, size = 26 }) {
  const pop = useCheckPop(on);
  return (
    <Pressable onPress={onPress} hitSlop={10} accessibilityRole="checkbox" accessibilityState={{ checked: !!on }}>
      <Animated.View style={[{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? colors.darkPill : 'transparent', borderWidth: 1.5, borderColor: on ? colors.darkPill : colors.checkRing }, pop]}>
        {on ? (
          <Svg width={size * 0.54} height={size * 0.54} viewBox="0 0 24 24" fill="none" stroke={colors.card} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M4 12.5l5.5 5.5L20 6.5" />
          </Svg>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

// ─── CTA secondaire « + Ajouter » (10) avec état pressé VISIBLE :
// fond qui fonce + échelle 0.97 (CTASecondary ne baisse que l'opacité).
export function AddButton({ label, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s3.add, pressed && s3.addPressed, style, pressed && { transform: [{ scale: 0.97 }] }]}>
      <Text style={font.ctaSecondary}>{label}</Text>
    </Pressable>
  );
}

// ─── barre de progression LENTE (11) : 0 → ratio sur `duration` ms
// (ProgressBar de motion.js est figée à 600 ms). Immédiate si animations réduites.
export function SetupProgress({ ratio = 1, duration = 3600, color, track, height = 4, radius: r = 999, style }) {
  const w = useSharedValue(0);
  React.useEffect(() => {
    w.value = wTiming(Math.max(0, Math.min(1, ratio)), { duration: prefersReducedMotion() ? 0 : duration, easing: REasing.out(REasing.quad) });
  }, [ratio, duration]);
  const fillStyle = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <View style={[{ height, borderRadius: r, backgroundColor: track, overflow: 'hidden' }, style]}>
      <Animated.View style={[{ height: '100%', borderRadius: r, backgroundColor: color }, fillStyle]} />
    </View>
  );
}

// ─── count-up (12) : compte depuis la valeur PRÉCÉDENTE (pas depuis 0),
// pour les totaux qui se recalculent en direct ; premier montage = depuis 0.
export function LiveCount({ value, format = v => String(Math.round(v)), style, duration = 500 }) {
  const [v, setV] = React.useState(prefersReducedMotion() ? value : 0);
  const fromRef = React.useRef(prefersReducedMotion() ? value : 0);
  React.useEffect(() => {
    if (prefersReducedMotion()) { fromRef.current = value; setV(value); return; }
    const from = fromRef.current, start = Date.now();
    let raf, last = from;
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      last = from + (value - from) * e;
      setV(last);
      if (p < 1) raf = requestAnimationFrame(tick); else fromRef.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); fromRef.current = last; };
  }, [value]);
  return <Text style={style}>{format(v)}</Text>;
}

const s3 = StyleSheet.create({
  add: { backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, borderRadius: radius.row, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  addPressed: { backgroundColor: alpha(colors.ink, 0.06), borderColor: alpha(colors.ink, 0.18) },
});

// ─── Retours Jeanne 22 août 2026 — écran 07 v2 (proposition A + slider) ───
// Slider 2 h → 8 h (pas de lib : responder JS, précision 30 min).
export function HourSlider({ min = 2, max = 8, step = 0.5, value, onChange }) {
  const [w, setW] = React.useState(0);
  const KNOB = 28;
  const ratio = (Math.min(max, Math.max(min, value)) - min) / (max - min);
  const fromX = x => {
    if (w <= KNOB) return value;
    const r = Math.min(1, Math.max(0, (x - KNOB / 2) / (w - KNOB)));
    return Math.min(max, Math.max(min, Math.round((min + r * (max - min)) / step) * step));
  };
  const move = e => { const v = fromX(e.nativeEvent.locationX); if (v !== value) onChange(v); };
  return (
    <View
      onLayout={e => setW(e.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={move}
      onResponderMove={move}
      style={{ height: 44, justifyContent: 'center' }}
    >
      <View style={{ height: 6, borderRadius: 999, backgroundColor: alpha(colors.ink, 0.08) }} />
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, height: 6, borderRadius: 999, backgroundColor: colors.sage, width: KNOB / 2 + ratio * Math.max(0, w - KNOB) }} />
      <View pointerEvents="none" style={{ position: 'absolute', left: ratio * Math.max(0, w - KNOB), width: KNOB, height: KNOB, borderRadius: KNOB / 2, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, shadowColor: colors.ink, shadowOpacity: 0.15, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }} />
    </View>
  );
}

// chip de légende (proposition A) : mini-case + libellé ; `on` = surlignée par la démo
export function LegendChip({ state, label, on }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 7, paddingHorizontal: 11, borderRadius: 999, backgroundColor: on ? alpha(colors.sage, 0.35) : alpha(colors.ink, 0.04) }}>
      <View style={{ width: 22, height: 22, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: state === 2 ? colors.sage : state === 1 ? alpha(colors.sage, 0.35) : colors.card, borderWidth: state === 0 ? 1.5 : StyleSheet.hairlineWidth, borderColor: state === 0 ? alpha(colors.ink, 0.10) : colors.hairline }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: state === 2 ? colors.ink : colors.sageDeep }}>{state === 2 ? '●' : state === 1 ? '○' : ''}</Text>
      </View>
      <Text style={{ fontSize: 12.5, fontWeight: on ? '600' : '500', color: colors.ink }}>{label}</Text>
    </View>
  );
}
