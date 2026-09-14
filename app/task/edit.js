// Fiche tâche = LA sheet du Planning, sans ce qui ne sert pas hors occurrence (décision Jeanne
// 9 sept 2026 : « garder le A partout mais enlever temps passé / pas le temps / dépense »).
// Trois entrées : `?setup=` depuis le 12 (tâche encore locale), `?id=` tâche réelle du foyer,
// rien = « Nouvelle tâche ». Le titre s'édite en tête ; la règle (jours = fréquence, moment,
// qui, durée, effort, note) est dépliée d'entrée. Comme la sheet, tout s'enregistre à la
// fermeture — sauf une nouvelle tâche, qui a besoin d'un « Créer ».
import React, { useState, useEffect, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, Keyboard, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSheetGrow, CREATE_SHEET_MIN } from '../../src/components/sheet-grow';
import { Card, CTAPrimary } from '../../src/components/ui';
import { SheetHandle } from '../../src/components/social/extra';
import { TaskHeader } from '../../src/components/task/extra';
import { TrashButton } from '../../src/components/task/proto';
import { RuleEditor } from '../../src/components/task/rule-editor';
import { dayKeys, me, partner } from '../../src/demo-task';
import { loadRealTask, saveRealTask, createRealTask, deleteRealTask } from '../../src/task-actions';
import { EmojiPicker } from '../../src/components/emoji-picker';
import { setup, saveTasks, saveResult, freqPerWeek } from '../../src/setup-state';
import { daysForTask } from '../../src/dispatch';
import { catalogue } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, alpha, font, space } from '../../src/theme';

const t = copy.task;
const todayDow = () => (new Date().getDay() + 6) % 7;

// who de la règle ↔ colonnes assign_mode / fixed_assignee de la fiche réelle
const toWho = f => (f.assign_mode === 'alternate' ? 'alt' : f.assign_mode === 'fixed' ? (f.fixed_assignee === partner.id ? 'partner' : 'me') : 'auto');
const fromWho = who => (who === 'alt' ? { assign_mode: 'alternate', fixed_assignee: null } : who === 'auto' ? { assign_mode: 'auto', fixed_assignee: null } : { assign_mode: 'fixed', fixed_assignee: who === 'partner' ? partner.id : me.id });
// les jours cochés font la fréquence
const freqOf = days => (days.length >= 7 ? 'daily' : days.length >= 2 ? 'twiceWeek' : 'weekly');
const EMPTY = { title: '', emoji: '', window_days: [], deadline: null, who: 'auto', duration_min: 15, note: '', pain: 3, importance: 3, mental_load: false };

// fiche depuis le 12 : la tâche vit dans setup.tasks ; les jours arrivent PRÉ-COCHÉS avec le
// placement de Mochi (retour Jeanne 9 sept 2026)
const fromSetupTask = sid => {
  const c = catalogue.find(x => x.id === sid);
  const tk = (setup.tasks || []).find(x => x.id === sid) || (c ? { label: c.label, emoji: c.emoji, duration_min: c.mins, per_week: freqPerWeek(c.freq), pain: c.pain } : null);
  const items = setup.result?.items || [];
  const index = Math.max(0, items.findIndex(it => it.task_id === sid));
  const item = items[index];
  const td = todayDow();
  const offs = daysForTask({ perWeek: tk?.per_week || 1, windowDays: tk?.window_days, availability: setup.availability, todayDow: td, seed: index });
  const who = item ? (item.assignee_id === me.id ? 'me' : item.assignee_id === partner.id ? 'partner' : item.assignee_id === 'alt' ? 'alt' : 'auto') : 'auto';
  // rien de pré-coché (Jeanne, 10 sept 2026 : « ne rien pré-remplir ») : les jours de Mochi sont montrés en légende
  const placed = tk?.window_days?.length ? [] : offs.map(o => (td + o) % 7).sort((a, b) => a - b);
  return { ...EMPTY, title: tk?.label || '', emoji: tk?.emoji || '', window_days: tk?.window_days || [], mochiDays: placed.length >= 7 ? copy.setup.everyDay : placed.map(i => copy.calendar.dowsLong[i].toLowerCase()).join(' · '), deadline: tk?.deadline ?? null,
    who, duration_min: tk?.duration_min || 15, note: tk?.note || '', pain: tk?.pain ?? 3, mental_load: !!tk?.mental_load };
};
const saveSetupTask = (sid, f) => {
  const per_week = f.window_days.length || (setup.tasks || []).find(tk => tk.id === sid)?.per_week || 1;
  saveTasks((setup.tasks || []).map(tk => (tk.id === sid ? { ...tk, label: f.title.trim() || tk.label, duration_min: f.duration_min, per_week, pain: f.pain, note: f.note || '', window_days: f.window_days, deadline: f.deadline ?? null } : tk)));
  if (setup.result?.items) {
    const assignee = f.who === 'me' ? me.id : f.who === 'partner' ? partner.id : f.who === 'alt' ? 'alt' : null;
    saveResult({ ...setup.result, items: setup.result.items.map(it => (it.task_id === sid ? { ...it, weekly_min: per_week * f.duration_min, ...(assignee ? { assignee_id: assignee } : {}) } : it)) });
  }
};
const fromReal = rt => ({ ...EMPTY, ...rt, window_days: (rt.window_days || []).map(k => dayKeys.indexOf(k)).filter(i => i >= 0), who: toWho(rt), pain: rt.pains?.[me.id] ?? 3 });
const toReal = (f, base = {}) => ({ ...base, ...f, frequency: freqOf(f.window_days), window_days: f.window_days.map(i => dayKeys[i]), ...fromWho(f.who), pains: { ...(base.pains || {}), [me.id]: f.pain }, divisible: false, has_expense: false });

// `page` : même fiche, présentée en écran plein (proposition C, 9 sept 2026) au lieu d'une sheet
export function TaskEditBody({ page = false }) {
  const { id, setup: setupId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const isNew = !id && !setupId;
  const [noteOpen, setNoteOpen] = useState(false);
  const onGrowLayout = useSheetGrow(false, noteOpen, page ? null : CREATE_SHEET_MIN);
  const [f, setF] = useState(() => (setupId ? fromSetupTask(setupId) : EMPTY));
  const [base, setBase] = useState(null); // fiche réelle d'origine (rien n'est perdu à l'enregistrement)
  useEffect(() => { if (id) loadRealTask(id).then(rt => { if (rt) { setBase(rt); setF(fromReal(rt)); } }); }, [id]);
  const patch = p => { dirty.current = true; setF(x => ({ ...x, ...p })); };

  // comme la sheet du Planning : la fiche s'enregistre d'elle-même à la fermeture
  const dirty = useRef(false);
  const latest = useRef({ f, base });
  latest.current = { f, base };
  useEffect(() => () => {
    if (isNew || !dirty.current) return;
    const { f: cur, base: b } = latest.current;
    if (setupId) saveSetupTask(setupId, cur);
    else if (b) saveRealTask(toReal(cur, b));
  }, []);
  const busy = useRef(false); // deux taps rapides = deux tâches (Ketley 12 sept 2026)
  const create = async () => { if (busy.current) return; busy.current = true; await createRealTask(toReal(f)); dirty.current = false; router.back(); };

  return (
    <KeyboardAvoidingView behavior="padding" style={[s.sheet, page && s.page, { paddingBottom: Math.max(insets.bottom, 31) }]} onLayout={page ? undefined : onGrowLayout}>
      <Pressable onPress={Keyboard.dismiss} accessible={false}>
      {page ? <TaskHeader title={isNew ? t.headerNew : t.headerEdit} backLabel={t.back} /> : <SheetHandle />}
        <View style={[s.head, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
          <EmojiPicker value={f.emoji} onChange={e => patch({ emoji: e })} />
          <TextInput
            value={f.title} onChangeText={v => patch({ title: v })} placeholder={t.titlePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)}
            autoCorrect={false} returnKeyType="done" cursorColor={colors.coral} selectionColor={colors.coral} style={[s.title, { flex: 1 }]}
          />
        </View>
        <Card r={16} padding={0} style={s.block}>
          <RuleEditor rule={f} onPatch={patch} showMoment showEffort mochiDays={f.mochiDays || null} onNoteOpen={setNoteOpen} />
        </Card>
        {isNew
          ? <View style={{ marginTop: 14 }}><CTAPrimary label={t.ctaCreate} disabled={!f.title.trim()} onPress={create} big /></View>
          : id ? <View style={{ marginTop: 18 }}><TrashButton onPress={async () => { await deleteRealTask(String(id)).catch(() => {}); dirty.current = false; router.back(); }} label={copy.mission.deleteTask} /></View> : null}
      </Pressable>
    </KeyboardAvoidingView>
  );
}
export default function TaskEdit() { return <TaskEditBody />; }

const s = StyleSheet.create({
  sheet: { backgroundColor: colors.card, paddingTop: 10, paddingHorizontal: space.screenX },
  page: { flex: 1, paddingTop: 0, backgroundColor: 'transparent' },
  head: { marginTop: 2, marginBottom: 12, paddingHorizontal: 2 },
  title: { ...font.cardTitle, padding: 0 },
  block: { marginBottom: 8 },
});
