// ═══════════════════════════════════════════════════════════════════
// ui.js — composants canoniques (design/handoff/README.md §Composants)
// Créés une fois, réutilisés partout. DA v3 (4 nov 2026) : fond plat jour/nuit, cartes = hairline, couleurs par useTokens.
// ═══════════════════════════════════════════════════════════════════
import React, { useState, useRef, useEffect } from 'react';
import { router, usePathname } from 'expo-router';
import { View, Text, Pressable, Image, StyleSheet, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Rect, Circle, Ellipse, Path, LinearGradient as SvgLinear } from 'react-native-svg';
import { colors, gradients, radius, space, font, shadows, alpha, ctaSpec } from '../theme';
import { useTokens } from '../theme-v3';
import { MochiImage } from './mochi-img';
import copy from '../data/copy.json';
// ─── fond app : crème + 4 halos radiaux ─────────────────────────────
export function GlowBg({ intensity = 'normal' }) {
  // v3 : plus de halos — un fond uni qui suit le mode jour / nuit (les anciens écrans en profitent sans changement)
  const T = useTokens();
  return (
    <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { backgroundColor: T.bg }]}>
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
  const s = mk(useTokens());
  return (
    <View style={[s.card, { padding, borderRadius: 0 }, accent && { borderLeftWidth: 3, borderLeftColor: accent }, style]}>
      {children}
    </View>
  );
}
// ─── rangée glass (liste secondaire) ────────────────────────────────
export function GlassRow({ children, style, onPress }) {
  const s = mk(useTokens());
  const inner = <View style={[s.glass, style]}>{children}</View>;
  return onPress ? <Pressable onPress={onPress}>{inner}</Pressable> : inner;
}
// ─── séparateur 1px entre rangées d'une même card ───────────────────
export const Divider = () => { const s = mk(useTokens()); return <View style={s.divider} />; };
// ─── LinkText : texte dont les adresses web deviennent cliquables (notes de tâche, 7 sept 2026) ──
// À utiliser DANS un <Text> parent (retourne des <Text> imbriqués) ou seul.
const URL_RE = /((?:https?:\/\/|www\.)[^\s<>"']+)/gi;
export function LinkText({ children, style }) {
  const T = useTokens();
  const str = String(children ?? '');
  const parts = str.split(URL_RE);
  return (
    <Text style={style}>
      {parts.map((p, i) => URL_RE.test(p) && (URL_RE.lastIndex = 0, true)
        ? <Text key={i} style={{ color: T.ok, textDecorationLine: 'underline' }} onPress={() => Linking.openURL(p.startsWith('http') ? p : `https://${p}`).catch(() => {})}>{p}</Text>
        : <Text key={i}>{p}</Text>)}
    </Text>
  );
}
// ─── PillLabel : uppercase 9.5/600, fond couleur à 16 % ─────────────
export function PillLabel({ children, color, tint }) {
  const T = useTokens(); const s = mk(T); color = color || T.ink;
  return (
    <View style={[s.pill, { backgroundColor: alpha(tint || color, 0.16) }]}>
      <Text style={[font.pill, { color }]}>{children}</Text>
    </View>
  );
}
// ─── CTA primaire : gradient Mochi, radius 14 ───────────────────────
export function CTAPrimary({ label, onPress, disabled, style, big, pill }) {
  const s = mk(useTokens());
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
  const T = useTokens(); const s = mk(T);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.cta, s.card, { opacity: pressed ? 0.85 : 1 }, style]}>
      <Text style={[font.ctaSecondary, { color: T.ink }]}>{label}</Text>
    </Pressable>
  );
}
// ─── footer blanc qui porte le CTA ──────────────────────────────────
export function Footer({ children, bottom = space.footerBottom }) {
  const s = mk(useTokens());
  return <View style={[s.footer, { paddingBottom: bottom }]}>{children}</View>;
}
// ─── avatar : photo réelle (profil Supabase) ou initiale sur couleur de slot ─
export function Avatar({ initial = '?', color = colors.sky, size = 36, ring, photo }) {
  const T = useTokens();
  if (photo) {
    return <Image source={{ uri: photo }} style={{ width: size, height: size, borderRadius: size / 2, borderWidth: ring ? 2 : 0, borderColor: T.bg, backgroundColor: color }} />;
  }
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center', borderWidth: ring ? 2 : 0, borderColor: T.bg }}>
      <Text style={{ color: colors.white, fontWeight: '600', fontSize: size * 0.42 }}>{initial}</Text>
    </View>
  );
}
// ─── titres ─────────────────────────────────────────────────────────
export const ScreenTitle = ({ children, style }) => { const T = useTokens(); return <Text style={[font.screenTitle, { color: T.ink }, style]}>{children}</Text>; };
export const Micro = ({ children, style }) => { const T = useTokens(); return <Text style={[font.micro, { color: T.muted }, style]}>{children}</Text>; };
export const Secondary = ({ children, style }) => { const T = useTokens(); return <Text style={[font.secondary, { color: T.muted }, style]}>{children}</Text>; };
// ─── Mochi : images ChatGPT (14 sept 2026), voir mochi-img.js ; `size` = largeur ────────────
export function Mochi({ size = 140, mood = 'happy', lean = 0 }) {
  return <MochiImage size={size} lean={lean} mood={mood} />;
}
const mk = T => StyleSheet.create({
  card: { backgroundColor: T.bg, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: T.line }, // DA v3 (7 nov 2026) : groupe entre deux hairlines, plus de boîte
  glass: { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 13 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: T.line },
  pill: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 10, borderRadius: radius.pill },
  cta: { borderRadius: radius.row, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  footer: { backgroundColor: T.bg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: T.line, paddingTop: space.footerTop, paddingHorizontal: space.screenX },
});
export function SetupHeader({ step, total = 3, title, sub, hero, backFallback, why }) {
  const T = useTokens();
  const kicker = [step ? copy.setup.stepOf.replace('{n}', step).replace('{total}', total) : null, why].filter(Boolean).join(' · ');
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
            <View key={i} style={{ width: i === step ? 18 : 6, height: 6, borderRadius: radius.pill, backgroundColor: i <= step ? T.ink : T.seg }} />
          ))}
        </View>
      ) : <View style={{ height: 20 }} />}
      <View style={{ paddingHorizontal: space.headerX, paddingTop: canBack ? 22 : 14 }}>
        {kicker ? <Text style={{ fontSize: 13.5, fontWeight: '500', color: T.muted, marginBottom: 8 }}>{kicker}</Text> : null}
        <Text style={{ fontSize: 28, fontWeight: '600', letterSpacing: -0.9, lineHeight: 32, color: T.ink }}>{title}</Text>
        {sub ? <Text style={{ fontSize: 15.5, marginTop: 8, lineHeight: 21, color: T.muted }}>{sub}</Text> : null}
      </View>
      {canBack ? (
        <Pressable onPress={goBack} hitSlop={12} style={{ position: 'absolute', left: space.screenX, top: 4, zIndex: 2, width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: T.line, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M15 5l-7 7 7 7" stroke={T.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></Svg>
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
