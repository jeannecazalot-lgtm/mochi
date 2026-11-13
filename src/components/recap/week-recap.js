// ═════════════════════════════════════════════════════════════════
// Récap de la semaine (13 nov 2026, Jeanne : « une page qui s'ouvre sur la home »).
// Ouvert par le moment `week_closed` (dimanche 20 h, Accueil ou notification) et depuis la Balance.
// Les trois promesses : ce que Mochi y gagne (jeu), qui a porté quoi (équité), ce qui a été fait,
// puis la semaine qui vient (gratuit : « Préparer la semaine » ; Mochi+ : déjà prête).
// ═════════════════════════════════════════════════════════════════
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CTAPrimary, Avatar } from '../ui';
import { Scene } from '../mochi/scene';
import { Label, Num } from '../mochi/gauges';
import { useTokens, type, layout } from '../../theme-v3';
import { read } from '../../store';
import { getMochi, STAGES, STAGE_AT, stageFor } from '../../mochi-state';
import { getUid, getPartnerUid } from '../../identity';
import { me, partner, fmtMin } from '../../demo';
import { isPremium } from '../../demo-premium';
import { addDaysIso } from '../../dates';
import { mondayOf } from '../../week';
import { LOCALE, isEN } from '../../lang';
import copy from '../../copy';

const fill = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '');
const at = iso => new Date(iso + 'T12:00:00');
const fmtDay = iso => new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short' }).format(at(iso)).replace('.', '');

const DEMO = {
  done: 24, total: 28, pearls: 86, next: 0,
  people: [{ who: 'me', min: 310, n: 13, top: ['Cuisiner', 'Courses'] }, { who: 'partner', min: 300, n: 11, top: ['Vaisselle', 'Lessive'] }],
  missed: ['Lessive', 'Plantes'], mochi: { stage: 'mini', healthy_weeks: 1, hearts: 5 },
};

async function loadRecap(ev) {
  const ws = ev.payload?.week_start; if (!ws) return null;
  const we = addDaysIso(6, at(ws)); const n0 = addDaysIso(7, at(ws)); const n6 = addDaysIso(13, at(ws));
  const [occs, tasks, evs, mochi] = await Promise.all([read('occurrences'), read('tasks'), read('mochi_events').catch(() => []), getMochi().catch(() => null)]);
  const byTask = Object.fromEntries(tasks.map(t => [t.id, t]));
  const live = o => o.status !== 'skipped';
  const week = occs.filter(o => live(o) && o.due_date >= ws && o.due_date <= we);
  const done = week.filter(o => o.status === 'done'), missed = week.filter(o => o.status === 'missed');
  const uid = getUid(), puid = getPartnerUid();
  const per = { me: { who: 'me', min: 0, n: 0, tasks: {} }, partner: { who: 'partner', min: 0, n: 0, tasks: {} } };
  for (const o of done) {
    const min = o.duration_min || byTask[o.task_id]?.duration_min || 15; const title = byTask[o.task_id]?.title || '';
    const keys = !o.assignee_id ? ['me', 'partner'] : [o.assignee_id === uid ? 'me' : 'partner'];
    for (const k of keys) { per[k].min += min / keys.length; per[k].n += 1; if (title) per[k].tasks[title] = (per[k].tasks[title] || 0) + 1; }
  }
  const people = [per.me, ...(puid ? [per.partner] : [])].map(p => ({ ...p, min: Math.round(p.min), top: Object.entries(p.tasks).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([t]) => t) }));
  const pearls = evs.filter(e => e.type === 'pearls' && String(e.created_at).slice(0, 10) >= ws && String(e.created_at).slice(0, 10) <= we).reduce((a, e) => a + (e.payload?.delta || 0), 0);
  const next = occs.filter(o => live(o) && o.due_date >= n0 && o.due_date <= n6).length;
  return { done: done.length, total: done.length + missed.length, pearls, next, people, missed: [...new Set(missed.map(o => byTask[o.task_id]?.title).filter(Boolean))].slice(0, 3), mochi };
}

// sections et lignes hors du composant : recréées à chaque rendu, elles rejouaient leur animation d'entrée
function Section({ T, title, children, delay = 0 }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(300)} style={[s.section, { borderColor: T.line }]}>
      <Text style={[type.section, { color: T.ink, marginBottom: 10 }]}>{title}</Text>{children}
    </Animated.View>
  );
}
function Row({ T, label, value, accent }) {
  return <View style={s.row}><Label T={T} style={{ flex: 1 }}>{label}</Label><Text style={[type.body, { color: accent ? T.accent : T.ink, fontWeight: '600' }]}>{value}</Text></View>;
}

export function WeekRecap({ ev, demo = false, onDone, ctaLabel }) {
  const t = copy.recap; const tm = copy.moments;
  const T = useTokens();
  const insets = useSafeAreaInsets();
  const { height: SH } = useWindowDimensions(); const sceneH = Math.round(SH * 0.36);
  const [d, setD] = useState(demo ? DEMO : null);
  useEffect(() => { if (!demo) loadRecap(ev).then(setD).catch(() => setD(null)); }, [ev]);
  const wk = ev.payload || {};
  const ws = wk.week_start || mondayOf(addDaysIso(-6)); // démo : la semaine qui vient de finir
  const m = d?.mochi || { stage: 'mini', healthy_weeks: 0 };
  const hw = m.healthy_weeks || 0; const k = Math.max(1, STAGES.indexOf(m.stage));
  const nextStage = STAGES[STAGES.indexOf(stageFor(hw)) + 1];
  const left = nextStage ? Math.max(1, (STAGE_AT[nextStage] || 0) - hw) : 0;
  const title = wk.done_pct == null ? tm.weekTitleOk : (wk.healthy ? tm.weekTitleOk : tm.weekTitleKo);
  const sub = wk.done_pct == null ? tm.weekSubEmpty : wk.sick ? fill(tm.weekSubSick, { done: wk.done_pct }) : fill(tm.weekSub, { done: wk.done_pct, gap: wk.gap_pct });
  const plus = isPremium();
  const total = (d?.people || []).reduce((a, p) => a + p.min, 0) || 1;
  const person = p => (p.who === 'me' ? me : partner);
  const go = route => { onDone?.({ silent: true }); setTimeout(() => router.push(route), 50); };
  const X = layout.x;
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        <Scene T={T} stage={m.stage === 'egg' ? 'mini' : m.stage} mood={wk.healthy === false ? 'neutral' : T.night ? 'sleeping' : 'wink'} lvl={k >= 3 ? 4 : 3} height={sceneH} />
        <View style={{ paddingHorizontal: X, marginTop: 14 }}>
          <Animated.View entering={FadeInDown.delay(120).duration(320)} style={{ alignItems: 'center' }}>
            <Label T={T}>{fill(t.kicker, { from: fmtDay(ws), to: fmtDay(addDaysIso(6, at(ws))) })}</Label>
            <Text style={{ fontSize: 28, fontWeight: '600', letterSpacing: -0.8, lineHeight: 34, color: T.ink, textAlign: 'center', marginTop: 8 }}>{title}</Text>
            <Text style={{ fontSize: 16, lineHeight: 23, color: T.muted, textAlign: 'center', marginTop: 10, maxWidth: 360 }}>{sub}</Text>
          </Animated.View>

          <Section T={T} title={t.gainTitle} delay={220}>
            <Row T={T} label={t.heartLabel} value={wk.healthy ? t.heartUp : wk.sick ? t.heartSick : t.heartNone} accent={wk.healthy} />
            <Row T={T} label={t.stageLabel} value={wk.counts === false ? t.stageNotCounted : nextStage ? fill(left === 1 ? t.stageNextOne : t.stageNext, { n: left, k: STAGES.indexOf(nextStage) }) : t.stageMax} />
            <Row T={T} label={t.pearlsLabel} value={fill(t.pearls, { n: d?.pearls ?? 0 })} accent />
          </Section>

          {d?.people?.length ? (
            <Section T={T} title={t.splitTitle} delay={300}>
              {d.people.length > 1 ? (
                <View style={[s.bar, { backgroundColor: T.seg }]}>{d.people.map(p => <View key={p.who} style={{ flex: Math.max(0.0001, p.min / total), backgroundColor: person(p).color }} />)}</View>
              ) : null}
              {d.people.map(p => (
                <View key={p.who} style={s.person}>
                  <Avatar initial={person(p).initial} color={person(p).color} photo={person(p).avatar_url} size={30} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={[type.body, { color: T.ink, fontWeight: '600' }]}>{person(p).first_name}</Text>
                    <Label T={T} numberOfLines={1}>{p.n ? [fill(p.n === 1 ? t.splitLineOne : t.splitLine, { time: fmtMin(p.min), n: p.n }), p.top.join(', ')].filter(Boolean).join(' · ') : t.splitNone}</Label>
                  </View>
                  <Num T={T}>{Math.round(p.min / total * 100)}{isEN ? '%' : ' %'}</Num>
                </View>
              ))}
            </Section>
          ) : null}

          {d && d.total ? (
            <Section T={T} title={t.doneTitle} delay={380}>
              <Text style={[type.body, { color: T.ink }]}>{fill(t.doneLine, { done: d.done, total: d.total })}</Text>
              {d.missed.length ? <Label T={T} style={{ marginTop: 6 }}>{fill(t.missed, { list: d.missed.join(', ') })}</Label> : null}
            </Section>
          ) : null}

          <Section T={T} title={t.nextTitle} delay={460}>
            {d && d.next ? (
              <>
                <Text style={[type.body, { color: T.ink }]}>{fill(plus ? t.nextReadyPlus : t.nextReady, { n: d.next })}</Text>
                <Pressable onPress={() => go('/(tabs)/planning')} hitSlop={8} style={{ marginTop: 8 }}><Text style={{ color: T.accent, fontWeight: '600' }}>{t.nextPlanner}</Text></Pressable>
              </>
            ) : (
              <>
                <Text style={[type.body, { color: T.ink }]}>{t.nextEmpty}</Text>
                <View style={{ marginTop: 12 }}><CTAPrimary label={t.nextCta} onPress={() => go('/semaine')} /></View>
                {!plus ? (
                  <Pressable onPress={() => go('/paywall?from=plan')} hitSlop={8} style={{ marginTop: 12, alignItems: 'center' }}>
                    <Text style={{ fontSize: 13.5, color: T.muted, textAlign: 'center' }}>{t.nextPlus} <Text style={{ color: T.accent, fontWeight: '600' }}>{t.nextPlusCta}</Text></Text>
                  </Pressable>
                ) : null}
              </>
            )}
          </Section>
        </View>
      </ScrollView>
      <Pressable onPress={() => onDone?.()} hitSlop={12} accessibilityLabel={t.close} style={[s.close, { top: insets.top + 8, backgroundColor: 'rgba(255,255,255,0.85)' }]}><Text style={{ fontSize: 18, color: '#1F2A58' }}>×</Text></Pressable>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: X, paddingBottom: insets.bottom + 10, paddingTop: 10, backgroundColor: T.bg }}>
        {d && !d.next ? (
          // « Préparer la semaine » est déjà le bouton principal : ici, un simple lien (un seul bouton orange à l'écran)
          <Pressable onPress={() => onDone?.()} hitSlop={10} style={{ alignItems: 'center', paddingVertical: 12 }}><Text style={{ fontSize: 15, fontWeight: '600', color: T.muted }}>{ctaLabel || t.later}</Text></Pressable>
        ) : <CTAPrimary big label={ctaLabel || t.cta} onPress={() => onDone?.()} />}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  section: { marginTop: 22, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: 'row', alignItems: 'baseline', paddingVertical: 7, gap: 12 },
  bar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  person: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  close: { position: 'absolute', left: 16, width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});
