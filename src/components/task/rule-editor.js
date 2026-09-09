// ═══════════════════════════════════════════════════════════════════
// rule-editor.js — LA règle d'une tâche, un seul éditeur partout (décision Jeanne
// 9 sept 2026 : « pourquoi pas le même écran tâche que celui du Planning ? ») :
// jours (= la fréquence : lun + jeu = 2×/sem), moment, qui s'en occupe, durée,
// effort (à la création), importance (fiche d'une tâche existante), note.
// Utilisé par la sheet Tâche (Planning/Accueil), la fiche courte du 12 et « Nouvelle tâche ».
// ═══════════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { LinkText } from '../ui';
import { Row, Stepper, PillChip, RuleGroup, Arrow } from './proto';
import { Stars } from './extra';
import { me, partner, fmtMin } from '../../demo';
import copy from '../../data/copy.json';
import { colors, alpha } from '../../theme';

const t = copy.mission;
const tt = copy.task;
export const MOMENTS = ['morning', 'evening', null]; // Le matin · Le soir · Peu importe
export const momentLabel = dl => (dl == null ? tt.anytime : dl === 'morning' ? tt.morning : tt.evening);

// rule = { window_days: [0-6], deadline, who: 'me'|'partner'|'alt'|'auto', duration_min, note, pain?, importance? }
export function RuleEditor({ rule, onPatch, showMoment = false, showEffort = false, showImportance = false, showDuration = true, first = true }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const days = rule.window_days || [];
  return (
    <View>
      <RuleGroup first={first} label={t.ruleDays} row>
        {copy.calendar.dowsLong.map((d, i) => <PillChip key={i} flex label={d.toLowerCase()} selected={days.includes(i)}
          onPress={() => onPatch({ window_days: days.includes(i) ? days.filter(x => x !== i) : [...days, i].sort((a, b) => a - b) })} />)}
      </RuleGroup>
      {showMoment ? (
        <RuleGroup label={t.ruleMoment}>
          {MOMENTS.map(dl => <PillChip key={String(dl)} label={momentLabel(dl)} selected={(rule.deadline ?? null) === dl} onPress={() => onPatch({ deadline: dl })} />)}
        </RuleGroup>
      ) : null}
      <RuleGroup label={t.ruleWho}>
        <PillChip label={t.who.me} avatar={me} selected={rule.who === 'me'} onPress={() => onPatch({ who: 'me' })} />
        <PillChip label={partner.first_name} avatar={partner} selected={rule.who === 'partner'} onPress={() => onPatch({ who: 'partner' })} />
        <PillChip label={t.who.alt} selected={rule.who === 'alt'} onPress={() => onPatch({ who: 'alt' })} />
        <PillChip label={t.who.auto} selected={rule.who === 'auto'} onPress={() => onPatch({ who: 'auto' })} />
      </RuleGroup>
      {showDuration ? <Row label={t.ruleDuration} right={<Stepper value={fmtMin(rule.duration_min)} onMinus={() => onPatch({ duration_min: Math.max(5, rule.duration_min - 5) })} onPlus={() => onPatch({ duration_min: rule.duration_min + 5 })} />} /> : null}
      {showEffort ? <Row label={tt.statPain} sub={tt.effortSub} right={<Stars value={rule.pain || 3} onChange={n => onPatch({ pain: n })} />} /> : null}
      {showImportance ? <Row label={tt.importance} sub={tt.importanceSub} right={<Stars value={rule.importance || 3} onChange={n => onPatch({ importance: n })} color={colors.coralDeep} />} /> : null}
      {noteOpen
        ? <View style={s.noteBox}><TextInput value={rule.note || ''} onChangeText={v => onPatch({ note: v })} placeholder={t.notePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)} multiline autoFocus={false} style={s.noteInput} /></View>
        : <Row label={t.ruleNote} sub={rule.note ? <LinkText>{rule.note}</LinkText> : t.notePlaceholder} right={<Arrow />} onPress={() => setNoteOpen(true)} />}
    </View>
  );
}

const s = StyleSheet.create({
  noteBox: { paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.line },
  noteInput: { fontSize: 15, color: colors.ink, minHeight: 60, textAlignVertical: 'top' },
});
