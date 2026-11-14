// Écran « Jour X ensemble » v3 (Jeanne, 14 nov 2026 : « qu'on voie que c'est une application, pas un PowerPoint »).
// Recette : l'Accueil reste derrière sous un voile ; Mochi décolle de SA place (béret compris) et vient au centre en
// une seule trajectoire à ressort ; une ombre se forme sous lui à l'arrivée ; vos photos glissent de sous lui et se posent devant, de chaque côté ;
// le chiffre est un compteur à rouleaux (une vibration à chaque cran) ; clin d'œil. Fermer = toucher, ou tirer vers
// le bas (tout suit le doigt, Mochi s'étire avec la vitesse) : Mochi repart à sa place et l'Accueil revient.
// Pas de confettis, pas de pulsation, Mochi jamais transformé. Une fois par jour (app/(tabs)/index.js).
import React, { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Image, useWindowDimensions, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedReaction, withDelay, withSequence, withSpring, withTiming, Easing, interpolate, Extrapolation, runOnJS } from 'react-native-reanimated';
import { MochiImage, MOCHI_RATIO, PAPIER_RATIO } from '../src/components/mochi-img';
import { SHOP, outfitStyle } from '../src/components/mochi/shop-assets';
import { Avatar } from '../src/components/ui';
import { useTokens } from '../src/theme-v3';
import { me, partner } from '../src/demo';
import { useIdentity } from '../src/identity';
import { getMochiBox, setMochiAway } from '../src/day-screen';
import copy from '../src/copy';

const STAY = 5200; // ms avant fermeture automatique
const W = 190; // largeur de Mochi au centre
const H = W * PAPIER_RATIO;
const PH = 56; // photos
const LH = 100; // hauteur d'un cran du compteur
const light = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
const tick = () => Haptics.selectionAsync().catch(() => {});
const success = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
const clamp01 = v => { 'worklet'; return Math.min(1, Math.max(0, v)); };

// un rouleau : la bande 0-9 (répétée `turns` fois) défile et se cale sur le chiffre, en ressort
function Reel({ d, turns, delay, onTick, color }) {
  const pos = useSharedValue(0);
  useEffect(() => { pos.value = withDelay(delay, withSpring(turns * 10 + d, { damping: 18, stiffness: 60, mass: 1 })); }, []);
  useAnimatedReaction(() => Math.round(pos.value), (cur, prev) => { if (onTick && prev != null && cur !== prev) runOnJS(onTick)(); });
  const st = useAnimatedStyle(() => ({ transform: [{ translateY: -pos.value * LH }] }));
  return (
    <View style={{ height: LH, overflow: 'hidden' }}>
      <Animated.View style={st}>
        {Array.from({ length: (turns + 1) * 10 }, (_, i) => <Text key={i} style={[s.big, { color }]}>{i % 10}</Text>)}
      </Animated.View>
    </View>
  );
}

function usePhotoStyle(side, ph, drag) {
  return useAnimatedStyle(() => ({
    opacity: clamp01(ph.value * 1.4),
    transform: [{ translateY: drag.value }, { translateX: -side * (W * 0.5) * (1 - ph.value) }, { scale: 0.5 + 0.5 * ph.value }, { rotate: `${side * 8 * ph.value}deg` }],
  }));
}

export default function JourEnsemble() {
  const T = useTokens();
  useIdentity();
  const { width: SW, height: SH } = useWindowDimensions();
  const { day: dayParam, outfit } = useLocalSearchParams();
  const day = Math.max(1, parseInt(dayParam, 10) || 1);
  const t = copy.dayScreen;
  const [mood, setMood] = useState('happy');
  const [counting, setCounting] = useState(false);
  const closing = useRef(false);

  // d'où part Mochi : sa boîte sur l'Accueil ; sinon il arrive d'en haut
  const box = useRef(getMochiBox()).current;
  const tTop = SH * 0.2, tcx = SW / 2, tcy = tTop + H / 2;
  const o = box ? { dx: box.x + box.w / 2 - tcx, dy: box.y + box.h / 2 - tcy, s: box.w / W } : { dx: 0, dy: -tcy - H, s: 0.7 };

  const p = useSharedValue(0); // vol : 0 = à sa place, 1 = au centre
  const veil = useSharedValue(0);
  const land = useSharedValue(1); // écrasement à l'atterrissage
  const stretch = useSharedValue(1); // étirement selon la vitesse du doigt
  const drag = useSharedValue(0);
  const ph = useSharedValue(0); // photos + chiffre
  const txt = useSharedValue(0);

  const finish = () => { setMochiAway(false); if (router.canGoBack()) router.back(); };
  const close = () => {
    if (closing.current) return; closing.current = true;
    setMood('happy');
    txt.value = withTiming(0, { duration: 160 });
    ph.value = withTiming(0, { duration: 220 });
    veil.value = withTiming(0, { duration: 460, easing: Easing.inOut(Easing.cubic) });
    p.value = withTiming(0, { duration: 480, easing: Easing.inOut(Easing.cubic) }, done => { if (done) runOnJS(finish)(); });
  };

  useEffect(() => {
    if (box) setMochiAway(true);
    veil.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    p.value = withDelay(60, withSpring(1, { damping: 15, stiffness: 110, mass: 1 }));
    const tm = [
      setTimeout(() => { setMood('surprised'); light(); }, 40),
      setTimeout(() => { setMood('happy'); land.value = withSequence(withTiming(0.86, { duration: 90 }), withSpring(1, { damping: 7, stiffness: 260 })); light(); }, 620),
      setTimeout(() => { ph.value = withSpring(1, { damping: 13, stiffness: 130 }); setCounting(true); }, 680),
      setTimeout(() => { txt.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }); }, 1500),
      setTimeout(() => { setMood('wink'); success(); }, 2500),
      setTimeout(() => close(), STAY),
    ];
    return () => { tm.forEach(clearTimeout); setMochiAway(false); };
  }, []);

  const pan = Gesture.Pan().activeOffsetY([-8, 8])
    .onUpdate(e => {
      drag.value = e.translationY > 0 ? e.translationY : e.translationY * 0.15;
      stretch.value = 1 + Math.max(-0.06, Math.min(0.14, e.velocityY / 4500));
    })
    .onEnd(e => {
      stretch.value = withSpring(1, { damping: 6, stiffness: 220 });
      if (e.translationY > 120 || e.velocityY > 900) runOnJS(close)();
      else drag.value = withSpring(0, { damping: 15, stiffness: 180 });
    });
  const tap = Gesture.Tap().onEnd(() => runOnJS(close)());
  const gesture = Gesture.Exclusive(pan, tap);

  const veilStyle = useAnimatedStyle(() => ({ opacity: 0.9 * veil.value * interpolate(drag.value, [0, 420], [1, 0.35], Extrapolation.CLAMP) }));
  const flyStyle = useAnimatedStyle(() => {
    const k = p.value;
    return { transform: [
      { translateX: o.dx * (1 - k) },
      { translateY: o.dy * (1 - k) - 64 * Math.sin(Math.PI * clamp01(k)) + drag.value * k },
      { scale: o.s + (1 - o.s) * k },
    ] };
  });
  const bodyStyle = useAnimatedStyle(() => { const v = land.value * stretch.value; return { transform: [{ scaleY: v }, { scaleX: 2 - v }] }; });
  const shadowStyle = useAnimatedStyle(() => ({
    opacity: 0.1 * interpolate(p.value, [0.55, 1], [0, 1], Extrapolation.CLAMP) * interpolate(drag.value, [0, 200], [1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: drag.value }, { scaleX: 0.4 + 0.6 * clamp01(p.value) }],
  }));
  const leftStyle = usePhotoStyle(-1, ph, drag), rightStyle = usePhotoStyle(1, ph, drag);
  const numStyle = useAnimatedStyle(() => ({ opacity: clamp01(ph.value * 1.3), transform: [{ translateY: drag.value + 14 * (1 - ph.value) }] }));
  const txtStyle = useAnimatedStyle(() => ({ opacity: txt.value, transform: [{ translateY: drag.value + 10 * (1 - txt.value) }] }));

  const digits = String(day).split('').map(Number);
  const os = outfit && SHOP[outfit] ? outfitStyle(outfit, W, W * MOCHI_RATIO) : null;
  const baseY = tTop + H; // le sol sous Mochi
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <View style={{ flex: 1 }} accessible accessibilityRole="button" accessibilityLabel={t.closeA11y}>
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: T.bg }, veilStyle]} />
          {/* ombre au sol, qui se forme quand il se pose */}
          <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: tcx - W * 0.36, top: baseY - 9, width: W * 0.72, height: 14, borderRadius: 7, backgroundColor: T.ink }, shadowStyle]} />
          {/* Mochi : vol (dehors) + écrasement depuis la base (dedans) */}
          <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: tcx - W / 2, top: tTop, width: W, height: H }, flyStyle]}>
            <Animated.View style={[{ width: W, height: H, transformOrigin: 'bottom' }, bodyStyle]}>
              <MochiImage size={W} mood={mood} />
              {os ? <Image source={SHOP[outfit]} style={os} resizeMode="contain" /> : null}
            </Animated.View>
          </Animated.View>
          {/* les photos, devant lui, de chaque côté (Jeanne : « pourquoi les photos sont derrière ») */}
          <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: tcx - W * 0.56 - PH / 2, top: baseY - PH * 0.9 }, leftStyle]}>
            <Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={PH} ring />
          </Animated.View>
          <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: tcx + W * 0.56 - PH / 2, top: baseY - PH * 0.9 }, rightStyle]}>
            <Avatar initial={partner.initial} color={partner.color} photo={partner.avatar_url} size={PH} ring />
          </Animated.View>
          {/* le compteur */}
          <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: 0, right: 0, top: baseY + 40, alignItems: 'center' }, numStyle]}>
            <View style={{ flexDirection: 'row' }}>
              {counting ? digits.map((d, i) => <Reel key={i} d={d} turns={i === digits.length - 1 ? 1 : 0} delay={(digits.length - 1 - i) * 120} onTick={i === digits.length - 1 ? tick : null} color={T.ink} />) : <View style={{ height: LH }} />}
            </View>
          </Animated.View>
          <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: 32, right: 32, top: baseY + 40 + LH, alignItems: 'center' }, txtStyle]}>
            <Text style={{ fontSize: 20, fontWeight: '600', letterSpacing: -0.4, color: T.ink }}>{day === 1 ? t.daysOne : t.days}</Text>
            <Text style={{ fontSize: 15, color: T.muted, marginTop: 10, textAlign: 'center' }}>{t.sub.replace('{name}', partner.first_name)}</Text>
          </Animated.View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const s = StyleSheet.create({
  big: { height: LH, lineHeight: LH, fontSize: 88, fontWeight: '700', letterSpacing: -3, fontVariant: ['tabular-nums'], textAlign: 'center' },
});
