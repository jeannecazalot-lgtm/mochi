// Écran 23 · Point hebdo (malus de la semaine). Refait le 8 sept 2026 dans la DA actuelle
// (retour Jeanne : « l'écran malus n'est pas adapté à la nouvelle DA ») et sur les VRAIS
// malus : par personne, liste de la semaine, remise à zéro naturelle chaque lundi.
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, Micro, Avatar, Divider } from '../src/components/ui';
import { ScreenHeader } from '../src/components/balance/extra';
import { LiveMochi } from '../src/components/motion';
import { me, partner } from '../src/demo';
import { getUid, useIdentity, loadIdentity } from '../src/identity';
import { loadSetup, inRealMode } from '../src/setup-state';
import { weekMalus } from '../src/malus-actions';
import { occStore, weekDays } from '../src/demo-core';
import copy from '../src/data/copy.json';
import { colors, space, radius, font, slotColors } from '../src/theme';

const t = copy.pointHebdo;
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const fmtPts = n => String(Math.round(n * 10) / 10).replace('.', ',');
const deep = m => slotColors[m.slot]?.deep ?? colors.ink;

export default function PointHebdo() {
  useIdentity();
  const occV = occStore.useVersion();
  const [items, setItems] = useState(null);
  useEffect(() => {
    (async () => {
      await loadSetup();
      if (!inRealMode()) { setItems([]); return; }
      await loadIdentity();
      setItems(await weekMalus().catch(() => []));
    })();
  }, [occV]);
  const uid = getUid();
  const list = items || [];
  const mine = list.filter(m => m.user_id === uid);
  const other = list.filter(m => m.user_id !== uid);
  const sum = l => l.reduce((a, m) => a + Number(m.points || 0), 0);
  const sunday = weekDays(new Date())[6];
  const dayLabel = `${new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(sunday).replace('.', '')} ${sunday.getDate()}`;
  const total = sum(list);

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScreenHeader title={t.title} onBack={() => router.back()} />
        <ScrollView contentContainerStyle={{ paddingHorizontal: space.headerX, paddingTop: 6, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}><PillLabel color={colors.coralDeep} tint={colors.coral}>{fill(t.pill, { day: dayLabel })}</PillLabel></View>
          <Text style={s.intro}>{t.intro}</Text>

          {/* deux tuiles : mes points, ses points */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 18 }}>
            {[{ who: me, pts: sum(mine) }, { who: partner, pts: sum(other) }].map(({ who, pts }) => (
              <Card key={who.id} padding={14} r={radius.row} style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Avatar initial={who.initial} color={who.color} photo={who.avatar_url} size={22} />
                  <Text style={[s.tileName, { color: deep(who) }]}>{who.id === me.id ? t.mine : who.first_name}</Text>
                </View>
                <Text style={s.tileNum}>{fmtPts(pts)} <Text style={s.tileUnit}>pt</Text></Text>
              </Card>
            ))}
          </View>

          <Micro style={{ marginTop: 22, marginBottom: 8, paddingHorizontal: 4 }}>{t.detail}</Micro>
          <Card padding={0} r={radius.row}>
            {items === null ? null : list.length === 0 ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 }}>
                <LiveMochi size={40} mood="happy" float={false} />
                <Text style={[font.secondary, { flex: 1 }]}>{t.none}</Text>
              </View>
            ) : list.map((m, i) => {
              const who = m.user_id === uid ? me : partner;
              return (
                <View key={m.id}>
                  {i > 0 ? <Divider /> : null}
                  <View style={s.row}>
                    <Text style={{ fontSize: 18 }}>{m.task_emoji || '⏰'}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={s.rowTitle} numberOfLines={1}>{m.task_title || t.postponedTitle}</Text>
                      <Text style={s.rowSub}>{m.occurrence_id ? t.missed : t.postponed}</Text>
                    </View>
                    <Text style={s.rowPts}>{fill(t.pts, { n: fmtPts(m.points) })}</Text>
                    <Avatar initial={who.initial} color={who.color} photo={who.avatar_url} size={22} />
                  </View>
                </View>
              );
            })}
          </Card>
          <Text style={s.note}>{total > 0 ? t.resetNote : t.resetNoteEmpty}</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  intro: { ...font.secondary, lineHeight: 20 },
  tileName: { fontSize: 11.5, fontWeight: '600', letterSpacing: 0.4, textTransform: 'uppercase' },
  tileNum: { fontSize: 24, fontWeight: '600', letterSpacing: -0.8, color: colors.ink, fontVariant: ['tabular-nums'] },
  tileUnit: { fontSize: 13, fontWeight: '500', color: colors.muted, letterSpacing: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  rowTitle: { fontSize: 15, fontWeight: '500', color: colors.ink },
  rowSub: { ...font.caption, marginTop: 2 },
  rowPts: { fontSize: 14, fontWeight: '600', color: colors.coralDeep, fontVariant: ['tabular-nums'] },
  note: { ...font.caption, textAlign: 'center', marginTop: 14, paddingHorizontal: 12 },
});
