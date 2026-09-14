// ═══════════════════════════════════════════════════════════════════
// rule-editor.js — LA règle d'une tâche, un seul éditeur partout (décision Jeanne
// 9 sept 2026 : « pourquoi pas le même écran tâche que celui du Planning ? ») :
// jours (= la fréquence : lun + jeu = 2×/sem), moment, qui s'en occupe, durée, effort, note.
// Ni importance ni divisible (Jeanne, 9 sept 2026 : « on alterne » suffit, importance abandonnée).
// Utilisé par la sheet Tâche (Planning/Accueil), la fiche courte du 12 et « Nouvelle tâche ».
// ═══════════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard } from 'react-native';
import { LinkText } from '../ui';
import { Row, Stepper, PillChip, RuleGroup, Arrow } from './proto';
import { Stars } from './extra';
import { me, partner, fmtMin } from '../../demo';
import copy from '../../data/copy.json';
import { colors, alpha, font } from '../../theme';

const t = copy.mission;
const tt = copy.task;
export const MOMENTS = ['morning', 'evening', null]; // Le matin · Le soir · Peu importe
export const momentLabel = dl => (dl == null ? tt.anytime : dl === 'morning' ? tt.morning : tt.evening);

// rule = { window_days: [0-6], deadline, who: 'me'|'partner'|'alt'|'auto', duration_min, note, pain?, importance? }
export function RuleEditor({ rule, onPatch, showMoment = false, showEffort = false, showDuration = true, first = true, mochiDays = null, onNoteOpen, onSkipOnce, onDeleteTask }) {
  const [noteOpen, setNoteOpenRaw] = useState(false);
  const setNoteOpen = v => { setNoteOpenRaw(v); onNoteOpen?.(v); if (!v) Keyboard.dismiss(); };
  // un choix fait avant reste visible (Jeanne 15 sept) : 7 jours cochés = 7 jours noirs ; seule une tâche
  // quotidienne SANS jours choisis affiche « Sans choix : tous les jours »
  const days = rule.window_days || [];
  const allDays = !days.length && !!rule.daily;
  return (
    <View>
      <RuleGroup first={first} label={t.ruleDays} row>
        {copy.calendar.dowsLong.map((d, i) => <PillChip key={i} flex label={d.toLowerCase()} selected={days.includes(i)}
          onPress={() => onPatch({ window_days: days.includes(i) ? days.filter(x => x !== i) : [...days, i].sort((a, b) => a - b) })} />)}
      </RuleGroup>
      {!days.length && (mochiDays || allDays) ? <Text style={s.hint}>{t.ruleMochiDays.replace('{days}', allDays ? copy.setup.everyDay : mochiDays)}</Text> : null}
      {showMoment ? (
        <RuleGroup label={t.ruleMoment}>
          {MOMENTS.map(dl => <PillChip key={String(dl)} label={momentLabel(dl)} selected={dl != null && (rule.deadline ?? null) === dl} onPress={() => onPatch({ deadline: dl })} />)}
        </RuleGroup>
      ) : null}
      {/* une seule ligne, « Mochi décide » compris (Jeanne, 10 sept 2026) */}
      <RuleGroup label={t.ruleWho} row>
        <PillChip flex label={t.who.me} avatar={me} selected={rule.who === 'me'} onPress={() => onPatch({ who: 'me' })} />
        <PillChip flex label={partner.first_name} avatar={partner} selected={rule.who === 'partner'} onPress={() => onPatch({ who: 'partner' })} />
        <PillChip flex label={t.who.alt} selected={rule.who === 'alt'} onPress={() => onPatch({ who: 'alt' })} />
        <PillChip flex label={t.who.auto} selected={false} onPress={() => onPatch({ who: 'auto' })} />
      </RuleGroup>
      {showDuration ? <Row label={t.ruleDuration} right={<Stepper value={fmtMin(rule.duration_min)} onMinus={() => onPatch({ duration_min: Math.max(5, rule.duration_min - 5) })} onPlus={() => onPatch({ duration_min: rule.duration_min + 5 })} />} /> : null}
      {showEffort ? <Row label={tt.statPain} sub={tt.effortSub} right={<Stars value={rule.pain || 3} onChange={n => onPatch({ pain: n })} />} /> : null}
      {noteOpen
        ? (
          <View style={s.noteBox}>
            <TextInput value={rule.note || ''} onChangeText={v => onPatch({ note: v })} placeholder={t.notePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)} multiline autoFocus returnKeyType="done" blurOnSubmit onSubmitEditing={() => setNoteOpen(false)} style={s.noteInput} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}><PillChip label={t.noteDone} selected onPress={() => setNoteOpen(false)} /></View>
          </View>
        )
        : <Row label={t.ruleNote} sub={rule.note ? <LinkText>{rule.note}</LinkText> : t.notePlaceholder} right={<Arrow />} onPress={() => setNoteOpen(true)} />}
      {onSkipOnce ? <Row label={t.skipOnce} sub={t.skipOnceSub} right={<Arrow />} onPress={onSkipOnce} /> : null}
      {onDeleteTask ? <Row label={<Text style={s.danger}>{t.deleteTask}</Text>} sub={t.deleteTaskSub} onPress={onDeleteTask} /> : null}
    </View>
  );
}

const s = StyleSheet.create({
  danger: { color: colors.coralDeep },
  hint: { ...font.caption, paddingHorizontal: 14, paddingBottom: 10, marginTop: -4 },
  noteBox: { paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.line },
  noteInput: { fontSize: 15, color: colors.ink, minHeight: 60, textAlignVertical: 'top' },
});
