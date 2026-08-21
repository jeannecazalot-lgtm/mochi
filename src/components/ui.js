// ═══════════════════════════════════════════════════════════════════
// ui.js — composants canoniques (design/handoff/README.md §Composants)
// Créés une fois, réutilisés partout. Tout style passe par theme.js.
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Rect, Circle, Ellipse, Path, LinearGradient as SvgLinear } from 'react-native-svg';
import { colors, glow, gradients, radius, space, font, shadows, alpha } from '../theme';

// ─── fond app : crème + 4 halos radiaux ─────────────────────────────
export function GlowBg({ intensity = 'normal' }) {
  const o = glow.opacity[intensity] ?? glow.opacity.normal;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]}>
      <Svg width="100%" height="100%" style={{ opacity: o }}>
        <Defs>
          <RadialGradient id="g1" cx="18%" cy="12%" rx="60%" ry="40%"><Stop offset="0" stopColor={glow.coral} /><Stop offset="0.7" stopColor={glow.coral} stopOpacity="0" /></RadialGradient>
          <RadialGradient id="g2" cx="88%" cy="22%" rx="50%" ry="35%"><Stop offset="0" stopColor={glow.butter} /><Stop offset="0.72" stopColor={glow.butter} stopOpacity="0" /></RadialGradient>
          <RadialGradient id="g3" cx="80%" cy="90%" rx="70%" ry="50%"><Stop offset="0" stopColor={glow.sage} /><Stop offset="0.72" stopColor={glow.sage} stopOpacity="0" /></RadialGradient>
          <RadialGradient id="g4" cx="10%" cy="88%" rx="55%" ry="40%"><Stop offset="0" stopColor={glow.lavender} /><Stop offset="0.72" stopColor={glow.lavender} stopOpacity="0" /></RadialGradient>
        </Defs>
        {['g1', 'g2', 'g3', 'g4'].map(id => <Rect key={id} width="100%" height="100%" fill={`url(#${id})`} />)}
      </Svg>
    </View>
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
export function CTAPrimary({ label, onPress, disabled, style }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [{ opacity: disabled ? 0.5 : pressed ? 0.85 : 1 }, style]}>
      <LinearGradient {...gradients.mochi} style={[s.cta, shadows.cta]}>
        <Text style={font.cta}>{label}</Text>
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

// ─── avatar : photo (plus tard) ou initiale sur couleur de slot ─────
export function Avatar({ initial = '?', color = colors.sky, size = 36, ring }) {
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
