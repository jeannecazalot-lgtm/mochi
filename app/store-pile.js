// Visuel App Store, écran 2 « La pile » (recette du 10 nov 2026) : la pièce de Mochi, le couple sur le tapis,
// les tâches tombent et s'empilent sur une seule des deux. Rendu par l'app (captures et vidéo d'aperçu).
// mochi://store-pile — toucher l'écran rejoue la chute.
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withSpring, withTiming, Easing } from 'react-native-reanimated';
import { Scene } from '../src/components/mochi/scene';
import { Avatar } from '../src/components/ui';
import { TOKENS } from '../src/theme-v3';
import { me, partner } from '../src/demo';
import { useIdentity } from '../src/identity';

const ICONS = ['dish', 'basket', 'cart', 'calendar', 'baby', 'pan', 'trash', 'pill', 'mail', 'gift', 'shirt', 'dog', 'coins', 'bed'];
const SRC = {
  dish: require('../assets/icones/dish.png'), basket: require('../assets/icones/basket.png'), cart: require('../assets/icones/cart.png'),
  calendar: require('../assets/icones/calendar.png'), baby: require('../assets/icones/baby.png'), pan: require('../assets/icones/pan.png'),
  trash: require('../assets/icones/trash.png'), pill: require('../assets/icones/pill.png'), mail: require('../assets/icones/mail.png'),
  gift: require('../assets/icones/gift.png'), shirt: require('../assets/icones/shirt.png'), dog: require('../assets/icones/dog.png'),
  coins: require('../assets/icones/coins.png'), bed: require('../assets/icones/bed.png'),
};
const INK = '#1F2A58';
// une tour de 3 de large qui se resserre en montant, rotations légères (pas de hasard : même rendu à chaque capture)
const SLOTS = [[-1, 0, -6], [0, 0, 4], [1, 0, -3], [-0.5, 1, 8], [0.5, 1, -7], [-1, 2, 3], [0, 2, -5], [1, 2, 6], [-0.5, 3, -4], [0.5, 3, 9], [0, 4, -8], [-0.5, 5, 5], [0.5, 5, -3], [0, 6, 7]];

function Falling({ src, x, y, rot, size, delay, run }) {
  const v = useSharedValue(0);
  useEffect(() => { v.value = 0; v.value = withDelay(delay, withSpring(1, { damping: 11, stiffness: 140, mass: 0.9 })); }, [run]);
  const st = useAnimatedStyle(() => ({ opacity: v.value > 0.02 ? 1 : 0, transform: [{ translateY: (1 - v.value) * -900 }, { rotate: `${rot * v.value}deg` }] }));
  return <Animated.View style={[{ position: 'absolute', left: x, top: y, width: size, height: size }, st]}><Image source={src} style={{ width: size, height: size }} /></Animated.View>;
}

export default function StorePile() {
  useIdentity();
  const T = TOKENS.jour;
  const { width: W, height: H } = useWindowDimensions();
  const [run, setRun] = useState(0);
  const sceneH = W * 1.42; const sceneTop = H - sceneH - 20;
  const floorY = H - 150;                 // le tapis
  const av = 96; const jx = W * 0.24, kx = W * 0.78; // Jeanne à gauche, Ketley à droite
  const ic = 82; const step = ic * 0.8;
  const title = useSharedValue(0);
  useEffect(() => { title.value = 0; title.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }); }, [run]);
  const tSt = useAnimatedStyle(() => ({ opacity: title.value }));
  return (
    <Pressable style={{ flex: 1, backgroundColor: T.bg }} onPress={() => setRun(r => r + 1)}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: sceneTop }}>
        <Scene key={run} T={T} stage="mochi" mood="surprised" lvl={2} height={sceneH} items={[]} outfit={null} positions={{}} />
        <LinearGradient colors={[T.bg, 'rgba(245,241,234,0)']} style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 110 }} />
      </View>
      <Animated.View style={[{ position: 'absolute', top: 92, left: 24, right: 24, alignItems: 'center' }, tSt]}>
        <Text style={{ fontSize: 34, lineHeight: 40, fontWeight: '700', letterSpacing: -0.9, color: INK, textAlign: 'center' }}>Souvent, une seule{'\n'}personne porte tout.</Text>
        <Text style={{ marginTop: 12, fontSize: 16, fontWeight: '500', color: INK, opacity: 0.6 }}>+1h26 par jour · Insee, enquête emploi du temps</Text>
      </Animated.View>
      {/* le couple, vrais avatars de l'app */}
      <View style={{ position: 'absolute', left: jx - av / 2, top: floorY - av }}><Avatar initial={me.initial} color={me.color} photo={me.avatar_url} size={av} ring /></View>
      <View style={{ position: 'absolute', left: kx - av / 2, top: floorY - av }}><Avatar initial={partner.initial} color={partner.color} photo={partner.avatar_url} size={av} ring /></View>
      <Text style={{ position: 'absolute', left: jx - 60, width: 120, top: floorY + 6, textAlign: 'center', fontSize: 15, fontWeight: '600', color: INK }}>{me.first_name}</Text>
      <Text style={{ position: 'absolute', left: kx - 60, width: 120, top: floorY + 6, textAlign: 'center', fontSize: 15, fontWeight: '600', color: INK }}>{partner.first_name}</Text>
      {/* la pile, sur une seule tête */}
      {SLOTS.map(([cx, row, rot], i) => (
        <Falling key={`${run}-${i}`} run={run} src={SRC[ICONS[i]]} size={ic} rot={rot} delay={250 + i * 110}
          x={jx + cx * step - ic / 2} y={floorY - av - (row + 1) * step - 4} />
      ))}
    </Pressable>
  );
}
