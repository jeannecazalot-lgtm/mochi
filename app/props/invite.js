// Planche de propositions · écran 09 (invitation) — 3 variantes STATIQUES pour Jeanne.
// Maquettes non interactives (pointerEvents="none"), empilées pleine largeur,
// label A/B/C + 1 ligne de justification. Retours Jeanne 22 août 2026.
import React from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect } from 'react-native-svg';
import { GlowBg, Card, Avatar, Mochi, PillLabel } from '../../src/components/ui';
import { ActionPill, ShareIcon, QRIcon, AvatarPlaceholder, fill } from '../../src/components/setup/extra';
import { me } from '../../src/demo';
import { inviteLink } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, space, radius, font, gradients, alpha } from '../../src/theme';

const t = copy.setup;
const p = copy.props;

// ─── CTA statique (même recette visuelle que CTAPrimary, sans interaction) ─
const StaticCTA = ({ label }) => (
  <LinearGradient {...gradients.mochi} style={s.staticCta}>
    <Text style={[font.cta, { fontSize: 16 }]}>{label}</Text>
  </LinearGradient>
);

// ─── faux QR déterministe (3 mires + modules pseudo-aléatoires) ─────
function FakeQR({ size = 190 }) {
  const n = 21, m = size / n;
  const cells = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inFinder = (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
      if (!inFinder && (x * 7 + y * 13 + ((x * y) % 5)) % 3 === 0) cells.push([x, y]);
    }
  }
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[[0, 0], [n - 7, 0], [0, n - 7]].map(([fx, fy], i) => (
        <React.Fragment key={i}>
          <Rect x={fx * m + m / 2} y={fy * m + m / 2} width={6 * m} height={6 * m} rx={m} fill="none" stroke={colors.ink} strokeWidth={m} />
          <Rect x={(fx + 2) * m} y={(fy + 2) * m} width={3 * m} height={3 * m} rx={m / 2} fill={colors.ink} />
        </React.Fragment>
      ))}
      {cells.map(([x, y], i) => (
        <Rect key={i} x={x * m} y={y * m} width={m * 0.9} height={m * 0.9} rx={m * 0.25} fill={colors.ink} />
      ))}
    </Svg>
  );
}

// ─── éléments partagés des maquettes ────────────────────────────────
const MiniDots = ({ step = 4, total = 4 }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5 }}>
    {Array.from({ length: total }, (_, i) => i + 1).map(i => (
      <View key={i} style={{ width: i === step ? 18 : 6, height: 6, borderRadius: radius.pill, backgroundColor: i <= step ? colors.ink : alpha(colors.ink, 0.15) }} />
    ))}
  </View>
);
const AvatarsRow = ({ mochi = 64, avatar = 54 }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Avatar initial={me.initial} color={me.color} size={avatar} ring />
    <View style={{ marginHorizontal: -6, zIndex: 2 }}><Mochi size={mochi} /></View>
    <AvatarPlaceholder size={avatar} />
  </View>
);
const LinkBlock = ({ style }) => (
  <View style={[s.link, style]}><Text numberOfLines={1} style={s.linkTxt}>{inviteLink}</Text></View>
);
const Later = () => <Text style={s.later}>{t.inviteLater}</Text>;

// ─── variante A · actuelle améliorée : carte-aperçu + grand CTA ─────
function VariantA() {
  return (
    <View style={s.mock}>
      <MiniDots />
      <Text style={[s.mockTitle, { marginTop: 12 }]}>{fill(t.inviteTitle, { partner: copy.common.partner })}</Text>
      <Text style={s.mockSub}>{t.inviteSub}</Text>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card padding={0} r={22}>
          <View style={{ paddingVertical: 22, paddingHorizontal: 20, alignItems: 'center' }}>
            <AvatarsRow />
            <Text style={[s.cardTitle, { marginTop: 12 }]}>{t.inviteCardTitle}</Text>
            <Text style={s.cardSub}>{t.inviteCardSub}</Text>
            <LinkBlock />
          </View>
        </Card>
      </View>
      <StaticCTA label={t.sendLink} />
      <View style={s.pillRow}>
        <ActionPill icon={<QRIcon />} label={t.qr} size={44} />
        <ActionPill icon={<ShareIcon />} size={44} />
      </View>
      <Later />
    </View>
  );
}

// ─── variante B · façon Tricount : hero en haut, actions empilées en bas ─
function VariantB() {
  return (
    <View style={s.mock}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Mochi size={92} />
        <Text style={[s.mockTitle, { textAlign: 'center', marginTop: 14 }]}>{fill(t.inviteTitle, { partner: copy.common.partner })}</Text>
        <Text style={[s.mockSub, { textAlign: 'center', maxWidth: 240, alignSelf: 'center' }]}>{t.inviteSub}</Text>
        <LinkBlock style={{ alignSelf: 'stretch', marginTop: 16 }} />
      </View>
      <View style={{ gap: 10 }}>
        <StaticCTA label={t.sendLink} />
        <ActionPill icon={<QRIcon />} label={t.qr} size={46} style={{ alignSelf: 'stretch' }} />
        <ActionPill icon={<ShareIcon />} label={t.share} size={46} style={{ alignSelf: 'stretch' }} />
      </View>
      <Later />
    </View>
  );
}

// ─── variante C · minimaliste : QR géant, lien dessous, un seul CTA ─
function VariantC() {
  return (
    <View style={s.mock}>
      <Text style={[s.mockTitle, { textAlign: 'center' }]}>{fill(t.inviteTitle, { partner: copy.common.partner })}</Text>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Card r={22} padding={18}><FakeQR size={190} /></Card>
        <Text style={[s.linkTxt, { marginTop: 14 }]}>{inviteLink}</Text>
        <Text style={[s.cardSub, { marginTop: 6 }]}>{t.inviteHint}</Text>
      </View>
      <StaticCTA label={t.sendLink} />
    </View>
  );
}

const variants = [
  { key: 'A', label: p.aLabel, why: p.aWhy, node: <VariantA /> },
  { key: 'B', label: p.bLabel, why: p.bWhy, node: <VariantB /> },
  { key: 'C', label: p.cLabel, why: p.cWhy, node: <VariantC /> },
];

export default function PropsInvite() {
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={s.back} accessibilityLabel={p.back}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"><Path d="M15 5l-7 7 7 7" stroke={colors.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></Svg>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[font.screenTitle, { letterSpacing: -1.1 }]}>{p.inviteTitle}</Text>
            <Text style={[font.secondary, { fontSize: 14, marginTop: 4, lineHeight: 20 }]}>{p.inviteSub}</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: space.screenX, paddingTop: 18, paddingBottom: 40, gap: 26 }}>
          {variants.map(v => (
            <View key={v.key}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <PillLabel color={colors.coralDeep} tint={colors.coral}>{v.label}</PillLabel>
              </View>
              <Text style={s.why}>{v.why}</Text>
              <View style={s.frame} pointerEvents="none">{v.node}</View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: space.screenX, paddingTop: 14 },
  back: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  why: { fontSize: 13, fontWeight: '400', color: colors.muted, lineHeight: 18, marginBottom: 10 },
  frame: { height: 540, borderRadius: radius.cardLg, backgroundColor: colors.bg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.sheetLine, overflow: 'hidden' },
  mock: { flex: 1, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 16, alignItems: 'stretch' },
  mockTitle: { fontSize: 20, fontWeight: '600', letterSpacing: -0.8, color: colors.ink },
  mockSub: { fontSize: 13.5, fontWeight: '400', color: colors.muted, marginTop: 5, lineHeight: 19 },
  cardTitle: { fontSize: 16, fontWeight: '600', letterSpacing: -0.3, color: colors.ink },
  cardSub: { fontSize: 13, fontWeight: '400', color: colors.muted, marginTop: 3, marginBottom: 12, textAlign: 'center' },
  link: { alignSelf: 'stretch', backgroundColor: alpha(colors.ink, 0.05), borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14 },
  linkTxt: { fontSize: 13.5, fontWeight: '500', color: colors.ink, textAlign: 'center' },
  later: { fontSize: 13, fontWeight: '500', color: colors.muted, textAlign: 'center', marginTop: 12 },
  pillRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 12 },
  staticCta: { borderRadius: radius.row, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
});
