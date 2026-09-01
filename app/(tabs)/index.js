// Écran 17 · Accueil. Recette : docs/recettes/17-home.md
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GlowBg, Card, Divider, Avatar } from '../../src/components/ui';
import { LiveMochi, useCheckPop, Animated } from '../../src/components/motion';
import { Icon, ICON, BadgePill, CheckCircle, RoundButton, Hint } from '../../src/components/core/extra';
import { me, partner, balance, streak, myToday, taskById, fmtMin } from '../../src/demo';
import { fmtHeaderDate, mochiLean, moreLoaded, hasUnreadPing, missionDone, occStore } from '../../src/demo-core';
import { read } from '../../src/store';
import { loadSetup, setup } from '../../src/setup-state';
import { useIdentity } from '../../src/identity';
import { localIso } from '../../src/dates';
import { toggleOccurrence } from '../../src/occ-actions';
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
  useIdentity(); // re-rend quand le vrai profil (prénom + photo) arrive
  // Branchement réel (1er sept 2026) : si le setup a tourné, l'Accueil affiche les
  // VRAIES occurrences du jour (cache local du store) ; la démo n'est qu'un fallback.
  const [vms, setVms] = useState(demoVms);
  const [real, setReal] = useState(false);
  const occV = occStore.useVersion(); // « Déplacer » depuis la sheet → on relit le store
  useEffect(() => {
    (async () => {
      await loadSetup();
      if (!setup.result?.items?.length) return;
      const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]);
      const byId = Object.fromEntries(tasks.map(tk => [tk.id, tk]));
      const today = localIso();
      const todays = occs.filter(o => o.due_date === today);
      if (!todays.length && !occV) return; // premier chargement sans données réelles → démo
      setReal(true);
      // hydrate la coche depuis le statut serveur (relance de l'app)
      todays.forEach(o => { if (o.status === 'done' && !missionDone.has(o.id)) missionDone.set(o.id, true); });
      setVms(todays.map(o => {
        const tk = byId[o.task_id] || {};
        const q = `occ=${o.id}&tid=${o.task_id}&title=${encodeURIComponent(tk.title || '')}&emoji=${encodeURIComponent(tk.emoji || '•')}&mins=${tk.duration_min || 15}`;
        return { id: o.id, emoji: tk.emoji || '•', title: tk.title || '…', mental: !!tk.mental_load, badge: null, mins: tk.duration_min || 15, href: `/mission?${q}`, ping: null };
      }));
    })();
  }, [occV]);
  const toggle = id => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const nowDone = !missionDone.has(id);
    missionDone.toggle(id);
    if (real) toggleOccurrence(String(id), nowDone, vms.find(v => v.id === id)?.mins).catch(() => {});
  };
  // phrase de Mochi : sur le vrai résultat du dispatch quand il existe
  const { line, sub } = real && setup.result?.loads ? mochiLineReal(t, setup.result.loads) : mochiLine(t);
  const meta = fill(vms.length === 1 ? t.missionMeta : t.missionsMeta, { n: vms.length, time: fmtMin(vms.reduce((s2, v) => s2 + (v.mins || 0), 0)) });
  const left = Math.max(0, streak.next.at - streak.days);

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Header : date + bulle activité + avatar */}
          <View style={s.header}>
            <Text style={[font.micro, { flex: 1, fontWeight: '500' }]}>{fmtHeaderDate()}</Text>
            <RoundButton onPress={() => router.push('/activite')} accessibilityLabel={t.activityA11y}>
              <Icon d={ICON.bubble} size={17} />
              {hasUnreadPing() ? <View style={s.dot} /> : null}
            </RoundButton>
            <Pressable onPress={() => router.push('/profil')} accessibilityLabel={t.profileA11y}>
              <Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={36} />
            </Pressable>
          </View>

          {/* Bloc 1 · Mochi qui penche + phrase */}
          <View style={s.mochiBlock}>
            <LiveMochi size={104} mood="neutral" lean={mochiLean()} />
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
              {vms.length === 0
                ? <Text style={[font.secondary, { textAlign: 'center', paddingVertical: 10 }]}>{t.emptyToday}</Text>
                : vms.map((v, i) => <MissionRow key={v.id} vm={v} first={i === 0} done={missionDone.has(v.id)} onToggle={() => toggle(v.id)} />)}
            </Card>
            <Hint style={{ marginTop: 6 }}>{t.swipeHint}</Hint>
          </View>

          {/* Bloc « Côté binôme » retiré (retour Jeanne, 1er sept 2026) : redondant
              avec le Planning, où l'on voit déjà ce que fait l'autre. */}

          {/* Bloc 4 · Streak discret — masqué en mode réel (pas d'historique encore) */}
          <View style={{ flex: 1 }} />
          {real ? null : <Text style={s.streak}>{fill(t.streak, { n: streak.days, left, badge: streak.next.label })}</Text>}
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
