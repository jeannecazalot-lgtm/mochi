// ═══════════════════════════════════════════════════════════════════
// Trois itérations complètes de l'onboarding (Jeanne, 14 sept 2026 : « trois itérations de
// l'onboarding entier, aéré, tous les titres sur la même ligne »). Même cadre pour les 15 slides :
// titre à hauteur FIXE et sur une ligne, un seul visuel, une phrase. Sélection : ?it=a|b|c.
//   a · Mochi raconte (Mochi + une pastille)   b · cartes (la DA des sheets)   c · mini-écrans de l'app
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlowBg, Card, PillLabel, Avatar } from '../ui';
import { LiveMochi } from '../motion';
import { Row, PillChip } from '../task/proto';
import { CheckCircle } from '../social/extra';
import copy from '../../data/copy.json';
import { colors, alpha, font, slotColors } from '../../theme';
import * as pitch from '../../demo-onboarding';

const t = copy.onb2;
const daily = pitch.dailyGapLabel();
const fill = (str, vars) => String(str).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const A = { initial: 'L', color: slotColors[1].main, deep: slotColors[1].deep };
const B = { initial: 'K', color: slotColors[2].main, deep: slotColors[2].deep };

// cadre commun : titre à la même hauteur partout, visuel centré dans une zone fixe, phrase en dessous
function Frame({ width, headerH, title, body, children, intensity = 'strong' }) {
  return (
    <View style={{ width, alignSelf: 'stretch' }}>
      <GlowBg intensity={intensity} />
      <View style={{ paddingTop: headerH + 26, paddingHorizontal: 24 }}>
        <Text style={s.title} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{title}</Text>
        <View style={s.visual}>{children}</View>
        <Text style={s.body}>{body}</Text>
      </View>
    </View>
  );
}

const Pill = ({ children, color = colors.coral }) => <View style={{ marginTop: 14 }}><PillLabel color={color}>{children}</PillLabel></View>;

// ─── a · Mochi raconte ───
const A1 = p => <Frame {...p} title={t.s1Title} body={fill(t.s1Body, { daily })}><LiveMochi size={150} mood="sad" /><Pill>{fill(t.s1Pill, { daily })}</Pill></Frame>;
const A2 = p => <Frame {...p} title={t.s2Title} body={t.s2Body} intensity="soft"><LiveMochi size={150} mood="sad" /><Pill color={colors.lavender}>{t.s2Pill}</Pill></Frame>;
const A3 = p => <Frame {...p} title={t.s3Title} body={t.s3Body}><LiveMochi size={150} mood="happy" /><Pill color={colors.sage}>{t.s3Pill}</Pill></Frame>;
const A4 = p => <Frame {...p} title={t.s4Title} body={t.s4Body} intensity="soft"><LiveMochi size={150} mood="happy" /><Pill color={colors.butter}>{t.s4Pill}</Pill></Frame>;
const A5 = p => <Frame {...p} title={t.s5Title} body={t.s5Body}><LiveMochi size={150} mood="happy" /><View style={{ flexDirection: 'row', marginTop: 14 }}><Avatar initial={A.initial} color={A.color} size={30} ring /><View style={{ marginLeft: -8 }}><Avatar initial={B.initial} color={B.color} size={30} ring /></View></View></Frame>;

// ─── b · cartes (DA des sheets) ───
const Bar = ({ left }) => <View style={s.bar}><View style={{ flex: left, backgroundColor: A.color }} /><View style={{ flex: 1 - left, backgroundColor: B.color }} /></View>;
const B1 = p => (
  <Frame {...p} title={t.s1Title} body={fill(t.s1Body, { daily })}>
    <Card r={16} padding={0} style={s.card}>
      <Row first label={t.b1Row1} sub={t.b1Row1Sub} right={<Text style={s.num}>{daily}</Text>} />
      <Row label={t.b1Row2} sub={t.b1Row2Sub} right={<Text style={s.num}>{pitch.fmtHours(pitch.weeklyGapHours)}</Text>} />
      <Row label={t.b1Row3} sub={t.b1Row3Sub} right={<Text style={[s.num, { color: colors.coralDeep }]}>{t.b1Row3Value}</Text>} />
    </Card>
  </Frame>
);
const B2 = p => (
  <Frame {...p} title={t.s2Title} body={t.s2Body} intensity="soft">
    <Card r={16} padding={0} style={s.card}>
      {t.thoughts.map((it, i) => <Row key={i} first={i === 0} label={it.t} sub={it.s} left={<Text style={{ fontSize: 18 }}>{it.c}</Text>} />)}
    </Card>
  </Frame>
);
const B3 = p => (
  <Frame {...p} title={t.s3Title} body={t.s3Body}>
    <Card r={16} padding={0} style={s.card}>
      {t.steps.map((st, i) => <Row key={i} first={i === 0} label={st.t} sub={st.s} left={<View style={s.stepNum}><Text style={s.stepTxt}>{i + 1}</Text></View>} />)}
    </Card>
  </Frame>
);
const B4 = p => (
  <Frame {...p} title={t.s4Title} body={t.s4Body} intensity="soft">
    <Card r={18} padding={18} style={s.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View><Text style={[s.heroName, { color: A.deep }]}>{t.one}</Text><Text style={s.heroNum}>52%</Text></View>
        <View style={{ alignItems: 'flex-end' }}><Text style={[s.heroName, { color: B.deep }]}>{t.other}</Text><Text style={s.heroNum}>48%</Text></View>
      </View>
      <Bar left={0.52} />
      <View style={{ alignItems: 'center', marginTop: 12 }}><PillLabel color={colors.sage}>{t.balancedPill}</PillLabel></View>
    </Card>
  </Frame>
);
const B5 = p => (
  <Frame {...p} title={t.s5Title} body={t.s5Body}>
    <Card r={16} padding={0} style={s.card}>
      <Row first label={t.b5Row1} sub={t.b5Row1Sub} left={<Avatar initial={A.initial} color={A.color} size={24} />} />
      <Row label={t.b5Row2} sub={t.b5Row2Sub} left={<Avatar initial={B.initial} color={B.color} size={24} />} />
      <Row label={t.b5Row3} sub={t.b5Row3Sub} left={<LiveMochi size={26} float={false} />} />
    </Card>
  </Frame>
);

// ─── c · mini-écrans de l'app ───
const ListRow = ({ emoji, title, who, done, last, pair }) => (
  <View style={[s.row, !last && s.rowLine]}>
    <Text style={{ fontSize: 19 }}>{emoji}</Text>
    <Text style={[font.body, { flex: 1 }, done && { textDecorationLine: 'line-through', opacity: 0.5 }]} numberOfLines={1}>{title}</Text>
    {pair ? <View style={{ flexDirection: 'row' }}><Avatar initial={A.initial} color={A.color} size={22} ring /><View style={{ marginLeft: -7 }}><Avatar initial={B.initial} color={B.color} size={22} ring /></View></View> : who ? <Avatar initial={who.initial} color={who.color} size={22} /> : null}
    <CheckCircle done={!!done} />
  </View>
);
const Mini = ({ label, meta, children }) => (
  <View style={s.card}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
      <Text style={font.sectionTitle}>{label}</Text>{meta ? <Text style={{ fontSize: 13, fontWeight: '500', color: colors.muted }}>{meta}</Text> : null}
    </View>
    <Card padding={0} style={{ paddingVertical: 4, paddingHorizontal: 14 }}>{children}</Card>
  </View>
);
const C1 = p => (
  <Frame {...p} title={t.s1Title} body={fill(t.s1Body, { daily })}>
    <Mini label={t.today} meta={fill(t.c1Meta, { daily })}>
      {t.c1Items.map((it, i) => <ListRow key={i} emoji={it.c} title={it.t} who={A} last={i === t.c1Items.length - 1} />)}
    </Mini>
  </Frame>
);
const C2 = p => (
  <Frame {...p} title={t.s2Title} body={t.s2Body} intensity="soft">
    <View style={[s.card, { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }]}>
      {t.thoughts.slice(0, 4).map((it, i) => (
        <View key={i} style={[s.note, { backgroundColor: [alpha(colors.butter, 0.7), alpha(colors.sky, 0.6), alpha(colors.lavender, 0.55), alpha(colors.sage, 0.55)][i], transform: [{ rotate: i % 2 ? '-0.8deg' : '0.6deg' }] }]}>
          <Text style={s.noteTitle}>{it.c} {it.t}</Text><Text style={s.noteSub}>{it.s}</Text>
        </View>
      ))}
    </View>
  </Frame>
);
const C3 = p => (
  <Frame {...p} title={t.s3Title} body={t.s3Body}>
    <Mini label={t.c3Label}>
      <ListRow emoji="🍽️" title={t.c3Items[0]} who={A} />
      <ListRow emoji="🛒" title={t.c3Items[1]} who={B} />
      <ListRow emoji="🗑️" title={t.c3Items[2]} pair />
      <ListRow emoji="🧺" title={t.c3Items[3]} who={B} last />
    </Mini>
  </Frame>
);
const C4 = p => (
  <Frame {...p} title={t.s4Title} body={t.s4Body} intensity="soft">
    <View style={s.card}>
      <View style={{ alignItems: 'center', marginBottom: 8 }}><PillLabel color={colors.sage}>{t.balancedPill}</PillLabel></View>
      <Card r={18} padding={16}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View><Text style={[s.heroName, { color: A.deep }]}>Léa</Text><Text style={s.heroNum}>2h10</Text><Text style={s.heroSub}>52% · 6 tâches</Text></View>
          <View style={{ alignItems: 'flex-end' }}><Text style={[s.heroName, { color: B.deep }]}>Ket</Text><Text style={s.heroNum}>2h</Text><Text style={s.heroSub}>48% · 5 tâches</Text></View>
        </View>
        <Bar left={0.52} />
      </Card>
    </View>
  </Frame>
);
const C5 = p => (
  <Frame {...p} title={t.s5Title} body={t.s5Body}>
    <View style={{ alignItems: 'center' }}>
      <LiveMochi size={120} mood="happy" />
      <View style={{ flexDirection: 'row', marginTop: 12 }}><Avatar initial={A.initial} color={A.color} size={34} ring /><View style={{ marginLeft: -10 }}><Avatar initial={B.initial} color={B.color} size={34} ring /></View></View>
    </View>
  </Frame>
);

export const ITERATIONS = { a: [A1, A2, A3, A4, A5], b: [B1, B2, B3, B4, B5], c: [C1, C2, C3, C4, C5] };

const s = StyleSheet.create({
  title: { fontSize: 27, fontWeight: '700', letterSpacing: -1, lineHeight: 32, color: colors.ink, height: 34 },
  visual: { height: 330, justifyContent: 'center', alignItems: 'center', marginTop: 18 },
  body: { ...font.secondary, fontSize: 15.5, lineHeight: 23, marginTop: 6, textAlign: 'center' },
  card: { alignSelf: 'stretch' },
  num: { fontSize: 17, fontWeight: '700', color: colors.ink, fontVariant: ['tabular-nums'] },
  stepNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  stepTxt: { fontSize: 13, fontWeight: '700', color: colors.card },
  heroName: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroNum: { fontSize: 30, fontWeight: '600', letterSpacing: -1.2, lineHeight: 32, color: colors.ink, fontVariant: ['tabular-nums'], marginTop: 2 },
  heroSub: { ...font.caption, marginTop: 2 },
  bar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11 },
  rowLine: { borderBottomWidth: 1, borderBottomColor: colors.line },
  note: { width: '47%', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 13, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, minHeight: 80 },
  noteTitle: { fontSize: 14.5, fontWeight: '600', color: colors.ink },
  noteSub: { ...font.caption, marginTop: 4 },
});
