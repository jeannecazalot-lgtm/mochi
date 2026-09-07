// Écran 14 · Fiche tâche (création / édition). Recette : docs/recettes/14-fiche-tache.md
// `?id=` : vraie tâche du foyer (store local, Enregistrer persiste — 1er sept 2026)
// ou tâche de démo ; sinon fiche vierge.
import React, { useState, useEffect, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, Avatar, LinkText } from '../../src/components/ui';
import { TaskHeader, Section, Toggle, Chip, StatTile, Stars, Segmented, OptionRow, ChevronRight, TaskCTA, TaskFooter, taskTokens } from '../../src/components/task/extra';
import { loadTask, frequencies, durations, dayKeys, deadlines, me, partner, fmtMinShort, fmtStars, fmtHour } from '../../src/demo-task';
import { loadRealTask, saveRealTask, createRealTask } from '../../src/task-actions';
import { setup, saveTasks, saveResult, freqPerWeek } from '../../src/setup-state';
import { catalogue } from '../../src/demo-setup';
import copy from '../../src/data/copy.json';
import { colors, alpha, font } from '../../src/theme';

const f = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
const FREQ_KEY = { daily: 'freqDaily', twiceWeek: 'freqTwiceWeek', weekly: 'freqWeekly', monthly: 'freqMonthly', once: 'freqOnce' };
const next = (list, v) => list[(list.indexOf(v) + 1) % list.length];

// Fiche COURTE depuis l'écran 12 (retour Jeanne 7 sept 2026 : « trop d'infos », titre vide) :
// la tâche vit encore dans setup.tasks (pas d'uuid) → nom, type, fréquence, durée, note.
const fromSetupTask = sid => {
  const c = catalogue.find(x => x.id === sid); // entrée directe /plan (démo) : le catalogue fait foi
  const tk = (setup.tasks || []).find(x => x.id === sid) || (c ? { label: c.label, emoji: c.emoji, duration_min: c.mins, per_week: freqPerWeek(c.freq), mental_load: !!c.mental } : null);
  return { ...loadTask(null), short: true, setupId: sid, title: tk?.label || '', emoji: tk?.emoji || '', duration_min: tk?.duration_min || 15, per_week: tk?.per_week || 1, mental_load: !!tk?.mental_load, note: tk?.note || '' };
};
const saveSetupTask = fiche => {
  saveTasks((setup.tasks || []).map(tk => (tk.id === fiche.setupId ? { ...tk, label: fiche.title.trim(), duration_min: fiche.duration_min, per_week: fiche.per_week, mental_load: !!fiche.mental_load, note: fiche.note || '' } : tk)));
  if (setup.result?.items) saveResult({ ...setup.result, items: setup.result.items.map(it => (it.task_id === fiche.setupId ? { ...it, weekly_min: fiche.per_week * fiche.duration_min } : it)) });
};

export default function TaskEdit() {
  const { id, setup: setupId } = useLocalSearchParams();
  const t = copy.task;
  const [task, setTask] = useState(() => (setupId ? fromSetupTask(setupId) : loadTask(id)));
  const [open, setOpen] = useState(null); // 'window' | 'pain' | 'note'
  // vraie tâche du foyer ? on remplace la démo dès que le store a répondu
  useEffect(() => { if (!setupId) loadRealTask(id).then(rt => { if (rt) setTask(rt); }); }, [id]);
  const set = patch => setTask(x => ({ ...x, ...patch }));
  const scrollRef = useRef(null);
  // la note est le dernier champ : on déroule jusqu'en bas quand elle s'ouvre, et le ScrollView
  // suit le clavier (retour Jeanne 7 sept 2026 : « le champ n'apparaît pas, juste le clavier »)
  const toggleOpen = k => setOpen(o => { const n = o === k ? null : k; if (n === 'note') setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120); return n; });

  const mental = !!task.mental_load;
  const accent = mental ? colors.lavender : colors.sage;
  const deadlineLabel = dl => (dl == null ? t.noDeadline : dl === 'morning' ? t.morning : f(t.before, { h: fmtHour(dl) }));
  const windowLabel = () => {
    const parts = [];
    if (task.window_days.length) parts.push(task.window_days.join(' + '));
    if (task.deadline) parts.push(deadlineLabel(task.deadline));
    return parts.length ? parts.join(' · ') : t.windowNone;
  };
  const toggleDay = k => set({ window_days: task.window_days.includes(k) ? task.window_days.filter(x => x !== k) : dayKeys.filter(x => x === k || task.window_days.includes(x)) });
  const setPain = (uid, n) => set({ pains: { ...task.pains, [uid]: n } });
  const fixedName = task.fixed_assignee === partner.id ? partner.first_name : me.first_name;

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <TaskHeader title={!id && !setupId ? t.headerNew : t.headerEdit} backLabel={t.back} />

        <ScrollView ref={scrollRef} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
          {/* Héro */}
          <Card r={18} padding={0} accent={accent} style={s.hero}>
            {/* Type au tap (retour Jeanne 7 sept 2026) : les deux pills côte à côte, l'active pleine, l'autre en fantôme */}
            <View style={s.typeRow}>
              {[{ m: false, l: t.catDomestic, c: colors.sageDeep }, { m: true, l: t.catMental, c: colors.lavenderDeep }].map(o => {
                const on = mental === o.m;
                return (
                  <Pressable key={String(o.m)} onPress={() => set({ mental_load: o.m })} hitSlop={6} style={[s.typePill, { backgroundColor: alpha(o.c, on ? 0.16 : 0.05) }]}>
                    <Text style={[font.pill, { color: on ? o.c : alpha(colors.ink, 0.35) }]}>{o.l}</Text>
                  </Pressable>
                );
              })}
            </View>
            <TextInput
              value={task.title} onChangeText={v => set({ title: v })} placeholder={t.titlePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)}
              autoCorrect={false} returnKeyType="done" cursorColor={colors.coral} selectionColor={colors.coral} style={s.heroTitle}
            />
          </Card>

          {task.short ? (
            <>
              <Section label={t.secWhen}>
                <Card r={14} padding={0} style={s.whenCard}>
                  <View style={[s.freqRow, { borderBottomWidth: 0, paddingBottom: 2 }]}>
                    <Text style={s.rowTitle}>{t.frequency}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Chip small onPress={() => set({ per_week: Math.max(1, task.per_week - 1) })}>−</Chip>
                      <Text style={[s.rowTitle, { minWidth: 56, textAlign: 'center' }]}>{copy.setup.timesPerWeek.replace('{n}', String(task.per_week))}</Text>
                      <Chip small onPress={() => set({ per_week: Math.min(14, task.per_week + 1) })}>+</Chip>
                    </View>
                  </View>
                </Card>
              </Section>
              <Section label={t.secDetails}>
                <View style={s.grid}>
                  <StatTile label={t.statDuration} value={fmtMinShort(task.duration_min)} onPress={() => set({ duration_min: next(durations, task.duration_min) })} />
                </View>
              </Section>
              <Section label={t.secOptions}>
                <Card r={14} padding={0} style={s.optCard}>
                  <OptionRow first title={t.optNote} sub={task.note ? <LinkText>{f(t.optNoteSub, { note: task.note })}</LinkText> : t.optNoteEmpty} control={<ChevronRight />} onPress={() => toggleOpen('note')} />
                  {open === 'note' ? (
                    <TextInput
                      value={task.note} onChangeText={v => set({ note: v })} placeholder={t.notePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)}
                      multiline cursorColor={colors.coral} selectionColor={colors.coral} style={s.noteInput}
                    />
                  ) : null}
                </Card>
              </Section>
            </>
          ) : null}

          {/* Quand */}
          {task.short ? null : <Section label={t.secWhen}>
            <Card r={14} padding={0} style={s.whenCard}>
              <View style={s.freqRow}>
                <Text style={s.rowTitle}>{t.frequency}</Text>
                <Chip onPress={() => set({ frequency: next(frequencies, task.frequency) })}>{t[FREQ_KEY[task.frequency]]}</Chip>
              </View>
              <Pressable onPress={() => toggleOpen('window')} style={s.windowRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowTitle}>{t.window}</Text>
                  <Text style={s.rowSub}>{t.windowHint}</Text>
                </View>
                <Chip tone="coral">{windowLabel()}</Chip>
              </Pressable>
              {open === 'window' ? (
                <View style={s.picker}>
                  <View style={{ flexDirection: 'row', gap: 5 }}>
                    {dayKeys.map((k, i) => (
                      <Pressable key={k} onPress={() => toggleDay(k)} style={[s.dayChip, task.window_days.includes(k) && { backgroundColor: colors.ink }]}>
                        <Text style={[s.dayText, task.window_days.includes(k) && { color: colors.card }]}>{t.days[i]}</Text>
                      </Pressable>
                    ))}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
                    {deadlines.map(dl => <Chip key={String(dl)} small selected={task.deadline === dl} onPress={() => set({ deadline: dl })}>{deadlineLabel(dl)}</Chip>)}
                  </View>
                </View>
              ) : null}
            </Card>
          </Section>}

          {/* Détails */}
          {task.short ? null : <Section label={t.secDetails}>
            <View style={s.grid}>
              <StatTile label={t.statDuration} value={fmtMinShort(task.duration_min)} onPress={() => set({ duration_min: next(durations, task.duration_min) })} />
              <StatTile label={t.statPain} value={fmtStars(task.pains[me.id])} hint={f(t.painOf, { name: partner.first_name, stars: fmtStars(task.pains[partner.id]) })} active={open === 'pain'} onPress={() => toggleOpen('pain')} />
              <StatTile label={t.statImport} value={f(t.importOf, { n: task.importance })} onPress={() => set({ importance: (task.importance % 5) + 1 })} />
            </View>
            {open === 'pain' ? (
              <Card r={14} padding={0} style={s.painCard}>
                {[me, partner].map((m, i) => (
                  <View key={m.id} style={[s.painRow, i > 0 && s.painRowLine]}>
                    <Avatar initial={m.initial} color={m.color} size={26} />
                    <Text style={[s.rowTitle, { flex: 1 }]}>{i === 0 ? t.painMe : m.first_name}</Text>
                    <Stars value={task.pains[m.id]} onChange={n => setPain(m.id, n)} color={i === 0 ? colors.ink : colors.lavenderDeep} />
                  </View>
                ))}
              </Card>
            ) : null}
          </Section>}

          {/* Assignation */}
          {task.short ? null : <Section label={t.secAssign}>
            <Card r={14} padding={0} style={s.assignCard}>
              <Segmented
                value={task.assign_mode} onChange={k => set({ assign_mode: k })}
                options={[{ k: 'auto', l: t.assignAuto, s: t.assignAutoSub }, { k: 'fixed', l: t.assignFixed, s: t.assignFixedSub }, { k: 'alternate', l: t.assignAlt, s: t.assignAltSub }]}
              />
              {task.assign_mode === 'fixed' ? (
                <Pressable onPress={() => set({ fixed_assignee: task.fixed_assignee === me.id ? partner.id : me.id })} style={s.fixedRow}>
                  <Avatar initial={task.fixed_assignee === partner.id ? partner.initial : me.initial} color={task.fixed_assignee === partner.id ? partner.color : me.color} size={22} />
                  <Text style={s.rowSub}>{f(t.fixedWho, { name: fixedName })}</Text>
                </Pressable>
              ) : null}
            </Card>
          </Section>}

          {/* Options */}
          {task.short ? null : <Section label={t.secOptions}>
            <Card r={14} padding={0} style={s.optCard}>
              <OptionRow first title={t.optDivisible} sub={t.optDivisibleSub} control={<Toggle on={!!task.divisible} onChange={v => set({ divisible: v })} />} />
              <OptionRow title={t.optExpense} sub={t.optExpenseSub} control={<Toggle on={!!task.has_expense} onChange={v => set({ has_expense: v })} />} />
              <OptionRow title={t.optNote} sub={task.note ? <LinkText>{f(t.optNoteSub, { note: task.note })}</LinkText> : t.optNoteEmpty} control={<ChevronRight />} onPress={() => toggleOpen('note')} />
              {open === 'note' ? (
                <TextInput
                  value={task.note} onChangeText={v => set({ note: v })} placeholder={t.notePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)}
                  multiline cursorColor={colors.coral} selectionColor={colors.coral} style={s.noteInput}
                />
              ) : null}
            </Card>
          </Section>}
        </ScrollView>

        <TaskFooter>
          <TaskCTA label={copy.common.save} disabled={!task.title.trim()} onPress={() => {
            // fiche courte du 12 : la tâche du setup est mise à jour (le 12 se relit au retour)
            if (task.short) saveSetupTask(task);
            // vraie tâche → persistance (store + Supabase) ; démo → simple fermeture
            else if (task.real) saveRealTask(task).catch(e => console.warn('[14] sauvegarde échouée :', e?.message || e));
            // nouvelle tâche (FAB) : créée dans le foyer avec ses occurrences (6 sept 2026)
            else if (!id) createRealTask(task).catch(e => console.warn('[14] création échouée :', e?.message || e));
            router.back();
          }} />
        </TaskFooter>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  content: { paddingHorizontal: taskTokens.contentX, paddingBottom: 16 },
  hero: { paddingVertical: 10, paddingHorizontal: 12, marginBottom: 6, gap: 6 },
  typeRow: { flexDirection: 'row', gap: 6 },
  typePill: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 },
  heroTitle: { fontSize: 20, fontWeight: '600', letterSpacing: -0.8, color: colors.ink, padding: 0, lineHeight: 22 },
  whenCard: { paddingVertical: 9, paddingHorizontal: 11, marginBottom: 8 },
  freqRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 2, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: colors.line },
  windowRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, gap: 8 },
  rowTitle: { fontSize: 15, fontWeight: '500', color: colors.ink },
  rowSub: { fontSize: 12, color: colors.muted, fontWeight: '400', marginTop: 2 },
  picker: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.line },
  dayChip: { flex: 1, height: 30, borderRadius: 999, backgroundColor: taskTokens.chipBg, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 12, fontWeight: '600', color: colors.ink },
  grid: { flexDirection: 'row', gap: 5, marginBottom: 8 },
  painCard: { paddingVertical: 4, paddingHorizontal: 11, marginBottom: 8 },
  painRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 },
  painRowLine: { borderTopWidth: 1, borderTopColor: colors.line },
  assignCard: { paddingVertical: 8, paddingHorizontal: 10, marginBottom: 8 },
  fixedRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.line },
  optCard: { paddingVertical: 8, paddingHorizontal: 11, marginBottom: 10 },
  noteInput: { ...font.secondary, color: colors.ink, fontSize: 14, lineHeight: 19, minHeight: 48, marginTop: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.line, padding: 0 },
});
