// Écran 14 · Fiche tâche (création / édition). Recette : docs/recettes/14-fiche-tache.md
// `?id=` optionnel : pré-remplit depuis demo ; sinon fiche vierge. États locaux, pas de persistance.
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, Avatar } from '../../src/components/ui';
import { TaskHeader, Section, Toggle, Chip, StatTile, Stars, Segmented, OptionRow, ChevronRight, TaskCTA, TaskFooter, taskTokens } from '../../src/components/task/extra';
import { loadTask, frequencies, durations, dayKeys, deadlines, me, partner, fmtMinShort, fmtStars, fmtHour } from '../../src/demo-task';
import copy from '../../src/data/copy.json';
import { colors, alpha, font } from '../../src/theme';

const f = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
const FREQ_KEY = { daily: 'freqDaily', twiceWeek: 'freqTwiceWeek', weekly: 'freqWeekly', monthly: 'freqMonthly', once: 'freqOnce' };
const next = (list, v) => list[(list.indexOf(v) + 1) % list.length];

export default function TaskEdit() {
  const { id } = useLocalSearchParams();
  const t = copy.task;
  const [task, setTask] = useState(() => loadTask(id));
  const [open, setOpen] = useState(null); // 'window' | 'pain' | 'note'
  const set = patch => setTask(x => ({ ...x, ...patch }));
  const toggleOpen = k => setOpen(o => (o === k ? null : k));

  const mental = !!task.mental_load;
  const accent = mental ? colors.lavender : colors.sage;
  const catColor = mental ? colors.lavenderDeep : colors.sageDeep;
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
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <TaskHeader title={t.headerEdit} backLabel={t.back} />

        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Héro */}
          <Card r={18} padding={0} accent={accent} style={s.hero}>
            <PillLabel color={catColor}>{mental ? t.catMental : t.catDomestic}</PillLabel>
            <TextInput
              value={task.title} onChangeText={v => set({ title: v })} placeholder={t.titlePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)}
              autoFocus={!task.id} autoCorrect={false} returnKeyType="done" cursorColor={colors.coral} selectionColor={colors.coral} style={s.heroTitle}
            />
          </Card>

          {/* Quand */}
          <Section label={t.secWhen}>
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
          </Section>

          {/* Détails */}
          <Section label={t.secDetails}>
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
          </Section>

          {/* Assignation */}
          <Section label={t.secAssign}>
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
          </Section>

          {/* Options */}
          <Section label={t.secOptions}>
            <Card r={14} padding={0} style={s.optCard}>
              <OptionRow first title={t.optDivisible} sub={t.optDivisibleSub} control={<Toggle on={!!task.divisible} onChange={v => set({ divisible: v })} />} />
              <OptionRow title={t.optMental} sub={t.optMentalSub} control={<Toggle on={mental} onChange={v => set({ mental_load: v })} />} />
              <OptionRow title={t.optExpense} sub={t.optExpenseSub} control={<Toggle on={!!task.has_expense} onChange={v => set({ has_expense: v })} />} />
              <OptionRow title={t.optNote} sub={task.note ? f(t.optNoteSub, { note: task.note }) : t.optNoteEmpty} control={<ChevronRight />} onPress={() => toggleOpen('note')} />
              {open === 'note' ? (
                <TextInput
                  value={task.note} onChangeText={v => set({ note: v })} placeholder={t.notePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)}
                  multiline autoFocus cursorColor={colors.coral} selectionColor={colors.coral} style={s.noteInput}
                />
              ) : null}
            </Card>
          </Section>
        </ScrollView>

        <TaskFooter>
          <TaskCTA label={copy.common.save} disabled={!task.title.trim()} onPress={() => router.back()} />
        </TaskFooter>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  content: { paddingHorizontal: taskTokens.contentX, paddingBottom: 16 },
  hero: { paddingVertical: 10, paddingHorizontal: 12, marginBottom: 6, gap: 6 },
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
