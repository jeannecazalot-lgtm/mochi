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
import { colors, gradients, radius, space, font, motion, shadows, tabBar, alpha } from '../theme';

const SHEET_TRAVEL = 420;
const ENTRIES = [
  { k: 'task', icon: ICON.task, tint: colors.sage, deep: colors.sageDeep, route: '/task/edit' },
  { k: 'event', icon: ICON.event, tint: colors.sky, deep: colors.skyDeep, route: '/event' },
  { k: 'expense', icon: ICON.expense, tint: colors.butter, deep: colors.coralDeep, route: '/depense' },
  { k: 'note', icon: ICON.note, tint: colors.lavender, deep: colors.lavenderDeep, route: '/pense-bete' },
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
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: alpha(colors.ink, 0.35) }, scrimStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel={t.closeA11y} />
      </Animated.View>

      <Animated.View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 24) + 64 }, sheetStyle]}>
        <SheetHandle />
        <Text style={[font.cardTitle, { marginBottom: 12 }]}>{t.title}</Text>
        {ENTRIES.map((e, i) => (
          <View key={e.k}>
            {i ? <Divider /> : null}
            <Pressable onPress={() => go(e.route)} style={({ pressed }) => [s.row, { opacity: pressed ? 0.7 : 1 }]}>
              <View style={[s.bullet, { backgroundColor: alpha(e.tint, 0.16) }]}><Icon d={e.icon} size={20} color={e.deep} /></View>
              <View style={{ flex: 1 }}>
                <Text style={font.body}>{t[e.k]}</Text>
                <Text style={[font.secondary, { fontSize: 13, marginTop: 2 }]}>{t[`${e.k}Sub`]}</Text>
              </View>
              <Text style={{ fontSize: 16, color: colors.muted }}>›</Text>
            </Pressable>
          </View>
        ))}
      </Animated.View>

      {/* réplique du FAB, tournée de 45° (+ → ×) */}
      <Pressable onPress={onClose} style={[s.fabWrap, { bottom: Math.max(insets.bottom, 24) + 10 }]} accessibilityLabel={t.closeA11y}>
        <Animated.View style={fabStyle}>
          <LinearGradient {...gradients.mochi} style={[s.fab, shadows.fab]}>
            <Icon d={ICON.plus} size={22} sw={2.4} />
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.card, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingTop: 10, paddingHorizontal: space.screenX, borderTopWidth: 1, borderTopColor: colors.sheetLine },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 12 },
  bullet: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  fabWrap: { position: 'absolute', alignSelf: 'center' },
  fab: { width: tabBar.fabSize, height: tabBar.fabSize, borderRadius: tabBar.fabSize / 2, alignItems: 'center', justifyContent: 'center', borderWidth: tabBar.fabRing, borderColor: colors.white },
});
