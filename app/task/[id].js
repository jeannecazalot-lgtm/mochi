// Écran 16 · Détail tâche + mini-historique. Recette : docs/recettes/16-detail-tache.md
// Route `/task/<id>` ; bouton ··· → /task/edit?id=. Checklist et « Marquer fait » en état local.
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, Avatar, Micro } from '../../src/components/ui';
import { LiveMochi, Animated, useCheckPop } from '../../src/components/motion';
import { TaskHeader, RoundButton, CheckMark, TaskCTA, TaskFooter, taskTokens } from '../../src/components/task/extra';
import { loadTask, lastFive, historyCounts, currentAssignee, currentDay, fmtDay, fmtWeekday, me, partner, byId } from '../../src/demo-task';
import { occurrences, fmtMin } from '../../src/demo';
import copy from '../../src/data/copy.json';
import { colors } from '../../src/theme';

const f = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));

function CheckRow({ item, first, onToggle }) {
  const pop = useCheckPop(item.done);
  return (
    <Pressable onPress={onToggle} style={[s.checkRow, !first && s.checkRowLine]}>
      <Animated.View style={[s.box, item.done ? s.boxDone : s.boxTodo, pop]}>{item.done ? <CheckMark /> : null}</Animated.View>
      <Text style={[s.checkText, item.done && { textDecorationLine: 'line-through', opacity: 0.5 }]}>{item.label}</Text>
    </Pressable>
  );
}

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  const t = copy.task;
  const task = loadTask(id);
  const [checklist, setChecklist] = useState(task.checklist || []);
  const [done, setDone] = useState(false);

  const mental = !!task.mental_load;
  const assignee = currentAssignee(occurrences, task.id);
  const day = currentDay(occurrences, task.id);
  const sub = [
    assignee ? (assignee.id === me.id ? t.youThisWeek : f(t.partnerThisWeek, { name: assignee.first_name })) : t.nobodyThisWeek,
    day ? fmtWeekday(day) : null,
    f(t.approx, { dur: fmtMin(task.duration_min) }),
    task.divisible ? t.divisibleTag : null,
  ].filter(Boolean).join(' · ');

  const hist = lastFive(task.id);
  const counts = historyCounts(task.id);
  const summary = Math.abs(counts.me - counts.partner) <= 1
    ? f(t.histBalanced, { p: counts.partner, name: partner.first_name, m: counts.me })
    : f(t.histLeaning, { who: counts.partner > counts.me ? partner.first_name : t.you, p: counts.partner, name: partner.first_name, m: counts.me });
  const author = task.checklist_by ? byId(task.checklist_by) : null;

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <TaskHeader
          title={t.headerDetail} backLabel={t.back}
          right={<RoundButton label={t.more} onPress={() => router.push(`/task/edit?id=${task.id || ''}`)}><Text style={s.more}>···</Text></RoundButton>}
        />

        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <Card r={18} padding={0} style={s.hero}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
              <LiveMochi size={56} mood={done ? 'wink' : 'happy'} />
              <View style={{ flex: 1 }}>
                <View style={{ marginBottom: 4 }}><PillLabel color={mental ? colors.lavenderDeep : colors.sageDeep}>{mental ? t.catMental : t.catDomestic}</PillLabel></View>
                <Text style={s.heroTitle}>{task.title}</Text>
                <Text style={s.heroSub}>{sub}</Text>
              </View>
            </View>
          </Card>

          {checklist.length ? (
            <>
              <Micro style={s.label}>{author ? f(t.checklistBy, { name: author.first_name }) : t.optNote}</Micro>
              <Card r={14} padding={0} style={s.listCard}>
                {checklist.map((c, i) => (
                  <CheckRow key={c.id} item={c} first={i === 0} onToggle={() => setChecklist(l => l.map(x => (x.id === c.id ? { ...x, done: !x.done } : x)))} />
                ))}
              </Card>
            </>
          ) : null}

          <Micro style={s.label}>{t.lastFive}</Micro>
          <Card r={14} padding={0} style={s.histCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              {hist.map((h, i) => {
                const who = byId(h.who);
                return (
                  <View key={i} style={{ alignItems: 'center', gap: 4 }}>
                    <Avatar initial={who.initial} color={who.color} photo={who.avatar_url} size={30} />
                    <Text style={s.histDate}>{fmtDay(h.at)}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={s.histSum}>{summary}</Text>
          </Card>
        </ScrollView>

        <TaskFooter bottom={16}>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <TaskCTA label={done ? t.markedDone : t.markDone} onPress={() => setDone(v => !v)} />
            <Text style={s.hint}>{t.swipeHint}</Text>
          </View>
        </TaskFooter>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  content: { paddingHorizontal: taskTokens.contentX, paddingBottom: 16 },
  more: { fontSize: 15, color: colors.ink, fontWeight: '600', letterSpacing: 1 },
  hero: { paddingVertical: 12, paddingHorizontal: 14, marginBottom: 8 },
  heroTitle: { fontSize: 20, fontWeight: '600', letterSpacing: -0.7, lineHeight: 22, color: colors.ink },
  heroSub: { fontSize: 12, color: colors.muted, fontWeight: '400', marginTop: 2 },
  label: { marginBottom: 5 },
  listCard: { paddingVertical: 8, paddingHorizontal: 11, marginBottom: 8 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9 },
  checkRowLine: { borderTopWidth: 1, borderTopColor: colors.line },
  box: { width: 18, height: 18, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  boxTodo: { borderWidth: 1.5, borderColor: colors.checkRing },
  boxDone: { backgroundColor: colors.sage },
  checkText: { fontSize: 14.5, fontWeight: '400', color: colors.ink, flex: 1 },
  histCard: { paddingVertical: 9, paddingHorizontal: 13, marginBottom: 8 },
  histDate: { fontSize: 9.5, color: colors.muted, fontWeight: '500' },
  histSum: { fontSize: 12, color: colors.muted, fontWeight: '400', marginTop: 7, textAlign: 'center' },
  hint: { fontSize: 12, color: colors.muted, fontWeight: '400' },
});
