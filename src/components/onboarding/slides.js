// Slides 01-05 de l'onboarding. Chaque slide = une page du pager (largeur écran),
// avec son propre GlowBg. Recette : docs/recettes/01-05-onboarding.md
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlowBg, Card, PillLabel } from '../ui';
import { CountUp, LiveMochi } from '../motion';
import { onb, StepPill, Kicker, AccentCard, onbStyles as o } from './extra';
import copy from '../../data/copy.json';
import { colors, radius, alpha } from '../../theme';
import * as pitch from '../../demo-onboarding';

const t = copy.onboarding;
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k]));
const daily = pitch.dailyGapLabel();

// gros chiffre héros : remonté (key) à chaque fois que la slide devient courante → count-up 500 ms
function Hero({ value, size, tracking, unit, active }) {
  const style = { fontSize: size, fontWeight: '700', letterSpacing: tracking, lineHeight: Math.round(size * 0.88), color: colors.ink, fontVariant: ['tabular-nums'] };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
      {active ? <CountUp value={value} format={pitch.fmtHours} style={style} /> : <Text style={style}>{pitch.fmtHours(value)}</Text>}
      <Text style={[o.unit, { fontSize: unit.size }]}>{unit.label}</Text>
    </View>
  );
}

// headerH = safe area + hauteur de l'en-tête fixe (14 + ~16) : le fond couvre tout, le contenu commence dessous
function Page({ intensity, width, headerH, top, children }) {
  return (
    <View style={{ width, alignSelf: 'stretch' }}>
      <GlowBg intensity={intensity} />
      <View style={[o.page, { paddingTop: headerH + top }]}>{children}</View>
    </View>
  );
}

// ── 01 · le constat ─────────────────────────────────────────────────
export function Slide01({ width, headerH, active }) {
  return (
    <Page intensity="strong" width={width} headerH={headerH} top={22}>
      <StepPill>{t.s1Pill}</StepPill>
      <AccentCard accent={onb.salmon} dx={6} dy={8} r={22} padding={0} style={{ marginBottom: 16 }}>
        <View style={s.heroPad}>
          <Kicker>{t.s1Kicker}</Kicker>
          <Hero value={pitch.weeklyGapHours} size={92} tracking={-5} unit={{ size: 20, label: t.s1Unit }} active={active} />
          <View style={s.barRow}>
            <View style={s.track}>
              <LinearGradient colors={[onb.salmon, colors.coral]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: pitch.gapShare }} />
              <View style={{ flex: 1 - pitch.gapShare, backgroundColor: alpha(colors.ink, 0.12) }} />
            </View>
            <Text style={s.barLabel}>{fill(t.s1PerDay, { daily })}</Text>
          </View>
        </View>
      </AccentCard>
      <Text style={s.h20}>{t.s1Title1}{'\n'}{t.s1Title2}{'\n'}<Text style={o.coral}>{t.s1TitleAccent}</Text></Text>
      <Text style={o.body}>{fill(t.s1Body, { daily })}<Text style={{ fontStyle: 'italic' }}>{t.s1BodyEm}</Text></Text>
    </Page>
  );
}

// ── 02 · la charge mentale ──────────────────────────────────────────
export function Slide02({ width, headerH }) {
  return (
    <Page intensity="soft" width={width} headerH={headerH} top={19}>
      <StepPill>{t.s2Pill}</StepPill>
      <Text style={[o.h22, { marginBottom: 16 }]}>
        <Text style={o.coral}>{t.s2TitleA1}</Text>{t.s2Title1}{'\n'}<Text style={o.coral}>{t.s2TitleA2}</Text>{t.s2Title2}
      </Text>
      <Text style={o.micro}>{t.s2Kicker}</Text>
      <View style={{ gap: 6 }}>
        {t.s2Items.map((it, i) => (
          <Card key={i} r={12} padding={0} style={{ transform: [{ rotate: i % 2 ? '-0.4deg' : '0.3deg' }] }}>
            <View style={s.thought}>
              <Text style={{ fontSize: 18 }}>{it.c}</Text>
              <Text style={s.thoughtTitle}>{it.t}</Text>
              <Text style={s.thoughtSub}>{it.s}</Text>
            </View>
          </Card>
        ))}
        <View style={s.faded}>
          <Text style={{ fontSize: 16, opacity: 0.5 }}>{t.s2FadedEmoji}</Text>
          <Text style={s.fadedText}>{t.s2Faded}</Text>
        </View>
        <Text style={s.dots}>···</Text>
      </View>
      <Text style={s.outro}>{t.s2Outro}<Text style={s.outroStrong}>{t.s2OutroStrong}</Text></Text>
    </Page>
  );
}

// ── 03 · à un an ────────────────────────────────────────────────────
const ALT_ACCENTS = [colors.butter, colors.lavender, colors.sky];
export function Slide03({ width, headerH, active }) {
  return (
    <Page intensity="strong" width={width} headerH={headerH} top={22}>
      <StepPill>{t.s3Pill}</StepPill>
      <AccentCard accent={colors.sage} dx={-5} dy={7} r={22} padding={0} style={{ marginBottom: 14 }}>
        <View style={s.heroPad}>
          <Kicker>{t.s3Kicker}</Kicker>
          <Hero value={pitch.yearlyHours} size={80} tracking={-4} unit={{ size: 21, label: t.s3Unit }} active={active} />
          <Text style={s.heroSub}>{t.s3Sub1}<Text style={[o.coral, { fontWeight: '600' }]}>{fill(t.s3SubAccent, { n: pitch.yearlyFullDays })}</Text>{t.s3Sub2}</Text>
        </View>
      </AccentCard>
      <Text style={[o.micro, { marginBottom: 9 }]}>{t.s3Breakdown}</Text>
      <View style={{ gap: 8 }}>
        {t.s3Alt.map((label, i) => (
          <AccentCard key={i} accent={ALT_ACCENTS[i]} dx={3} dy={4} opacity={onb.rowShadowAlpha} r={radius.row} padding={0}>
            <View style={s.altRow}>
              <Text style={s.altN}>{fill(t.s3Times, { n: pitch.yearlyAlternatives[i] })}</Text>
              <Text style={s.altLabel}>{label}</Text>
            </View>
          </AccentCard>
        ))}
      </View>
    </Page>
  );
}

// ── 04 · au-delà du temps ───────────────────────────────────────────
export function Slide04({ width, headerH }) {
  const rows = t.s4Rows;
  return (
    <Page intensity="soft" width={width} headerH={headerH} top={19}>
      <StepPill>{t.s4Pill}</StepPill>
      <Text style={[o.h22, { marginBottom: 14 }]}>{t.s4Title1}<Text style={o.coral}>{t.s4TitleAccent}</Text>{t.s4Title2}</Text>
      <Card r={18} padding={0}>
        <View style={s.ledgerPad}>
          <View style={s.ledgerHead}>
            <Text style={s.ledgerCol}>{t.s4ColLeft}</Text><Text style={s.ledgerCol}>{t.s4ColRight}</Text>
          </View>
          {rows.map((label, i) => {
            const r = pitch.avoidedPerYear[i];
            return (
              <View key={i} style={[s.ledgerRow, i === rows.length - 1 ? s.ledgerLast : s.ledgerLine]}>
                <Text style={s.ledgerLabel}>{label}</Text>
                <Text style={[s.ledgerVal, r.accent ? s.ledgerValAccent : s.ledgerValMuted]}>{r.value}</Text>
              </View>
            );
          })}
          <View style={s.ledgerTotal}>
            <Text style={s.totalLabel}>{t.s4Total}</Text>
            <Text style={s.totalVal}>{fill(t.s4TotalValue, { n: pitch.coupleBreathing })}</Text>
          </View>
        </View>
      </Card>
      <Text style={s.note}>{t.s4Note}</Text>
    </Page>
  );
}

// ── 05 · bienvenue ──────────────────────────────────────────────────
export function Slide05({ width, headerH }) {
  return (
    <Page intensity="strong" width={width} headerH={headerH} top={24}>
      <View style={{ alignItems: 'center', marginBottom: 29 }}><LiveMochi size={210} mood="happy" /></View>
      <Card r={22} padding={24} style={{ marginHorizontal: -1 }}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ marginBottom: 14 }}><PillLabel color={colors.coral}>{t.s5Pill}</PillLabel></View>
          <Text style={s.welcomeTitle}>{t.s5Title}</Text>
          <Text style={s.welcomeBody}>{t.s5Body}</Text>
        </View>
      </Card>
    </Page>
  );
}

const s = StyleSheet.create({
  heroPad: { paddingTop: 22, paddingHorizontal: 23, paddingBottom: 18 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line },
  track: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden', flexDirection: 'row', backgroundColor: alpha(colors.ink, 0.05) },
  barLabel: { fontSize: 11.5, fontWeight: '500', color: colors.muted, fontVariant: ['tabular-nums'] },
  h20: { fontSize: 20, fontWeight: '600', letterSpacing: -0.8, lineHeight: 24, color: colors.ink, marginBottom: 10 },
  thought: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 13 },
  thoughtTitle: { flex: 1, fontSize: 15, fontWeight: '500', letterSpacing: -0.1, color: colors.ink },
  thoughtSub: { fontSize: 12, fontWeight: '400', color: colors.muted, fontVariant: ['tabular-nums'] },
  faded: { backgroundColor: alpha(colors.card, 0.55), borderRadius: 12, paddingVertical: 8, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  fadedText: { fontSize: 14, fontWeight: '400', color: colors.muted },
  dots: { fontSize: 19, fontWeight: '600', letterSpacing: 4, textAlign: 'center', color: alpha(colors.muted, 0.55), marginTop: -2 },
  outro: { fontSize: 15, fontWeight: '400', fontStyle: 'italic', color: colors.inkSoft, marginTop: 11 },
  outroStrong: { fontStyle: 'normal', fontWeight: '600', color: colors.ink },
  heroSub: { fontSize: 15, fontWeight: '400', lineHeight: 20, color: colors.inkSoft, marginTop: 11 },
  altRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 11, paddingHorizontal: 14 },
  altN: { minWidth: 56, fontSize: 20, fontWeight: '700', fontStyle: 'italic', letterSpacing: -0.8, color: colors.coral, fontVariant: ['tabular-nums'] },
  altLabel: { flex: 1, fontSize: 14.5, fontWeight: '500', lineHeight: 19, color: colors.ink },
  ledgerPad: { paddingTop: 14, paddingHorizontal: 16, paddingBottom: 13 },
  ledgerHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 8, borderBottomWidth: 1.5, borderBottomColor: colors.ink, marginBottom: 6 },
  ledgerCol: { fontSize: 10.5, fontWeight: '600', letterSpacing: 1.4, color: colors.ink },
  ledgerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingVertical: 9 },
  ledgerLine: { borderBottomWidth: 1, borderBottomColor: colors.sheetLine },
  ledgerLast: { borderBottomWidth: 1.5, borderBottomColor: colors.ink },
  ledgerLabel: { fontSize: 14.5, fontWeight: '400', lineHeight: 19, color: colors.ink },
  ledgerVal: { fontSize: 19, letterSpacing: -0.4, fontVariant: ['tabular-nums'] },
  ledgerValAccent: { fontWeight: '700', fontStyle: 'italic', color: colors.coral },
  ledgerValMuted: { fontWeight: '500', color: colors.muted },
  ledgerTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12 },
  totalLabel: { fontSize: 15, fontWeight: '600', fontStyle: 'italic', color: colors.ink },
  totalVal: { fontSize: 22, fontWeight: '700', letterSpacing: -1, color: colors.sage, fontVariant: ['tabular-nums'] },
  note: { fontSize: 11, fontWeight: '400', letterSpacing: 0.4, lineHeight: 16, color: colors.muted, marginTop: 10 },
  welcomeTitle: { fontSize: 22, fontWeight: '600', letterSpacing: -1.2, lineHeight: 23, textAlign: 'center', color: colors.ink, marginBottom: 11 },
  welcomeBody: { fontSize: 15.5, fontWeight: '400', lineHeight: 23, textAlign: 'center', color: colors.inkSoft },
});
