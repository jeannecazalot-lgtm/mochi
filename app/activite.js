// Écran 22 · Activité — fil du duo (pings, événements, moments Mochi). Recette : docs/recettes/22-activite.md
// DA v3 (4 nov 2026) : une colonne, un filet à gauche (sauge = moi, gris = l'autre, corail = à répondre), jour/nuit.
import { RouteError } from '../src/components/route-error';
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { FadeOut, LinearTransition } from 'react-native-reanimated';
import { Animated } from '../src/components/motion';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Avatar } from '../src/components/ui';
import { LiveMochiImage } from '../src/components/mochi-img';
import { useTokens, type, layout } from '../src/theme-v3';
import { Label } from '../src/components/mochi/gauges';
import { taskById, byId, occurrences, me, streak, today } from '../src/demo';
import { activityFeed, replyPresets } from '../src/demo-social';
import { react } from '../src/activity-actions';
import { pushToPartner } from '../src/push';
import { computeRealBalance } from '../src/balance-real';
import { read } from '../src/store';
import { loadSetup, setup, inRealMode } from '../src/setup-state';
import { missionDone, occStore } from '../src/demo-core';
import { useIdentity, getUid } from '../src/identity';
import { mySwaps, resolveSwap } from '../src/swap-actions';
import { partner } from '../src/demo';
import copy from '../src/copy';
import { radius } from '../src/theme';
import { LOCALE } from '../src/lang';
import { markSuiviSeen } from '../src/suivi-unread';

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
  return new Intl.DateTimeFormat(LOCALE, { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
};

function Replies({ T, item, keys, chosen, onChoose, name }) {
  const s = mk(T);
  return (
    <View style={s.replies}>
      {keys.map(k => <Pressable key={k} onPress={() => onChoose(item.id, k)} style={[s.chip, chosen === k && { backgroundColor: T.ink, borderColor: T.ink }]}><Text style={[type.label, { color: chosen === k ? T.bg : T.ink }]}>{fill(t.replies[k], { name })}</Text></Pressable>)}
    </View>
  );
}

// Suivi façon messagerie (décision Jeanne 13 sept 2026) : mes actions d'un côté, celles de l'autre
// de l'autre, « tu as … » quand c'est moi ; rappels, reprises et rendus soulignés (filet corail).
const HIGHLIGHT = new Set(['reminder', 'budgetRemind', 'tookOver', 'gaveBack', 'swap_proposed']);
// Variantes de présentation proposées à Jeanne (13 sept 2026, « j'aime pas la présentation ») :
//   a · cartes alignées (moi à droite, l'autre à gauche)   b · bulles façon messagerie, sans carte
//   c · une colonne pleine largeur, filet corail à gauche pour rappels / reprises
function Wrap({ T, mine, highlight, children, style }) {
  const s = mk(T);
  return <View style={[s.card, { borderLeftColor: highlight ? T.accent : mine ? T.ok : T.line }, style]}>{children}</View>;
}
function Item({ T, item, chosen, onChoose, variant = 'c' }) {
  const s = mk(T);
  const actor = item.actor_id ? byId(item.actor_id) : null;
  const mine = actor?.id === me.id;
  const hi = item.type === 'info' ? HIGHLIGHT.has(item.preset) : item.type === 'swap_proposed';
  const task = item.task_title ? { title: item.task_title } : item.task_id ? taskById(item.task_id) : null;
  const head = (content) => (
    <View>
      {hi ? <Text style={s.bubTag}>{item.type === 'swap_proposed' ? t.tagSwap : item.preset === 'tookOver' || item.preset === 'gaveBack' ? t.tagTake : t.tagReminder}</Text> : null}
      <View style={s.head}>
        {actor && !mine ? <Avatar initial={actor.initial} color={actor.color} photo={actor.avatar_url} size={24} /> : null}
        <View style={{ flex: 1 }}>{content}</View>
        <Text style={s.time}>{item.time}</Text>
      </View>
    </View>
  );

  if (item.type === 'partner_day') {
    const list = item.tasks.length > 3 ? `${item.tasks.slice(0, 3).join(', ')} ${fill(t.andMore, { n: item.tasks.length - 3 })}` : item.tasks.join(', ');
    return (
      <Wrap T={T} mine={false} highlight={false}>
        {head(<RichText template={item.tasks.length > 1 ? t.partnerDayMany : t.partnerDayOne} vars={{ name: actor.first_name, n: item.tasks.length, task: list }} style={s.body} />)}
        <Replies T={T} item={item} keys={['best', 'thanks']} chosen={chosen} onChoose={onChoose} name={actor.first_name} />
      </Wrap>
    );
  }
  if (item.type === 'task_done') {
    return (
      <Wrap T={T} mine={mine} highlight={hi}>
        {head(<RichText template={mine ? t.taskDoneMe : t.taskDone} vars={{ name: actor.first_name, task: task.title.toLowerCase() }} style={s.body} />)}
        {actor.id !== me.id ? <Replies T={T} item={item} keys={replyPresets.task_done} chosen={chosen} onChoose={onChoose} name={actor.first_name} /> : null}
        {/* la réaction de l'autre sous MA mission terminée (fil réel) */}
        {item.reaction ? <Text style={s.debt}>{fill(t.reactionFrom, { name: item.reaction.name, reply: fill(t.replies[item.reaction.key] || item.reaction.key, { name: me.first_name }) })}</Text> : null}
      </Wrap>
    );
  }
  if (item.type === 'ping') {
    const occ = occurrences.find(o => o.task_id === item.task_id && o.assignee_id === item.target_id);
    const when = occ?.time || occ?.badge || null;
    return (
      <Wrap T={T} mine={mine} highlight={hi}>
        {head(<RichText template={copy.pings[item.preset_key] || ''} vars={{ task: task.title.toLowerCase() + (when ? ` · ${when}` : '') }} style={s.body} />)}
        {item.target_id === me.id ? <Replies T={T} item={item} keys={replyPresets.ping} chosen={chosen} onChoose={onChoose} /> : null}
      </Wrap>
    );
  }
  if (item.type === 'swap_proposed' || item.type === 'swap_accepted') {
    const proposed = item.type === 'swap_proposed';
    return (
      <Wrap T={T} mine={mine} highlight={hi}>
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
      <Wrap T={T} mine={mine} highlight={hi}>
        {head(<Text style={s.body}>{item.text}</Text>)}
      </Wrap>
    );
  }
  // mochi_moment
  return (
    <View style={s.moment}>
      <LiveMochiImage size={44} lean={0} />
      <View style={{ flex: 1 }}>
        <Text style={s.momentTitle}>{t.mochiRebalance}</Text>
        <Label T={T} style={{ marginTop: 2 }}>{fill(t.mochiStreak, { n: item.streak ?? streak.days })}</Label>
      </View>
    </View>
  );
}

export default function Activite() {
  const T = useTokens();
  const s = mk(T);
  const { v: variant = 'c', demo: demoParam } = useLocalSearchParams();
  const [chosen, setChosen] = useState({});
  const choose = (id, key) => {
    Haptics.selectionAsync().catch(() => {});
    // une réponse envoyée (Bravo, Merci…) fait partir la ligne (retour Jeanne 13 nov 2026)
    setChosen(c => ({ ...c, [id]: key }));
    // repassage réel : Accepter change le porteur de l'occurrence, Refuser la laisse
    const sw = realItems?.find(x => x.id === id && x.swap_id);
    // la carte part tout de suite (retour Jeanne 3 sept : « la notif devrait partir »)
    if (sw) {
      setRealItems(items => items.filter(x => x.id !== id));
      resolveSwap(sw.swap_id, key === 'accept').then(() => occStore.bump()).catch(() => {});
      return;
    }
    // réaction rapide réelle (table activity) sous une mission terminée par l'autre
    const done = realItems?.find(x => x.id === id && x.type === 'partner_day');
    if (done && key) {
      const reply = fill(t.replies[key] || key, { name: partner.first_name }).trim();
      const now = new Date();
      setRealItems(items => [{ id: `sent-${id}`, type: 'info', preset: 'sent', actor_id: me.id, text: fill(t.reactionSent, { name: partner.first_name, reply }), at: now, time: new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit' }).format(now) }, ...(items || [])]);
      pushToPartner('reaction', { reply: fill(t.replies[key] || key, { name: partner.first_name }).trim() }); react(String(id), key).catch(() => {});
    }
  };

  // Branchement réel (2 sept 2026, retour Jeanne « encore du simulator ») :
  // en mode réel, le fil montre les VRAIES validations — rien d'inventé.
  useIdentity();
  const occV = occStore.useVersion();
  missionDone.useVersion();
  const [realItems, setRealItems] = useState(null);
  useEffect(() => { markSuiviSeen(); return () => { markSuiviSeen(); }; }, []); // la pastille de la bulle retombe à zéro
  useEffect(() => {
    (async () => {
      await loadSetup();
      // Réel dès qu'on a un foyer, même vide (retour test à deux, 3 sept 2026 :
      // le fil de démo montrait des notifs inertes — Accepter/émoji sans effet)
      if (!inRealMode()) return;
      const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]);
      const byTask = Object.fromEntries(tasks.map(tk => [tk.id, tk]));
      const hhmm = d => new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit' }).format(new Date(d));
      const occById = Object.fromEntries(occs.map(o => [o.id, o]));
      const titleOf = occId2 => (byTask[occById[occId2]?.task_id]?.title || '…').toLowerCase();
      // Suivi « entre vous deux » (Jeanne, 7 nov 2026) : plus la liste de ce que j'ai fait (c'est dans le Planning) ;
      // ce que l'AUTRE a fait, groupé par jour, avec un Bravo ; ses réactions à moi ; rappels, repassages, rééquilibrages.
      const uid0 = getUid();
      const theirs = occs.filter(o => o.status === 'done' && o.done_at && o.done_by && o.done_by !== uid0).sort((a, b) => String(b.done_at).localeCompare(String(a.done_at)));
      const byDay = {};
      for (const o of theirs) { const k = String(o.done_at).slice(0, 10); (byDay[k] ||= []).push(o); }
      const dones = Object.values(byDay).map(list => ({
        id: list[0].id, ids: list.map(o => o.id), type: 'partner_day', actor_id: partner.id,
        tasks: list.map(o => (byTask[o.task_id]?.title || '…').toLowerCase()),
        at: new Date(list[0].done_at), time: hhmm(list[0].done_at),
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
      const received = [];
      for (const a of acts) {
        if (a.type !== 'ping_reply' || !a.occurrence_id) continue;
        if (a.actor_id === uid) {
          const d = dones.find(x => x.ids.includes(a.occurrence_id)); if (d) mineReact[d.id] = a.preset_key;
          // ce que J'ai envoyé reste visible de mon côté (Ketley, TestFlight 12 nov 2026 : « je ne vois que les tiens »)
          received.push({ id: a.id, type: 'info', preset: 'sent', actor_id: me.id, text: fill(t.reactionSent, { name: partner.first_name, reply: fill(t.replies[a.preset_key] || a.preset_key, { name: partner.first_name }).trim() }), at: new Date(a.created_at), time: hhmm(a.created_at) });
        }
        else received.push({ id: a.id, type: 'info', preset: 'reaction', actor_id: partner.id, text: fill(t.reactionFrom, { name: partner.first_name, reply: fill(t.replies[a.preset_key] || a.preset_key, { name: me.first_name }).trim() }), at: new Date(a.created_at), time: hhmm(a.created_at) });
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

      setRealItems([...dones, ...received, ...swaps, ...infos, ...moments].sort((a, b) => b.at - a.at));
    })();
  }, [occV]);

  const real = realItems != null && demoParam !== '1';
  const now = real ? new Date() : today;
  const groups = [];
  // ce à quoi j'ai déjà répondu ne reste pas dans le fil (Bravo, Merci, Ok ce soir…)
  const answered = it => chosen[it.id] && (it.type === 'partner_day' || it.type === 'task_done' || it.type === 'ping');
  (real ? realItems : activityFeed).filter(it => !answered(it)).forEach(it => {
    const label = dayLabel(it.at, now);
    let g = groups.find(x => x.label === label);
    if (!g) { g = { label, items: [] }; groups.push(g); }
    g.items.push(it);
  });

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ paddingTop: 12, paddingHorizontal: layout.x, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable onPress={() => router.back()} hitSlop={12}><Text style={[type.name, { color: T.ink, fontSize: 28 }]}>‹</Text></Pressable>
          <Text style={[type.name, { color: T.ink, flex: 1 }]}>{t.title}</Text>
        </View>
        <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
          {real && groups.length === 0
            ? <Text style={[type.sub, { color: T.muted, textAlign: 'center', paddingVertical: 24 }]}>{t.emptyReal}</Text>
            : groups.map((g, gi) => (
              <React.Fragment key={g.label}>
                <Label T={T} style={s.day}>{g.label}</Label>
                {g.items.map(it => (
                  <Animated.View key={it.id} exiting={FadeOut.duration(220)} layout={LinearTransition.duration(260)} style={[gi > 0 && { opacity: 0.7 }]}>
                    <Item T={T} item={it} chosen={chosen[it.id]} onChoose={choose} variant={variant} />
                  </Animated.View>
                ))}
              </React.Fragment>
            ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const mk = T => StyleSheet.create({
  list: { paddingTop: 16, paddingHorizontal: layout.x, paddingBottom: 40, gap: 10 },
  day: { alignSelf: 'center', marginTop: 10, marginBottom: 2 },
  card: { paddingVertical: 10, paddingLeft: 14, paddingRight: 4, borderLeftWidth: 3 },
  bubTag: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4, color: T.accent, marginBottom: 4 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  body: { fontSize: 15.5, fontWeight: '500', color: T.ink, lineHeight: 21 },
  time: { fontSize: 11, fontWeight: '500', color: T.muted, fontVariant: ['tabular-nums'] },
  replies: { flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' },
  chip: { borderWidth: 1.5, borderColor: T.line, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  debt: { fontSize: 13.5, color: T.muted, marginTop: 6 },
  actions: { flexDirection: 'row', gap: 6, marginTop: 10 },
  btn: { flex: 1, borderRadius: radius.pill, paddingVertical: 9, paddingHorizontal: 13, alignItems: 'center', borderWidth: 1.5, borderColor: T.ink },
  btnDark: { backgroundColor: T.ink },
  btnDarkText: { fontSize: 14, fontWeight: '600', color: T.bg },
  btnLight: { backgroundColor: 'transparent' },
  btnLightText: { fontSize: 14, fontWeight: '500', color: T.ink },
  moment: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10, paddingHorizontal: 4 },
  momentTitle: { fontSize: 15, fontWeight: '600', letterSpacing: -0.2, color: T.ink },
});

// expo-router : une erreur de rendu affiche ce filet au lieu d'un écran vide
export function ErrorBoundary(props) { return <RouteError {...props} />; }
