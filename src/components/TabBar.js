// TabBar v3 « l'instrument » (4 nov 2026) : hairline en haut, icônes fines, étiquettes en phrase normale,
// + plat couleur accent ; suit le mode jour / nuit (theme-v3). Accueil · Planning · [+] · Balance · Budget
import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTokens } from '../theme-v3';
import copy from '../data/copy.json';

const ICONS = {
  index: 'M4 11.5L12 4l8 7.5V20a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8.5z',
  planning: 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z',
  balance: 'M12 4v16M5 7h14M5 7l-2.5 6a3.5 3.5 0 007 0L7 7M19 7l-2.5 6a3.5 3.5 0 007 0L21 7M8 20h8',
  budget: 'M3 8a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8zM3 10h18M16 15h2',
};
// pictos en images (décision Jeanne 5 nov 2026 : « Accueil, Planning… sont des pictos aussi »)
const TAB_IMG = { index: require('../../assets/icones/tabs/building.png'), planning: require('../../assets/icones/tabs/calendar.png'), balance: require('../../assets/icones/tabs/balance.png'), budget: require('../../assets/icones/tabs/wallet.png') };
const LABELS = { index: copy.tabs.home, planning: copy.tabs.planning, balance: copy.tabs.balance, budget: copy.tabs.budget };
const ORDER = ['index', 'planning', 'fab', 'balance', 'budget'];

export default function TabBar({ state, navigation, onFab }) {
  const insets = useSafeAreaInsets();
  const T = useTokens();
  const active = state.routes[state.index].name;
  return (
    <View style={[s.bar, { paddingBottom: Math.max(insets.bottom, 24), backgroundColor: T.bg, borderTopColor: T.line }]}>
      {ORDER.map(name => {
        if (name === 'fab') {
          return (
            <Pressable key="fab" onPress={onFab} style={s.fabWrap} accessibilityLabel="Ajouter">
              <View style={[s.fab, { backgroundColor: T.accent }]}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none"><Path d="M12 5v14M5 12h14" stroke={T.bg} strokeWidth={2.4} strokeLinecap="round" /></Svg>
              </View>
            </Pressable>
          );
        }
        const on = active === name;
        const c = on ? T.ink : T.muted;
        return (
          <Pressable key={name} onPress={() => {
            // émet tabPress comme la barre native : les écrans peuvent l'intercepter (Budget sans Mochi+ → paywall, 11 nov 2026)
            const route = state.routes.find(r => r.name === name);
            const ev = navigation.emit({ type: 'tabPress', target: route?.key, canPreventDefault: true });
            if (!ev.defaultPrevented) navigation.navigate(name);
          }} style={s.tab}>
            <Image source={TAB_IMG[name]} style={{ width: 26, height: 26, opacity: on ? 1 : 0.5 }} resizeMode="contain" accessibilityIgnoresInvertColors />
            <Text style={{ fontSize: 11, color: c, fontWeight: on ? '600' : '400' }}>{LABELS[name]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  tab: { alignItems: 'center', gap: 6, minWidth: 56 },
  fabWrap: { marginBottom: 6 },
  fab: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
});
