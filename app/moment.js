// Moments plein écran de « Mochi qu'on élève » (étape 2, 4 nov 2026) : éclosion, retour de balade, passage de palier.
// Source = mochi_events non vus par moi (seen_by) ; chacun des deux les reçoit. Démo : /moment?demo=hatch|walk_return|stage_up
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Burst } from '../src/components/motion';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CTAPrimary } from '../src/components/ui';
import { Scene } from '../src/components/mochi/scene';
import { Label, Num } from '../src/components/mochi/gauges';
import { useTokens, type, layout } from '../src/theme-v3';
import { unseenMoments, markSeen, getMochi, PEARLS, STAGES } from '../src/mochi-state';
import items from '../src/data/mochi-items.json';
import { read } from '../src/store';
import { isLive } from '../src/occ-actions';
import copy from '../src/data/copy.json';

const fill = (s, vars) => Object.keys(vars).reduce((acc, k) => acc.replace(`{${k}}`, vars[k]), s);
const DEMO = {
  hatch: { type: 'hatch', payload: {}, created_at: new Date().toISOString() },
  walk_return: { type: 'walk_return', payload: { souvenir_key: 'jardin-01', place: 'jardin' }, created_at: new Date().toISOString() },
  stage_up: { type: 'stage_up', payload: { from: 'mini', to: 'mochi' }, created_at: new Date().toISOString() },
  week_closed: { type: 'week_closed', payload: { healthy: true, done_pct: 86, gap_pct: 6, sick: false }, created_at: new Date().toISOString() },
};
const fmtTime = iso => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', ' h ');

export default function Moment() {
  const t = copy.moments;
  const T = useTokens();
  const insets = useSafeAreaInsets();
  const { height: SH } = useWindowDimensions(); const sceneH = Math.round(SH * 0.46);
  const { demo } = useLocalSearchParams();
  const [queue, setQueue] = useState(demo ? [DEMO[demo] || DEMO.hatch] : null);
  const [mochi, setMochi] = useState(null);
  useEffect(() => { if (!demo) unseenMoments().then(q => { if (!q.length) router.back(); else setQueue(q); }); getMochi().then(setMochi); }, []);
  if (!queue) return <View style={{ flex: 1, backgroundColor: T.bg }} />;
  const ev = queue[0];
  const m = mochi || { stage: ev.payload?.to || 'mini', hearts: 5 };
  const souvenir = ev.type === 'walk_return' && ev.payload?.souvenir_key ? items.souvenirs.find(s => s.key === ev.payload.souvenir_key) : null;
  const place = items.placeTo[ev.payload?.place] || 'dehors';
  const stageAfter = ev.type === 'hatch' ? 'mini' : ev.type === 'stage_up' ? ev.payload?.to || m.stage : m.stage;
  const k = Math.max(1, STAGES.indexOf(stageAfter));
  const lvl = ev.type === 'hatch' ? 1 : ev.type === 'walk_return' ? 2 : k >= 3 ? 4 : 3;
  const wk = ev.payload || {};
  const title = ev.type === 'hatch' ? t.hatchTitle : ev.type === 'walk_return' ? t.returnTitle : ev.type === 'week_closed' ? (wk.healthy ? t.weekTitleOk : t.weekTitleKo) : t.stageTitle;
  const sub = ev.type === 'hatch' ? t.hatchSub
    : ev.type === 'week_closed' ? (wk.done_pct == null ? t.weekSubEmpty : wk.sick ? fill(t.weekSubSick, { done: wk.done_pct }) : fill(t.weekSub, { done: wk.done_pct, gap: wk.gap_pct }))
    : ev.type === 'walk_return' ? (souvenir ? fill(t.returnSub, { place, label: souvenir.label.toLowerCase() }) : fill(t.returnEmpty, { place }))
    : fill(t.stageSub, { weeks: m.healthy_weeks || k, k });
  const next = async () => {
    if (!demo) await markSeen(ev).catch(() => {});
    const rest = queue.slice(1);
    if (rest.length) { setQueue(rest); return; }
    // éclosion réelle et rien d'encore réparti : on enchaîne sur le choix des missions à deux (8 nov 2026, Jeanne : « ça m'a pas proposé de remplir des missions »)
    if (!demo && ev.type === 'hatch') { try { const occs = await read('occurrences'); if (!occs.some(isLive)) { router.replace('/(setup)/taches'); return; } } catch (e) { /* retour simple */ } }
    router.back();
  };
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}><Scene T={T} stage={stageAfter} mood={ev.type === 'week_closed' && !wk.healthy ? 'neutral' : T.night ? 'sleeping' : 'wink'} lvl={lvl} height={sceneH} />{ev.type !== 'walk_return' && !(ev.type === 'week_closed' && !wk.healthy) ? <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: sceneH }}><Burst count={18} colors={[T.accent, T.ok, T.scene.lamp, T.ink]} dist={150} delay={200} /></View> : null}</View>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ height: Math.max(8, sceneH - insets.top) }} />
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: layout.x, paddingBottom: 12 }}>
          <Animated.View entering={FadeInDown.delay(200).duration(320)} style={{ alignItems: 'center' }}><Label T={T}>{fill(t.kicker, { time: fmtTime(ev.created_at) })}</Label>
          <Text style={{ fontSize: 28, fontWeight: '600', letterSpacing: -0.8, lineHeight: 34, color: T.ink, textAlign: 'center', marginTop: 8 }}>{title}</Text>
          <Text style={{ fontSize: 17, lineHeight: 24, color: T.muted, textAlign: 'center', marginTop: 12, maxWidth: 340 }}>{sub}</Text></Animated.View>
          {ev.type === 'walk_return' ? (
            <Animated.View entering={FadeInUp.delay(500).springify().damping(16)} style={[s.pearls, { borderColor: T.line }]}>
              <View style={{ flex: 1 }}>{souvenir ? <><Text style={[type.section, { color: T.ink }]}>{souvenir.label}</Text><Label T={T} style={{ marginTop: 2 }}>{items.places[souvenir.place]}</Label></> : <Label T={T}>{items.places[ev.payload?.place] || ''}</Label>}</View>
              <Num T={T} style={{ color: T.accent }}>{fill(t.pearls, { n: PEARLS.fullDay })}</Num>
            </Animated.View>
          ) : null}
        </View>
        <View style={{ paddingHorizontal: layout.x, paddingBottom: 16 }}><CTAPrimary big label={queue.length > 1 ? t.cta : t.ctaLast} onPress={next} /></View>
      </SafeAreaView>
    </View>
  );
}
const s = StyleSheet.create({ pearls: { marginTop: 22, paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', gap: 12 } });
