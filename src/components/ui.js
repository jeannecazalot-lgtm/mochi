// ═══════════════════════════════════════════════════════════════════
// ui.js — composants canoniques (design/handoff/README.md §Composants)
// Créés une fois, réutilisés partout. Tout style passe par theme.js.
// ═══════════════════════════════════════════════════════════════════
import React, { useState, useRef, useEffect } from 'react';
import { router, usePathname } from 'expo-router';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Rect, Circle, Ellipse, Path, LinearGradient as SvgLinear } from 'react-native-svg';
import { colors, glow, gradients, radius, space, font, shadows, alpha, ctaSpec } from '../theme';
// ─── fond app : crème + 4 halos radiaux ─────────────────────────────
export function GlowBg({ intensity = 'normal' }) {
  const o = glow.opacity[intensity] ?? glow.opacity.normal;
  return (
    <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]}>
      <Svg width="100%" height="100%" style={{ opacity: o }}>
        <Defs>
          <RadialGradient id="g1" cx="18%" cy="12%" rx="60%" ry="40%"><Stop offset="0" stopColor={glow.coral} /><Stop offset="0.7" stopColor={glow.coral} stopOpacity="0" /></RadialGradient>
          <RadialGradient id="g2" cx="88%" cy="22%" rx="50%" ry="35%"><Stop offset="0" stopColor={glow.butter} /><Stop offset="0.72" stopColor={glow.butter} stopOpacity="0" /></RadialGradient>
          <RadialGradient id="g3" cx="80%" cy="90%" rx="70%" ry="50%"><Stop offset="0" stopColor={glow.sage} /><Stop offset="0.72" stopColor={glow.sage} stopOpacity="0" /></RadialGradient>
          <RadialGradient id="g4" cx="10%" cy="88%" rx="55%" ry="40%"><Stop offset="0" stopColor={glow.lavender} /><Stop offset="0.72" stopColor={glow.lavender} stopOpacity="0" /></RadialGradient>
        </Defs>
        {['g1', 'g2', 'g3', 'g4'].map(id => <Rect key={id} width="100%" height="100%" fill={`url(#${id})`} />)}
      </Svg>
      <PlanFab />
    </View>
  );
}
// Bouton flottant « Plan des écrans » (dev uniquement) — dans GlowBg pour être
// présent sur tous les écrans et recevoir les taps.
function PlanFab() {
  const pathname = usePathname();
  if (!__DEV__ || pathname === '/plan') return null;
  return (
    <Pressable onPress={() => router.push('/plan')} hitSlop={10}
      style={({ pressed }) => ({ position: 'absolute', left: 12, bottom: 110, width: 40, height: 40, borderRadius: 20, backgroundColor: alpha(colors.ink, pressed ? 0.75 : 1), alignItems: 'center', justifyContent: 'center', zIndex: 99 })}
      accessibilityLabel="Plan des écrans">
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.card} strokeWidth={2} strokeLinecap="round">
        <Path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
      </Svg>
    </Pressable>
  );
}
// ─── Card crème + hairline (AUCUNE ombre). accent = bordure 1.5 d'action ─
export function Card({ children, style, padding = space.md, r = radius.card, accent }) {
  return (
    <View style={[s.card, { padding, borderRadius: r }, accent && { borderWidth: 1.5, borderColor: accent }, style]}>
      {children}
    </View>
  );
}
// ─── rangée glass (liste secondaire) ────────────────────────────────
export function GlassRow({ children, style, onPress }) {
  const inner = <View style={[s.glass, style]}>{children}</View>;
  return onPress ? <Pressable onPress={onPress}>{inner}</Pressable> : inner;
}
// ─── séparateur 1px entre rangées d'une même card ───────────────────
export const Divider = () => <View style={s.divider} />;
// ─── PillLabel : uppercase 9.5/600, fond couleur à 16 % ─────────────
export function PillLabel({ children, color = colors.ink, tint }) {
  return (
    <View style={[s.pill, { backgroundColor: alpha(tint || color, 0.16) }]}>
      <Text style={[font.pill, { color }]}>{children}</Text>
    </View>
  );
}
// ─── CTA primaire : gradient Mochi, radius 14 ───────────────────────
export function CTAPrimary({ label, onPress, disabled, style, big, pill }) {
  // à l'appui, une bande claire traverse le bouton : le dégradé « avance » (retour Jeanne, 22 août 2026)
  // Recette (retour Jeanne, 1er sept 2026 : plus fluide, plus lent) : bande 60 % de large,
  // blanc 0→0,4→0, traversée 800 ms easing inOut(cubic) — accélère et ralentit en douceur.
  const slide = useSharedValue(-1);
  const shimmer = useAnimatedStyle(() => ({ transform: [{ translateX: slide.value * 360 }] }));
  const fire = () => { slide.value = -1; slide.value = withTiming(1, { duration: 800, easing: Easing.inOut(Easing.cubic) }); };
  return (
    <Pressable onPressIn={fire} onPress={onPress} disabled={disabled} style={({ pressed }) => [{ opacity: disabled ? 0.5 : pressed ? 0.92 : 1 }, style]}>
      <LinearGradient {...gradients.mochi} style={[s.cta, shadows.cta, big && { paddingVertical: 0, height: ctaSpec.height }, pill && { borderRadius: radius.pill, height: 56 }, { overflow: 'hidden' }]}>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, shimmer]}>
          <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1, width: '60%' }} />
        </Animated.View>
        <Text style={[font.cta, big && { fontSize: ctaSpec.fontSize }]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}
// ─── CTA secondaire : card crème, texte 14/500 ──────────────────────
export function CTASecondary({ label, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.cta, s.card, { opacity: pressed ? 0.85 : 1 }, style]}>
      <Text style={font.ctaSecondary}>{label}</Text>
    </Pressable>
  );
}
// ─── footer blanc qui porte le CTA ──────────────────────────────────
export function Footer({ children, bottom = space.footerBottom }) {
  return <View style={[s.footer, { paddingBottom: bottom }]}>{children}</View>;
}
// ─── avatar : photo réelle (profil Supabase) ou initiale sur couleur de slot ─
export function Avatar({ initial = '?', color = colors.sky, size = 36, ring, photo }) {
  if (photo) {
    return <Image source={{ uri: photo }} style={{ width: size, height: size, borderRadius: size / 2, borderWidth: ring ? 2 : 0, borderColor: colors.card, backgroundColor: color }} />;
  }
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center', borderWidth: ring ? 2 : 0, borderColor: colors.card }}>
      <Text style={{ color: colors.white, fontWeight: '600', fontSize: size * 0.42 }}>{initial}</Text>
    </View>
  );
}
// ─── titres ─────────────────────────────────────────────────────────
export const ScreenTitle = ({ children, style }) => <Text style={[font.screenTitle, style]}>{children}</Text>;
export const Micro = ({ children, style }) => <Text style={[font.micro, style]}>{children}</Text>;
export const Secondary = ({ children, style }) => <Text style={[font.secondary, style]}>{children}</Text>;
// ─── Mochi iridescent (statique ; float/blink/lean viendront avec reanimated) ─
export function Mochi({ size = 140, mood = 'happy', lean = 0 }) {
  const eyes = mood === 'sleeping' ? null : (
    <>
      <Circle cx="92" cy="110" r="4" fill={colors.ink} />
      {mood === 'wink'
        ? <Path d="M122 110 Q128 106 134 110" stroke={colors.ink} strokeWidth="2.8" fill="none" strokeLinecap="round" />
        : <Circle cx="128" cy="110" r="4" fill={colors.ink} />}
    </>
  );
  const mouth = mood === 'sad'
    ? 'M88 146 Q110 132 132 146'
    : mood === 'neutral' ? 'M92 140 L128 140' : 'M88 136 Q110 150 132 136';
  return (
    <View style={{ transform: [{ rotate: `${lean * 12}deg` }] }}>
      <Svg width={size} height={size} viewBox="0 0 220 220">
        <Defs>
          <RadialGradient id="mMain" cx="38%" cy="28%" r="78%">
            <Stop offset="0" stopColor="#FFF1E0" /><Stop offset="0.2" stopColor="#FBC9A4" /><Stop offset="0.4" stopColor="#F5A89A" /><Stop offset="0.65" stopColor={colors.coral} /><Stop offset="1" stopColor={colors.coralDeep} />
          </RadialGradient>
          <RadialGradient id="mGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={colors.butterLight} stopOpacity="0.6" /><Stop offset="0.6" stopColor="#F5A89A" stopOpacity="0.25" /><Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="mGloss" cx="32%" cy="22%" r="28%">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" /><Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.4" /><Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
          <SvgLinear id="mRim" x1="0" y1="1" x2="1" y2="0">
            <Stop offset="0" stopColor={colors.sage} stopOpacity="0.5" /><Stop offset="0.5" stopColor={colors.butterLight} stopOpacity="0.7" /><Stop offset="1" stopColor="#F5A89A" stopOpacity="0.5" />
          </SvgLinear>
        </Defs>
        <Circle cx="110" cy="110" r="106" fill="url(#mGlow)" />
        <Circle cx="110" cy="110" r="82" fill="url(#mMain)" />
        <Circle cx="110" cy="110" r="82" fill="none" stroke="url(#mRim)" strokeWidth="6" />
        <Ellipse cx="84" cy="76" rx="32" ry="24" fill="url(#mGloss)" />
        <Circle cx="76" cy="68" r="4" fill="#FFFFFF" />
        <Circle cx="148" cy="92" r="2" fill="#FFFFFF" opacity="0.7" />
        {eyes}
        <Path d={mouth} stroke={colors.ink} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </Svg>
    </View>
  );
}
const s = StyleSheet.create({
  card: { backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  glass: { backgroundColor: colors.glass, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: radius.row, paddingVertical: 11, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 13 },
  divider: { height: 1, backgroundColor: colors.line },
  pill: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 10, borderRadius: radius.pill },
  cta: { borderRadius: radius.row, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  footer: { backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.footerLine, paddingTop: space.footerTop, paddingHorizontal: space.screenX },
});
// ─── en-tête des écrans Setup (06-08) : points d'étape + titre + sous-titre ─
export function SetupHeader({ step, total = 3, title, sub, hero, backFallback }) {
  // backFallback : chevron affiché même sans historique (ex. 06 → onboarding,
  // retour Jeanne du 2 sept « pas de retour en arrière sur le 06 »)
  const canBack = router.canGoBack() || !!backFallback;
  const goBack = () => (router.canGoBack() ? router.back() : router.replace(backFallback));
  return (
    <View>
      {hero ? <View style={{ alignItems: 'center', paddingTop: 6 }}>{hero}</View> : null}
      {step ? (
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, paddingTop: 14 }}>
          {Array.from({ length: total }, (_, i) => i + 1).map(i => (
            <View key={i} style={{ width: i === step ? 18 : 6, height: 6, borderRadius: radius.pill, backgroundColor: i <= step ? colors.ink : alpha(colors.ink, 0.15) }} />
          ))}
        </View>
      ) : <View style={{ height: 20 }} />}
      <View style={{ paddingHorizontal: space.headerX, paddingTop: canBack ? 22 : 14 }}>
        <Text style={[font.screenTitle, { letterSpacing: -1.1, lineHeight: 23 }]}>{title}</Text>
        {sub ? <Text style={[font.secondary, { fontSize: 14, marginTop: 6, lineHeight: 20 }]}>{sub}</Text> : null}
      </View>
      {canBack ? (
        <Pressable onPress={goBack} hitSlop={12} style={{ position: 'absolute', left: space.screenX, top: 4, zIndex: 2, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M15 5l-7 7 7 7" stroke={colors.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></Svg>
        </Pressable>
      ) : null}
    </View>
  );
}

// ─── CTA « court puis pleine largeur en bas de liste » (retour Jeanne, 23 août 2026) ─
// useScrollEnd() se branche sur une ScrollView (…scrollProps) ; GrowCTA rétrécit le
// bouton (marges latérales) tant qu'on n'a pas atteint le bas, puis l'élargit en spring.
export function useScrollEnd(threshold = 32) {
  const [atEnd, setAtEnd] = useState(true); // vrai par défaut : liste plus courte que l'écran
  const dims = useRef({ layout: 0, content: 0, offset: 0 });
  const update = () => {
    const { layout, content, offset } = dims.current;
    setAtEnd(content <= layout || layout + offset >= content - threshold);
  };
  return {
    atEnd,
    scrollProps: {
      scrollEventThrottle: 32,
      onScroll: e => {
        dims.current.offset = e.nativeEvent.contentOffset.y;
        dims.current.layout = e.nativeEvent.layoutMeasurement.height;
        dims.current.content = e.nativeEvent.contentSize.height;
        update();
      },
      onLayout: e => { dims.current.layout = e.nativeEvent.layout.height; update(); },
      onContentSizeChange: (w, h) => { dims.current.content = h; update(); },
    },
  };
}

export function GrowCTA({ grown = true, compact = 56, style, children }) {
  const m = useSharedValue(grown ? 0 : compact);
  useEffect(() => { m.value = withTiming(grown ? 0 : compact, { duration: 220, easing: Easing.out(Easing.cubic) }); }, [grown]); // sans rebond (retour Jeanne, 23 août 2026)
  const a = useAnimatedStyle(() => ({ marginHorizontal: m.value }));
  return <Animated.View style={[a, style]}>{children}</Animated.View>;
}
