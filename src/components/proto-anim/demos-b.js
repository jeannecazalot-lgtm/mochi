// Proto animations (14 sept 2026) · propositions ChatGPT 6 à 10. Chaque démo se rejoue au tap.
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, Easing, FadeIn, FadeInRight, FadeInLeft, FadeOut, FadeOutLeft, FadeOutRight, ZoomIn, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Card, Avatar, Micro } from '../ui';
import { colors, font, radius } from '../../theme';
import { useMochiBody, MochiBody, SPRING_SOFT, SPRING_BALANCE, haptic } from './body';
import { Btn, Buttons } from './demos-a';

const ease = Easing.out(Easing.cubic);

// ─── 6 · Navigation entre onglets : crossfade + 4–6 px dans le sens du mouvement ─
const TABS = [['Accueil', 'Ce soir, deux choses à faire.'], ['Planning', 'Semaine du 14 septembre.'], ['Balance', 'Vous êtes à l’équilibre.']];
const TabIcon = ({ i, active }) => (
  <Svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke={active ? colors.ink : colors.tabInactive} strokeWidth={1.8}>
    {i === 0 ? <Path d="M4 10l7-6 7 6v8H4z" /> : i === 1 ? <Rect x={4} y={5} width={14} height={13} rx={3} /> : <Circle cx={11} cy={11} r={7} />}
  </Svg>
);
export function Demo6() {
  const [tab, setTab] = useState(0);
  const dir = useRef(1);
  const go = (i) => { if (i === tab) return; dir.current = i > tab ? 1 : -1; haptic(); setTab(i); };
  const enter = (dir.current > 0 ? FadeInRight : FadeInLeft).duration(200).easing(ease).withInitialValues({ opacity: 0, transform: [{ translateX: dir.current * 6 }] });
  const exit = (dir.current > 0 ? FadeOutLeft : FadeOutRight).duration(140);
  return (
    <View style={{ height: 250, borderRadius: radius.cardLg, overflow: 'hidden', backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Animated.View key={tab} entering={enter} exiting={exit} style={{ position: 'absolute', left: 16, right: 16, top: 16 }}>
          <Text style={font.screenTitle}>{TABS[tab][0]}</Text>
          <Card style={{ marginTop: 12 }}><Text style={font.body}>{TABS[tab][1]}</Text><Text style={[font.secondary, { marginTop: 4 }]}>Contenu de l’onglet {TABS[tab][0]}.</Text></Card>
        </Animated.View>
      </View>
      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.footerLine, backgroundColor: colors.card, paddingVertical: 8 }}>
        {TABS.map(([l], i) => (
          <Pressable key={l} onPress={() => go(i)} style={{ flex: 1, alignItems: 'center' }}>
            <TabIcon i={i} active={tab === i} />
            <Text style={[font.tabLabel, { marginTop: 3, color: tab === i ? colors.ink : colors.tabInactive }]}>{l}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ─── 7 · Planning : changement de jour, les cards sortent dans le sens du swipe ─
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DAY_CARDS = [
  [['Vaisselle', 'Ce soir · 15ʼ', 'K']], [['Lessive', '18h · 30ʼ', 'L'], ['Vaisselle', 'Ce soir · 15ʼ', 'K']], [['Vaisselle', 'Ce soir · 15ʼ', 'L']],
  [['Poubelles', 'Matin · 5ʼ', 'K'], ['Vaisselle', 'Ce soir · 15ʼ', 'K']], [['Vaisselle', 'Ce soir · 15ʼ', 'L']], [['Courses', '10h · 45ʼ', 'L'], ['Aspirateur', '14h · 25ʼ', 'K']], [['Repos', 'Rien de prévu', null]],
];
export function Demo7() {
  const [day, setDay] = useState(0);
  const dir = useRef(1);
  const [w, setW] = useState(0);
  const x = useSharedValue(0);
  const go = (i) => { const c = Math.max(0, Math.min(6, i)); if (c === day) return; dir.current = c > day ? 1 : -1; haptic(); setDay(c); x.value = withSpring(c, SPRING_SOFT); };
  const pan = Gesture.Pan().activeOffsetX([-16, 16]).onEnd(e => { if (e.translationX < -40) runOnJS(go)(day + 1); else if (e.translationX > 40) runOnJS(go)(day - 1); });
  const slot = w / 7;
  const under = useAnimatedStyle(() => ({ transform: [{ translateX: x.value * slot }] }));
  const enter = (dir.current > 0 ? FadeInRight : FadeInLeft).duration(260).easing(ease).withInitialValues({ opacity: 0, transform: [{ translateX: dir.current * 40 }] });
  const exit = (dir.current > 0 ? FadeOutLeft : FadeOutRight).duration(200);
  return (
    <View>
      <View onLayout={e => setW(e.nativeEvent.layout.width)} style={{ flexDirection: 'row', marginBottom: 10 }}>
        <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width: slot, height: 44, borderRadius: 12, backgroundColor: colors.ink }, under]} />
        {DAYS.map((d, i) => (
          <Pressable key={i} onPress={() => go(i)} style={{ flex: 1, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[font.caption, { color: day === i ? colors.white : colors.muted }]}>{d}</Text>
            <Text style={[font.row, { color: day === i ? colors.white : colors.ink }]}>{14 + i}</Text>
          </Pressable>
        ))}
      </View>
      <GestureDetector gesture={pan}>
        <View style={{ height: 150, overflow: 'hidden' }}>
          <Animated.View key={day} entering={enter} exiting={exit} style={{ position: 'absolute', left: 0, right: 0 }}>
            <Card padding={0}>
              {DAY_CARDS[day].map(([l, s, who], k) => (
                <View key={l} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: k === DAY_CARDS[day].length - 1 ? 0 : 1, borderBottomColor: colors.line }}>
                  <View style={{ marginLeft: 2, flex: 1 }}><Text style={font.row}>{l}</Text><Text style={[font.caption, { marginTop: 1 }]}>{s}</Text></View>
                  {who ? <Avatar initial={who} color={who === 'L' ? colors.sky : colors.lavender} size={24} /> : null}
                </View>
              ))}
            </Card>
          </Animated.View>
        </View>
      </GestureDetector>
      <Micro style={{ paddingHorizontal: 5 }}>Swipe sur la liste, ou tape un jour</Micro>
    </View>
  );
}

// ─── 8 · Balance : franchissement d'un seuil, Mochi suit avec 70 ms de retard ─
export function Demo8() {
  const body = useMochiBody(0);
  const [bal, setBal] = useState(0);
  const [mood, setMood] = useState('happy');
  const [w, setW] = useState(0);
  const m = useSharedValue(0);
  const apply = (nb) => {
    const c = Math.max(-1, Math.min(1, +nb.toFixed(2)));
    setBal(c); haptic();
    m.value = withSpring(c, SPRING_SOFT);
    body.leanTo(c, SPRING_SOFT, 70, () => setMood(Math.abs(c) > 0.5 ? 'sad' : 'happy')); // le visage change seulement à la fin
  };
  const over = Math.abs(bal) > 0.5;
  const line = useAnimatedStyle(() => ({ transform: [{ translateX: m.value * (w / 2) }] }));
  return (
    <View>
      <Card>
        <View style={{ alignItems: 'center', paddingTop: 8 }}><MochiBody body={body} size={120} mood={mood} /></View>
        <Text style={[font.body, { textAlign: 'center', marginTop: 8 }]}>{!over ? 'Dans la zone d’équilibre' : bal > 0 ? 'Ça penche nettement chez Kima' : 'Ça penche nettement chez Lea'}</Text>
        <View onLayout={e => setW(e.nativeEvent.layout.width)} style={{ height: 36, marginTop: 14, justifyContent: 'center' }}>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.line }} />
          {[-0.5, 0.5].map(t => <View key={t} style={{ position: 'absolute', left: `${50 + t * 50}%`, width: 1, height: 20, backgroundColor: colors.checkRing }} />)}
          <Animated.View style={[{ position: 'absolute', left: '50%', marginLeft: -1.5, width: 3, height: 36, borderRadius: 2, backgroundColor: over ? colors.coralDeep : colors.ink }, line]} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}><Micro>Lea</Micro><Micro>seuil</Micro><Micro>Kima</Micro></View>
      </Card>
      <Buttons><Btn label="+ charge Kima" onPress={() => apply(bal + 0.3)} primary /><Btn label="+ charge Lea" onPress={() => apply(bal - 0.3)} primary /><Btn label="Remettre à zéro" onPress={() => apply(0)} /></Buttons>
    </View>
  );
}

// ─── 9 · Mochi calcule : compression, deux anneaux fins, puis inclinaison finale ─
export function Demo9() {
  const body = useMochiBody(0);
  const [state, setState] = useState('idle');
  const [mood, setMood] = useState('neutral');
  const r1 = useSharedValue(0), r2 = useSharedValue(0);
  const run = () => {
    if (state === 'calc') return;
    setState('calc'); setMood('neutral'); haptic();
    body.leanTo(0, SPRING_SOFT); body.compress(0.14, { stiffness: 200, damping: 16 });
    r1.value = 0; r2.value = 0;
    r1.value = withTiming(1, { duration: 700, easing: ease });
    r2.value = withDelay(160, withTiming(1, { duration: 700, easing: ease }));
    setTimeout(() => { body.leanTo(0.7, SPRING_SOFT); setMood('happy'); setState('done'); }, 800);
  };
  const ring = (v) => useAnimatedStyle(() => ({ opacity: (1 - v.value) * 0.7, transform: [{ scale: 1 + v.value * 1.5 }] }));
  const s1 = ring(r1), s2 = ring(r2);
  const R = { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 1.5, borderColor: colors.ink };
  return (
    <View>
      <Card>
        <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View style={[R, s1]} /><Animated.View style={[R, s2]} />
          <MochiBody body={body} size={120} mood={mood} />
        </View>
        <Text style={[font.body, { textAlign: 'center' }]}>{state === 'calc' ? 'Mochi calcule…' : state === 'done' ? 'Kima porte un peu plus cette semaine' : 'Prêt pour le calcul'}</Text>
      </Card>
      <Buttons><Btn label="Lancer le calcul" onPress={run} primary /></Buttons>
    </View>
  );
}

// ─── 10 · Célébration rare : Duo formé, ~1 s, jamais de boucle ──────
const PALETTE = [colors.coral, colors.butter, colors.sage, colors.lavender, colors.sky];
function Particle({ i, n }) {
  const p = useSharedValue(0);
  const a = (i / n) * Math.PI * 2 - Math.PI / 2, d = 70 + (i % 3) * 18;
  useEffect(() => { p.value = withDelay(240 + (i % 3) * 40, withTiming(1, { duration: 620, easing: ease })); }, []);
  const st = useAnimatedStyle(() => ({ opacity: 1 - p.value * p.value, transform: [{ translateX: Math.cos(a) * d * p.value }, { translateY: Math.sin(a) * d * p.value - 8 * p.value }, { scale: 0.6 + 0.4 * p.value }] }));
  const round = i % 2 === 0;
  return <Animated.View style={[{ position: 'absolute', width: round ? 8 : 6, height: round ? 8 : 12, borderRadius: round ? 4 : 2, backgroundColor: PALETTE[i % PALETTE.length] }, st]} />;
}
function Duo({ body }) {
  useEffect(() => { const t = setTimeout(() => { body.pop(); haptic(); }, 150); return () => clearTimeout(t); }, []);
  return (
    <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>{Array.from({ length: 10 }).map((_, i) => <Particle key={i} i={i} n={10} />)}</View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Animated.View entering={ZoomIn.duration(160).easing(ease)}><Avatar initial="L" color={colors.sky} size={44} ring /></Animated.View>
        <View style={{ marginHorizontal: 14 }}><MochiBody body={body} size={96} mood="happy" /></View>
        <Animated.View entering={ZoomIn.duration(160).delay(60).easing(ease)}><Avatar initial="K" color={colors.lavender} size={44} ring /></Animated.View>
      </View>
      <Animated.View entering={FadeIn.duration(220).delay(420)} style={{ position: 'absolute', bottom: 10 }}><Text style={font.cardTitle}>Duo formé</Text></Animated.View>
    </View>
  );
}
export function Demo10() {
  const body = useMochiBody(0);
  const [k, setK] = useState(0);
  return (
    <View>
      <Card>{k ? <Duo key={k} body={body} /> : <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}><Text style={font.secondary}>Lea et Kima viennent de connecter leur foyer.</Text></View>}</Card>
      <Buttons><Btn label={k ? 'Rejouer' : 'Former le duo'} onPress={() => { body.reset(); setK(k + 1); }} primary /></Buttons>
    </View>
  );
}
