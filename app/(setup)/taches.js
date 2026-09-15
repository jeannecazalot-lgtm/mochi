// Écran 10 · Choisir les tâches. Recette : docs/recettes/10-taches.md
// Retours Jeanne 22 août 2026 : DA uniformisée (SetupHeader 4/4), catalogue large
// + intertitre « Selon ton foyer », pop + haptique au cochage, entrée en cascade.
import React, { useState, useEffect, useRef } from 'react';
import { TextInput } from 'react-native';
import { router } from 'expo-router';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GlowBg, Card, SetupHeader, CTAPrimary, useScrollEnd, GrowCTA } from '../../src/components/ui';
import { LiveMochi } from '../../src/components/motion';
import { CheckDot, AddButton } from '../../src/components/setup/extra';
import { Animated, FadeInDown, prefersReducedMotion } from '../../src/components/motion';
import { catalogue } from '../../src/demo-setup';
import { saveTasks, freqPerWeek, setup } from '../../src/setup-state';
import { loadDraft, pushDraft } from '../../src/draft-sync';
import { getUid, getPartnerUid, useIdentity } from '../../src/identity';
import { occStore } from '../../src/demo-core';
import { me, partner } from '../../src/demo';
import { Avatar } from '../../src/components/ui';
import { read } from '../../src/store';
import copy from '../../src/data/copy.json';
import { colors, space, motion } from '../../src/theme';

const t = copy.setup;
const next = () => router.push('/(setup)/calcul');

// une rangée du catalogue : cascade FadeInDown (~25 ms d'écart), rond de sélection qui pop
function Row({ c, index, active, onToggle, who }) {
  return (
    <Animated.View entering={prefersReducedMotion() ? undefined : FadeInDown.delay(index * 45).duration(motion.screen)}>
      <Pressable onPress={onToggle}>
        <Card padding={0} r={14} style={{ marginBottom: 6 }} accent={active ? colors.sage : undefined}>
          <View style={s.row}>
            <Text style={{ fontSize: 19 }}>{c.emoji}</Text>
            <Text style={[s.title, { flex: 1 }]}>{c.label}</Text>
            {c.mental ? <Text style={s.mental}>{t.mentalTag}</Text> : null}
            {who ? <Avatar initial={who.initial} color={who.color} photo={who.avatar_url} size={22} /> : null}
            <CheckDot on={active} onPress={onToggle} />
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
}

export default function Taches() {
  const { atEnd, scrollProps } = useScrollEnd();
  const scrollRef = React.useRef(null);
  // Retour Jeanne (1er sept 2026) : « + Ajouter » depuis le bas de liste → on remonte
  // automatiquement en haut, là où le champ d'ajout apparaît.
  const startAdding = () => { setAdding(true); scrollRef.current?.scrollTo({ y: 0, animated: true }); };
  // Retour Jeanne (23 août 2026) : rien de pré-coché, pas de rangée grisée.
  const [on, setOn] = useState([]);
  const [customs, setCustoms] = useState([]);   // tâches ajoutées à la main (cochées d'office)
  // ─── à deux en direct (15 sept 2026) : la sélection vit dans setup_drafts, l'autre la voit bouger ───
  useIdentity();
  const [by, setBy] = useState({});             // id → uid de qui a coché (pour l'avatar)
  const shared = !!setup.householdId;
  const occV = occStore.useVersion();
  const lastRemote = useRef('');
  const applyDraft = d => {
    if (!d) return;
    if (d.status === 'done') { router.replace('/(tabs)'); return; } // l'autre a validé : son dispatch arrive à l'Accueil
    const key = JSON.stringify(d.tasks);
    if (key === lastRemote.current) return;
    lastRemote.current = key;
    const ts = d.tasks || [];
    setCustoms(ts.filter(x => String(x.id).startsWith('custom-')).map(x => ({ id: x.id, emoji: x.emoji || '📝', label: x.label })));
    setOn(ts.map(x => x.id));
    setBy(Object.fromEntries(ts.map(x => [x.id, x.by?.[0] || null])));
  };
  useEffect(() => { if (shared) loadDraft().then(applyDraft).catch(() => {}); }, []);
  useEffect(() => { if (shared) read('setup_drafts').then(rows => applyDraft(rows.find(d => d.household_id === setup.householdId))).catch(() => {}); }, [occV]);
  // mes changements partent (groupés) ; `by` garde qui a coché quoi
  const share = (onIds, cs, byMap) => {
    if (!shared) return;
    const rows = [
      ...catalogue.filter(c => onIds.includes(c.id)).map(c => ({ id: c.id, label: c.label, emoji: c.emoji, duration_min: c.mins, per_week: freqPerWeek(c.freq), pain: c.pain, mental_load: !!c.mental, by: [byMap[c.id] || getUid()] })),
      ...cs.filter(c => onIds.includes(c.id)).map(c => ({ id: c.id, label: c.label, emoji: c.emoji, duration_min: 20, per_week: 1, pain: 2, mental_load: false, by: [byMap[c.id] || getUid()] })),
    ];
    lastRemote.current = JSON.stringify(rows);
    pushDraft(rows);
  };
  const whoFor = id => (by[id] ? (by[id] === getUid() ? me : by[id] === getPartnerUid() ? partner : null) : null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const draftRef = React.useRef(''); // valeur la plus fraîche : Entrée arrive parfois avant le re-rendu du dernier caractère (test du 6 sept 2026 : « jardin » → « jardi »)
  const onDraft = v => { draftRef.current = v; setDraft(v); };
  const submitting = React.useRef(false); // garde anti-doublon : Entrée ET la perte de focus appellent addCustom
  const addCustom = () => {
    if (submitting.current) return;
    submitting.current = true;
    setTimeout(() => { submitting.current = false; }, 400);
    const label = draftRef.current.trim();
    if (!label) { setAdding(false); return; }
    const id = `custom-${Date.now()}`;
    const cs = [...customs, { id, emoji: '📝', label }]; const onIds = [...on, id]; const byMap = { ...by, [id]: getUid() };
    setCustoms(cs); setOn(onIds); setBy(byMap); share(onIds, cs, byMap);
    draftRef.current = ''; setDraft(''); setAdding(false);
  };
  const toggle = id => {
    if (!on.includes(id)) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const onIds = on.includes(id) ? on.filter(x => x !== id) : [...on, id];
    const byMap = { ...by }; if (onIds.includes(id)) byMap[id] = byMap[id] || getUid(); else delete byMap[id];
    setOn(onIds); setBy(byMap); share(onIds, customs, byMap);
  };
  // branchement réel (1er sept 2026) : les tâches cochées partent dans setup-state,
  // le 11 calcule dessus (customs : 20 min · 1×/sem par défaut, ajustables sur 12)
  const launch = () => {
    saveTasks([
      ...catalogue.filter(c => on.includes(c.id)).map(c => ({ id: c.id, label: c.label, emoji: c.emoji, duration_min: c.mins, per_week: freqPerWeek(c.freq), pain: c.pain, mental_load: !!c.mental, divisible: !!c.divisible })),
      ...customs.filter(c => on.includes(c.id)).map(c => ({ id: c.id, label: c.label, emoji: c.emoji, duration_min: 20, per_week: 1, pain: 2, mental_load: false, divisible: false })),
    ]);
    next();
  };
  const broad = catalogue.filter(c => !c.specific);
  const specific = catalogue.filter(c => c.specific);
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Retour Jeanne (1er sept 2026) : minimum 3 tâches pour continuer — pas de « Passer » ici. */}
        <View>
          <SetupHeader hero={<LiveMochi size={96} />} title={t.tasksTitle} sub={shared && getPartnerUid() ? t.tasksSubDuo.replace('{name}', partner.first_name) : t.tasksSub} />
        </View>
        <ScrollView ref={scrollRef} {...scrollProps} contentContainerStyle={{ paddingHorizontal: space.screenX, paddingTop: 30, paddingBottom: 110 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {adding ? (
            <Card padding={0} r={14} style={{ marginBottom: 6 }} accent={colors.sage}>
              <View style={s.row}>
                <TextInput
                  value={draft} onChangeText={onDraft} placeholder={t.addTaskPlaceholder} placeholderTextColor={colors.muted}
                  autoCapitalize="sentences" returnKeyType="done" onSubmitEditing={addCustom} onBlur={addCustom}
                  style={[s.title, { flex: 1, paddingVertical: 0 }]} />
              </View>
            </Card>
          ) : null}
          {customs.map(c => <Row key={c.id} c={c} index={0} active={on.includes(c.id)} who={whoFor(c.id)} onToggle={() => toggle(c.id)} />)}
          {broad.map((c, i) => <Row key={c.id} c={c} index={i} active={on.includes(c.id)} who={whoFor(c.id)} onToggle={() => toggle(c.id)} />)}
          {specific.map((c, i) => <Row key={c.id} c={c} index={broad.length + 1 + i} active={on.includes(c.id)} who={whoFor(c.id)} onToggle={() => toggle(c.id)} />)}
        </ScrollView>
        <GrowCTA grown={atEnd} style={s.bottom}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <AddButton label={t.addTask} onPress={startAdding} style={{ flex: 1 }} />
            <CTAPrimary label={t.launch} onPress={launch} disabled={on.length < 3} style={{ flex: 1.6 }} />
          </View>
        </GrowCTA>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, paddingHorizontal: 16 },
  title: { fontSize: 16, fontWeight: '500', color: colors.ink },
  mental: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', color: colors.lavenderDeep },
  bottom: { position: 'absolute', left: 24, right: 24, bottom: 24 },
});
