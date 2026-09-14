// ═══════════════════════════════════════════════════════════════════
// Trois propositions pour la slide 01 dans la DA des sheets (Jeanne, 14 sept 2026 : « au vu de
// notre nouvelle DA, trois propositions pour le premier écran »). Sélection par ?v=a|b|c.
//   a · Mochi + carte « chiffres » en rangées   b · façon Balance (deux colonnes, barre)
//   c · façon Accueil (une liste de tâches, toutes sur la même personne)
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlowBg, Card, PillLabel, Avatar } from '../ui';
import { LiveMochi } from '../motion';
import { Row, Caption } from '../task/proto';
import { CheckCircle } from '../social/extra';
import copy from '../../data/copy.json';
import { colors, alpha, font, slotColors } from '../../theme';
import * as pitch from '../../demo-onboarding';

const t = copy.onboarding;
const daily = pitch.dailyGapLabel();
const Page = ({ width, headerH, top = 22, children }) => (
  <View style={{ width, alignSelf: 'stretch' }}>
    <GlowBg intensity="strong" />
    <View style={{ paddingTop: headerH + top, paddingHorizontal: 22 }}>{children}</View>
  </View>
);

// ── a · Mochi + carte chiffres ──
export function Slide01A({ width, headerH }) {
  return (
    <Page width={width} headerH={headerH}>
      <View style={{ alignItems: 'center', marginBottom: 14 }}><LiveMochi size={104} mood="sad" /></View>
      <Text style={s.title}>{t.v1aTitle}</Text>
      <Text style={s.body}>{t.v1aBody}</Text>
      <Card r={16} padding={0} style={{ marginTop: 18 }}>
        <Row first label={t.v1aRow1} sub={t.v1aRow1Sub} right={<Text style={s.num}>{daily}</Text>} />
        <Row label={t.v1aRow2} sub={t.v1aRow2Sub} right={<Text style={s.num}>{pitch.fmtHours(pitch.weeklyGapHours)}</Text>} />
        <Row label={t.v1aRow3} sub={t.v1aRow3Sub} right={<Text style={[s.num, { color: colors.coralDeep }]}>{t.v1aRow3Value}</Text>} />
      </Card>
      <Caption style={{ marginTop: 10 }}>{t.s1Source}</Caption>
    </Page>
  );
}

// ── b · façon Balance ──
export function Slide01B({ width, headerH }) {
  const a = { first_name: t.v1bOne, color: slotColors[1].main, initial: 'A' }, b = { first_name: t.v1bOther, color: slotColors[2].main, initial: 'B' };
  const share = pitch.gapShare; // part de l'écart
  const left = 0.5 + share / 2, right = 1 - left;
  return (
    <Page width={width} headerH={headerH}>
      <View style={{ marginBottom: 8 }}><PillLabel color={colors.coral}>{t.v1bPill}</PillLabel></View>
      <Text style={s.title}>{t.v1bTitle}</Text>
      <Card r={18} padding={18} style={{ marginTop: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View><Text style={[s.heroName, { color: slotColors[1].deep }]}>{a.first_name}</Text><Text style={s.heroNum}>{t.v1bOneValue}</Text><Text style={s.heroSub}>{t.v1bPerDay}</Text></View>
          <View style={{ alignItems: 'flex-end' }}><Text style={[s.heroName, { color: slotColors[2].deep }]}>{b.first_name}</Text><Text style={s.heroNum}>{t.v1bOtherValue}</Text><Text style={s.heroSub}>{t.v1bPerDay}</Text></View>
        </View>
        <View style={s.bar}><View style={{ flex: left, backgroundColor: a.color }} /><View style={{ flex: right, backgroundColor: b.color }} /></View>
        <Text style={s.barTxt}>{t.v1bGap.replace('{daily}', daily)}</Text>
      </Card>
      <Text style={[s.body, { marginTop: 16 }]}>{t.v1bBody}</Text>
      <Caption style={{ marginTop: 10 }}>{t.s1Source}</Caption>
    </Page>
  );
}

// ── c · façon Accueil ──
export function Slide01C({ width, headerH }) {
  const who = { initial: 'L', color: slotColors[1].main };
  return (
    <Page width={width} headerH={headerH}>
      <Text style={s.title}>{t.v1cTitle}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 8 }}>
        <Text style={font.sectionTitle}>{t.v1cSection}</Text>
        <Text style={{ fontSize: 13, fontWeight: '500', color: colors.muted }}>{t.v1cMeta.replace('{daily}', daily)}</Text>
      </View>
      <Card padding={0} style={{ paddingVertical: 6, paddingHorizontal: 14 }}>
        {t.v1cItems.map((it, i) => (
          <View key={i} style={[s.row, i > 0 && s.rowLine]}>
            <Text style={{ fontSize: 19 }}>{it.c}</Text>
            <Text style={[font.body, { flex: 1 }]} numberOfLines={1}>{it.t}</Text>
            <Avatar initial={who.initial} color={who.color} size={22} />
            <CheckCircle done={false} />
          </View>
        ))}
      </Card>
      <Text style={[s.body, { marginTop: 16 }]}>{t.v1cBody.replace('{daily}', daily)}</Text>
      <Caption style={{ marginTop: 10 }}>{t.s1Source}</Caption>
    </Page>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700', letterSpacing: -1, lineHeight: 30, color: colors.ink },
  body: { ...font.secondary, fontSize: 15, lineHeight: 22, marginTop: 8 },
  num: { fontSize: 17, fontWeight: '700', color: colors.ink, fontVariant: ['tabular-nums'] },
  heroName: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroNum: { fontSize: 30, fontWeight: '600', letterSpacing: -1.2, lineHeight: 32, color: colors.ink, fontVariant: ['tabular-nums'], marginTop: 2 },
  heroSub: { ...font.caption, marginTop: 2 },
  bar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 14 },
  barTxt: { ...font.caption, textAlign: 'center', marginTop: 10, color: colors.coralDeep, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11 },
  rowLine: { borderTopWidth: 1, borderTopColor: colors.line },
});
