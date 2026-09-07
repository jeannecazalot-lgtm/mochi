// Écran 17 · Accueil. Recette : docs/recettes/17-home.md
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSharedValue, useAnimatedStyle, withTiming, LinearTransition } from 'react-native-reanimated';
import { GlowBg, Card, Divider, Avatar, CTAPrimary } from '../../src/components/ui';
import { LiveMochi, useCheckPop, Animated } from '../../src/components/motion';
import { Icon, ICON, BadgePill, CheckCircle, RoundButton, Hint } from '../../src/components/core/extra';
import { me, partner, balance, streak, myToday, taskById, fmtMin } from '../../src/demo';
import { fmtHeaderDate, mochiLean, moreLoaded, hasUnreadPing, missionDone, occStore } from '../../src/demo-core';
import { read } from '../../src/store';
import { loadSetup, setup, inRealMode, isJoiner } from '../../src/setup-state';
import { useIdentity, getUid, loadIdentity } from '../../src/identity';
import { localIso, addDaysIso } from '../../src/dates';
import { fmtDayLabel } from '../../src/demo-core';
import { toggleOccurrence, isLive } from '../../src/occ-actions';
import { computeRealBalance } from '../../src/balance-real';
import copy from '../../src/data/copy.json';
import { colors, space, font, motion } from '../../src/theme';

const fill = (s, vars) => Object.keys(vars).reduce((acc, k) => acc.replace(`{${k}}`, vars[k]), s);

function mochiLine(t) {
  const who = moreLoaded();
  const other = who.id !== me.id;
  if (balance.state === 'balanced') return { line: t.mochiBalanced, sub: t.mochiBalancedSub };
  if (balance.state === 'unbalanced') return { line: fill(other ? t.mochiUnbalancedOther : t.mochiUnbalancedMe, { name: who.first_name }), sub: t.mochiUnbalancedSub };
  return { line: fill(other ? t.mochiLeaningOther : t.mochiLeaningMe, { name: who.first_name }), sub: t.mochiLeaningSub };
}

// version réelle : sur les charges calculées par le dispatch (binôme simulé compris)
function mochiLineReal(t, loads) {
  const a = loads[me.id] || 0, b = loads[partner.id] || 0, tot = a + b || 1;
  const gap = Math.abs(a - b) / tot;
  if (gap < 0.10) return { line: t.mochiBalanced, sub: t.mochiBalancedSub };
  const who = b > a ? partner : me;
  const other = who.id !== me.id;
  if (gap > 0.25) return { line: fill(other ? t.mochiUnbalancedOther : t.mochiUnbalancedMe, { name: who.first_name }), sub: t.mochiUnbalancedSub };
  return { line: fill(other ? t.mochiLeaningOther : t.mochiLeaningMe, { name: who.first_name }), sub: t.mochiLeaningSub };
}

// vm = { id, emoji, title, mental, badge, href, ping } — construit soit depuis la
// démo, soit depuis les VRAIES occurrences locales (branchement du 1er sept 2026)
function MissionRow({ vm, first, done, onToggle }) {
  const pop = useCheckPop(done);
  const op = useSharedValue(done ? 0.45 : 1);
  useEffect(() => { op.value = withTiming(done ? 0.45 : 1, { duration: motion.micro }); }, [done]);
  const rowStyle = useAnimatedStyle(() => ({ opacity: op.value }));
  // Retour Jeanne (1er sept 2026) : tap titre/émoji = sheet Mission (valider avec
  // le temps réel, pas le temps, modifier) ; le rond coche directement.
  return (
    <Pressable onPress={() => router.push(vm.href)} onLongPress={vm.ping ? () => router.push(vm.ping) : undefined} delayLongPress={400}>
      {!first ? <Divider /> : null}
      <Animated.View style={[s.row, rowStyle]}>
        <Text style={{ fontSize: 19 }}>{vm.emoji}</Text>
        <Text style={[font.body, { flex: 1 }, done && { textDecorationLine: 'line-through' }]} numberOfLines={1}>{vm.title}</Text>
        {vm.badge ? <BadgePill color={colors.coralDeep} tint={colors.coral} a={0.14}>{vm.badge}</BadgePill>
          : vm.together ? <BadgePill color={colors.sageDeep} tint={colors.sage} a={0.22}>{copy.home.togetherBadge}</BadgePill>
          : vm.mental ? <BadgePill color={colors.lavenderDeep} tint={colors.lavender} a={0.18}>{copy.home.mentalBadge}</BadgePill> : null}
        <Pressable onPress={onToggle} hitSlop={8}>
          <Animated.View style={pop}><CheckCircle done={done} /></Animated.View>
        </Pressable>
      </Animated.View>
    </Pressable>
  );
}

// missions de démo → vms (fallback tant que le setup réel n'a pas été fait)
const demoVms = () => myToday().map(o => {
  const task = taskById(o.task_id);
  return { id: o.id, emoji: task.emoji, title: task.title, mental: task.mental_load || o.kind === 'plan', badge: o.badge, mins: task.duration_min || 0, href: `/mission?occ=${o.id}`, ping: `/ping?occ=${o.id}` };
});

export default function Home() {
  const t = copy.home;
  missionDone.useVersion(); // re-rend quand la sheet Mission coche/décoche
  const ident = useIdentity(); // re-rend quand le vrai profil (prénom + photo + uid) arrive
  // Branchement réel (1er sept 2026) : si le setup a tourné, l'Accueil affiche les
  // VRAIES occurrences du jour (cache local du store) ; la démo n'est qu'un fallback.
  // null = pas encore chargé (rien ne s'affiche : pas de flash de démo chez les vrais foyers)
  const [vms, setVms] = useState(null);
  const [real, setReal] = useState(false);
  const [anyOcc, setAnyOcc] = useState(false); // le foyer a-t-il déjà des missions (pas forcément à moi) ?
  const [noTask, setNoTask] = useState(false); // foyer sans aucune tâche (on vient de le former) → bouton vers l'écran 10
  const [bal, setBal] = useState(null);
  const [upcoming, setUpcoming] = useState([]); // « À venir » : mes missions des 2 jours suivants (décision Jeanne 7 sept 2026) // balance réelle de la semaine → la phrase de Mochi dit la même chose que l'onglet Balance (6 sept 2026)
  const occV = occStore.useVersion(); // « Déplacer » depuis la sheet → on relit le store
  useEffect(() => {
    (async () => {
      await loadSetup();
      // Réel dès qu'on a un foyer, même vide (retour test à deux, 3 sept 2026 :
      // qui rejoignait voyait la démo figée — fausses missions, faux jour, streak)
      if (!inRealMode()) { setVms(demoVms()); return; }
      const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]);
      const byId = Object.fromEntries(tasks.map(tk => [tk.id, tk]));
      const today = localIso();
      // « pour toi » = mes missions + les communes (bot/simulateur 5 sept 2026 :
      // l'Accueil montrait aussi celles du binôme) ; sans uid (hors ligne) : tout
      await loadIdentity(); // uid de la session courante (peut avoir changé)
      const uid = getUid();
      const todays = occs.filter(o => isLive(o) && o.due_date === today && (!uid || !o.assignee_id || o.assignee_id === uid));
      setReal(true);
      setAnyOcc(occs.length > 0);
      setNoTask(tasks.length === 0);
      setBal(uid && occs.some(o => o.status === 'done') ? computeRealBalance(occs, uid) : null);
      // hydrate la coche depuis le statut serveur (relance de l'app)
      todays.forEach(o => { if (o.status === 'done' && !missionDone.has(o.id)) missionDone.set(o.id, true); });
      const toVm = o => {
        const tk = byId[o.task_id] || {};
        const q = `occ=${o.id}&tid=${o.task_id}&title=${encodeURIComponent(tk.title || '')}&emoji=${encodeURIComponent(tk.emoji || '•')}&mins=${tk.duration_min || 15}`;
        return { id: o.id, emoji: tk.emoji || '•', title: tk.title || '…', mental: !!tk.mental_load, badge: null, together: !o.assignee_id, mins: tk.duration_min || 15, href: `/mission?${q}`, ping: null };
      };
      setUpcoming([1, 2].map(k => {
        const iso = addDaysIso(k);
        const items = occs.filter(o => isLive(o) && o.due_date === iso && o.status !== 'done' && (!uid || !o.assignee_id || o.assignee_id === uid));
        return { iso, label: fmtDayLabel(new Date(iso + 'T12:00:00')), items: items.map(toVm) };
      }).filter(g => g.items.length));
      setVms(todays.map(o => {
        const tk = byId[o.task_id] || {};
        const q = `occ=${o.id}&tid=${o.task_id}&title=${encodeURIComponent(tk.title || '')}&emoji=${encodeURIComponent(tk.emoji || '•')}&mins=${tk.duration_min || 15}`;
        return { id: o.id, emoji: tk.emoji || '•', title: tk.title || '…', mental: !!tk.mental_load, badge: null, together: !o.assignee_id, mins: tk.duration_min || 15, href: `/mission?${q}`, ping: null };
      }));
    })();
  }, [occV, ident]);
  const toggle = id => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const nowDone = !missionDone.has(id);
    missionDone.toggle(id);
    if (real) toggleOccurrence(String(id), nowDone, (vms || []).find(v => v.id === id)?.mins).catch(() => {});
  };
  // phrase de Mochi : vrai dispatch si dispo ; foyer réel sans dispatch local
  // (on vient de rejoindre) → phrase neutre, jamais la phrase de démo
  const list = vms || [];
  const remaining = list.filter(v => !missionDone.has(v.id));
  const allDone = list.length > 0 && remaining.length === 0;
  // phrase : balance réelle de la semaine (même calcul que l'onglet Balance) ; sous-phrase :
  // ce qu'il reste à faire aujourd'hui — fini le « Rien à faire » au-dessus de 2 missions
  const balanceLine = () => {
    if (bal) {
      const who = bal.top; const other = who.id !== me.id;
      if (bal.state === 'balanced') return t.mochiBalanced;
      if (bal.state === 'unbalanced') return fill(other ? t.mochiUnbalancedOther : t.mochiUnbalancedMe, { name: who.first_name });
      return fill(other ? t.mochiLeaningOther : t.mochiLeaningMe, { name: who.first_name });
    }
    return setup.result?.loads ? mochiLineReal(t, setup.result.loads).line : t.mochiBalanced;
  };
  const todoSub = allDone ? t.allDoneSub : remaining.length === 0 ? t.mochiBalancedSub : remaining.length === 1 ? t.todoSubOne : fill(t.todoSub, { n: remaining.length });
  const { line, sub } = vms === null ? { line: ' ', sub: ' ' }
    : real
      ? ((list.length || anyOcc) ? { line: allDone ? t.allDoneLine : balanceLine(), sub: todoSub } : { line: t.mochiNew, sub: t.mochiNewSub })
      : mochiLine(t);
  const meta = vms === null ? '' : list.length === 0 ? '' : allDone ? t.allDoneMeta
    : fill(remaining.length === 1 ? t.remainingMetaOne : t.remainingMeta, { n: remaining.length, time: fmtMin(remaining.reduce((s2, v) => s2 + (v.mins || 0), 0)) });
  const left = Math.max(0, streak.next.at - streak.days);

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Header : date + bulle activité + avatar */}
          <View style={s.header}>
            {/* vraie date par défaut ; la date de démo n'apparaît qu'en démo confirmée */}
            <Text style={[font.micro, { flex: 1, fontWeight: '500' }]}>{fmtHeaderDate(real || vms === null ? new Date() : undefined)}</Text>
            <RoundButton onPress={() => router.push('/activite')} accessibilityLabel={t.activityA11y}>
              <Icon d={ICON.bubble} size={17} />
              {/* pastille « non lu » de démo : jamais en mode réel */}
              {!real && hasUnreadPing() ? <View style={s.dot} /> : null}
            </RoundButton>
            <Pressable onPress={() => router.push('/profil')} accessibilityLabel={t.profileA11y}>
              <Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={36} />
            </Pressable>
          </View>

          {/* Bloc 1 · Mochi qui penche + phrase */}
          <View style={s.mochiBlock}>
            <LiveMochi size={104} mood={allDone ? 'happy' : 'neutral'} lean={bal ? bal.lean : mochiLean()} />
            <View style={{ flex: 1 }}>
              <Text style={[font.cardTitle, { lineHeight: 23 }]}>{line}</Text>
              <Text style={[font.secondary, { marginTop: 4 }]}>{sub}</Text>
            </View>
          </View>

          {/* Bloc 2 · Mes missions du jour */}
          <View style={s.sectionHead}>
            <Pressable onPress={() => router.push('/afaire')} hitSlop={6}><Text style={font.sectionTitle}>{t.todayTitle}</Text></Pressable>
            <Text style={{ fontSize: 13, fontWeight: '500', color: colors.muted }}>{meta}</Text>
          </View>
          <View style={{ paddingHorizontal: space.screenX }}>
            <Card padding={0} style={{ paddingVertical: 11, paddingHorizontal: 14 }}>
              {/* Retour Jeanne (2 sept 2026) : une mission cochée descend en bas de la liste */}
              {vms !== null && list.length === 0
                ? <Text style={[font.secondary, { textAlign: 'center', paddingVertical: 10 }]}>{t.emptyToday}</Text>
                : [...list].sort((a, b) => (missionDone.has(a.id) ? 1 : 0) - (missionDone.has(b.id) ? 1 : 0))
                  .map((v, i) => (
                    <Animated.View key={v.id} layout={LinearTransition.duration(280)}>
                      <MissionRow vm={v} first={i === 0} done={missionDone.has(v.id)} onToggle={() => toggle(v.id)} />
                    </Animated.View>
                  ))}
            </Card>
            {/* test à deux du 6 sept 2026 : la rejoignante lisait « Choisissez vos tâches » sans aucun bouton */}
            {/* décision Jeanne 7 sept 2026 : UNE seule personne choisit et répartit ; qui rejoint attend
                et ajuste ensuite depuis le Planning (avant : les deux passaient par le 10 → tâches en double) */}
            {real && noTask
              ? (isJoiner()
                ? <Text style={[font.secondary, { textAlign: 'center', paddingTop: 14, paddingHorizontal: 8 }]}>{fill(t.waitingTasks, { name: partner.first_name })}</Text>
                : <View style={{ marginTop: 14 }}><CTAPrimary label={t.chooseTasksCta} onPress={() => router.push('/(setup)/taches')} /></View>)
              : null}{/* plus d'indice de glissement ici : le geste n'existe que dans À faire (décision Jeanne 6 sept 2026) */}
          </View>

          {/* Bloc 3 · À venir — les 2 jours suivants (Ketlon 7 sept 2026 : « un peu light ») */}
          {real && upcoming.length ? (
            <>
              <View style={s.sectionHead}><Text style={font.sectionTitle}>{t.upcomingTitle}</Text></View>
              <View style={{ paddingHorizontal: space.screenX, gap: 8 }}>
                {upcoming.map(g => (
                  <Card key={g.iso} padding={0} style={{ paddingVertical: 8, paddingHorizontal: 14 }}>
                    <Text style={[font.micro, { paddingTop: 4, paddingBottom: 2 }]}>{g.label}</Text>
                    {g.items.map((v, i) => <MissionRow key={v.id} vm={v} first={i === 0} done={missionDone.has(v.id)} onToggle={() => toggle(v.id)} />)}
                  </Card>
                ))}
              </View>
            </>
          ) : null}

          {/* Bloc « Côté binôme » retiré (retour Jeanne, 1er sept 2026) : redondant
              avec le Planning, où l'on voit déjà ce que fait l'autre. */}

          {/* Bloc 4 · Streak discret — masqué en mode réel (pas d'historique encore) */}
          <View style={{ flex: 1 }} />
          {real || vms === null ? null : <Text style={s.streak}>{fill(t.streak, { n: streak.days, left, badge: streak.next.label })}</Text>}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  // aération générale de l'Accueil (retour Jeanne, 1er sept 2026 : « trop collé »)
  header: { paddingTop: 16, paddingHorizontal: space.headerX, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { position: 'absolute', top: 1, right: 1, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.coral, borderWidth: 2, borderColor: colors.bg },
  mochiBlock: { paddingTop: 22, paddingHorizontal: space.headerX, flexDirection: 'row', alignItems: 'center', gap: 16 },
  sectionHead: { paddingTop: 30, paddingBottom: 9, paddingHorizontal: space.headerX, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13 },
  streak: { textAlign: 'center', fontSize: 13, fontWeight: '500', color: colors.muted, paddingTop: 16, paddingBottom: 12, paddingHorizontal: space.screenX },
});
