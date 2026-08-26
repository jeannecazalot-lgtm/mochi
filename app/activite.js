// Écran 22 · Activité — fil du duo (pings, événements, moments Mochi). Recette : docs/recettes/22-activite.md
import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GlowBg, Card, Avatar, Mochi } from '../src/components/ui';
import { CenterHeader, ReplyChip } from '../src/components/social/extra';
import { taskById, byId, occurrences, me, streak, today } from '../src/demo';
import { activityFeed, replyPresets, partnerGender } from '../src/demo-social';
import copy from '../src/data/copy.json';
import { colors, space, radius, alpha, font } from '../src/theme';

const t = copy.activity;
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

// « {name} a terminé {task} ✅ » → segments, {task} en 600
function RichText({ template, vars, style }) {
  const parts = template.split(/(\{task\})/);
  return (
    <Text style={style}>
      {parts.map((p, i) => p === '{task}'
        ? <Text key={i} style={{ fontWeight: '600' }}>{vars.task}</Text>
        : <Text key={i}>{fill(p, vars)}</Text>)}
    </Text>
  );
}

const dayLabel = (date) => {
  const diff = Math.round((today - date) / 86400000);
  if (diff === 0) return t.today;
  if (diff === 1) return t.yesterday;
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
};

function Replies({ item, keys, chosen, onChoose }) {
  return (
    <View style={s.replies}>
      {keys.map(k => <ReplyChip key={k} label={t.replies[k]} selected={chosen === k} onPress={() => onChoose(item.id, k)} />)}
    </View>
  );
}

function Item({ item, chosen, onChoose }) {
  const actor = item.actor_id ? byId(item.actor_id) : null;
  const task = item.task_id ? taskById(item.task_id) : null;
  const head = (content) => (
    <View style={s.head}>
      {actor ? <Avatar initial={actor.initial} color={actor.color} size={28} /> : null}
      <View style={{ flex: 1 }}>{content}</View>
      <Text style={s.time}>{item.time}</Text>
    </View>
  );

  if (item.type === 'task_done') {
    return (
      <Card r={radius.card} padding={0} style={s.card}>
        {head(<RichText template={t.taskDone} vars={{ name: actor.first_name, task: task.title.toLowerCase() }} style={s.body} />)}
        {actor.id !== me.id ? <Replies item={item} keys={replyPresets.task_done} chosen={chosen} onChoose={onChoose} /> : null}
      </Card>
    );
  }
  if (item.type === 'ping') {
    const occ = occurrences.find(o => o.task_id === item.task_id && o.assignee_id === item.target_id);
    const when = occ?.time || occ?.badge || null;
    return (
      <Card r={radius.card} padding={0} style={s.card}>
        {head(<Text style={s.bodyQuote}>« {fill(copy.pings[item.preset_key] || '', { task: task.title })} »</Text>)}
        <View style={s.attach}>
          <Text style={{ fontSize: 16 }}>{task.emoji}</Text>
          <Text style={s.attachText}>{task.title}{when ? ` · ${when}` : ''}</Text>
          <Pressable onPress={() => router.push(`/task/${task.id}`)} hitSlop={8}><Text style={s.view}>{t.view}</Text></Pressable>
        </View>
        {item.target_id === me.id ? <Replies item={item} keys={replyPresets.ping} chosen={chosen} onChoose={onChoose} /> : null}
      </Card>
    );
  }
  if (item.type === 'swap_proposed' || item.type === 'swap_accepted') {
    const proposed = item.type === 'swap_proposed';
    return (
      <Card r={radius.card} padding={0} style={s.card} accent={proposed ? colors.lavender : undefined}>
        {head(<RichText template={proposed ? t.swapProposed : t.swapAccepted} vars={{ name: actor.first_name, task: task.title.toLowerCase() }} style={s.body} />)}
        {proposed ? (
          <>
            <Text style={s.debt}>{fill(t.swapDebt, { pronoun: partnerGender === 'f' ? t.pronounShe : t.pronounHe })}</Text>
            <View style={s.actions}>
              <Pressable onPress={() => onChoose(item.id, 'accept')} style={[s.btn, s.btnDark, chosen === 'decline' && { opacity: 0.4 }]}><Text style={s.btnDarkText}>{t.accept}</Text></Pressable>
              <Pressable onPress={() => onChoose(item.id, 'decline')} style={[s.btn, s.btnLight, chosen === 'accept' && { opacity: 0.4 }]}><Text style={s.btnLightText}>{t.decline}</Text></Pressable>
            </View>
          </>
        ) : null}
      </Card>
    );
  }
  // mochi_moment
  return (
    <Card r={radius.row} padding={0} style={s.moment} accent={colors.butter}>
      <View style={{ alignItems: 'center', marginBottom: 6 }}><Mochi size={34} mood="happy" /></View>
      <Text style={s.momentTitle}>{t.mochiRebalance}</Text>
      <Text style={s.momentSub}>{fill(t.mochiStreak, { n: streak.days })}</Text>
    </Card>
  );
}

export default function Activite() {
  const [chosen, setChosen] = useState({});
  const choose = (id, key) => {
    Haptics.selectionAsync().catch(() => {});
    setChosen(c => ({ ...c, [id]: c[id] === key ? null : key }));
    // TODO Supabase : insérer la réponse préformatée (type reply, preset_key) dans activity
  };

  const groups = [];
  activityFeed.forEach(it => {
    const label = dayLabel(it.at);
    let g = groups.find(x => x.label === label);
    if (!g) { g = { label, items: [] }; groups.push(g); }
    g.items.push(it);
  });

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <CenterHeader title={t.title} onBack={() => router.back()} />
        <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
          {groups.map(g => (
            <React.Fragment key={g.label}>
              <Text style={s.day}>{g.label}</Text>
              {g.items.map(it => <Item key={it.id} item={it} chosen={chosen[it.id]} onChoose={choose} />)}
            </React.Fragment>
          ))}
          <Text style={s.note}>{t.note}</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  list: { paddingTop: 10, paddingHorizontal: space.screenX, paddingBottom: 40, gap: 8 },
  day: { alignSelf: 'center', fontSize: 10.5, fontWeight: '500', letterSpacing: 1.4, textTransform: 'uppercase', color: colors.muted },
  card: { paddingVertical: 13, paddingHorizontal: 14 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  body: { fontSize: 15, fontWeight: '500', color: colors.ink },
  bodyQuote: { fontSize: 15.5, fontWeight: '500', color: colors.ink },
  time: { fontSize: 11, fontWeight: '500', color: colors.muted, ...font.tabular },
  replies: { flexDirection: 'row', gap: 5, marginTop: 9, marginLeft: 38, flexWrap: 'wrap' },
  attach: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 9, marginLeft: 38, backgroundColor: alpha(colors.ink, 0.04), borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10 },
  attachText: { flex: 1, fontSize: 13.5, fontWeight: '500', color: colors.ink },
  view: { fontSize: 12, fontWeight: '600', color: colors.sageDeep },
  debt: { ...font.caption, marginTop: 4, marginLeft: 38 },
  actions: { flexDirection: 'row', gap: 6, marginTop: 9, marginLeft: 38 },
  btn: { flex: 1, borderRadius: radius.pill, paddingVertical: 8, paddingHorizontal: 13, alignItems: 'center' },
  btnDark: { backgroundColor: colors.ink },
  btnDarkText: { fontSize: 14, fontWeight: '600', color: colors.card },
  btnLight: { backgroundColor: alpha(colors.ink, 0.05) },
  btnLightText: { fontSize: 14, fontWeight: '500', color: colors.ink },
  moment: { alignSelf: 'center', minWidth: 230, alignItems: 'center', paddingVertical: 11, paddingHorizontal: 16 },
  momentTitle: { fontSize: 14.5, fontWeight: '600', letterSpacing: -0.2, color: colors.ink },
  momentSub: { ...font.caption, marginTop: 3 },
  note: { ...font.caption, fontSize: 11.5, textAlign: 'center', lineHeight: 17, marginTop: 3 },
});
