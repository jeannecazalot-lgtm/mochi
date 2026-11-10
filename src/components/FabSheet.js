// Sheet du FAB (README §Animations 6). Recette : docs/recettes/17b-fab-sheet.md
// Branchement dans app/(tabs)/_layout.js :
//   const fab = useFabSheet();
//   <Tabs tabBar={props => <TabBar {...props} onFab={fab.toggle} />} …>
//   <FabSheet open={fab.open} onClose={fab.hide} />   (en frère de <Tabs>, dans un fragment)
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS } from 'react-native-reanimated';
import { Divider } from './ui';
import { Animated, useFabRotation } from './motion';
import { Icon, ICON, SheetHandle } from './core/extra';
import copy from '../data/copy.json';
import { isPremium } from '../demo-premium';
import { colors, gradients, radius, space, font, motion, shadows, tabBar, alpha } from '../theme';
import { styles as v3Styles, currentTokens as tk } from '../theme-v3';

const SHEET_TRAVEL = 420;
const ENTRIES = [
  { k: 'task', icon: ICON.task, tint: tk().ok, deep: tk().ok, route: '/task/edit' },
  { k: 'event', icon: ICON.event, tint: '#7DB3D5', deep: '#7DB3D5', route: '/event' },
  { k: 'expense', icon: ICON.expense, tint: tk().scene.lamp, deep: tk().accent, route: '/depense', plus: true }, // Budget = Mochi+ (Jeanne, 11 nov 2026) : en gratuit, ouvre le paywall
  { k: 'note', icon: ICON.note, tint: '#9A7BC8', deep: '#9A7BC8', route: '/note' },
];

export function useFabSheet() {
  const [open, setOpen] = useState(false);
  return { open, show: () => setOpen(true), hide: () => setOpen(false), toggle: () => setOpen(o => !o) };
}

export default function FabSheet({ open, onClose }) {
  const insets = useSafeAreaInsets();
  const t = copy.fab;
  const [mounted, setMounted] = useState(open);
  const scrim = useSharedValue(0);
  const y = useSharedValue(SHEET_TRAVEL);
  const fabStyle = useFabRotation(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      scrim.value = withTiming(1, { duration: motion.micro });
      y.value = withSpring(0, { duration: motion.screen, dampingRatio: 0.8 });
    } else {
      scrim.value = withTiming(0, { duration: motion.micro });
      y.value = withTiming(SHEET_TRAVEL, { duration: motion.micro });
      const id = setTimeout(() => setMounted(false), motion.micro + 40); // démontage par timer JS : fiable même si l'animation est interrompue
      return () => clearTimeout(id);
    }
  }, [open]);

  const scrimStyle = useAnimatedStyle(() => ({ opacity: scrim.value }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  // ferme d'abord, pousse ensuite (sinon la route s'ouvre pendant la fermeture du sheet)
  const go = route => { onClose(); setTimeout(() => router.push(route), motion.micro); };

  if (!mounted) return null;
  return (
    <View pointerEvents={open ? 'auto' : 'none'} style={[StyleSheet.absoluteFill, { zIndex: 50, elevation: 50 }]}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: tk().seg }, scrimStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={t.closeA11y} />
      </Animated.View>

      <Animated.View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 24) + 64 }, sheetStyle]}>
        <SheetHandle />
        <Text style={[font.cardTitle, { color: tk().ink }, { marginBottom: 12 }]}>{t.title}</Text>
        {ENTRIES.map((e, i) => (
          <View key={e.k}>
            {i ? <Divider /> : null}
            <Pressable onPress={() => go(e.plus && !isPremium() ? '/paywall' : e.route)} style={({ pressed }) => [s.row, { opacity: pressed ? 0.7 : 1 }]}>
              <View style={[s.bullet, { backgroundColor: alpha(e.tint, 0.16) }]}><Icon d={e.icon} size={20} color={e.deep} /></View>
              <View style={{ flex: 1 }}>
                <Text style={[font.body, { color: tk().ink }, { color: tk().ink }]}>{t[e.k]}</Text>
                <Text style={[font.secondary, { color: tk().muted }, { fontSize: 13, marginTop: 2 }]}>{t[`${e.k}Sub`]}</Text>
              </View>
              {e.plus && !isPremium() ? <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, borderWidth: 1, borderColor: tk().accent }}><Text style={{ fontSize: 11.5, fontWeight: '700', color: tk().accent }}>Mochi+</Text></View> : null}
              <Text style={{ fontSize: 16, color: tk().muted }}>›</Text>
            </Pressable>
          </View>
        ))}
      </Animated.View>

      {/* réplique du FAB, tournée de 45° (+ → ×) */}
      <Pressable onPress={onClose} style={[s.fabWrap, { bottom: Math.max(insets.bottom, 24) + 6 }]} accessibilityLabel={t.closeA11y}>
        <Animated.View style={[s.fab, { backgroundColor: tk().accent }, fabStyle]}>
          <Icon d={ICON.plus} size={20} sw={2.4} color={tk().bg} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const s = v3Styles(T => StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: T.bg, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingTop: 10, paddingHorizontal: space.screenX, borderTopWidth: 1, borderTopColor: T.line },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 12 },
  bullet: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  fabWrap: { position: 'absolute', alignSelf: 'center' },
  fab: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
}));
