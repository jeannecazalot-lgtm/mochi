// ═══════════════════════════════════════════════════════════════════
// PLANCHE DE PROPOSITIONS — écran 07 (créneaux « tape pour cycler »).
// MAQUETTE STATIQUE JETABLE : rien n'est tactile, textes en dur assumés
// (hors règle copy.json — planche d'arbitrage, pas un écran de l'app).
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GlowBg, Card, Micro } from '../../src/components/ui';
import { PropsHeader, PropBlock } from '../../src/components/props/extra';
import { colors, space, alpha } from '../../src/theme';

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MATIN = [0, 1, 0, 1, 0, 2, 2];
const SOIR = [2, 1, 2, 0, 1, 2, 1];
const EMPTY = [0, 0, 0, 0, 0, 0, 0];
const UN_TAP = [0, 0, 0, 0, 0, 1, 0]; // état après un premier tap (samedi matin)

// ─── cellule : mêmes recettes que app/(setup)/dispos.js ; grad = variante B ─
function Cell({ v, h = 34, grad }) {
  const glyph = v === 2 ? '●' : v === 1 ? '○' : '';
  const txt = <Text style={[s.cellTxt, { fontSize: h < 28 ? 10 : 14, color: v === 2 ? colors.ink : colors.sageDeep }]}>{glyph}</Text>;
  if (grad && v > 0) {
    const cols = v === 2 ? [colors.sage, alpha(colors.sage, 0.68)] : [alpha(colors.sage, 0.45), alpha(colors.sage, 0.2)];
    return (
      <LinearGradient colors={cols} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[s.cell, { height: h, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline }]}>
        {txt}
      </LinearGradient>
    );
  }
  return <View style={[s.cell, { height: h }, v === 2 ? s.cellFull : v === 1 ? s.cellLight : s.cellEmpty]}>{txt}</View>;
}

// ─── grille matin/soir ; labels=false + h réduit = mini-grille (variante C) ─
function Grid({ matin = MATIN, soir = SOIR, h = 34, grad, labels = true, gap = 5 }) {
  return (
    <View>
      <View style={[s.row, { gap }]}>
        {labels ? <View style={s.rowLabel} /> : null}
        {DAYS.map((d, i) => (
          <Text key={i} style={[s.day, { fontSize: labels ? 10.5 : 8.5, color: i >= 5 ? colors.ink : colors.muted }]}>{d}</Text>
        ))}
      </View>
      {[['MATIN', matin], ['SOIR', soir]].map(([lab, data]) => (
        <View key={lab} style={[s.row, { gap, marginTop: labels ? 5 : 3 }]}>
          {labels ? <Text style={[s.rowLabel, s.rowTxt]}>{lab}</Text> : null}
          {data.map((v, i) => <Cell key={i} v={v} h={h} grad={grad} />)}
        </View>
      ))}
    </View>
  );
}

// ─── A · légende d'abord : 3 chips d'exemple au-dessus de la grille ─
function VarianteA() {
  return (
    <Card padding={0} r={18}>
      <View style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
        <View style={s.legendChips}>
          {[[0, 'pas dispo'], [1, 'un peu'], [2, 'à fond']].map(([v, lab]) => (
            <View key={lab} style={s.legendChip}>
              <View style={{ width: 22 }}><Cell v={v} h={22} /></View>
              <Text style={s.legendChipTxt}>{lab}</Text>
            </View>
          ))}
        </View>
        <Text style={s.tapHint}>Tape une case pour changer son état</Text>
        <Grid />
      </View>
    </Card>
  );
}

// ─── B · énergie : titre dédié, cases en dégradé sage, légende dessous ─
function VarianteB() {
  return (
    <Card padding={0} r={18}>
      <View style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
        <Text style={s.cardTitle}>Quand as-tu de l'énergie ?</Text>
        <Grid grad />
        <View style={s.oneLineLegend}>
          <Text style={s.oneLineTxt}>vide · pas ce jour-là</Text>
          <Text style={s.oneLineTxt}><Text style={{ color: colors.sageDeep }}>○</Text> un peu d'énergie</Text>
          <Text style={s.oneLineTxt}><Text style={{ color: colors.ink }}>●</Text> pleine énergie</Text>
        </View>
      </View>
    </Card>
  );
}

// ─── C · progressif : deux moments côte à côte, bulle qui guide le tap ─
function Bulle({ children }) {
  return (
    <View style={s.bulle}>
      <Text style={s.bulleTxt}>{children}</Text>
    </View>
  );
}
function VarianteC() {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[
        ['1er tap', 'Commence par taper un créneau', EMPTY, EMPTY],
        ['2e tap', 'Encore un tap = à fond', UN_TAP, EMPTY],
      ].map(([tag, bulle, matin, soir]) => (
        <View key={tag} style={{ flex: 1 }}>
          <Micro style={{ textAlign: 'center', marginBottom: 6 }}>{tag}</Micro>
          <Card padding={0} r={16}>
            <View style={{ paddingVertical: 12, paddingHorizontal: 10 }}>
              <Bulle>{bulle}</Bulle>
              <Grid matin={matin} soir={soir} h={18} labels={false} gap={3} />
            </View>
          </Card>
        </View>
      ))}
    </View>
  );
}

export default function PropsCreneaux() {
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 46 }}>
          <PropsHeader
            title="Créneaux — 3 propositions"
            sub="3 pistes pour rendre le « tape pour cycler » compréhensible (écran 07). Planche à regarder : rien n'est tactile."
          />
          <View style={{ paddingHorizontal: space.headerX }}>
            <PropBlock letter="A" color={colors.coralDeep}
              why="Légende d'abord : les 3 états sont montrés en exemples avant la grille, on sait quoi faire avant de toucher.">
              <VarianteA />
            </PropBlock>
            <PropBlock letter="B" color={colors.sageDeep}
              why="Wording « énergie » plutôt que « dispo » : plus concret, et la légende tient en une ligne discrète sous la grille.">
              <VarianteB />
            </PropBlock>
            <PropBlock letter="C" color={colors.lavenderDeep}
              why="Progressif : on guide le tout premier geste, deux moments côte à côte montrent ce qui se passe tap après tap.">
              <VarianteC />
            </PropBlock>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { width: 44 },
  rowTxt: { fontSize: 11, letterSpacing: 0.8, fontWeight: '600', color: colors.muted },
  day: { flex: 1, textAlign: 'center', letterSpacing: 1, fontWeight: '600' },
  cell: { flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cellFull: { backgroundColor: colors.sage, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  cellLight: { backgroundColor: alpha(colors.sage, 0.35), borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  cellEmpty: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: alpha(colors.ink, 0.10) },
  cellTxt: { fontWeight: '700' },
  // A
  legendChips: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  legendChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: alpha(colors.ink, 0.04), borderRadius: 999, paddingVertical: 5, paddingLeft: 6, paddingRight: 11 },
  legendChipTxt: { fontSize: 11.5, fontWeight: '500', color: colors.inkSoft },
  tapHint: { fontSize: 12.5, fontWeight: '500', color: colors.muted, textAlign: 'center', marginTop: 9, marginBottom: 12 },
  // B
  cardTitle: { fontSize: 16, fontWeight: '600', letterSpacing: -0.3, color: colors.ink, textAlign: 'center', marginBottom: 12 },
  oneLineLegend: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 11 },
  oneLineTxt: { fontSize: 10.5, fontWeight: '500', color: colors.muted },
  // C
  bulle: { alignSelf: 'center', backgroundColor: colors.darkPill, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 10, marginBottom: 10 },
  bulleTxt: { fontSize: 10.5, fontWeight: '600', color: colors.card, textAlign: 'center' },
});
