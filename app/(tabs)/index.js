// Écran 17 · Accueil — v3 « l'instrument et la créature » (4 nov 2026). Recette : docs/recettes/da-v2-mochi-eleve.md §6-7.
// La logique (vraies occurrences, retards groupés, « à venir » qui tient sur la page) est celle de la v1 ;
// le rendu est la DA v3 : scène pleine largeur, jauges, hairlines. L'état de Mochi vient de mochi-state (migration 0013).
import { RouteError } from '../../src/components/route-error';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, StyleSheet, useWindowDimensions, Image, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { LinearTransition, FadeInDown, FadeOut, ZoomIn, Easing } from 'react-native-reanimated';
import { Animated } from '../../src/components/motion';
import { PearlFlight, usePop } from '../../src/components/mochi/pearls';
import { Avatar, CTAPrimary } from '../../src/components/ui';
import { Icon, ICON, RoundButton } from '../../src/components/core/extra';
import { Scene } from '../../src/components/mochi/scene';
import { Gauges, Label, Num, Check } from '../../src/components/mochi/gauges';
import { useTokens, type, layout } from '../../src/theme-v3';
import { me, partner, myToday, taskById, fmtMin } from '../../src/demo';
import { fmtDayLabel, missionDone, occStore } from '../../src/demo-core';
import { read, healMissingTasks } from '../../src/store';
import { loadSetup, setup, inRealMode, isJoiner } from '../../src/setup-state';
import { useIdentity, getUid, getPartnerUid, loadIdentity } from '../../src/identity';
import { localIso, addDaysIso } from '../../src/dates';
import { toggleOccurrence, isLive, skipOccurrence } from '../../src/occ-actions';
import { clearMalusFor } from '../../src/malus-actions';
import { groupLate, lateCaption, daysBetweenIso } from '../../src/late-groups';
import { mochiReact } from '../../src/components/mochi-img';
import { mochiStore, getMochi, energyOf, onMissionDone, STAGES, unseenMoments, demoFlags, applyPendingName, pearlsFor, tick, positionsOf } from '../../src/mochi-state';
import copy from '../../src/copy';
import { isPremium } from '../../src/demo-premium';
import { weekNeedsRestart } from '../../src/horizon';
import { usePremiumVersion } from '../../src/purchases';
import { TaskIcon } from '../../src/components/task-icon';
import { LOCALE, fmtClock } from '../../src/lang';
import { unreadSuivi } from '../../src/suivi-unread';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reminderMarks } from '../../src/reminder-marks';
import { useFocusEffect } from 'expo-router';

const fill = (s, vars) => Object.keys(vars).reduce((acc, k) => acc.replace(`{${k}}`, vars[k]), s);
const CAPTURE = process.env.EXPO_PUBLIC_CAPTURE === '1'; // captures App Store : foyer d'exemple (Jeanne, 9 nov 2026)
const DEMO_MOCHI = { stage: 'mini', hearts: 4, pearls: 128, walk_status: 'home', hatched_at: new Date(Date.now() - 12 * 86400e3).toISOString() };
const fmtDate = d => { const s = d.toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' }); return s.charAt(0).toUpperCase() + s.slice(1); };
const headOn = T => (T.night ? '#F4EFE8' : T.ink); // en-tête posé sur la pièce : clair la nuit, encre le jour
const fmtTime = iso => fmtClock(new Date(iso));

function Row({ T, vm, first, done, onToggle }) {
  return (
    <Pressable onPress={() => router.push(vm.href)}>
      <View style={[s.row, { borderTopWidth: first ? 0 : StyleSheet.hairlineWidth, borderTopColor: T.line, opacity: done ? 0.4 : 1, paddingVertical: 14 * layout.air }]}>
        <TaskIcon emoji={vm.emoji} size={21} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[type.body, { color: T.ink, textDecorationLine: done ? 'line-through' : 'none' }]} numberOfLines={1}>{vm.title}</Text>
          {vm.sub && !done ? <Text style={[type.label, { color: T.accent, marginTop: 2 }]}>{vm.sub}</Text> : vm.pending && !done ? <Text style={[type.label, { color: T.muted, marginTop: 2 }]}>{vm.pending}</Text> : null}
          {vm.remind && !done ? <Text style={[type.label, { color: T.accent, marginTop: 2 }]}>{vm.remind}</Text> : null}
        </View>
        {vm.together ? <Label T={T}>{copy.home.togetherBadge.toLowerCase()}</Label> : vm.mental ? <Label T={T}>{copy.home.mentalBadge.toLowerCase()}</Label> : null}
        <Pressable onPress={onToggle} hitSlop={8}><Check T={T} done={done} /></Pressable>
      </View>
    </Pressable>
  );
}

// « Jour N ensemble » (Jeanne, 14 nov 2026) : un écran plein, animé, à la première ouverture du jour
// (remplace la pastille du 13 nov). Clé locale = le jour déjà montré.
const DAY_KEY = 'mochi.dayScreen.shown';
let dayBusy = false;
async function maybeShowDayScreen(day) {
  if (dayBusy) return false;
  dayBusy = true;
  try {
    const today = localIso();
    if ((await AsyncStorage.getItem(DAY_KEY)) === today) return false;
    await AsyncStorage.setItem(DAY_KEY, today);
    router.push(`/jour-ensemble?day=${day}`);
    return true;
  } catch (e) { return false; } finally { dayBusy = false; }
}

// bande de balade : une ligne de progression entre le départ et le retour, le point avance en direct

const demoVms = () => myToday().map(o => { const task = taskById(o.task_id); return { id: o.id, emoji: task.emoji, title: task.title, mental: task.mental_load || o.kind === 'plan', mins: task.duration_min || 0, href: `/mission?occ=${o.id}` }; });

export default function Home() {
  const t = copy.homeV3, h = copy.home;
  const T = useTokens(); const HEAD_ = headOn(T);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  missionDone.useVersion();
  const mochiV = mochiStore.useVersion();
  const ident = useIdentity();
  const [vms, setVms] = useState(null);
  const [real, setReal] = useState(false);
  const [anyOcc, setAnyOcc] = useState(false);
  const [noTask, setNoTask] = useState(false);
  const [late, setLate] = useState([]);
  const [mochi, setMochi] = useState(null);
  const [energy, setEnergy] = useState({ done: 0, total: 0 });
  const [lvl, setLvl] = useState(1);
  const [room, setRoom] = useState({ items: [], outfit: null, souvenirs: 0, positions: {} }); // ce qui a été acheté / ramené
  const [checkedIn, setCheckedIn] = useState(true); // ligne check-in masquée tant qu'on ne sait pas
  const [myMood, setMyMood] = useState(null); // mon check-in du jour (1 chargé·e, 2 ça va, 3 léger·ère)
  const [flight, setFlight] = useState(null); // perles qui volent de Mochi au compteur ({ key, n })
  const [demoPearls, setDemoPearls] = useState(0); // perles gagnées en démo (session)
  const pearlsRef = useRef(null); const [pearlsAt, setPearlsAt] = useState(null); // position du compteur
  const { pop, style: popStyle } = usePop();
  const data = useRef({ occs: [], byId: {} });
  const shown = useRef(false); // moments plein écran : une seule ouverture par montage
  const ticked = useRef(false);
  const [bgTop, setBgTop] = useState(0);
  const occV = occStore.useVersion();
  usePremiumVersion();
  const [unread, setUnread] = useState(0); // pastille de la bulle Suivi
  useFocusEffect(React.useCallback(() => { unreadSuivi().then(setUnread).catch(() => {}); }, [occV]));
  const [needWeek, setNeedWeek] = useState(false); // gratuit : plus rien de prévu → carte « Nouvelle semaine »
  useEffect(() => { weekNeedsRestart().then(setNeedWeek).catch(() => {}); }, [occV]);

  useEffect(() => {
    (async () => {
      await loadSetup();
      if (!inRealMode() || CAPTURE) { setVms(demoVms()); setMochi(CAPTURE ? { ...DEMO_MOCHI, stage: 'mochi', hearts: 5, pearls: 214 } : DEMO_MOCHI); setLvl(2); setRoom({ items: CAPTURE ? ['cheval', 'aquarium', 'tournedisque', 'lave'] : ['cheval', 'lave'], outfit: 'beret', souvenirs: 3 }); setEnergy(CAPTURE ? { done: 2, total: 3 } : { done: 0, total: 0 }); const dm = demoFlags.checkin[T.night ? 'evening' : 'morning']; setCheckedIn(!!dm); setMyMood(dm || null); return; }
      const [occs, tasks, inv, cks, acts] = await Promise.all([read('occurrences'), read('tasks'), read('mochi_inventory'), read('mochi_checkins'), read('activity').catch(() => [])]);
      if (setup.householdId && occs.some(o => !tasks.some(tk => tk.id === o.task_id))) healMissingTasks(setup.householdId).then(ok => { if (ok) occStore.bump(); }).catch(() => {});
      const byId = Object.fromEntries(tasks.map(tk => [tk.id, tk]));
      data.current = { occs, byId };
      const today = localIso();
      await loadIdentity();
      const uid = getUid();
      const myCk = cks.find(c => c.user_id === uid && c.day === today && c.moment === (T.night ? 'evening' : 'morning'));
      setCheckedIn(!!myCk); setMyMood(myCk?.mood || null);
      const mine = o => !uid || !o.assignee_id || o.assignee_id === uid;
      // une mission cochée reste à l'écran (barrée, décochable) : y compris un retard rattrapé aujourd'hui (Jeanne, 7 nov 2026 : « j'ai cliqué sans faire exprès et elle a disparu »)
      const doneToday = o => o.status === 'done' && o.done_at && localIso(new Date(o.done_at)) === today;
      const todays = occs.filter(o => isLive(o) && mine(o) && (o.due_date === today || (o.due_date < today && doneToday(o))));
      setReal(true); setAnyOcc(occs.length > 0); setNoTask(tasks.length === 0);
      occs.forEach(o => { if (o.status === 'done' && !missionDone.has(o.id)) missionDone.set(o.id, true); });
      if (!ticked.current) { ticked.current = true; await tick().catch(() => {}); } // éclosion / retour / cœurs dès l'ouverture, pas seulement au changement de jour
      let m = await getMochi(); if (await applyPendingName()) m = await getMochi(); setMochi(m); // nom choisi à l'onboarding
      let momentNow = false;
      if (!shown.current) { const un = await unseenMoments(); if (un.length) { shown.current = true; momentNow = true; setTimeout(() => router.push('/moment'), 400); } }
      // l'écran « Jour X » : première ouverture du jour (aussi quand l'app revient au premier plan le lendemain), jamais par-dessus un moment
      if (!momentNow && m && m.stage !== 'egg' && m.hatched_at && getPartnerUid()) { const d = Math.max(1, Math.floor((Date.now() - Date.parse(m.hatched_at)) / 86400e3) + 1); setTimeout(() => maybeShowDayScreen(d), 450); }
      setEnergy(energyOf(occs));
      const souvenirs = inv.filter(i => i.household_id === setup.householdId && i.kind === 'souvenir').length;
      const mineInv = inv.filter(i => i.household_id === setup.householdId); const outfits = mineInv.filter(i => i.kind === 'outfit').sort((a, b) => String(a.acquired_at).localeCompare(String(b.acquired_at)));
      setRoom({ items: mineInv.filter(i => i.kind === 'object' && i.placed !== false).map(i => i.item_key), outfit: (outfits.find(o => o.placed) || null)?.item_key || null, souvenirs, positions: positionsOf(mineInv) });
      setLvl(!m || m.stage === 'egg' ? 0 : souvenirs === 0 ? 1 : m.stage === 'mini' ? 2 : m.stage === 'mochi' ? 3 : 4);
      const swaps = await read('swap_requests').catch(() => []); const pendingIds = new Set(swaps.filter(sw => sw.status === 'pending' && sw.from_user === uid).map(sw => sw.occurrence_id));
      const refusedIds = new Set(swaps.filter(sw => sw.status === 'refused' && sw.from_user === uid && String(sw.resolved_at || '').slice(0, 10) === today).map(sw => sw.occurrence_id));
      const remind = reminderMarks(acts, uid);
      const toVm = o => { const tk = byId[o.task_id] || {}; const q = `occ=${o.id}&tid=${o.task_id}&title=${encodeURIComponent(tk.title || '')}&emoji=${encodeURIComponent(tk.emoji || '•')}&mins=${tk.duration_min || 15}`; return { id: o.id, emoji: tk.emoji || '•', title: tk.title || '…', mental: !!tk.mental_load, together: !o.assignee_id, mins: tk.duration_min || 15, href: `/mission?${q}`, remind: remind[o.id] || null, pending: pendingIds.has(o.id) ? fill(t.pending, { name: partner.first_name }) : refusedIds.has(o.id) ? fill(t.refused, { name: partner.first_name }) : null }; };
      setLate(groupLate(occs.filter(o => isLive(o) && o.due_date < today && o.status !== 'done' && mine(o))).map(g => {
        const o = g.latest; const tk = byId[o.task_id] || {};
        const q = `occ=${o.id}&tid=${o.task_id}&title=${encodeURIComponent(tk.title || '')}&emoji=${encodeURIComponent(tk.emoji || '•')}&mins=${tk.duration_min || 15}`;
        return { id: o.id, emoji: tk.emoji || '•', title: tk.title || '…', mental: !!tk.mental_load, sub: lateCaption(g.n, daysBetweenIso(g.oldest.due_date, today)), together: !o.assignee_id, mins: tk.duration_min || 15, href: `/retard?${q}&due=${g.oldest.due_date}&ids=${g.ids.join(',')}&n=${g.n}`, late: true, ids: g.ids, remind: g.ids.map(x => remind[x]).find(Boolean) || null };
      }));
      setVms(todays.map(toVm));
    })();
  }, [occV, ident, mochiV]);

  const toggle = (id, upcomingRow = false) => {
    (upcomingRow ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)).catch(() => {});
    const nowDone = !missionDone.has(id);
    missionDone.toggle(id);
    if (nowDone) { mochiReact(); const vm = (vms || []).find(v => v.id === id) || late.find(v => v.id === id); const n = vm ? pearlsFor({ assignee_id: vm.together ? null : 'me' }, { mental_load: vm.mental }) : 3; setFlight({ key: Date.now(), n }); if (!real) setDemoPearls(p => p + n); }
    if (real) toggleOccurrence(String(id), nowDone, (vms || []).find(v => v.id === id)?.mins).catch(() => {});
    const lateVm = late.find(v => v.id === id);
    if (real && nowDone && lateVm) {
      clearMalusFor(String(id)).catch(() => {});
      for (const oid of (lateVm.ids || []).filter(x => String(x) !== String(id))) { skipOccurrence(String(oid)).catch(() => {}); clearMalusFor(String(oid)).catch(() => {}); }
    }
    // Mochi qu'on élève : perles, cœur regagné si c'était un retard, balade si la jauge est pleine
    if (real && nowDone) { const occ = data.current.occs.find(o => String(o.id) === String(id)); if (occ) onMissionDone({ ...occ, status: 'done' }, data.current.byId[occ.task_id], { wasMissed: !!lateVm }).catch(() => {}); }
    if (!real) setEnergy(e => ({ done: Math.max(0, e.done + (nowDone ? 1 : -1)), total: Math.max(e.total, (vms || []).length) }));
  };

  const list = vms || [];
  const remaining = list.filter(v => !missionDone.has(v.id));
  const allDone = list.length > 0 && remaining.length === 0;
  const lateLeft = late.filter(v => !missionDone.has(v.id));
  const m = mochi || DEMO_MOCHI;
  const hearts = m.hearts ?? 5;
  const day = m.hatched_at ? Math.max(1, Math.floor((Date.now() - Date.parse(m.hatched_at)) / 86400e3) + 1) : 0;
  // quand je me sens pas bien, Mochi le montre (retour Jeanne 4 nov 2026) : tête neutre + phrase, avant tout le reste
  const heavy = myMood === 1 && hearts > 1 && m.stage !== 'egg';
  const mood = T.night || hearts <= 1 || full ? 'sleeping' : hearts === 2 ? 'sad' : hearts === 3 || heavy ? 'neutral' : undefined;
  const en = real ? energy : { done: list.length - remaining.length, total: list.length };
  const full = en.total > 0 && en.done >= en.total;
  // journée pleine (Jeanne, 8 nov 2026) : saut de joie, les 12 perles volent au compteur, puis il dort jusqu'à demain
  useEffect(() => {
    if (!full || vms === null) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const a = setTimeout(() => { mochiReact(); setTimeout(mochiReact, 260); setFlight({ key: Date.now(), n: 12 }); if (!real) setDemoPearls(p => p + 12); }, 700);
    return () => clearTimeout(a);
  }, [full]);
  const line = vms === null ? ' '
    : m.stage === 'egg' ? t.egg
    : hearts <= 1 ? t.sick
    : heavy ? t.heavy
    : T.night ? t.night
    : en.total > 0 && en.done >= en.total ? t.allDone
    : en.total - en.done === 1 ? t.remainingOne
    : fill(t.remaining, { n: Math.max(0, en.total - en.done) });
  const meta = vms === null || !list.length ? '' : allDone ? t.allDoneMeta : fill(remaining.length === 1 ? t.metaOne : t.meta, { n: remaining.length, time: fmtMin(remaining.reduce((a, v) => a + (v.mins || 0), 0)) });

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <Pressable onPress={() => router.push('/chambre')} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}><Scene T={T} stage={m.stage} mood={mood} lvl={lvl} topInset={insets.top + 44} items={room.items} outfit={room.outfit} souvenirs={room.souvenirs} positions={room.positions} photo={m.photo_url || null} /></Pressable>
      {flight && pearlsAt ? <PearlFlight key={flight.key} from={{ x: width / 2, y: layout.scene - layout.floor - 60 }} to={pearlsAt} count={Math.min(5, flight.n)} color={T.accent} onArrive={() => { pop(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}); }} /> : null}
      <SafeAreaView style={{ flex: 1 }} edges={['top']} pointerEvents="box-none">
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>{/* défile quand la journée est chargée (9 nov 2026) */}
          {/* sous la scène, le contenu a un fond plein : il glisse sur la pièce sans la traverser */}
          {bgTop ? <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: bgTop, height: 4000, backgroundColor: T.bg }} /> : null}
          <View pointerEvents="box-none">
            <View style={s.header}>
              {/* sur la pièce (sombre), l'en-tête est en blanc cassé quel que soit le mode */}
              <Label T={T} style={{ flex: 1, color: HEAD_ }}>{fmtDate(new Date())}</Label>
              <Pressable onPress={() => router.push('/chambre')} hitSlop={8} ref={pearlsRef} onLayout={() => pearlsRef.current?.measureInWindow((x, y, w, hh) => setPearlsAt({ x: x + w / 2, y: y + hh / 2 }))} style={{ flexDirection: 'row', alignItems: 'baseline', marginRight: 6 }}>
                <Animated.View style={popStyle}><Num T={T} style={{ color: HEAD_ }}>{(m.pearls ?? 0) + demoPearls}</Num></Animated.View><Label T={T} style={{ marginLeft: 6, color: HEAD_, opacity: 0.8 }}>{copy.common.pearlsWord}</Label>
              </Pressable>
              <Pressable onPress={() => router.push('/activite')} accessibilityLabel={h.activityA11y} hitSlop={8} style={{ marginRight: 4 }}><Image source={require('../../assets/icones/tabs/bubble.png')} style={{ width: 34, height: 34 }} resizeMode="contain" accessibilityIgnoresInvertColors />
                {/* pastille v2 (Jeanne, 14 nov 2026 : « le style ne va pas ») : corail plein, sans contour, à cheval sur le coin, un seul « pop » */}
                {unread > 0 ? <Animated.View key={unread} entering={ZoomIn.springify().damping(14).stiffness(260)} style={{ position: 'absolute', top: -1, right: -2, minWidth: 16, height: 16, paddingHorizontal: 4, borderRadius: 8, backgroundColor: T.accent, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 10, lineHeight: 12, fontWeight: '700', color: '#FFFFFF', fontVariant: ['tabular-nums'] }}>{unread > 9 ? '9+' : unread}</Text></Animated.View> : null}</Pressable>
              <Pressable onPress={() => router.push('/profil')} accessibilityLabel={h.profileA11y}><Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={36} /></Pressable>
            </View>
            <Pressable onPress={() => router.push('/chambre')} accessibilityLabel={t.roomA11y} onLayout={e => setBgTop(e.nativeEvent.layout.y + e.nativeEvent.layout.height)} style={{ height: Math.max(8, layout.scene + 12 - insets.top - 48) }} />{/* la scène se tape ici : vers la pièce de Mochi */}
            <View style={{ paddingHorizontal: layout.x, paddingTop: 18, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={[type.name, { color: T.ink, flex: 1 }]}>{m.name || 'Mochi'}</Text>
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: T.seg }}><Text style={[type.label, { color: T.ink, fontWeight: '600' }]}>{m.stage === 'egg' ? t.eggPill : fill(t.stagePill, { day, k: Math.max(1, STAGES.indexOf(m.stage)) })}</Text></View>
            </View>
            <Text style={[type.sub, { paddingHorizontal: layout.x, marginTop: 4, color: T.muted }]}>{line}</Text>
            {/* seul dans le foyer : l'invitation EST l'écran (retour Jeanne 6 nov 2026 : « on ne peut rien faire sans binôme ») */}
            {real && !getPartnerUid() ? (
              <View style={{ marginHorizontal: layout.x, marginTop: 16, padding: 18, borderRadius: 18, backgroundColor: T.ink }}>
                <Text style={{ fontSize: 20, fontWeight: '600', letterSpacing: -0.5, color: T.bg }}>{t.soloTitle}</Text>
                <Text style={{ fontSize: 14.5, lineHeight: 20, color: T.bg, opacity: 0.8, marginTop: 6 }}>{m.stage === 'egg' ? t.soloSub : t.soloSubHatched}</Text>
                <Pressable onPress={() => router.push('/(setup)/invite?from=home')} style={({ pressed }) => [{ marginTop: 14, paddingVertical: 13, borderRadius: 999, backgroundColor: T.accent, alignItems: 'center', opacity: pressed ? 0.85 : 1 }]}><Text style={[type.body, { color: '#FFFFFF', fontWeight: '600' }]}>{t.soloCta}</Text></Pressable>
              </View>
            ) : null}
            {real && getPartnerUid() && needWeek && !isPremium() ? (
              <Pressable onPress={() => router.push('/semaine')} style={({ pressed }) => [{ marginHorizontal: layout.x, marginTop: 16, padding: 18, borderRadius: 18, backgroundColor: T.ink, opacity: pressed ? 0.9 : 1 }]}>
                <Text style={{ fontSize: 20, fontWeight: '600', letterSpacing: -0.5, color: T.bg }}>{copy.semaine.cardTitle}</Text>
                <Text style={{ fontSize: 14.5, lineHeight: 20, color: T.bg, opacity: 0.8, marginTop: 6 }}>{copy.semaine.cardSub}</Text>
                <View style={{ marginTop: 14, paddingVertical: 13, borderRadius: 999, backgroundColor: T.accent, alignItems: 'center' }}><Text style={[type.body, { color: '#FFFFFF', fontWeight: '600' }]}>{copy.semaine.cardCta}</Text></View>
              </Pressable>
            ) : null}
            <View style={{ marginTop: (checkedIn ? 16 : 6) * layout.air }}><Gauges T={T} t={t} energy={en} hearts={hearts} formLabel={t.formLabels[hearts] || ''} hint={m.stage !== 'egg' && !full && day <= 7 ? t.energyHint : null} onFormPress={m.stage === 'egg' ? undefined : () => router.push('/forme')} /></View>
            <View style={s.sectionHead}>
              <Pressable onPress={() => router.push('/(tabs)/planning')} hitSlop={6}><Text style={[type.section, { color: T.ink }]}>{t.today}</Text></Pressable>
              <Label T={T}>{meta}</Label>
            </View>
            <View style={{ marginHorizontal: layout.x }}>
              {vms !== null && list.length === 0 && late.length === 0
                ? <Text style={[type.sub, { color: T.muted, paddingVertical: 10 }]}>{t.empty}</Text>
                : [...late, ...[...list].sort((a, b) => (missionDone.has(a.id) ? 1 : 0) - (missionDone.has(b.id) ? 1 : 0))].map((v, i) => (
                  <Animated.View key={v.id} layout={LinearTransition.duration(280)} entering={FadeInDown.duration(250).easing(Easing.out(Easing.cubic)).withInitialValues({ opacity: 0, transform: [{ translateY: 8 }] })}>
                    <Row T={T} vm={v} first={i === 0} done={missionDone.has(v.id)} onToggle={() => toggle(v.id)} />
                  </Animated.View>))}
              {real && noTask ? <View style={{ marginTop: 14 }}><CTAPrimary label={isJoiner() ? fill(h.chooseWithCta, { name: partner.first_name }) : h.chooseTasksCta} onPress={() => router.push('/(setup)/taches')} /></View> : null}
            </View>
          </View>
          {/* plus de « À venir » : l'Accueil ne montre que la journée (Jeanne, 13 nov 2026) — la semaine est dans le Planning */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 12, paddingHorizontal: layout.x, flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionHead: { paddingTop: 26 * layout.air, paddingBottom: 4, paddingHorizontal: layout.x, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});

// expo-router : une erreur de rendu affiche ce filet au lieu d'un écran vide
export function ErrorBoundary(props) { return <RouteError {...props} />; }
