// Check-in d'humeur (étape 4, 4 nov 2026) : matin (ou soir en mode nuit), 3 états, 1 perle, et ce que Mochi en retient :
// la charge ressentie face aux missions faites. Données : mochi_checkins (migration 0013). Démo sans foyer.
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CTAPrimary } from '../src/components/ui';
import { Label, Hair } from '../src/components/mochi/gauges';
import { useTokens, type, layout } from '../src/theme-v3';
import { frameFor, MOCHI_RATIO } from '../src/components/mochi-img';
import { me, partner } from '../src/demo';
import { read } from '../src/store';
import { loadSetup, inRealMode } from '../src/setup-state';
import { getUid, getPartnerUid } from '../src/identity';
import { localIso, addDaysIso } from '../src/dates';
import { computeRealBalance } from '../src/balance-real';
import { checkin } from '../src/mochi-state';
import copy from '../src/data/copy.json';

const fill = (s, vars) => Object.keys(vars).reduce((acc, k) => acc.replace(`{${k}}`, vars[k]), s);
const DEMO = { mine: [1, 2, 1, 1, 2, 1, null], theirs: [2, 2, 3, 2, 2, 2, 2], pct: 42 };

export default function Checkin() {
  const t = copy.checkin;
  const T = useTokens();
  const moment = T.night ? 'evening' : 'morning';
  const [mood, setMood] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    (async () => {
      await loadSetup();
      if (!inRealMode()) { setData(DEMO); return; }
      const [rows, occs] = await Promise.all([read('mochi_checkins'), read('occurrences')]);
      const uid = getUid(), pid = getPartnerUid();
      const days = [6, 5, 4, 3, 2, 1, 0].map(k => addDaysIso(-k));
      const pick = (u, d) => rows.find(r => r.user_id === u && r.day === d && r.moment === 'morning')?.mood ?? null;
      const bal = computeRealBalance(occs, uid);
      const mine = bal.parts?.find(p => p.member?.id === me.id) || bal.parts?.[0];
      const today = rows.find(r => r.user_id === uid && r.day === localIso() && r.moment === moment);
      if (today) setMood(today.mood);
      setData({ mine: days.map(d => pick(uid, d)), theirs: days.map(d => pick(pid, d)), pct: mine ? mine.pct : 0, partnerToday: pick(pid, localIso()) });
    })();
  }, []);
  const d = data || DEMO;
  const charged = d.mine.filter(x => x === 1).length;
  const partnerAnswer = d.partnerToday ?? (data === DEMO || !data ? 2 : null);
  const save = async () => { if (mood) await checkin(mood, moment).catch(() => {}); router.back(); };
  const X = layout.x;
  const Cell = ({ v }) => <View style={{ flex: 1, height: 14, borderRadius: 2, backgroundColor: v == null ? T.seg : v === 1 ? T.accent : v === 2 ? T.muted : T.ink, opacity: v == null ? 1 : v === 2 ? 0.6 : 1 }} />;
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ paddingHorizontal: X, paddingTop: 36, alignItems: 'center' }}>
          <Image source={frameFor(0, T.night ? 'sleeping' : 'wink')} style={{ width: 96, height: 96 * MOCHI_RATIO }} resizeMode="contain" />
          <Text style={[type.name, { color: T.ink, marginTop: 18, textAlign: 'center', fontSize: 26 }]}>{moment === 'morning' ? fill(t.morningTitle, { name: me.first_name }) : t.eveningTitle}</Text>
          <Text style={[type.sub, { color: T.muted, marginTop: 8, textAlign: 'center' }]}>{partnerAnswer ? fill(t.sub, { name: partner.first_name, answer: t.moods[partnerAnswer].toLowerCase() }) : fill(t.subNone, { name: partner.first_name })}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 28, paddingHorizontal: X }}>
          {[1, 2, 3].map(v => (
            <Pressable key={v} onPress={() => setMood(v)} style={{ flex: 1, paddingVertical: 18, borderRadius: 14, borderWidth: 1.5, borderColor: mood === v ? T.ink : T.line, backgroundColor: mood === v ? T.ink : 'transparent', alignItems: 'center' }}>
              <Text style={[type.body, { color: mood === v ? T.bg : T.ink }]}>{t.moods[v]}</Text>
            </Pressable>))}
        </View>
        <View style={{ marginHorizontal: X, marginTop: 32, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, paddingTop: 20 }}>
          <Text style={[type.section, { color: T.ink }]}>{t.retainTitle}</Text>
          <Text style={[type.sub, { color: T.muted, marginTop: 8 }]}>{fill(t.retain, { pct: d.pct, days: t.days[charged] })}</Text>
          <View style={{ marginTop: 18, gap: 12 }}>
            <View><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Label T={T}>{t.done}</Label><Label T={T}>{d.pct} %</Label></View><View style={{ height: 8, borderRadius: 4, backgroundColor: T.seg, marginTop: 6, overflow: 'hidden' }}><View style={{ width: `${Math.min(100, d.pct)}%`, height: 8, backgroundColor: T.ink }} /></View></View>
            <View><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Label T={T}>{t.felt}</Label><Label T={T}>{Math.round(charged / 7 * 100)} %</Label></View><View style={{ height: 8, borderRadius: 4, backgroundColor: T.seg, marginTop: 6, overflow: 'hidden' }}><View style={{ width: `${Math.round(charged / 7 * 100)}%`, height: 8, backgroundColor: T.accent }} /></View></View>
          </View>
          <Label T={T} style={{ marginTop: 20 }}>{t.week}</Label>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}><Label T={T} style={{ width: 54 }}>{me.first_name}</Label><View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>{d.mine.map((v, i) => <Cell key={i} v={v} />)}</View></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}><Label T={T} style={{ width: 54 }}>{partner.first_name}</Label><View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>{d.theirs.map((v, i) => <Cell key={i} v={v} />)}</View></View>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ paddingHorizontal: X, paddingBottom: 16 }}><CTAPrimary big label={t.cta} onPress={save} disabled={!mood} /></View>
      </SafeAreaView>
    </View>
  );
}
