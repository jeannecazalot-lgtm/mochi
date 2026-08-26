// ═══════════════════════════════════════════════════════════════════
// PLANCHE DE PROPOSITIONS — écran 08 (préférences j'aime / je déteste).
// MAQUETTE STATIQUE JETABLE : rien n'est tactile, textes en dur assumés
// (hors règle copy.json — planche d'arbitrage, pas un écran de l'app).
// Plus de pré-rempli en vrai : les exemples classés illustrent le geste.
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, Divider, Micro } from '../../src/components/ui';
import { PropsHeader, PropBlock } from '../../src/components/props/extra';
import { setupTokens } from '../../src/components/setup/extra';
import { colors, space, alpha } from '../../src/theme';

// « Repasser » devient « Le repassage » partout sur cette planche.
const LIKE = ['🍳 Cuisiner', '🛒 Courses', '🐕 Le chien'];
const HATE = ['👔 Le repassage', '🚽 Salle de bain', '📞 Appels admin'];
const NEUTRAL = ['🧺 Lessive', '🪴 Plantes', '🍽 Vaisselle', '🗑 Poubelles'];

// ─── chip statique : tone 'like' | 'hate' | null (neutre) ───────────
function Chip({ label, tone, small }) {
  const bg = tone === 'like' ? setupTokens.chipLike : tone === 'hate' ? setupTokens.chipHate : null;
  return (
    <View style={[s.chip, small && s.chipSmall, bg ? { backgroundColor: bg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline } : s.chipOff]}>
      <Text style={[s.chipTxt, small && { fontSize: 12.5 }]}>{label}</Text>
    </View>
  );
}

// ─── A · deux colonnes : on « glisse » les chips vers un côté ───────
function VarianteA() {
  return (
    <Card padding={0} r={18}>
      <View style={{ paddingVertical: 14, paddingHorizontal: 14 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[
            ['J’aime 💚', colors.sageDeep, LIKE, 'like'],
            ['Je déteste 🙈', colors.coralDeep, HATE, 'hate'],
          ].map(([head, color, items, tone]) => (
            <View key={tone} style={s.col}>
              <Text style={[s.colHead, { color }]}>{head}</Text>
              {items.map(l => <Chip key={l} label={l} tone={tone} small />)}
            </View>
          ))}
        </View>
        <View style={{ marginVertical: 12 }}><Divider /></View>
        <Micro style={{ textAlign: 'center', marginBottom: 8 }}>Encore à classer — tape vers un côté</Micro>
        <View style={[s.cloud, { justifyContent: 'center' }]}>
          {NEUTRAL.map(l => <Chip key={l} label={l} small />)}
        </View>
      </View>
    </Card>
  );
}

// ─── B · une liste, trois états par rangée (😊 / 😐 / 😖) ───────────
function FaceBtn({ face, on }) {
  const onBg = face === '😊' ? setupTokens.chipLike : face === '😖' ? setupTokens.chipHate : alpha(colors.ink, 0.10);
  return (
    <View style={[s.face, on ? { backgroundColor: onBg, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline } : s.faceOff]}>
      <Text style={{ fontSize: 15, opacity: on ? 1 : 0.55 }}>{face}</Text>
    </View>
  );
}
function VarianteB() {
  const rows = [
    ['🍳 Cuisiner', '😊'],
    ['👔 Le repassage', '😖'],
    ['🛒 Courses', null],
    ['🍽 Vaisselle', null],
  ];
  return (
    <Card padding={0} r={18}>
      {rows.map(([label, picked], i) => (
        <View key={label}>
          {i > 0 ? <Divider /> : null}
          <View style={s.listRow}>
            <Text style={s.listTxt}>{label}</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {['😊', '😐', '😖'].map(f => <FaceBtn key={f} face={f} on={picked === f} />)}
            </View>
          </View>
        </View>
      ))}
    </Card>
  );
}

// ─── C · chips uniques à bascule : 1 tap vert, 2 taps corail, 3 neutre ─
function VarianteC() {
  const cloud = [
    ['🍳 Cuisiner', 'like'], ['🐕 Le chien', 'like'],
    ['👔 Le repassage', 'hate'], ['🚽 Salle de bain', 'hate'],
    ['🛒 Courses', null], ['🧺 Lessive', null], ['🪴 Plantes', null], ['🍽 Vaisselle', null], ['🗑 Poubelles', null],
  ];
  return (
    <Card padding={0} r={18}>
      <View style={{ paddingVertical: 14, paddingHorizontal: 14 }}>
        <View style={s.cLegend}>
          <Text style={s.cLegendTxt}>⬜ neutre</Text>
          <Text style={s.cLegendTxt}>💚 1 tap · j'aime</Text>
          <Text style={s.cLegendTxt}>❤️‍🔥 2 taps · je déteste</Text>
        </View>
        <View style={s.cloud}>
          {cloud.map(([l, tone]) => <Chip key={l} label={l} tone={tone} />)}
        </View>
      </View>
    </Card>
  );
}

// ─── mini-section wording : 3 alternatives de titres de groupes ─────
function Wording() {
  const alts = [
    ['J’aime bien faire', 'Je déteste'],
    ['Plutôt moi', 'Plutôt pas moi'],
    ['Ça me va', 'Ça me pèse'],
  ];
  return (
    <View style={{ marginTop: 26 }}>
      <Micro style={{ marginBottom: 8 }}>Wording — titres des deux groupes</Micro>
      <Card padding={0} r={16}>
        {alts.map(([a, b], i) => (
          <View key={a}>
            {i > 0 ? <Divider /> : null}
            <View style={s.wordRow}>
              <Text style={s.wordNum}>{i + 1}</Text>
              <Text style={[s.wordTxt, { color: colors.sageDeep }]}>{a}</Text>
              <Text style={s.wordSep}>/</Text>
              <Text style={[s.wordTxt, { color: colors.coralDeep }]}>{b}</Text>
            </View>
          </View>
        ))}
      </Card>
    </View>
  );
}

export default function PropsPrefs() {
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 46 }}>
          <PropsHeader
            title="Préférences — 3 propositions"
            sub="3 pistes pour clarifier les deux groupes (écran 08). Plus de pré-rempli en vrai : les exemples classés montrent juste le geste. Rien n'est tactile."
          />
          <View style={{ paddingHorizontal: space.headerX }}>
            <PropBlock letter="A" color={colors.coralDeep}
              why="Deux colonnes face à face : on comprend qu'on range les mêmes tâches d'un côté ou de l'autre, le stock neutre reste visible dessous.">
              <VarianteA />
            </PropBlock>
            <PropBlock letter="B" color={colors.sageDeep}
              why="Une seule liste, trois réponses par tâche : pas de double groupe à comprendre, chaque rangée se lit comme une question.">
              <VarianteB />
            </PropBlock>
            <PropBlock letter="C" color={colors.lavenderDeep}
              why="Un seul nuage de chips à bascule : chaque tap fait le tour des trois états, zéro doublon entre les groupes.">
              <VarianteC />
            </PropBlock>
            <Wording />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  chip: { paddingVertical: 8, paddingHorizontal: 13, borderRadius: 999 },
  chipSmall: { paddingVertical: 6, paddingHorizontal: 11 },
  chipOff: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: alpha(colors.ink, 0.10) },
  chipTxt: { fontSize: 14, fontWeight: '500', color: colors.ink },
  cloud: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  // A
  col: { flex: 1, alignItems: 'center', gap: 6 },
  colHead: { fontSize: 13, fontWeight: '700', letterSpacing: -0.2, marginBottom: 3 },
  // B
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 14 },
  listTxt: { flex: 1, fontSize: 14.5, fontWeight: '500', color: colors.ink },
  face: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  faceOff: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: alpha(colors.ink, 0.10) },
  // C
  cLegend: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 12 },
  cLegendTxt: { fontSize: 11, fontWeight: '500', color: colors.inkSoft },
  // wording
  wordRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 14 },
  wordNum: { width: 18, fontSize: 12, fontWeight: '700', color: colors.muted },
  wordTxt: { fontSize: 14.5, fontWeight: '600' },
  wordSep: { fontSize: 13, color: colors.muted },
});
