// Écran 34 · Aperçu « lockscreen » des notifications mochi (démo). Recette : docs/recettes/34-notifs.md
import React from 'react';
import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { RoundButton, AppGlyph, extraColors, cream, sageA } from '../src/components/modaux/extra';
import { partner, balance, fmtMin } from '../src/demo';
import { lockscreen, fmtLongDate } from '../src/demo-modaux';
import copy from '../src/data/copy.json';
import { colors } from '../src/theme';

const app = copy.common.mochi;
const fill = (str, map) => Object.entries(map).reduce((acc, [k, v]) => acc.replace(`{${k}}`, String(v)), str);

export default function Notifs() {
  const t = copy.notifs;
  const when = w => typeof w === 'string' ? t[w] : fill(t.minAgo, { n: w.minAgo });
  const leaningTo = balance.partner >= balance.me ? partner.first_name : copy.common.partner;

  return (
    <View style={s.screen}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="lock" cx="50%" cy="30%" r="75%">
            <Stop offset="0" stopColor={extraColors.lockTop} /><Stop offset="0.65" stopColor={extraColors.lockMid} /><Stop offset="1" stopColor={extraColors.lockDeep} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#lock)" />
      </Svg>

      <View style={s.status}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <RoundButton kind="back" light size={30} onPress={() => router.back()} />
          <Text style={s.statusText}>{lockscreen.clock}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Text style={[s.statusText, { fontSize: 11.5 }]}>{lockscreen.network}</Text>
          <Text style={[s.statusText, { fontSize: 13 }]}>▮▮▮▯</Text>
        </View>
      </View>

      <View style={s.clockBlock}>
        <Text style={s.locked}>🔒 {t.locked}</Text>
        <Text style={s.date}>{fmtLongDate(lockscreen.date)}</Text>
        <Text style={s.time}>{lockscreen.time}</Text>
      </View>

      <View style={s.widget}>
        <Head kicker={fill(t.widgetKicker, { app })} when={t.now} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
          <View style={{ flex: 1 }}>
            <Text style={s.widgetTitle}>{copy.balance.leaning.replace('{name}', leaningTo)}</Text>
            <Text style={s.widgetSub}>{fill(t.widgetSub, { n: lockscreen.widget.gap_min, s: lockscreen.notifs.find(n => n.kind === 'streak').days })}</Text>
          </View>
          <View style={s.bars}>
            {lockscreen.widget.bars.map((h, i, arr) => <View key={i} style={{ width: 4, height: h, borderRadius: 2, backgroundColor: i === arr.length - 1 ? extraColors.peach : cream(0.35) }} />)}
          </View>
        </View>
      </View>

      <View style={s.stack}>
        {lockscreen.notifs.map(n => {
          if (n.kind === 'ping') return (
            <View key={n.id} style={s.notif}>
              <Head kicker={fill(t.appKicker, { app })} when={when(n.when)} />
              <Text style={s.nTitle}>{fill(t.pingTitle, { name: n.from.first_name })}</Text>
              <Text style={s.nBody}>{copy.pings.reminder.replace('{task}', n.task.title)}</Text>
            </View>
          );
          if (n.kind === 'reminder') return (
            <View key={n.id} style={s.notif}>
              <Head kicker={fill(t.appKicker, { app })} when={when(n.when)} />
              <Text style={s.nTitle}>{n.task.emoji} {n.task.title}</Text>
              <Text style={s.nBody}>{fill(t.reminderBody, { n: n.task.duration_min })}</Text>
            </View>
          );
          const record = n.days >= n.record;
          return (
            <View key={n.id} style={[s.notif, s.notifSage]}>
              <Head kicker={fill(t.streakKicker, { app })} when={when(n.when)} sage />
              <Text style={[s.nTitle, { fontWeight: '600' }]}>{fill(t.streakTitle, { n: n.days })}</Text>
              <Text style={[s.nBody, { color: cream(0.85) }]}>{record ? t.streakRecord : fill(t.streakProgress, { n: n.record - n.days })}</Text>
            </View>
          );
        })}
      </View>

      <View style={s.bottom}>
        <View style={s.bottomBtn}><Text style={{ fontSize: 19 }}>🔦</Text></View>
        <Text style={s.hint}>{t.demoHint}</Text>
        <View style={s.bottomBtn}><Text style={{ fontSize: 19 }}>📷</Text></View>
      </View>
    </View>
  );
}

function Head({ kicker, when, sage }) {
  return (
    <View style={s.head}>
      <AppGlyph letter={app[0].toLowerCase()} bg={sage ? colors.sage : undefined} />
      <Text style={[s.kicker, sage && { color: sageA(0.85), fontWeight: '600' }]}>{kicker}</Text>
      <View style={{ flex: 1 }} />
      <Text style={s.when}>{when}</Text>
    </View>
  );
}

const glass = { backgroundColor: cream(0.10), borderWidth: 0.5, borderColor: cream(0.08) };
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: extraColors.lockMid },
  status: { paddingTop: 54, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusText: { fontSize: 15, fontWeight: '500', color: extraColors.cream, fontVariant: ['tabular-nums'] },
  clockBlock: { marginTop: 21, alignItems: 'center' },
  locked: { fontSize: 13, fontWeight: '400', color: cream(0.6) },
  date: { fontSize: 15, fontWeight: '400', color: cream(0.7), marginTop: 10 },
  time: { fontSize: 88, fontWeight: '200', letterSpacing: -3, lineHeight: 88, marginTop: 3, color: extraColors.cream, fontVariant: ['tabular-nums'] },
  widget: { ...glass, marginTop: 24, marginHorizontal: 14, borderRadius: 18, paddingVertical: 13, paddingHorizontal: 14 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  kicker: { fontSize: 11.5, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase', color: cream(0.55) },
  when: { fontSize: 11.5, fontWeight: '400', color: cream(0.45) },
  widgetTitle: { fontSize: 16, fontWeight: '600', letterSpacing: -0.2, color: extraColors.cream },
  widgetSub: { fontSize: 13, fontWeight: '400', color: cream(0.55), marginTop: 3, fontVariant: ['tabular-nums'] },
  bars: { flexDirection: 'row', gap: 5, height: 22, alignItems: 'flex-end' },
  stack: { paddingTop: 14, paddingHorizontal: 14, gap: 8 },
  notif: { ...glass, borderColor: cream(0.06), borderRadius: 16, paddingVertical: 11, paddingHorizontal: 14 },
  notifSage: { backgroundColor: sageA(0.18), borderColor: sageA(0.30) },
  nTitle: { fontSize: 15.5, fontWeight: '500', color: extraColors.cream },
  nBody: { fontSize: 14, fontWeight: '400', color: cream(0.78), marginTop: 3, lineHeight: 19 },
  bottom: { position: 'absolute', bottom: 30, left: 0, right: 0, paddingHorizontal: 28, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bottomBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: cream(0.10), alignItems: 'center', justifyContent: 'center' },
  hint: { fontSize: 11.5, color: cream(0.45), textAlign: 'center' },
});
