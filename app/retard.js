// Écran 21 · Tâche en retard — sheet de l'ASSIGNÉ (maquette Jeanne, 1er sept 2026).
// Ouvert depuis une rangée en retard du Planning. La vue lecture du non-assigné
// viendra avec l'invitation réelle. `?occ=&tid=&title=&emoji=&mins=&due=`.
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Card, Avatar } from '../src/components/ui';
import { SheetHandle, CheckCircle } from '../src/components/social/extra';
import { me, partner, fmtMin } from '../src/demo';
import { missionDone } from '../src/demo-core';
import { moveOccurrence, toggleOccurrence, takeOver, giveBack, wasPartnersTask } from '../src/occ-actions';
import { Row, ConfirmBlock, PillChip, Caption, Arrow } from '../src/components/task/proto';
import { Animated, FadeIn, useCheckPop } from '../src/components/motion';
import { useSheetGrow } from '../src/components/sheet-grow';
import { fmtWeekday } from '../src/demo-task';
import { sendPing } from '../src/activity-actions';
import { getUid } from '../src/identity';
import { postponeMalus, malusPoints, clearMalusFor } from '../src/malus-actions';
import { read } from '../src/store';
import { requestSwap } from '../src/swap-actions';
import { localIso, addDaysIso } from '../src/dates';
import copy from '../src/data/copy.json';
import { colors, space, font, motion } from '../src/theme';

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const CLOSE_AFTER = 1700; // la confirmation reste lisible avant la fermeture (comme la sheet Tâche)

export default function Retard() {
  // Décision Jeanne (6 sept 2026) : le malus n'apparaît QUE dans le bouton recommandé
  // (« ≈1h · efface 8 pt de malus ») — variante b des trois proposées ; a (légende sous
  // le titre) et c (note en bas) restent accessibles par ?v= pour comparaison.
  const { occ: occId, tid, title, emoji, mins, due, v = 'b', other: otherParam, ask: askParam } = useLocalSearchParams(); // other=1 / ask=1 : variantes figées pour les captures
  const insets = useSafeAreaInsets();
  const t = copy.retard;
  const daysLate = due ? Math.max(1, Math.round((new Date(localIso()) - new Date(String(due))) / 86400000)) : 1;
  // le VRAI malus de cette occurrence (SPECS §4) : déjà posé par sweepMissed, sinon
  // celui qui tombera (importance × (1 + retard × 0,5)) — plus de « +1 » de démo
  const [points, setPoints] = useState(null);
  // la tâche en retard de l'AUTRE (10 sept 2026) : pas « je le fais / repasser / décaler » mais
  // « petit rappel » ou « je m'en occupe »
  const [other, setOther] = useState(otherParam === '1');
  const [theirs, setTheirs] = useState(false); // c'était la tâche de l'autre de base → « Rendre à » sans validation
  const [asking, setAsking] = useState(askParam === '1'); // « Décaler à un autre jour » déplié
  const [busy, setBusy] = useState([]);
  const [moveMsg, setMoveMsg] = useState(null);
  const [confirm, setConfirm] = useState(null); // { kind, title, sub, who?, pill? }
  const onGrowLayout = useSheetGrow(asking);
  useEffect(() => {
    (async () => {
      const [malus, tasks, occs] = await Promise.all([read('malus'), read('tasks'), read('occurrences')]);
      const row = occs.find(o => o.id === String(occId));
      const uid = getUid();
      if (row) {
        setOther(!!(row.assignee_id && uid && row.assignee_id !== uid));
        setBusy(occs.filter(o => o.id !== row.id && o.task_id === row.task_id && o.kind === row.kind && o.status !== 'skipped').map(o => o.due_date));
      }
      setTheirs(await wasPartnersTask(String(occId)));
      const posed = malus.filter(m => m.occurrence_id === String(occId)).reduce((a, m) => a + Number(m.points || 0), 0);
      const tk = tasks.find(x => x.id === String(tid));
      setPoints(posed || malusPoints(tk?.importance, daysLate));
    })();
  }, [occId]);
  const fmtPts = n => String(Math.round(n * 10) / 10).replace('.', ',');

  const close = () => router.back();
  // toutes les actions passent par une confirmation animée puis la sheet se referme (Jeanne, 10 sept 2026)
  const finish = c => { setConfirm(c); setTimeout(close, CLOSE_AFTER); };
  const days = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.now() + (i + 1) * 86400000);
    return { iso: localIso(d), label: copy.calendar.dowsLong[(d.getDay() + 6) % 7].toLowerCase(), long: fmtWeekday(d) };
  });
  const pop = useCheckPop(!!confirm && confirm.kind === 'done');
  const doNow = () => {
    if (confirm) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (occId) {
      missionDone.set(String(occId), true);
      toggleOccurrence(String(occId), true, Number(mins) || undefined).catch(() => {});
      clearMalusFor(String(occId)).catch(() => {}); // faite, même en retard : le malus s'efface
    }
    setConfirm({ kind: 'done', title: copy.mission.confirmDone, sub: fill(copy.mission.doneSub, { time: fmtMin(Number(mins) || 15) }) });
    setTimeout(close, 1200);
  };
  const swap = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    // binôme réel → vraie proposition (+1 dette à l'acceptation, SPECS §6)
    await requestSwap(String(occId || '')).catch(() => {});
    finish({ kind: 'swap', who: partner, title: fill(copy.mission.confirmSwap, { name: partner.first_name }), sub: copy.mission.confirmSwapSub, pill: copy.mission.confirmSwapPill });
  };
  // c'était sa tâche : elle lui revient tout de suite
  const give = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    await giveBack(String(occId || '')).catch(() => {});
    finish({ kind: 'swap', who: partner, title: fill(t.confirmGiveBack, { name: partner.first_name }), sub: fill(t.confirmGiveBackSub, { name: partner.first_name }) });
  };
  const ping = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    await sendPing(String(occId || ''), 'reminder').catch(() => {});
    finish({ kind: 'swap', who: partner, title: fill(t.confirmPing, { name: partner.first_name }), sub: t.confirmPingSub });
  };
  const take = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    await takeOver(String(occId || '')).catch(() => {});
    finish({ kind: 'done', title: copy.mission.confirmTake, sub: fill(copy.mission.confirmTakeSub, { name: partner.first_name }) });
  };
  // « Décaler à un autre jour » (Jeanne, 10 sept 2026) : on choisit le jour, puis confirmation
  const moveTo = async d => {
    if (busy.includes(d.iso)) { setMoveMsg(fill(copy.mission.moveBusy, { day: d.long })); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {}); return; }
    const r = await moveOccurrence(String(occId || ''), d.iso);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (r.ok) postponeMalus(String(occId)).catch(() => {}); // « +1 malus mais ça passe »
    if (r.ok || r.reason === 'introuvable') finish({ kind: 'moved', title: fill(copy.mission.confirmMoved, { day: d.long }), sub: fill(copy.mission.confirmMovedSub, { name: partner.first_name }) });
    else Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  };

  // ─── même langage que la sheet Tâche (Jeanne, 10 sept 2026 : « unifie l'UI ») :
  // titre + rond, ligne méta, puis des lignes dans des cartes — ni émoji ni Mochi.
  const who = other ? partner : me;
  const head = (
    <View style={s.head}>
      <View style={s.titleRow}>
        <Text style={[s.title, { flex: 1 }]} numberOfLines={2}>{title || t.fallbackTitle}</Text>
        {other ? null : (
          <Pressable onPress={doNow} hitSlop={12} accessibilityRole="button" accessibilityLabel={copy.mission.doneLabel}>
            <Animated.View style={pop}><CheckCircle done={!!confirm && confirm.kind === 'done'} size={26} /></Animated.View>
          </Pressable>
        )}
      </View>
      <View style={s.meta}>
        <Avatar initial={who.initial} color={who.color} photo={who.avatar_url} size={18} />
        <Text style={s.metaTxt}>{other ? partner.first_name : copy.mission.metaYou} · </Text>
        <Text style={[s.metaTxt, s.late]}>{fill(t.lateCaption, { n: daysLate })}</Text>
        <Text style={s.metaTxt}> · {fill(copy.mission.metaApprox, { time: fmtMin(Number(mins) || 15) })}</Text>
      </View>
    </View>
  );
  if (confirm) {
    return (
      <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]}>
        <SheetHandle />
        {head}
        <Animated.View entering={FadeIn.duration(motion.micro)}><ConfirmBlock {...confirm} /></Animated.View>
      </View>
    );
  }
  const pAvatar = <Avatar initial={partner.initial} color={partner.color} photo={partner.avatar_url} size={22} />;
  return (
    <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 31) }]} onLayout={onGrowLayout}>
      <SheetHandle />
      {head}

      {other ? (
        <Card r={16} padding={0}>
          <Row first strong label={fill(t.pingOther, { name: partner.first_name })} sub={t.pingOtherSub} left={pAvatar} right={<PillChip label={t.pingBtn} selected onPress={ping} />} onPress={ping} />
          <Row strong label={t.takeOther} sub={fill(t.takeOtherSub, { name: partner.first_name })} left={<Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={22} />} right={<Arrow />} onPress={take} />
        </Card>
      ) : (
        <>
          <Card r={16} padding={0} style={s.block} accent={colors.sage}>
            <Row first strong label={t.doNow} sub={points != null ? fill(t.doNowSubMalus, { time: fmtMin(Number(mins) || 15), pts: fmtPts(points) }) : fill(t.doNowSub, { time: fmtMin(Number(mins) || 15) })} right={<Arrow />} onPress={doNow} />
          </Card>
          <Card r={16} padding={0}>
            <Row first strong label={fill(theirs ? t.giveBack : t.swap, { name: partner.first_name })} sub={theirs ? t.giveBackSub : fill(t.swapSub, { name: partner.first_name })} left={pAvatar} right={<PillChip label={theirs ? t.giveBtn : copy.mission.swapBtn} selected onPress={theirs ? give : swap} />} onPress={theirs ? give : swap} />
            <Row strong label={t.moveOther} sub={t.moveOtherSub} right={<Text style={[s.chev, asking && { transform: [{ rotate: '90deg' }] }]}>›</Text>} onPress={() => { Haptics.selectionAsync().catch(() => {}); setAsking(a => !a); setMoveMsg(null); }} />
            {asking ? (
              <Animated.View entering={FadeIn.duration(motion.micro)} style={s.moveBox}>
                <View style={s.days}>
                  {days.map(d => <PillChip key={d.iso} flex label={d.label} dim={busy.includes(d.iso)} onPress={() => moveTo(d)} />)}
                </View>
                <Caption style={{ textAlign: 'left' }}>{moveMsg || fill(copy.mission.moveWarn, { name: partner.first_name })}</Caption>
              </Animated.View>
            ) : null}
          </Card>
        </>
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
  late: { color: colors.coralDeep, fontWeight: '600' },
  block: { marginBottom: 8 },
  chev: { fontSize: 16, color: colors.muted },
  moveBox: { paddingHorizontal: 14, paddingBottom: 12, gap: 9, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10 },
  days: { flexDirection: 'row', gap: 6 },
});
