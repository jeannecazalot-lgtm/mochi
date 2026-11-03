// Écran 17 · Accueil — v3 « l'instrument et la créature » (4 nov 2026). Recette : docs/recettes/da-v2-mochi-eleve.md §6-7.
// La logique (vraies occurrences, retards groupés, « à venir » qui tient sur la page) est celle de la v1 ;
// le rendu est la DA v3 : scène pleine largeur, jauges, hairlines. L'état de Mochi vient de mochi-state (migration 0013).
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { LinearTransition, FadeInDown, Easing } from 'react-native-reanimated';
import { Animated } from '../../src/components/motion';
import { Avatar, CTAPrimary } from '../../src/components/ui';
import { Icon, ICON, RoundButton } from '../../src/components/core/extra';
import { Scene } from '../../src/components/mochi/scene';
import { Gauges, Label, Num, Check } from '../../src/components/mochi/gauges';
import { useTokens, type, layout } from '../../src/theme-v3';
import { me, partner, myToday, taskById, fmtMin } from '../../src/demo';
import { fmtDayLabel, missionDone, occStore } from '../../src/demo-core';
import { read, healMissingTasks } from '../../src/store';
import { loadSetup, setup, inRealMode, isJoiner } from '../../src/setup-state';
import { useIdentity, getUid, loadIdentity } from '../../src/identity';
import { localIso, addDaysIso } from '../../src/dates';
import { toggleOccurrence, isLive, skipOccurrence } from '../../src/occ-actions';
import { clearMalusFor } from '../../src/malus-actions';
import { groupLate, lateCaption, daysBetweenIso } from '../../src/late-groups';
import { mochiReact } from '../../src/components/mochi-img';
import { mochiStore, getMochi, energyOf, onMissionDone, STAGES } from '../../src/mochi-state';
import copy from '../../src/data/copy.json';

const fill = (s, vars) => Object.keys(vars).reduce((acc, k) => acc.replace(`{${k}}`, vars[k]), s);
const DEMO_MOCHI = { stage: 'mini', hearts: 4, pearls: 128, walk_status: 'home', hatched_at: new Date(Date.now() - 12 * 86400e3).toISOString() };
const fmtDate = d => { const s = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }); return s.charAt(0).toUpperCase() + s.slice(1); };
const fmtTime = iso => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', ' h ');

function Row({ T, vm, first, done, onToggle }) {
  return (
    <Pressable onPress={() => router.push(vm.href)}>
      <View style={[s.row, { borderTopWidth: first ? 0 : StyleSheet.hairlineWidth, borderTopColor: T.line, opacity: done ? 0.4 : 1, paddingVertical: 14 * layout.air }]}>
        <Text style={{ fontSize: 16 }}>{vm.emoji}</Text>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[type.body, { color: T.ink, textDecorationLine: done ? 'line-through' : 'none' }]} numberOfLines={1}>{vm.title}</Text>
          {vm.sub && !done ? <Text style={[type.label, { color: T.accent, marginTop: 2 }]}>{vm.sub}</Text> : null}
        </View>
        {vm.together ? <Label T={T}>{copy.home.togetherBadge.toLowerCase()}</Label> : vm.mental ? <Label T={T}>{copy.home.mentalBadge.toLowerCase()}</Label> : null}
        <Pressable onPress={onToggle} hitSlop={8}><Check T={T} done={done} /></Pressable>
      </View>
    </Pressable>
  );
}

const demoVms = () => myToday().map(o => { const task = taskById(o.task_id); return { id: o.id, emoji: task.emoji, title: task.title, mental: task.mental_load || o.kind === 'plan', mins: task.duration_min || 0, href: `/mission?occ=${o.id}` }; });

export default function Home() {
  const t = copy.homeV3, h = copy.home;
  const T = useTokens();
  missionDone.useVersion();
  const mochiV = mochiStore.useVersion();
  const ident = useIdentity();
  const [vms, setVms] = useState(null);
  const [real, setReal] = useState(false);
  const [anyOcc, setAnyOcc] = useState(false);
  const [noTask, setNoTask] = useState(false);
  const [late, setLate] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [mochi, setMochi] = useState(null);
  const [energy, setEnergy] = useState({ done: 0, total: 0 });
  const [lvl, setLvl] = useState(1);
  const data = useRef({ occs: [], byId: {} });
  const [availH, setAvailH] = useState(0); const [topH, setTopH] = useState(0); const [headH, setHeadH] = useState(0); const [gh, setGh] = useState({});
  const fitDays = useMemo(() => { let left = availH - topH - headH - 12; const out = []; for (const g of upcoming) { const hgt = gh[g.iso]; if (hgt == null || hgt + 8 > left) break; left -= hgt + 8; out.push(g); } return out; }, [availH, topH, headH, gh, upcoming]);
  const occV = occStore.useVersion();

  useEffect(() => {
    (async () => {
      await loadSetup();
      if (!inRealMode()) { setVms(demoVms()); setMochi(DEMO_MOCHI); setLvl(2); setEnergy({ done: 0, total: 0 }); return; }
      const [occs, tasks, inv] = await Promise.all([read('occurrences'), read('tasks'), read('mochi_inventory')]);
      if (setup.householdId && occs.some(o => !tasks.some(tk => tk.id === o.task_id))) healMissingTasks(setup.householdId).then(ok => { if (ok) occStore.bump(); }).catch(() => {});
      const byId = Object.fromEntries(tasks.map(tk => [tk.id, tk]));
      data.current = { occs, byId };
      const today = localIso();
      await loadIdentity();
      const uid = getUid();
      const mine = o => !uid || !o.assignee_id || o.assignee_id === uid;
      const todays = occs.filter(o => isLive(o) && o.due_date === today && mine(o));
      setReal(true); setAnyOcc(occs.length > 0); setNoTask(tasks.length === 0);
      occs.forEach(o => { if (o.status === 'done' && !missionDone.has(o.id)) missionDone.set(o.id, true); });
      const m = await getMochi(); setMochi(m);
      setEnergy(energyOf(occs));
      const souvenirs = inv.filter(i => i.household_id === setup.householdId && i.kind === 'souvenir').length;
      setLvl(!m || m.stage === 'egg' ? 0 : souvenirs === 0 ? 1 : m.stage === 'mini' ? 2 : m.stage === 'mochi' ? 3 : 4);
      const toVm = o => { const tk = byId[o.task_id] || {}; const q = `occ=${o.id}&tid=${o.task_id}&title=${encodeURIComponent(tk.title || '')}&emoji=${encodeURIComponent(tk.emoji || '•')}&mins=${tk.duration_min || 15}`; return { id: o.id, emoji: tk.emoji || '•', title: tk.title || '…', mental: !!tk.mental_load, together: !o.assignee_id, mins: tk.duration_min || 15, href: `/mission?${q}` }; };
      setLate(groupLate(occs.filter(o => isLive(o) && o.due_date < today && o.status !== 'done' && mine(o))).map(g => {
        const o = g.latest; const tk = byId[o.task_id] || {};
        const q = `occ=${o.id}&tid=${o.task_id}&title=${encodeURIComponent(tk.title || '')}&emoji=${encodeURIComponent(tk.emoji || '•')}&mins=${tk.duration_min || 15}`;
        return { id: o.id, emoji: tk.emoji || '•', title: tk.title || '…', mental: !!tk.mental_load, sub: lateCaption(g.n, daysBetweenIso(g.oldest.due_date, today)), together: !o.assignee_id, mins: tk.duration_min || 15, href: `/retard?${q}&due=${g.oldest.due_date}&ids=${g.ids.join(',')}&n=${g.n}`, late: true, ids: g.ids };
      }));
      setUpcoming([1, 2, 3, 4, 5, 6].map(k => { const iso = addDaysIso(k); const items = occs.filter(o => isLive(o) && o.due_date === iso && mine(o)); return { iso, label: fmtDayLabel(new Date(iso + 'T12:00:00')), items: items.map(toVm) }; }).filter(g => g.items.length));
      setVms(todays.map(toVm));
    })();
  }, [occV, ident, mochiV]);

  const toggle = (id, upcomingRow = false) => {
    (upcomingRow ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)).catch(() => {});
    const nowDone = !missionDone.has(id);
    missionDone.toggle(id);
    if (nowDone) mochiReact();
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
  const away = m.walk_status === 'away';
  const hearts = m.hearts ?? 5;
  const day = m.hatched_at ? Math.max(1, Math.floor((Date.now() - Date.parse(m.hatched_at)) / 86400e3) + 1) : 0;
  const mood = T.night || hearts <= 1 ? 'sleeping' : hearts === 2 ? 'sad' : hearts === 3 ? 'neutral' : undefined;
  const en = real ? energy : { done: list.length - remaining.length, total: list.length };
  const line = vms === null ? ' '
    : m.stage === 'egg' ? (partner?.first_name && isJoiner() === false && !anyOcc ? fill(t.eggWait, { name: partner.first_name }) : t.egg)
    : away ? fill(t.away, { time: m.walk_returns_at ? fmtTime(m.walk_returns_at) : '…' })
    : hearts <= 1 ? t.sick
    : T.night ? t.night
    : en.total > 0 && en.done >= en.total ? t.allDone
    : en.total - en.done === 1 ? t.remainingOne
    : fill(t.remaining, { n: Math.max(0, en.total - en.done) });
  const meta = vms === null || !list.length ? '' : allDone ? t.allDoneMeta : fill(remaining.length === 1 ? t.metaOne : t.meta, { n: remaining.length, time: fmtMin(remaining.reduce((a, v) => a + (v.mins || 0), 0)) });

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}><Scene T={T} stage={m.stage} mood={mood} lvl={lvl} away={away} /></View>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ flex: 1, overflow: 'hidden' }} onLayout={e => setAvailH(e.nativeEvent.layout.height)}>
          <View onLayout={e => setTopH(e.nativeEvent.layout.height)}>
            <View style={s.header}>
              <Label T={T} style={{ flex: 1, color: T.ink }}>{fmtDate(new Date())}</Label>
              <Num T={T}>{m.pearls ?? 0}</Num><Label T={T} style={{ marginLeft: 6, marginRight: 6 }}>perles</Label>
              <RoundButton onPress={() => router.push('/activite')} accessibilityLabel={h.activityA11y}><Icon d={ICON.bubble} size={17} color={T.ink} /></RoundButton>
              <Pressable onPress={() => router.push('/profil')} accessibilityLabel={h.profileA11y}><Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={36} /></Pressable>
            </View>
            <View style={{ height: layout.scene - 130 }} />
            <View style={{ paddingHorizontal: layout.x, paddingTop: 24 * layout.air, flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={[type.name, { color: T.ink, flex: 1 }]}>{m.name || 'Mochi'}</Text>
              <Label T={T}>{m.stage === 'egg' ? t.eggPill : fill(t.stagePill, { day, k: Math.max(1, STAGES.indexOf(m.stage)) })}</Label>
            </View>
            <Text style={[type.sub, { paddingHorizontal: layout.x, marginTop: 6, color: T.muted }]}>{line}</Text>
            <View style={{ marginTop: 24 * layout.air }}><Gauges T={T} t={t} energy={en} hearts={hearts} formLabel={t.formLabels[hearts] || ''} /></View>
            <View style={s.sectionHead}>
              <Pressable onPress={() => router.push('/afaire')} hitSlop={6}><Text style={[type.section, { color: T.ink }]}>{t.today}</Text></Pressable>
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
          {real && upcoming.length ? (
            <>
              <View style={s.sectionHead} onLayout={e => setHeadH(e.nativeEvent.layout.height)}><Text style={[type.section, { color: T.ink }]}>{t.upcoming}</Text></View>
              <View style={{ marginHorizontal: layout.x }}>
                {fitDays.map(g => (<View key={g.iso}><Label T={T} style={{ paddingTop: 10, paddingBottom: 2 }}>{g.label}</Label>{g.items.map((v, i) => <Row key={v.id} T={T} vm={v} first={i === 0} done={missionDone.has(v.id)} onToggle={() => toggle(v.id, true)} />)}</View>))}
              </View>
              <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, opacity: 0, paddingHorizontal: layout.x }}>
                {upcoming.map(g => (<View key={g.iso} onLayout={e => { const hgt = e.nativeEvent.layout.height; setGh(mm => (mm[g.iso] === hgt ? mm : { ...mm, [g.iso]: hgt })); }}><Label T={T} style={{ paddingTop: 10, paddingBottom: 2 }}>{g.label}</Label>{g.items.map((v, i) => <Row key={v.id} T={T} vm={v} first={i === 0} done={missionDone.has(v.id)} onToggle={() => {}} />)}</View>))}
              </View>
            </>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 12, paddingHorizontal: layout.x, flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionHead: { paddingTop: 26 * layout.air, paddingBottom: 4, paddingHorizontal: layout.x, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});
