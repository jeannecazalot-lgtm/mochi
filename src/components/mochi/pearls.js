// Perles qui volent (4 nov 2026) : à chaque mission cochée, des perles partent de Mochi et rejoignent le
// compteur en haut, qui fait un pop à l'arrivée. Remplace les confettis (retour Jeanne : « j'aime pas »).
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, withSequence, withSpring, Easing, runOnJS } from 'react-native-reanimated';

function Pearl({ from, to, delay, color, onDone }) {
  const p = useSharedValue(0), op = useSharedValue(0);
  useEffect(() => {
    op.value = withDelay(delay, withSequence(withTiming(1, { duration: 80 }), withDelay(520, withTiming(0, { duration: 120 }))));
    p.value = withDelay(delay, withTiming(1, { duration: 700, easing: Easing.inOut(Easing.cubic) }, f => { if (f && onDone) runOnJS(onDone)(); }));
  }, []);
  const st = useAnimatedStyle(() => {
    const t = p.value; const arc = -90 * Math.sin(Math.PI * t); // trajectoire en cloche
    return { opacity: op.value, transform: [{ translateX: from.x + (to.x - from.x) * t }, { translateY: from.y + (to.y - from.y) * t + arc }, { scale: 1 - 0.4 * t }] };
  });
  return <Animated.View style={[{ position: 'absolute', left: -6, top: -6, width: 12, height: 12, borderRadius: 6, backgroundColor: color }, st]} />;
}

export function PearlFlight({ from, to, count = 3, color, onArrive }) {
  if (!from || !to) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}>
      {Array.from({ length: count }).map((_, i) => <Pearl key={i} from={{ x: from.x + (i - 1) * 14, y: from.y }} to={to} delay={i * 70} color={color} onDone={i === count - 1 ? onArrive : null} />)}
    </View>
  );
}

// le compteur fait un pop quand une perle arrive
export function usePop() {
  const sc = useSharedValue(1);
  const pop = () => { sc.value = withSequence(withTiming(1.25, { duration: 110 }), withSpring(1, { damping: 8, stiffness: 260 })); };
  const style = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return { pop, style };
}
