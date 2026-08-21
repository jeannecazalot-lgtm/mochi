// TabBar canonique (README §Composants) : barre blanche, borderTop #EBEBEB,
// 4 onglets icône outline 22 + label, FAB central 54 gradient Mochi,
// détouré 4px blanc, marginTop −34.
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, tabBar, font, shadows } from '../theme';
import copy from '../data/copy.json';

const ICONS = {
  index: 'M4 11.5L12 4l8 7.5V20a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8.5z',
  planning: 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z',
  balance: 'M12 4v16M5 7h14M5 7l-2.5 6a3.5 3.5 0 007 0L7 7M19 7l-2.5 6a3.5 3.5 0 007 0L21 7M8 20h8',
  budget: 'M3 8a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8zM3 10h18M16 15h2',
};
const LABELS = { index: copy.tabs.home, planning: copy.tabs.planning, balance: copy.tabs.balance, budget: copy.tabs.budget };
const ORDER = ['index', 'planning', 'fab', 'balance', 'budget'];

export default function TabBar({ state, navigation, onFab }) {
  const insets = useSafeAreaInsets();
  const active = state.routes[state.index].name;
  return (
    <View style={[s.bar, { paddingBottom: Math.max(insets.bottom, 24) }]}>
      {ORDER.map(name => {
        if (name === 'fab') {
          return (
            <Pressable key="fab" onPress={onFab} style={s.fabWrap}>
              <LinearGradient {...gradients.mochi} style={[s.fab, shadows.fab]}>
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none"><Path d="M12 5v14M5 12h14" stroke={colors.ink} strokeWidth={2.4} strokeLinecap="round" /></Svg>
              </LinearGradient>
            </Pressable>
          );
        }
        const on = active === name;
        const c = on ? colors.coral : colors.tabInactive;
        return (
          <Pressable key={name} onPress={() => navigation.navigate(name)} style={s.tab}>
            <Svg width={tabBar.iconSize} height={tabBar.iconSize} viewBox="0 0 24 24" fill="none">
              <Path d={ICONS[name]} stroke={c} strokeWidth={on ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={[font.tabLabel, { color: c, fontWeight: on ? '600' : '400' }]}>{LABELS[name]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: { backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.footerLine, paddingTop: 8, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  tab: { alignItems: 'center', gap: 5, minWidth: 52 },
  fabWrap: { marginTop: tabBar.fabLift },
  fab: { width: tabBar.fabSize, height: tabBar.fabSize, borderRadius: tabBar.fabSize / 2, alignItems: 'center', justifyContent: 'center', borderWidth: tabBar.fabRing, borderColor: colors.white },
});
