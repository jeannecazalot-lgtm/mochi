// Écran 22 · Activité — fil du duo (pings, événements, moments Mochi). Recette : docs/recettes/22-activite.md
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GlowBg, Card, Avatar, Mochi } from '../src/components/ui';
import { CenterHeader, ReplyChip } from '../src/components/social/extra';
import { taskById, byId, occurrences, me, streak, today } from '../src/demo';
import { activityFeed, replyPresets } from '../src/demo-social';
import { react } from '../src/activity-actions';
import { computeRealBalance } from '../src/balance-real';
import { read } from '../src/store';
import { loadSetup, setup, inRealMode } from '../src/setup-state';
import { missionDone, occStore } from '../src/demo-core';
import { useIdentity, getUid } from '../src/identity';
import { mySwaps, resolveSwap } from '../src/swap-actions';
import { partner } from '../src/demo';
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

const dayLabel = (date, now = today) => {
  const diff = Math.round((now - date) / 86400000);
  if (diff === 0) return t.today;
  if (diff === 1) return t.yesterday;
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
};

function Replies({ item, keys, chosen, onChoose, name }) {
  return (
    <View style={s.replies}>
      {keys.map(k => <ReplyChip key={k} label={fill(t.replies[k], { name })} selected={chosen === k} onPress={() => onChoose(item.id, k)} />)}
    </View>
  );
}

// Suivi façon messagerie (décision Jeanne 13 sept 2026) : mes actions d'un côté, celles de l'autre
// de l'autre, « tu as … » quand c'est moi ; rappels, reprises et rendus soulignés (filet corail).
const HIGHLIGHT = new Set(['reminder', 'budgetRemind', 'tookOver', 'gaveBack', 'swap_proposed']);
// Variantes de présentation proposées à Jeanne (13 sept 2026, « j'aime pas la présentation ») :
//   a · cartes alignées (moi à droite, l'autre à gauche)   b · bulles façon messagerie, sans carte
//   c · une colonne pleine largeur, filet corail à gauche pour rappels / reprises
function Wrap({ variant, mine, highlight, children, style }) {
  if (variant === 'b') return <View style={[s.bub, mine ? s.bubMine : s.bubTheirs, highlight && s.bubHi, style]}>{children}</View>;
  // C colorée (choix Jeanne 14 sept 2026) : une colonne, cartes teintées — moi sauge, l'autre crème, corail quand ça demande une réponse
  if (variant === 'c') return <View style={[s.card, s.cCard, mine ? s.cMine : s.cTheirs, highlight && s.cHi, style]}>{children}</View>;
  return <Card r={radius.card} padding={0} style={[s.card, highlight && s.highlight, style]}>{children}</Card>;
}
function Item({ item, chosen, onChoose, variant = 'a' }) {
  const actor = item.actor_id ? byId(item.actor_id) : null;
  const mine = actor?.id === me.id;
  const hi = item.type === 'info' ? HIGHLIGHT.has(item.preset) : item.type === 'swap_proposed';
  const task = item.task_title ? { title: item.task_title } : item.task_id ? taskById(item.task_id) : null;
  const head = (content) => (variant === 'b' || variant === 'c' ? (
    <View>
      {hi ? <Text style={s.bubTag}>{item.type === 'swap_proposed' ? t.tagSwap : item.preset === 'tookOver' || item.preset === 'gaveBack' ? t.tagTake : t.tagReminder}</Text> : null}
      <View style={s.head}>
        {actor && !mine ? <Avatar initial={actor.initial} color={actor.color} photo={actor.avatar_url} size={24} /> : null}
        <View style={{ flex: 1 }}>{content}</View>
      </View>
      <Text style={[s.time, { alignSelf: 'flex-end', marginTop: 4 }]}>{item.time}</Text>
    </View>
  ) : (
    <View style={s.head}>
      {actor ? <Avatar initial={actor.initial} color={actor.color} photo={actor.avatar_url} size={28} /> : null}
      <View style={{ flex: 1 }}>{content}</View>
      <Text style={s.time}>{item.time}</Text>
    </View>
  ));

  if (item.type === 'task_done') {
    return (
      <Wrap variant={variant} mine={mine} highlight={hi}>
        {head(<RichText template={mine ? t.taskDoneMe : t.taskDone} vars={{ name: actor.first_name, task: task.title.toLowerCase() }} style={s.body} />)}
        {actor.id !== me.id ? <Replies item={item} keys={replyPresets.task_done} chosen={chosen} onChoose={onChoose} name={actor.first_name} /> : null}
        {/* la réaction de l'autre sous MA mission terminée (fil réel) */}
        {item.reaction ? <Text style={s.debt}>{fill(t.reactionFrom, { name: item.reaction.name, reply: fill(t.replies[item.reaction.key] || item.reaction.key, { name: me.first_name }) })}</Text> : null}
      </Wrap>
    );
  }
  if (item.type === 'ping') {
    const occ = occurrences.find(o => o.task_id === item.task_id && o.assignee_id === item.target_id);
    const when = occ?.time || occ?.badge || null;
    return (
      <Wrap variant={variant} mine={mine} highlight={hi}>
        {head(<RichText template={copy.pings[item.preset_key] || ''} vars={{ task: task.title.toLowerCase() + (when ? ` · ${when}` : '') }} style={s.body} />)}
        {item.target_id === me.id ? <Replies item={item} keys={replyPresets.ping} chosen={chosen} onChoose={onChoose} /> : null}
      </Wrap>
    );
  }
  if (item.type === 'swap_proposed' || item.type === 'swap_accepted') {
    const proposed = item.type === 'swap_proposed';
    return (
      <Wrap variant={variant} mine={mine} highlight={hi} style={proposed && variant === 'a' ? { borderColor: colors.lavender, borderWidth: 1.5 } : null}>
        {head(<RichText template={proposed ? t.swapProposed : mine ? t.swapAcceptedMe : t.swapAccepted} vars={{ name: actor.first_name, task: task.title.toLowerCase() }} style={s.body} />)}
        {proposed ? (
          <>
            <View style={s.actions}>
              <Pressable onPress={() => onChoose(item.id, 'accept')} style={[s.btn, s.btnDark, chosen === 'decline' && { opacity: 0.4 }]}><Text style={s.btnDarkText}>{t.accept}</Text></Pressable>
              <Pressable onPress={() => onChoose(item.id, 'decline')} style={[s.btn, s.btnLight, chosen === 'accept' && { opacity: 0.4 }]}><Text style={s.btnLightText}>{t.decline}</Text></Pressable>
            </View>
          </>
        ) : null}
      </Wrap>
    );
  }
  // info préformatée (je m'en occupe, règle changée, tâche ajoutée — 7 sept 2026)
  if (item.type === 'info') {
    return (
      <Wrap variant={variant} mine={mine} highlight={hi}>
        {head(<Text style={s.body}>{item.text}</Text>)}
      </Wrap>
    );
  }
  // mochi_moment
  return (
    <Card r={radius.row} padding={0} style={s.moment} accent={colors.butter}>
      <View style={{ alignItems: 'center', marginBottom: 6 }}><Mochi size={34} mood="happy" /></View>
      <Text style={s.momentTitle}>{t.mochiRebalance}</Text>
      <Text style={s.momentSub}>{fill(t.mochiStreak, { n: item.streak ?? streak.days })}</Text>
    </Card>
  );
}

export default function Activite() {
  const { v: variant = 'c', demo: demoParam } = useLocalSearchParams();
  const [chosen, setChosen] = useState({});
  const choose = (id, key) => {
    Haptics.selectionAsync().catch(() => {});
    setChosen(c => ({ ...c, [id]: c[id] === key ? null : key }));
    // repassage réel : Accepter change le porteur de l'occurrence, Refuser la laisse
    const sw = realItems?.find(x => x.id === id && x.swap_id);
    // la carte part tout de suite (retour Jeanne 3 sept : « la notif devrait partir »)
    if (sw) {
      setRealItems(items => items.filter(x => x.id !== id));
      resolveSwap(sw.swap_id, key === 'accept').then(() => occStore.bump()).catch(() => {});
      return;
    }
    // réaction rapide réelle (table activity) sous une mission terminée par l'autre
    const done = realItems?.find(x => x.id === id && x.type === 'task_done');
    if (done && key) react(String(id), key).catch(() => {});
  };

  // Branchement réel (2 sept 2026, retour Jeanne « encore du simulator ») :
  // en mode réel, le fil montre les VRAIES validations — rien d'inventé.
  useIdentity();
  const occV = occStore.useVersion();
  missionDone.useVersion();
  const [realItems, setRealItems] = useState(null);
  useEffect(() => {
    (async () => {
      await loadSetup();
      // Réel dès qu'on a un foyer, même vide (retour test à deux, 3 sept 2026 :
      // le fil de démo montrait des notifs inertes — Accepter/émoji sans effet)
      if (!inRealMode()) return;
      const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]);
      const byTask = Object.fromEntries(tasks.map(tk => [tk.id, tk]));
      const hhmm = d => new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(d));
      const occById = Object.fromEntries(occs.map(o => [o.id, o]));
      const titleOf = occId2 => (byTask[occById[occId2]?.task_id]?.title || '…').toLowerCase();
      const dones = occs.filter(o => o.status === 'done' && o.done_at).map(o => ({
        id: o.id, type: 'task_done', actor_id: o.done_by && o.done_by !== getUid() ? partner.id : me.id,
        task_title: (byTask[o.task_id]?.title || '…').toLowerCase(),
        at: new Date(o.done_at), time: hhmm(o.done_at),
      }));
      // repassages réels : propositions qui M'attendent (Accepter/Refuser) + acceptées
      const { pending, resolved } = await mySwaps();
      const swaps = [
        ...pending.map(sw => ({ id: sw.id, swap_id: sw.id, type: 'swap_proposed', actor_id: partner.id, task_title: titleOf(sw.occurrence_id), at: new Date(sw.created_at), time: hhmm(sw.created_at) })),
        ...resolved.filter(sw => sw.status === 'accepted').map(sw => ({ id: sw.id, type: 'swap_accepted', actor_id: sw.to_user === getUid() ? me.id : partner.id, task_title: titleOf(sw.occurrence_id), at: new Date(sw.resolved_at || sw.created_at), time: hhmm(sw.resolved_at || sw.created_at) })),
      ];
      // table activity : réactions (sous la mission concernée) + infos préformatées
      const uid = getUid();
      const acts = await read('activity');
      const mineReact = {};
      for (const a of acts) {
        if (a.type !== 'ping_reply' || !a.occurrence_id) continue;
        if (a.actor_id === uid) mineReact[a.occurrence_id] = a.preset_key;
        else { const d = dones.find(x => x.id === a.occurrence_id); if (d) d.reaction = { name: partner.first_name, key: a.preset_key }; }
      }
      if (Object.keys(mineReact).length) setChosen(c => ({ ...mineReact, ...c }));
      const infos = acts.filter(a => a.type === 'ping' && t.presets[a.preset_key]).map(a => ({
        id: a.id, type: 'info', preset: a.preset_key, actor_id: a.actor_id === uid ? me.id : partner.id,
        text: fill((a.actor_id === uid && t.presetsMe[a.preset_key]) || t.presets[a.preset_key], { name: a.actor_id === uid ? me.first_name : partner.first_name, ...(a.payload || {}) }),
        at: new Date(a.created_at), time: hhmm(a.created_at),
      }));
      // carte « Soirée équilibrée » : hier tout était fait → streak réel (proto du 2 sept, validé le 7 sept)
      const moments = [];
      const sd = uid ? computeRealBalance(occs, uid).streakDays : 0;
      if (sd > 0) { const y = new Date(); y.setDate(y.getDate() - 1); y.setHours(21, 0, 0, 0); moments.push({ id: 'streak', type: 'mochi_moment', at: y, time: '', streak: sd }); }
      setRealItems([...dones, ...swaps, ...infos, ...moments].sort((a, b) => b.at - a.at));
    })();
  }, [occV]);

  const real = realItems != null && demoParam !== '1';
  const now = real ? new Date() : today;
  const groups = [];
  (real ? realItems : activityFeed).forEach(it => {
    const label = dayLabel(it.at, now);
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
          {real && groups.length === 0
            ? <Text style={[font.secondary, { textAlign: 'center', paddingVertical: 24 }]}>{t.emptyReal}</Text>
            : groups.map((g, gi) => (
              <React.Fragment key={g.label}>
                <Text style={s.day}>{g.label}</Text>
                {g.items.map(it => (
                  <View key={it.id} style={[it.type === 'mochi_moment' || variant === 'c' ? null : [s.bubble, it.actor_id === me.id ? s.bubbleMine : s.bubbleTheirs], (chosen[it.id] || gi > 0) && { opacity: chosen[it.id] ? 0.45 : 0.7 }]}>
                    <Item item={it} chosen={chosen[it.id]} onChoose={choose} variant={variant} />
                  </View>
                ))}
              </React.Fragment>
            ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  list: { paddingTop: 10, paddingHorizontal: space.screenX, paddingBottom: 40, gap: 8 },
  day: { alignSelf: 'center', fontSize: 10.5, fontWeight: '500', letterSpacing: 1.4, textTransform: 'uppercase', color: colors.muted },
  card: { paddingVertical: 13, paddingHorizontal: 14 },
  highlight: { borderColor: colors.coral, borderWidth: 1.5 },
  bubble: { width: '86%' },
  bub: { paddingVertical: 10, paddingHorizontal: 13, borderRadius: 18 },
  bubMine: { backgroundColor: alpha(colors.sage, 0.35), borderBottomRightRadius: 6 },
  bubTheirs: { backgroundColor: colors.card, borderBottomLeftRadius: 6, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  bubHi: { backgroundColor: alpha(colors.coral, 0.16) },
  cCard: { borderRadius: radius.card, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.hairline },
  cMine: { backgroundColor: alpha(colors.sage, 0.3) },
  cTheirs: { backgroundColor: colors.card },
  cHi: { backgroundColor: alpha(colors.coral, 0.16), borderColor: alpha(colors.coral, 0.5) },
  bubTag: { fontSize: 10.5, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: colors.coralDeep, marginBottom: 4 },
  bubbleMine: { alignSelf: 'flex-end' },
  bubbleTheirs: { alignSelf: 'flex-start' },
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
});
