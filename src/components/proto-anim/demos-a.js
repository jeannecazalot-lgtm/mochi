// Proto animations (14 sept 2026) · propositions ChatGPT 1 à 5. Chaque démo se rejoue au tap.
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, withSequence, Easing, FadeInDown, FadeIn, LinearTransition, interpolateColor, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Card, Avatar, CTAPrimary, Micro, Secondary } from '../ui';
import { MochiGalet } from '../mochi-v2';
import { colors, font, space, radius } from '../../theme';
import { useMochiBody, MochiBody, SPRING_BALANCE, haptic } from './body';

// petites pastilles de commande du proto (pas les CTA de l'app, qui prennent toute la largeur)
const Btn = ({ label, onPress, primary }) => (
  <Pressable onPress={onPress} style={({ pressed }) => ({ paddingHorizontal: 14, height: 36, borderRadius: 18, justifyContent: 'center', marginRight: 8, marginBottom: 8, opacity: pressed ? 0.8 : 1, backgroundColor: primary ? colors.ink : colors.card, borderWidth: primary ? 0 : 1, borderColor: colors.sheetLine })}>
    <Text style={[font.cta, { color: primary ? colors.white : colors.ink }]}>{label}</Text>
  </Pressable>
);
export const Buttons = ({ children }) => <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 14 }}>{children}</View>;
export { Btn };

// ─── 1 · Coche d'une tâche ───────────────────────────────────────────
// cercle : remplissage 160 ms easeOut, check en spring avec léger overshoot ; row : 65 % puis compaction 240 ms.
function CheckAnim({ done, size = 22 }) {
  const fill = useSharedValue(done ? 1 : 0), check = useSharedValue(done ? 1 : 0);
  useEffect(() => {
    if (done) {
      fill.value = withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic) });
      check.value = withDelay(70, withSpring(1, { stiffness: 420, damping: 26 }));
    } else { fill.value = withTiming(0, { duration: 120 }); check.value = withTiming(0, { duration: 80 }); }
  }, [done]);
  const fillSt = useAnimatedStyle(() => ({ opacity: fill.value, transform: [{ scale: 0.55 + 0.45 * fill.value }] }));
  const checkSt = useAnimatedStyle(() => ({ opacity: check.value > 0.05 ? 1 : 0, transform: [{ scale: check.value }] }));
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1.5, borderColor: colors.checkRing, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[{ position: 'absolute', left: -1.5, top: -1.5, width: size, height: size, borderRadius: size / 2, backgroundColor: colors.sage }, fillSt]} />
      <Animated.View style={checkSt}>
        <Svg width={11} height={11} viewBox="0 0 12 12" fill="none" stroke={colors.white} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><Path d="M2 6l3 3 5-6" /></Svg>
      </Animated.View>
    </View>
  );
}
const TASKS1 = [['Vaisselle', 'Ce soir · 15ʼ'], ['Lessive', 'Demain · 30ʼ'], ['Courses', 'Samedi · 45ʼ']];
function Row1({ label, sub, phase, onToggle, last }) {
  const op = useSharedValue(1), h = useSharedValue(1), hMax = useSharedValue(0);
  useEffect(() => {
    if (phase === 'done') op.value = withTiming(0.65, { duration: 200 });
    if (phase === 'gone') h.value = withTiming(0, { duration: 240, easing: Easing.out(Easing.cubic) });
  }, [phase]);
  const st = useAnimatedStyle(() => ({ opacity: op.value, height: hMax.value ? hMax.value * h.value : undefined }));
  return (
    <Animated.View style={[{ overflow: 'hidden' }, st]}>
      <Pressable onPress={onToggle} onLayout={e => { if (!hMax.value) hMax.value = e.nativeEvent.layout.height; }}
        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.line }}>
        <CheckAnim done={phase !== 'todo'} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={font.row}>{label}</Text>
          <Text style={[font.caption, { marginTop: 1 }]}>{sub}</Text>
        </View>
        <Avatar initial="K" color={colors.lavender} size={24} />
      </Pressable>
    </Animated.View>
  );
}
export function Demo1() {
  const [phases, setPhases] = useState({});
  const [doneList, setDoneList] = useState([]);
  const [gen, setGen] = useState(0);
  const toggle = (i) => {
    if (phases[i]) return;
    haptic();
    setPhases(p => ({ ...p, [i]: 'done' }));
    setTimeout(() => setPhases(p => ({ ...p, [i]: 'gone' })), 320);
    setTimeout(() => setDoneList(d => [...d, i]), 560);
  };
  const reset = () => { setPhases({}); setDoneList([]); setGen(g => g + 1); };
  const remaining = TASKS1.map((t, i) => [t, i]).filter(([, i]) => !doneList.includes(i));
  return (
    <View>
      <Micro style={{ marginBottom: 6, paddingHorizontal: 5 }}>À faire · {TASKS1.length - doneList.length}</Micro>
      <Card padding={0}>
        {remaining.map(([[label, sub], i], k) => <Row1 key={`${gen}-${i}`} label={label} sub={sub} phase={phases[i] || 'todo'} onToggle={() => toggle(i)} last={k === remaining.length - 1} />)}
        {remaining.length === 0 ? <Text style={[font.secondary, { padding: 14 }]}>Tout est fait.</Text> : null}
      </Card>
      <Micro style={{ marginTop: 14, marginBottom: 6, paddingHorizontal: 5 }}>Fait aujourd'hui · {doneList.length}</Micro>
      <Card padding={0}>
        {doneList.length === 0 ? <Text style={[font.secondary, { padding: 14 }]}>Rien pour l'instant.</Text> : null}
        {doneList.map((i, k) => (
          <Animated.View key={i} entering={FadeIn.duration(200)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, opacity: 0.55, borderBottomWidth: k === doneList.length - 1 ? 0 : 1, borderBottomColor: colors.line }}>
              <CheckAnim done /><Text style={[font.row, { marginLeft: 12 }]}>{TASKS1[i][0]}</Text>
            </View>
          </Animated.View>
        ))}
      </Card>
      <Buttons><Btn label="Rejouer" onPress={reset} /></Buttons>
    </View>
  );
}

// ─── 2 · Balance / Accueil : Mochi réagit à la charge ───────────────
export function Demo2() {
  const body = useMochiBody(0);
  const [bal, setBal] = useState(0);
  const marker = useSharedValue(0);
  const [w, setW] = useState(0);
  const apply = (d) => {
    const c = Math.max(-1, Math.min(1, +(bal + d).toFixed(2)));
    setBal(c); haptic();
    body.leanTo(c); body.compress(0.05); marker.value = withSpring(c, SPRING_BALANCE);
  };
  const reset = () => { setBal(0); body.leanTo(0); marker.value = withSpring(0, SPRING_BALANCE); };
  const mk = useAnimatedStyle(() => ({ transform: [{ translateX: marker.value * (w / 2 - 10) }] }));
  return (
    <View>
      <Card>
        <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 6 }}><MochiBody body={body} size={120} mood={Math.abs(bal) > 0.6 ? 'neutral' : 'happy'} /></View>
        <Text style={[font.body, { textAlign: 'center', marginTop: 8 }]}>{bal === 0 ? 'Vous êtes à l’équilibre' : bal > 0 ? 'Ça penche un peu chez Kima' : 'Ça penche un peu chez Lea'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
          <Avatar initial="L" color={colors.sky} size={26} />
          <View onLayout={e => setW(e.nativeEvent.layout.width)} style={{ flex: 1, height: 6, marginHorizontal: 10, borderRadius: 3, backgroundColor: colors.line, justifyContent: 'center' }}>
            <View style={{ position: 'absolute', left: '50%', width: 1, height: 12, top: -3, backgroundColor: colors.checkRing }} />
            <Animated.View style={[{ position: 'absolute', left: '50%', marginLeft: -10, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.coral }, mk]} />
          </View>
          <Avatar initial="K" color={colors.lavender} size={26} />
        </View>
      </Card>
      <Buttons>
        <Btn label="Kima coche la vaisselle" onPress={() => apply(0.35)} primary />
        <Btn label="Lea coche les courses" onPress={() => apply(-0.35)} primary />
        <Btn label="Remettre à zéro" onPress={reset} />
      </Buttons>
    </View>
  );
}

// ─── 3 · Dispatch : changement d'assignation ────────────────────────
const WHO = [['Lea', colors.sky, 'L'], ['Kima', colors.lavender, 'K'], ['Alterné', colors.butter, '⇄']];
export function Demo3() {
  const [idx, setIdx] = useState(0);
  const [w, setW] = useState(0);
  const x = useSharedValue(0), col = useSharedValue(0), mochi = useSharedValue(0);
  const pick = (i) => {
    if (i === idx) return;
    const dir = i > idx ? 1 : -1;
    setIdx(i); haptic();
    const cfg = { duration: 230, easing: Easing.bezier(0.22, 1, 0.36, 1) };
    x.value = withTiming(i, cfg); col.value = withTiming(i, cfg);
    mochi.value = withSequence(withTiming(dir * 3, { duration: 110 }), withSpring(0, SPRING_BALANCE));
  };
  const slot = w / 3;
  const ind = useAnimatedStyle(() => ({ transform: [{ translateX: x.value * slot }] }));
  const bar = useAnimatedStyle(() => ({ backgroundColor: interpolateColor(col.value, [0, 1, 2], [colors.sky, colors.lavender, colors.butter]) }));
  const mo = useAnimatedStyle(() => ({ transform: [{ translateX: mochi.value }] }));
  return (
    <View>
      <Card padding={0}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 14, paddingVertical: 12 }}>
          <Animated.View style={[{ width: 3, height: 34, borderTopRightRadius: 2, borderBottomRightRadius: 2 }, bar]} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={font.row}>Vaisselle</Text>
            <Text style={[font.caption, { marginTop: 1 }]}>Tous les soirs · 15ʼ · {WHO[idx][0]}</Text>
          </View>
          <Animated.View style={mo}><MochiGalet size={34} mood="happy" /></Animated.View>
        </View>
        <View style={{ marginHorizontal: 14, marginBottom: 14, height: 40, borderRadius: 12, backgroundColor: colors.line, padding: 3 }} onLayout={e => setW(e.nativeEvent.layout.width - 6)}>
          <Animated.View style={[{ position: 'absolute', left: 3, top: 3, width: slot, height: 34, borderRadius: 10, backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', paddingLeft: 8 }, ind]}>
            <Avatar initial={WHO[idx][2]} color={WHO[idx][1]} size={22} />
          </Animated.View>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            {WHO.map(([label], i) => (
              <Pressable key={label} onPress={() => pick(i)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingLeft: idx === i ? 24 : 0 }}>
                <Text style={[font.cta, { color: idx === i ? colors.ink : colors.muted }]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Card>
    </View>
  );
}

// ─── 4 · Ajout d'une tâche ──────────────────────────────────────────
const POOL = [['Sortir les poubelles', 'Mardi · 5ʼ'], ['Arroser les plantes', 'Dimanche · 10ʼ'], ['Passer l’aspirateur', 'Samedi · 25ʼ'], ['Changer les draps', 'Dimanche · 20ʼ']];
export function Demo4() {
  const [rows, setRows] = useState([POOL[0], POOL[1]]);
  const [n, setN] = useState(2);
  const add = () => {
    if (n >= POOL.length) return;
    haptic();
    setRows(r => [r[0], POOL[n], ...r.slice(1)]); // insérée en 2e position : les suivantes se repositionnent
    setN(n + 1);
  };
  const reset = () => { setRows([POOL[0], POOL[1]]); setN(2); };
  return (
    <View>
      <Card padding={0}>
        {rows.map(([label, sub], k) => (
          <Animated.View key={label} entering={FadeInDown.duration(250).easing(Easing.out(Easing.cubic)).withInitialValues({ opacity: 0, transform: [{ translateY: 8 }] })}
            layout={LinearTransition.duration(240).easing(Easing.out(Easing.cubic))}
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: k === rows.length - 1 ? 0 : 1, borderBottomColor: colors.line }}>
            <CheckAnim done={false} />
            <View style={{ marginLeft: 12, flex: 1 }}><Text style={font.row}>{label}</Text><Text style={[font.caption, { marginTop: 1 }]}>{sub}</Text></View>
            <Avatar initial="L" color={colors.sky} size={24} />
          </Animated.View>
        ))}
      </Card>
      <Buttons><Btn label="Ajouter une tâche" onPress={add} primary /><Btn label="Rejouer" onPress={reset} /></Buttons>
    </View>
  );
}

// ─── 5 · Bottom sheet : montée en spring, suit le doigt au swipe ────
const TRAVEL = 250;
function Sheet({ onClose }) {
  const y = useSharedValue(TRAVEL), scrim = useSharedValue(0), start = useSharedValue(0);
  useEffect(() => { scrim.value = withTiming(1, { duration: 200 }); y.value = withSpring(0, { damping: 18, stiffness: 180, mass: 0.9 }); }, []);
  const close = () => {
    scrim.value = withTiming(0, { duration: 180 });
    y.value = withTiming(TRAVEL, { duration: 220, easing: Easing.in(Easing.cubic) }, (f) => { 'worklet'; if (f) runOnJS(onClose)(); });
  };
  const pan = Gesture.Pan().activeOffsetY([-6, 6])
    .onBegin(() => { start.value = y.value; })
    .onUpdate(e => { y.value = Math.max(0, start.value + e.translationY); })
    .onEnd(e => { if (y.value > 80 || e.velocityY > 700) runOnJS(close)(); else y.value = withSpring(0, { damping: 18, stiffness: 180 }); });
  const sc = useAnimatedStyle(() => ({ opacity: scrim.value }));
  const sh = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <>
      <Animated.View style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(26,26,31,0.28)' }, sc]}><Pressable style={{ flex: 1 }} onPress={close} /></Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[{ position: 'absolute', left: 0, right: 0, bottom: 0, height: TRAVEL, backgroundColor: colors.card, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: 18, paddingTop: 8 }, sh]}>
          <View style={{ alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: colors.sheetLine, marginBottom: 14 }} />
          <Text style={font.cardTitle}>Vaisselle</Text>
          <Text style={[font.secondary, { marginTop: 4 }]}>Tous les soirs · 15ʼ · Kima</Text>
          <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 14 }} />
          <Text style={font.row}>Repasser à Lea</Text>
          <Text style={[font.row, { marginTop: 12 }]}>Reporter à demain</Text>
          <View style={{ marginTop: 18 }}><CTAPrimary label="C’est fait" onPress={close} /></View>
        </Animated.View>
      </GestureDetector>
    </>
  );
}
export function Demo5() {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ height: 330, borderRadius: radius.cardLg, overflow: 'hidden', backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line }}>
      <View style={{ padding: 16 }}>
        <Text style={font.screenTitle}>À faire</Text>
        <Card padding={0} style={{ marginTop: 12 }}>
          {[['Vaisselle', 'Ce soir · 15ʼ'], ['Lessive', 'Demain · 30ʼ']].map(([l, s], k) => (
            <Pressable key={l} onPress={() => setOpen(true)} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: k ? 0 : 1, borderBottomColor: colors.line }}>
              <CheckAnim done={false} /><View style={{ marginLeft: 12 }}><Text style={font.row}>{l}</Text><Text style={[font.caption, { marginTop: 1 }]}>{s}</Text></View>
            </Pressable>
          ))}
        </Card>
        <Secondary style={{ marginTop: 12 }}>Touche une tâche pour ouvrir la sheet, puis tire-la vers le bas.</Secondary>
      </View>
      {open ? <Sheet onClose={() => setOpen(false)} /> : null}
    </View>
  );
}
