// Écran 15 · Tâche mentale — planifier ≠ exécuter. Recette : docs/recettes/15-tache-mentale.md
// `?id=` optionnel (défaut : la tâche mentale de démo). Tap sur l'avatar = bascule moi/binôme. Pas de persistance.
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, Avatar } from '../../src/components/ui';
import { TaskHeader, Chip, ChevronRight, TaskCTA, TaskFooter, taskTokens } from '../../src/components/task/extra';
import { loadTask, me, partner, byId, fmtMin } from '../../src/demo-task';
import copy from '../../src/data/copy.json';
import { colors, alpha } from '../../src/theme';

const f = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
const DEFAULT_ID = 't-pediatre';

export default function TaskMentale() {
  const { id } = useLocalSearchParams();
  const t = copy.task;
  const [task] = useState(() => loadTask(id || DEFAULT_ID));
  const mental = task.mental || { plan: { desc: '', who: partner.id }, exec: { desc: '', who: me.id, duration_min: task.duration_min } };
  const [planWho, setPlanWho] = useState(mental.plan.who);
  const [execWho, setExecWho] = useState(mental.exec.who);
  const [note, setNote] = useState(task.note || '');
  const [editNote, setEditNote] = useState(false);
  const swap = uid => (uid === me.id ? partner.id : me.id);

  const halves = [
    { n: '1', l: t.planLabel, d: mental.plan.desc, who: planWho, onWho: () => setPlanWho(swap(planWho)), tag: t.mentalTag, win: mental.plan.deadline_day ? f(t.beforeDay, { day: mental.plan.deadline_day, n: mental.plan.deadline_num }) : t.windowNone },
    { n: '2', l: t.execLabel, d: mental.exec.desc, who: execWho, onWho: () => setExecWho(swap(execWho)), tag: fmtMin(mental.exec.duration_min || task.duration_min), win: t.dayJ },
  ];

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="soft" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <TaskHeader title={t.headerMental} backLabel={t.back} />

        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Card r={18} padding={0} accent={colors.lavender} style={s.hero}>
            <View style={{ flexDirection: 'row', gap: 5, marginBottom: 6 }}><PillLabel color={colors.lavenderDeep}>{t.catMental}</PillLabel></View>
            <Text style={s.heroTitle}>{task.title}</Text>
            <Text style={s.heroSub}>{t.mentalIntro}</Text>
          </Card>

          {halves.map((p, i) => {
            const who = byId(p.who);
            return (
              <View key={p.n}>
                <Card r={15} padding={0} style={[s.half, { marginBottom: i === 0 ? 6 : 14 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={s.num}><Text style={s.numText}>{p.n}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.halfTitle}>{p.l}</Text>
                      <Text style={s.halfSub}>{p.d}</Text>
                      <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
                        <Chip small tone="muted">{p.tag}</Chip>
                        <Chip small tone="coralSoft">{p.win}</Chip>
                      </View>
                    </View>
                    <Pressable onPress={p.onWho} hitSlop={8} accessibilityLabel={who.first_name}>
                      <Avatar initial={who.initial} color={who.color} size={26} />
                    </Pressable>
                  </View>
                </Card>
                {i === 0 ? <View style={s.link}><View style={s.linkLine} /></View> : null}
              </View>
            );
          })}

          <Pressable onPress={() => setEditNote(v => !v)} style={s.noteRow}>
            <Text style={{ fontSize: 18 }}>📝</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.noteTitle}>{t.noteAttached}</Text>
              {editNote
                ? <TextInput value={note} onChangeText={setNote} placeholder={t.notePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)} multiline autoFocus cursorColor={colors.coral} selectionColor={colors.coral} style={s.noteInput} />
                : <Text style={s.noteSub}>{note ? `« ${note} »` : t.optNoteEmpty}</Text>}
            </View>
            <ChevronRight />
          </Pressable>
        </ScrollView>

        <TaskFooter>
          <TaskCTA label={t.saveBoth} onPress={() => router.back()} />
        </TaskFooter>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  content: { paddingHorizontal: taskTokens.contentX, paddingBottom: 16 },
  hero: { paddingVertical: 12, paddingHorizontal: 14, marginBottom: 10 },
  heroTitle: { fontSize: 20, fontWeight: '600', letterSpacing: -0.8, lineHeight: 22, color: colors.ink },
  heroSub: { fontSize: 13, color: colors.muted, fontWeight: '400', marginTop: 3 },
  half: { paddingVertical: 9, paddingHorizontal: 11 },
  num: { width: 26, height: 26, borderRadius: 13, backgroundColor: taskTokens.circleBg, alignItems: 'center', justifyContent: 'center' },
  numText: { fontSize: 14, fontWeight: '600', color: colors.ink },
  halfTitle: { fontSize: 16.5, fontWeight: '600', color: colors.ink },
  halfSub: { fontSize: 12, color: colors.muted, fontWeight: '400', marginTop: 2 },
  link: { alignItems: 'center', marginBottom: 4 },
  linkLine: { width: 1.5, height: 10, backgroundColor: taskTokens.linkLine },
  noteRow: { backgroundColor: colors.glass, borderWidth: 0.5, borderColor: colors.line, borderRadius: 14, paddingVertical: 8, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 8 },
  noteTitle: { fontSize: 14.5, fontWeight: '500', color: colors.ink },
  noteSub: { fontSize: 12, color: colors.muted, fontWeight: '400', marginTop: 2 },
  noteInput: { fontSize: 13, color: colors.ink, marginTop: 2, padding: 0, minHeight: 36 },
});
