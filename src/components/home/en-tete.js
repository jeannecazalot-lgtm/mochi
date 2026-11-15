// ═════════════════════════════════════════════════════════════════
// « En tête » — la saisie express du « j'y ai pensé » (proposition du 15 nov 2026, prototype à valider par Jeanne).
// Sur l'Accueil, au-dessus d'« Aujourd'hui » : un champ, Entrée, c'est noté (Mochi saute). La liste montre les pensées
// des deux (3 au plus, « Voir les N ») ; le rond à droite coche et efface (comme une mission) ; toucher la ligne = en
// faire une tâche. Retouches du 15 nov : champ léger, plus de « Je m'en occupe », le compteur « pensé à » ira dans la Balance.
// PROTOTYPE : pensées d'exemple en mémoire. La table Supabase `thoughts` viendra après validation (règle « modèle d'abord »).
// ═════════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Keyboard } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeOut, LinearTransition, Easing } from 'react-native-reanimated';
import { Avatar } from '../ui';
import { Label, Check } from '../mochi/gauges';
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
    { id: 'd3', text: copy.thoughts.demo[2], by: 'me', at: now - 26 * H, done: false },
    { id: 'd4', text: copy.thoughts.demo[3], by: 'partner', at: now - 30 * H, done: false },
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
  const [all, setAll] = useState(false);
  const who = k => (k === 'me' ? me : partner);
  const MAX = 3; // retouche 2 (Jeanne, 15 nov 2026) : l'Accueil garde ses missions visibles
  const shown = all ? items : items.slice(0, MAX);

  const add = () => {
    const v = text.trim(); if (!v) return;
    setItems(xs => [{ id: String(Date.now()), text: v, by: 'me', at: Date.now(), done: false }, ...xs]);
    setText(''); Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); mochiReact();
  };
  // cocher (Jeanne, 15 nov 2026 : « pouvoir le cocher pour l'enlever ») : rayé, Mochi saute, la ligne s'efface
  const check = id => {
    setItems(xs => xs.map(x => (x.id === id ? { ...x, done: true } : x)));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); mochiReact();
    setTimeout(() => setItems(xs => xs.filter(x => x.id !== id)), 900);
  };
  // toucher la ligne = en faire une tâche (fiche pré-remplie) ; plus de menu
  const toTask = it => router.push(`/task/edit?title=${encodeURIComponent(it.text)}`);

  return (
    <View>
      <View style={s.head}><Text style={[type.section, { color: T.ink }]}>{t.title}</Text></View>
      <View style={{ marginHorizontal: layout.x }}>
        {/* champ léger : un trait, pas de bloc plein */}
        <View style={[s.field, { borderBottomColor: T.line }]}>
          <Text style={{ fontSize: 20, lineHeight: 22, color: T.muted, width: 26, textAlign: 'center' }}>+</Text>
          <TextInput value={text} onChangeText={setText} placeholder={t.placeholder} placeholderTextColor={T.muted}
            returnKeyType="done" onSubmitEditing={add} blurOnSubmit={false} cursorColor={T.accent} selectionColor={T.accent}
            style={[type.body, { flex: 1, color: T.ink, paddingVertical: 12 }]} />
          {text.trim() ? <Pressable onPress={add} hitSlop={8}><Text style={[type.label, { color: T.accent, fontWeight: '600' }]}>{t.add}</Text></Pressable> : null}
        </View>
        {shown.map((it, i) => (
          <Animated.View key={it.id} layout={LinearTransition.duration(260)} entering={FadeInDown.duration(260).easing(Easing.out(Easing.cubic))} exiting={FadeOut.duration(180)}>
            <Pressable onPress={() => !it.done && toTask(it)} style={[s.row, { borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderTopColor: T.line, opacity: it.done ? 0.4 : 1 }]}>
              <Avatar initial={who(it.by).initial} color={who(it.by).color} photo={who(it.by).avatar_url} size={26} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[type.body, { color: T.ink, textDecorationLine: it.done ? 'line-through' : 'none' }]} numberOfLines={2}>{it.text}</Text>
                <Label T={T} style={{ marginTop: 2 }}>{ago(it.at)}</Label>
              </View>
              <Pressable onPress={() => !it.done && check(it.id)} hitSlop={8}><Check T={T} done={it.done} /></Pressable>
            </Pressable>
          </Animated.View>
        ))}
        {items.length > MAX ? (
          <Pressable onPress={() => setAll(v => !v)} hitSlop={8} style={{ paddingVertical: 10 }}>
            <Text style={[type.label, { color: T.muted, fontWeight: '600' }]}>{all ? t.less : fill(t.more, { n: items.length })}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  head: { paddingTop: 26 * layout.air, paddingBottom: 8, paddingHorizontal: layout.x, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  field: { flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: StyleSheet.hairlineWidth, marginBottom: 2 },
  add: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingLeft: 38, paddingBottom: 12 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
});
