// Sheet Tâche v2 (validée par Jeanne le 6 sept 2026) — Accueil / Planning → tap sur une mission.
// Une seule sheet, deux étages : « ce moment-ci » (temps, dépense, pas le temps) et « la règle »
// (jours, qui, durée, note) repliée en bas. Jamais de push d'écran : tout se déplie en place.
// Recette : docs/recettes/17c-sheet-tache-v2.md. `?occ=<id>` = occurrence (réelle ou démo).
import React, { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { LinearTransition } from 'react-native-reanimated';
import { Card, Micro, Avatar } from '../src/components/ui';
import { SheetHandle, CheckCircle } from '../src/components/social/extra';
import { Animated, FadeIn, useCheckPop } from '../src/components/motion';
import { Row, Stepper, PillChip, RuleGroup, ConfirmBlock, Arrow, Caption } from '../src/components/task/proto';
import { loadMission, saveRule, completeMission, parseAmount } from '../src/mission-data';
import { moveOccurrence, toggleOccurrence, takeOver } from '../src/occ-actions';
import { requestSwap } from '../src/swap-actions';
import { missionDone } from '../src/demo-core';
import { me, partner, fmtMin } from '../src/demo';
import { fmtWeekday } from '../src/demo-task';
import { localIso } from '../src/dates';
import copy from '../src/data/copy.json';
import { colors, space, font, alpha, motion } from '../src/theme';

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const fmtAmount = cents => `${(cents / 100).toFixed(2).replace('.', ',')} €`;
const CLOSE_AFTER = 900; // la confirmation reste visible avant la fermeture automatique
const layout = LinearTransition.springify().damping(motion.spring.damping).stiffness(motion.spring.stiffness);

export default function Mission() {
  const { occ: occId, tid, title, mins } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const t = copy.mission;
  const [m, setM] = useState(null); // { real, occ, task, dueIso, mine }
  const [spent, setSpent] = useState(15);
  const [amount, setAmount] = useState('');
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [asking, setAsking] = useState(false);
  const [ruleOpen, setRuleOpen] = useState(false);
  const [rule, setRule] = useState(null); // { window_days, who, duration_min, note }
  const [noteOpen, setNoteOpen] = useState(false);
  const [confirm, setConfirm] = useState(null); // 'done' | 'moved' | 'swap'
  const [movedTo, setMovedTo] = useState(null);
  const [moveMsg, setMoveMsg] = useState(null); // « Déjà prévue mardi »
  const [done, setDone] = useState(false);
  // mission déjà cochée à l'ouverture (test du 6 sept 2026) : rond plein, étage « ce moment-ci »
  // remplacé par « Déjà fait · tape pour la remettre à faire », report et repassage masqués
  const [already, setAlready] = useState(false);
  const pop = useCheckPop(done);
  const dirty = useRef(false);
  const ruleRef = useRef(null);

  useEffect(() => {
    loadMission({ occId, tid, title, mins }).then(r => {
      if (!r) { router.back(); return; }
      setM(r);
      const wasDone = r.occ?.status === 'done' || missionDone.has(r.occ?.id);
      if (wasDone) { setDone(true); setAlready(true); }
      setSpent(wasDone && r.occ?.duration_min ? r.occ.duration_min : r.task.duration_min);
      setRule({ window_days: r.task.window_days, who: r.task.who, duration_min: r.task.duration_min, note: r.task.note });
    });
  }, []);
  // la règle s'enregistre d'elle-même à la fermeture (pas de bouton Enregistrer)
  useEffect(() => () => { if (dirty.current && ruleRef.current) saveRule(ruleRef.current.id, ruleRef.current); }, []);
  useEffect(() => { if (m && rule) ruleRef.current = { id: m.task.id, ...rule }; }, [m, rule]);

  const patchRule = p => { dirty.current = true; setRule(r => ({ ...r, ...p })); Haptics.selectionAsync().catch(() => {}); };
  const close = () => router.back();
  const finish = kind => { setConfirm(kind); setTimeout(close, CLOSE_AFTER); };

  const undo = () => {
    if (!m) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    missionDone.set(m.occ.id, false);
    toggleOccurrence(String(m.occ.id), false).catch(() => {});
    setDone(false); setAlready(false);
  };
  const markDone = async () => {
    if (already) { undo(); return; }
    if (done || !m) return;
    setDone(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    missionDone.set(m.occ.id, true);
    completeMission(m.occ, m.task, spent, parseAmount(amount)).catch(() => {});
    setTimeout(() => finish('done'), motion.check);
  };
  const moveTo = async d => {
    if (m.busy.includes(d.iso)) { setMoveMsg(fill(t.moveBusy, { day: d.long })); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {}); return; }
    const r = await moveOccurrence(String(occId || ''), d.iso);
    if (r.ok || r.reason === 'introuvable') { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); setMovedTo(d); finish('moved'); }
    else Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  };
  // « Je m'en occupe » : la tâche de l'autre passe sur moi (retour Jeanne 7 sept 2026)
  const take = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    await takeOver(String(occId || '')).catch(() => {});
    finish('take');
  };
  const swap = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    await requestSwap(String(occId || '')).catch(() => {});
    finish('swap');
  };

  if (!m || !rule) return <View style={[s.sheet, { height: 120 }]} />;
  const { task } = m;
  const today = localIso();
  const who = m.mine ? me : partner;
  const dayLabel = m.dueIso === today ? t.metaToday : fmtWeekday(new Date(m.dueIso + 'T12:00:00'));
  const cents = parseAmount(amount);
  const days = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.now() + (i + 1) * 86400000);
    return { iso: localIso(d), label: copy.calendar.dowsLong[(d.getDay() + 6) % 7].toLowerCase(), long: fmtWeekday(d) };
  });

  const head = (
    <View style={s.head}>
      <View style={s.titleRow}>
        <Text style={[s.title, { flex: 1 }]} numberOfLines={2}>{task.title}</Text>
        {m.mine ? (
          <Pressable onPress={markDone} hitSlop={12} accessibilityRole="button" accessibilityLabel={t.doneLabel}>
            <Animated.View style={pop}><CheckCircle done={done} size={26} /></Animated.View>
          </Pressable>
        ) : null}
      </View>
      <View style={s.meta}>
        <Avatar initial={who.initial} color={who.color} photo={who.avatar_url} size={18} />
        <Text style={s.metaTxt}>{m.mine ? t.metaYou : who.first_name} · {dayLabel} · {done ? fmtMin(spent) : fill(t.metaApprox, { time: fmtMin(rule.duration_min) })}</Text>
      </View>
    </View>
  );

  if (confirm) {
    const props = confirm === 'done'
      ? { kind: 'done', title: t.confirmDone, sub: cents ? fill(t.confirmDoneSub, { time: fmtMin(spent), amount: fmtAmount(cents) }) : fill(t.doneSub, { time: fmtMin(spent) }) }
      : confirm === 'moved'
        ? { kind: 'moved', title: fill(t.confirmMoved, { day: movedTo?.long }), sub: fill(t.confirmMovedSub, { name: partner.first_name }) }
        : confirm === 'take'
          ? { kind: 'done', title: t.confirmTake, sub: fill(t.confirmTakeSub, { name: partner.first_name }) }
          : { kind: 'swap', who: partner, title: fill(t.confirmSwap, { name: partner.first_name }), sub: t.confirmSwapSub, pill: t.confirmSwapPill };
    return (
      <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]}>
        <SheetHandle />
        {head}
        <Animated.View entering={FadeIn.duration(motion.micro)}><ConfirmBlock {...props} /></Animated.View>
      </View>
    );
  }

  // résumé de la règle (une ligne) : jours · qui · durée
  const ruleSummary = [rule.window_days.length ? rule.window_days.map(i => copy.calendar.dowsLong[i].toLowerCase()).join(', ') : t.ruleAnyDay, t.who[rule.who] || partner.first_name, fmtMin(rule.duration_min)].join(' · ');

  // ─── la tâche de l'AUTRE : lecture seule + « Je m'en occupe » (retour Jeanne 7 sept 2026) ───
  if (!m.mine) {
    return (
      <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]}>
        <SheetHandle />
        {head}
        <Card r={16} padding={0} style={s.block}>
          <Row first strong label={t.takeLabel} sub={fill(t.takeSub, { name: who.first_name })} left={<Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={22} />} right={<Arrow />} onPress={take} />
        </Card>
        <Card r={16} padding={0}>
          <Row first label={t.ruleLabel} sub={ruleSummary} />
          {rule.note ? <Row label={t.ruleNote} sub={rule.note} /> : null}
        </Card>
        <Caption style={{ marginTop: 10 }}>{t.ruleReadOnly}</Caption>
      </View>
    );
  }

  // ─── ma tâche : ce moment-ci → la règle (repliable, en place) → dépense en dernier ───
  // (ordre décidé par Jeanne le 7 sept 2026 ; la règle ne masque plus le reste : retour Ketlon
  // « comment je retourne avant ? » — tap sur « La règle » replie)
  return (
    <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]}>
      <SheetHandle />
      {head}

      <Animated.View layout={layout}>
        <Card r={16} padding={0} style={s.block}>
          {already ? (
            <Row first strong label={t.doneAlready} sub={t.doneAlreadySub} onPress={undo} />
          ) : (
            <>
              <Row first label={t.timeLabel} right={<Stepper value={fmtMin(spent)} onMinus={() => setSpent(v => Math.max(5, v - 5))} onPlus={() => setSpent(v => v + 5)} />} />
              {!asking ? (
                <Row strong label={t.noTimeLabel} sub={fill(t.noTimeSub, { name: partner.first_name })} right={<Arrow />} onPress={() => { Haptics.selectionAsync().catch(() => {}); setAsking(true); }} />
              ) : (
                <Animated.View entering={FadeIn.duration(motion.micro)}>
                  <View style={s.moveBox}>
                    <Micro>{t.moveLabel}</Micro>
                    <View style={s.days}>
                      {days.map(d => <PillChip key={d.iso} flex label={d.label} dim={m.busy.includes(d.iso)} onPress={() => moveTo(d)} />)}
                    </View>
                    <Caption style={{ textAlign: 'left' }}>{moveMsg || fill(t.moveWarn, { name: partner.first_name })}</Caption>
                  </View>
                  <Row strong label={fill(t.swapLabel, { name: partner.first_name })} sub={fill(t.swapSub, { name: partner.first_name })} left={<Avatar initial={partner.initial} color={partner.color} photo={partner.avatar_url} size={22} />} right={<Arrow />} onPress={swap} />
                </Animated.View>
              )}
            </>
          )}
        </Card>
      </Animated.View>

      <Animated.View layout={layout}>
        <Card r={16} padding={0} style={s.block}>
          <Row first label={t.ruleLabel} sub={ruleOpen ? null : ruleSummary} right={<Arrow />} onPress={() => { Haptics.selectionAsync().catch(() => {}); setRuleOpen(o => !o); }} />
          {ruleOpen ? (
            <Animated.View entering={FadeIn.duration(motion.micro)}>
              <RuleGroup label={t.ruleDays} row>
                {copy.calendar.dows.map((d, i) => <PillChip key={i} flex label={d} selected={rule.window_days.includes(i)}
                  onPress={() => patchRule({ window_days: rule.window_days.includes(i) ? rule.window_days.filter(x => x !== i) : [...rule.window_days, i].sort() })} />)}
              </RuleGroup>
              <RuleGroup label={t.ruleWho}>
                <PillChip label={t.who.me} avatar={me} selected={rule.who === 'me'} onPress={() => patchRule({ who: 'me' })} />
                <PillChip label={partner.first_name} avatar={partner} selected={rule.who === 'partner'} onPress={() => patchRule({ who: 'partner' })} />
                <PillChip label={t.who.alt} selected={rule.who === 'alt'} onPress={() => patchRule({ who: 'alt' })} />
                <PillChip label={t.who.auto} selected={rule.who === 'auto'} onPress={() => patchRule({ who: 'auto' })} />
              </RuleGroup>
              <Row label={t.ruleDuration} right={<Stepper value={fmtMin(rule.duration_min)} onMinus={() => patchRule({ duration_min: Math.max(5, rule.duration_min - 5) })} onPlus={() => patchRule({ duration_min: rule.duration_min + 5 })} />} />
              {noteOpen
                ? <View style={s.noteBox}><TextInput value={rule.note} onChangeText={v => patchRule({ note: v })} placeholder={t.notePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)} multiline style={s.noteInput} /></View>
                : <Row label={t.ruleNote} sub={rule.note || t.notePlaceholder} right={<Arrow />} onPress={() => setNoteOpen(true)} />}
            </Animated.View>
          ) : null}
        </Card>
      </Animated.View>

      {already ? null : (
        <Animated.View layout={layout}>
          <Card r={16} padding={0}>
            <Row first label={t.expenseLabel} right={expenseOpen
              ? <View style={s.amountBox}><TextInput value={amount} onChangeText={setAmount} placeholder={t.expensePlaceholder} placeholderTextColor={alpha(colors.ink, 0.3)} keyboardType="decimal-pad" style={s.amountInput} /><Text style={s.amountUnit}>€</Text></View>
              : <PillChip label={cents ? fmtAmount(cents) : t.expenseAdd} selected={!!cents} onPress={() => setExpenseOpen(true)} />} />
          </Card>
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  sheet: { backgroundColor: colors.card, paddingTop: 10, paddingHorizontal: space.screenX },
  head: { marginTop: 2, marginBottom: 12, paddingHorizontal: 2, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { ...font.cardTitle },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaTxt: { fontSize: 13, fontWeight: '400', color: colors.muted },
  block: { marginBottom: 8 },
  moveBox: { paddingVertical: 12, paddingHorizontal: 14, gap: 9, borderTopWidth: 1, borderTopColor: colors.line },
  days: { flexDirection: 'row', gap: 6 },
  amountBox: { flexDirection: 'row', alignItems: 'center', gap: 4, borderBottomWidth: 1.5, borderBottomColor: colors.ink, paddingBottom: 2 },
  amountInput: { fontSize: 15, fontWeight: '600', color: colors.ink, minWidth: 56, textAlign: 'right', padding: 0, fontVariant: ['tabular-nums'] },
  amountUnit: { fontSize: 15, fontWeight: '600', color: colors.ink },
  noteBox: { paddingVertical: 10, paddingHorizontal: 14, borderTopWidth: 1, borderTopColor: colors.line },
  noteInput: { fontSize: 15, fontWeight: '400', color: colors.ink, minHeight: 44, padding: 0 },
});
