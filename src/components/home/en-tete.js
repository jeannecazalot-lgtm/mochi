// ═════════════════════════════════════════════════════════════════
// « En tête » — la saisie express du « j'y ai pensé » (proposition du 15 nov 2026, prototype à valider par Jeanne).
// Sur l'Accueil, au-dessus d'« Aujourd'hui » : un champ, Entrée, c'est noté (Mochi saute). La liste montre les pensées
// des deux ; un toucher ouvre trois choix : C'est fait · Je m'en occupe · En faire une tâche (fiche pré-remplie).
// En tête de section : « pensé à cette semaine : toi n · {name} m », la charge invisible rendue visible.
// PROTOTYPE : pensées d'exemple en mémoire. La table Supabase `thoughts` viendra après validation (règle « modèle d'abord »).
// ═════════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Keyboard } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeOut, LinearTransition, Easing } from 'react-native-reanimated';
import { Avatar } from '../ui';
import { Label } from '../mochi/gauges';
import { mochiReact } from '../mochi-img';
import { type, layout } from '../../theme-v3';
import { me, partner } from '../../demo';
import copy from '../../copy';

const fill = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '');
const H = 3600e3;
const DEMO = () => {
  const now = Date.now();
  return [
    { id: 'd1', text: copy.thoughts.demo[0], by: 'partner', at: now - 2 * H, taken: null, done: false },
    { id: 'd2', text: copy.thoughts.demo[1], by: 'me', at: now - 9 * H, taken: null, done: false },
    { id: 'd3', text: copy.thoughts.demo[2], by: 'me', at: now - 26 * H, taken: 'partner', done: false },
  ];
};
const ago = at => {
  const t = copy.thoughts; const m = Math.round((Date.now() - at) / 60000);
  if (m < 2) return t.agoNow; if (m < 60) return fill(t.agoMin, { n: m });
  const h = Math.round(m / 60); if (h < 24) return fill(t.agoHour, { n: h });
  return fill(t.agoDay, { n: Math.round(h / 24) });
};

export function EnTete({ T }) {
  const t = copy.thoughts;
  const [items, setItems] = useState(DEMO);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(null);
  const who = k => (k === 'me' ? me : partner);
  const counts = { me: items.filter(i => i.by === 'me').length, partner: items.filter(i => i.by === 'partner').length };

  const add = () => {
    const v = text.trim(); if (!v) return;
    setItems(xs => [{ id: String(Date.now()), text: v, by: 'me', at: Date.now(), taken: null, done: false }, ...xs]);
    setText(''); Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); mochiReact();
  };
  const act = (id, kind) => {
    setOpen(null);
    if (kind === 'done') { setItems(xs => xs.map(x => (x.id === id ? { ...x, done: true } : x))); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); mochiReact(); }
    if (kind === 'take') { setItems(xs => xs.map(x => (x.id === id ? { ...x, taken: 'me' } : x))); Haptics.selectionAsync().catch(() => {}); }
    if (kind === 'task') { const it = items.find(x => x.id === id); router.push(`/task/edit?title=${encodeURIComponent(it?.text || '')}`); }
  };

  return (
    <View>
      <View style={s.head}>
        <Text style={[type.section, { color: T.ink }]}>{t.title}</Text>
        <Label T={T}>{fill(t.count, { me: counts.me, name: partner.first_name, partner: counts.partner })}</Label>
      </View>
      <View style={{ marginHorizontal: layout.x }}>
        <View style={[s.field, { backgroundColor: T.seg }]}>
          <TextInput value={text} onChangeText={setText} placeholder={t.placeholder} placeholderTextColor={T.muted}
            returnKeyType="done" onSubmitEditing={add} blurOnSubmit={false} cursorColor={T.accent} selectionColor={T.accent}
            style={[type.body, { flex: 1, color: T.ink, paddingVertical: 12 }]} />
          {text.trim() ? <Pressable onPress={add} hitSlop={8} style={[s.add, { backgroundColor: T.accent }]}><Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16, lineHeight: 18 }}>↵</Text></Pressable> : null}
        </View>
        {items.map((it, i) => (
          <Animated.View key={it.id} layout={LinearTransition.duration(260)} entering={FadeInDown.duration(260).easing(Easing.out(Easing.cubic))} exiting={FadeOut.duration(180)}>
            <Pressable onPress={() => setOpen(open === it.id ? null : it.id)} style={[s.row, { borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderTopColor: T.line, opacity: it.done ? 0.4 : 1 }]}>
              <Avatar initial={who(it.by).initial} color={who(it.by).color} photo={who(it.by).avatar_url} size={26} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[type.body, { color: T.ink, textDecorationLine: it.done ? 'line-through' : 'none' }]} numberOfLines={2}>{it.text}</Text>
                <Label T={T} style={{ marginTop: 2 }}>{[ago(it.at), it.taken === 'me' ? t.takenMe : it.taken ? fill(t.takenBy, { name: partner.first_name }) : null].filter(Boolean).join(' · ')}</Label>
              </View>
              {it.taken ? <Avatar initial={who(it.taken).initial} color={who(it.taken).color} photo={who(it.taken).avatar_url} size={22} /> : null}
            </Pressable>
            {open === it.id && !it.done ? (
              <Animated.View entering={FadeInDown.duration(180)} style={s.actions}>
                <Pressable onPress={() => act(it.id, 'done')} style={[s.pill, { backgroundColor: T.ink }]}><Text style={[type.label, { color: T.bg, fontWeight: '600' }]}>{t.done}</Text></Pressable>
                {it.taken !== 'me' ? <Pressable onPress={() => act(it.id, 'take')} style={[s.pill, { borderColor: T.ink, borderWidth: 1.5 }]}><Text style={[type.label, { color: T.ink, fontWeight: '600' }]}>{t.take}</Text></Pressable> : null}
                <Pressable onPress={() => act(it.id, 'task')} style={[s.pill, { borderColor: T.line, borderWidth: 1.5 }]}><Text style={[type.label, { color: T.ink }]}>{t.toTask}</Text></Pressable>
              </Animated.View>
            ) : null}
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  head: { paddingTop: 26 * layout.air, paddingBottom: 8, paddingHorizontal: layout.x, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  field: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingLeft: 14, paddingRight: 6, marginBottom: 6 },
  add: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingLeft: 38, paddingBottom: 12 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
});
