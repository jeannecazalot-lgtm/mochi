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
import { Row, Stepper, PillChip, RuleGroup, Arrow, TrashButton } from './proto';
import { Stars } from './extra';
import { me, partner, fmtMin } from '../../demo';
import copy from '../../copy';
import { useTokens } from '../../theme-v3';
import { dayWord } from '../../lang';

const t = copy.mission;
const tt = copy.task;
export const MOMENTS = ['morning', 'noon', 'afternoon', 'evening', null]; // Matin · Midi · Après-midi · Soir · Peu importe (tranches, 7 nov 2026)
export const momentLabel = dl => (dl == null ? tt.anytime : dl === 'morning' ? tt.morning : dl === 'noon' ? tt.noon : dl === 'afternoon' ? tt.afternoon : tt.evening);

// rule = { window_days: [0-6], deadline, who: 'me'|'partner'|'alt'|'auto', duration_min, note, pain?, importance? }
// plannedDay : le jour (0 = lundi) où cette occurrence est prévue (Jeanne 7 nov 2026 : « voir quel jour, pré-rempli ») ;
// plus de point rouge sous la pastille (Jeanne 13 nov 2026 : « pourquoi une pastille rouge ? ») : la phrase dessous le dit.
// noteOutside : la note s'édite dans le parent, en haut de la sheet, pour rester au-dessus du clavier
export function RuleEditor({ rule, onPatch, showMoment = false, showEffort = false, showDuration = true, first = true, mochiDays = null, onNoteOpen, onSkipOnce, onDeleteTask, plannedDay = null, noteOutside = false }) {
  const T = useTokens(); const s = mk(T);
  const [noteOpen, setNoteOpenRaw] = useState(false);
  const setNoteOpen = v => { setNoteOpenRaw(v); onNoteOpen?.(v); if (!v) Keyboard.dismiss(); };
  // un choix fait avant reste visible (Jeanne 15 sept) : 7 jours cochés = 7 jours noirs ; seule une tâche
  // quotidienne SANS jours choisis affiche « Sans choix : tous les jours »
  const days = rule.window_days || [];
  const allDays = !days.length && !!rule.daily;
  return (
    <View>
      <RuleGroup first={first} label={t.ruleDays} row>
        {copy.calendar.dowsLong.map((d, i) => <View key={i} style={{ flex: 1, alignItems: 'center' }}><View style={{ flexDirection: 'row', alignSelf: 'stretch' }}><PillChip flex label={d.toLowerCase()} selected={days.includes(i)}
          onPress={() => onPatch({ window_days: days.includes(i) ? days.filter(x => x !== i) : [...days, i].sort((a, b) => a - b) })} /></View></View>)}
      </RuleGroup>
      {plannedDay != null ? <Text style={s.hint}>{t.plannedDayHint.replace('{day}', dayWord(copy.calendar.dowsLong[plannedDay]))}</Text> : null}
      {!days.length && (mochiDays || allDays) ? <Text style={s.hint}>{t.ruleMochiDays.replace('{days}', allDays ? copy.setup.everyDay : mochiDays)}</Text> : null}
      {showMoment ? (
        <RuleGroup label={t.ruleMoment}>
          {MOMENTS.map(dl => <PillChip key={String(dl)} label={momentLabel(dl)} selected={(rule.deadline ?? null) === dl && (dl != null || !!rule.momentChosen)} onPress={() => onPatch({ deadline: dl, momentChosen: true })} />)}
        </RuleGroup>
      ) : null}
      {/* une seule ligne, « Mochi décide » compris (Jeanne, 10 sept 2026) */}
      <RuleGroup label={t.ruleWho}>
        <PillChip label={t.who.me} avatar={me} selected={rule.who === 'me'} onPress={() => onPatch({ who: 'me' })} />
        <PillChip label={partner.first_name} avatar={partner.avatar_url || partner.initial !== '?' ? partner : null} selected={rule.who === 'partner'} onPress={() => onPatch({ who: 'partner' })} />
        <PillChip label={t.who.alt} selected={rule.who === 'alt'} onPress={() => onPatch({ who: 'alt' })} />
        <PillChip label={t.who.auto} selected={rule.who === 'auto' && !!rule.whoChosen} onPress={() => onPatch({ who: 'auto', whoChosen: true })} />
      </RuleGroup>
      {showDuration ? <Row label={t.ruleDuration} right={<Stepper value={fmtMin(rule.duration_min)} onMinus={() => onPatch({ duration_min: Math.max(5, rule.duration_min - 5) })} onPlus={() => onPatch({ duration_min: rule.duration_min + 5 })} />} /> : null}
      {showEffort ? <Row label={tt.statPain} sub={tt.effortSub} right={<Stars value={rule.pain || 3} onChange={n => onPatch({ pain: n })} />} /> : null}
      {noteOpen && !noteOutside
        ? (
          <View style={s.noteBox}>
            <TextInput value={rule.note || ''} onChangeText={v => onPatch({ note: v })} placeholder={t.notePlaceholder} placeholderTextColor={T.muted} multiline autoFocus returnKeyType="done" blurOnSubmit onSubmitEditing={() => setNoteOpen(false)} style={s.noteInput} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}><PillChip label={t.noteDone} selected onPress={() => setNoteOpen(false)} /></View>
          </View>
        )
        : <Row label={t.ruleNote} sub={rule.note ? <LinkText>{rule.note}</LinkText> : t.notePlaceholder} right={<Arrow />} onPress={() => setNoteOpen(true)} />}
      {onSkipOnce ? <Row label={t.skipOnce} sub={t.skipOnceSub} right={<Arrow />} onPress={onSkipOnce} /> : null}
      {onDeleteTask ? <View style={{ paddingHorizontal: 14, paddingVertical: 12 }}><TrashButton onPress={onDeleteTask} label={t.deleteTask} /></View> : null}
    </View>
  );
}

// la note, éditable en haut d'une sheet (au-dessus du clavier) — utilisée par la sheet Mission
export function NoteInput({ rule, onPatch, onDone }) {
  const T = useTokens(); const s = mk(T);
  return (
    <View style={[s.noteBox, { borderTopWidth: 0, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: T.line }]}>
      <TextInput value={rule.note || ''} onChangeText={v => onPatch({ note: v })} placeholder={t.notePlaceholder} placeholderTextColor={T.muted} multiline autoFocus returnKeyType="done" blurOnSubmit onSubmitEditing={onDone} style={s.noteInput} />
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}><PillChip label={t.noteDone} selected onPress={onDone} /></View>
    </View>
  );
}

const mk = T => StyleSheet.create({
  danger: { color: T.accent },
  hint: { fontSize: 12.5, color: T.muted, paddingHorizontal: 14, paddingBottom: 10, marginTop: -4 },
  noteBox: { paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: T.line },
  noteInput: { fontSize: 15, color: T.ink, minHeight: 60, textAlignVertical: 'top' },
});
