// Icônes de tâches à nous (4 nov 2026, retour Jeanne : « enlever les emoji et faire nos propres visuels »).
// Traits fins 1,8 comme la tab bar (DA v3 « l'instrument »), couleur encre. Les données gardent la colonne
// `emoji` (clé) : chaque emoji connu a son icône, un emoji inconnu tombe sur l'icône générique.
import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTokens } from '../theme-v3';

export const ICONS = {
  dish: 'M5 12a7 7 0 1014 0 7 7 0 00-14 0zM9 12a3 3 0 106 0 3 3 0 00-6 0z',
  pan: 'M3 14a6 6 0 1012 0 6 6 0 00-12 0zM15 13h6M7 14a2 2 0 104 0 2 2 0 00-4 0z',
  cart: 'M3 4h2l2.4 11h11l2-7H6.5M9 20a1 1 0 100-2 1 1 0 000 2zM17 20a1 1 0 100-2 1 1 0 000 2z',
  basket: 'M4 10h16l-1.5 9h-13L4 10zM8 10l2-5M16 10l-2-5',
  shirt: 'M8 4l4 2 4-2 4 3-2 3-2-1v11H8V9l-2 1-2-3 4-3z',
  broom: 'M14 3l-6 10M8 13l-3 2 2 5 5-1 2-4-6-2z',
  bath: 'M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3zM6 12V6a2 2 0 014 0M18 19l1 2M6 19l-1 2',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
  bed: 'M3 18v-7a2 2 0 012-2h14a2 2 0 012 2v7M3 14h18M6 9V6h5v3',
  box: 'M4 8l8-4 8 4-8 4-8-4zM4 8v8l8 4 8-4V8M12 12v8',
  file: 'M6 3h8l4 4v14H6V3zM14 3v4h4M9 12h6M9 16h6',
  mail: 'M3 6h18v12H3V6zM3 7l9 6 9-6',
  calendar: 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z',
  list: 'M5 5h14v14H5V5zM8 9h8M8 12h8M8 15h5',
  suitcase: 'M4 8h16v12H4V8zM9 8V5h6v3M4 13h16',
  dog: 'M6 9c0-3 2-5 6-5s6 2 6 5v4a6 6 0 01-12 0V9zM9 12h.01M15 12h.01M10 15h4M6 8L3 6M18 8l3-2',
  leaf: 'M5 19c0-7 4-12 14-13-1 10-6 14-13 14M5 19l8-8',
  cat: 'M6 10l-1-5 4 2h6l4-2-1 5M6 10a6 6 0 0012 0M9 12h.01M15 12h.01M10 15c1.5 1 2.5 1 4 0',
  pin: 'M12 21s-6-5.5-6-11a6 6 0 1112 0c0 5.5-6 11-6 11zM10 10a2 2 0 104 0 2 2 0 00-4 0z',
  baby: 'M5 12a7 7 0 1014 0 7 7 0 00-14 0zM9 11h.01M15 11h.01M9 15c2 1.5 4 1.5 6 0M12 5V3',
  wrench: 'M14 4a5 5 0 00-4.8 6.4L3 16.6 6.4 20l6.2-6.2A5 5 0 0019 9l-3 1-2-2 1-3z',
  car: 'M3 13l2-5h14l2 5v5H3v-5zM3 13h18M7 18v2M17 18v2M7 15h.01M17 15h.01',
  pill: 'M8 8l8 8M5 11a4.5 4.5 0 016.4-6.4l8 8A4.5 4.5 0 0113 19l-8-8z',
  gift: 'M4 10h16v10H4V10zM3 6h18v4H3V6zM12 6v14M12 6c-2-4-6-3-5 0M12 6c2-4 6-3 5 0',
  pizza: 'M12 3l9 16H3L12 3zM12 10h.01M9 15h.01M15 15h.01',
  coins: 'M4 12a8 8 0 1016 0 8 8 0 00-16 0zM9 10h6M9 14h6M12 8v8',
  bulb: 'M9 18h6M10 21h4M8 12a4 4 0 118 0c0 2-2 3-2 5h-4c0-2-2-3-2-5z',
  key: 'M14 10a4 4 0 10-4 4l1-1 2 2 2-2-2-2 1-1zM10 10h.01',
  phone: 'M5 4h4l2 5-2 1a11 11 0 005 5l1-2 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  stetho: 'M6 3v6a6 6 0 0012 0V3M12 15v3a3 3 0 006 0v-3M18 13a2 2 0 100 4 2 2 0 000-4z',
  home: 'M4 11.5L12 4l8 7.5V20a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8.5z',
  cake: 'M5 12h14v8H5v-8zM8 12V8h8v4M12 4v4',
  plane: 'M2 12l20-8-6 18-3-7-7-3z',
  party: 'M4 20l5-14 9 9-14 5zM14 4l1 2M18 7l2 1M19 12l2 1',
  grad: 'M2 9l10-5 10 5-10 5L2 9zM6 11v5c3 2 9 2 12 0v-5',
  ring: 'M12 8l-3-4h6l-3 4zM12 8a6 6 0 100 12 6 6 0 000-12z',
  mask: 'M5 5h14v8a7 7 0 01-14 0V5zM9 9h.01M15 9h.01M9 14c2 1.5 4 1.5 6 0',
  ball: 'M4 12a8 8 0 1016 0 8 8 0 00-16 0zM12 4v16M4 12h16',
  user: 'M8 8a4 4 0 108 0 4 4 0 00-8 0zM4 21a8 8 0 0116 0',
  bell: 'M6 16v-5a6 6 0 0112 0v5l2 2H4l2-2M10 20a2 2 0 004 0',
  balance: 'M12 4v16M5 7h14M5 7l-2.5 6a3.5 3.5 0 007 0L7 7M19 7l-2.5 6a3.5 3.5 0 007 0L21 7M8 20h8',
  moon: 'M20 14A8 8 0 0110 4a8 8 0 1010 10z',
  card: 'M3 8a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8zM3 10h18',
  map: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6zM9 4v14M15 6v14',
  mochi: 'M5 15c0-4 3-8 7-8s7 4 7 8c0 2-3 3-7 3s-7-1-7-3zM10 13h.01M14 13h.01',
  generic: 'M4 12a8 8 0 1016 0 8 8 0 00-16 0zM10 12a2 2 0 104 0 2 2 0 00-4 0z',
};
const BY_EMOJI = {
  '🍽': 'dish', '🍽️': 'dish', '🍳': 'pan', '🛒': 'cart', '🧺': 'basket', '👕': 'shirt', '🧹': 'broom', '🛁': 'bath', '🚿': 'bath', '🗑': 'trash', '🗑️': 'trash',
  '🛏': 'bed', '🛏️': 'bed', '🧸': 'box', '📄': 'file', '🧾': 'file', '📬': 'mail', '📅': 'calendar', '🗓': 'calendar', '📆': 'calendar', '📝': 'list', '🧳': 'suitcase',
  '🐕': 'dog', '🐶': 'dog', '🪴': 'leaf', '🌱': 'leaf', '🐈': 'cat', '📌': 'pin', '👶': 'baby', '🔧': 'wrench', '🚗': 'car', '💊': 'pill', '🎁': 'gift', '🍕': 'pizza',
  '💶': 'coins', '💸': 'coins', '💰': 'coins', '💡': 'bulb', '🔑': 'key', '📞': 'phone', '🩺': 'stetho', '🏠': 'home', '🏡': 'home', '🎂': 'cake', '✈️': 'plane', '✈': 'plane',
  '🎉': 'party', '🎓': 'grad', '💍': 'ring', '🎭': 'mask', '⚽': 'ball', '👤': 'user', '🔔': 'bell', '⚖️': 'balance', '⚖': 'balance', '🌙': 'moon', '💳': 'card', '🗺': 'map', '🗺️': 'map', '🍡': 'mochi', '☕': 'dish', '🎟️': 'party', '🎟': 'party', '✅': 'list', '📞': 'phone',
};
export const iconFor = emoji => ICONS[BY_EMOJI[String(emoji || '').trim()] || (ICONS[emoji] ? emoji : 'generic')];

export function TaskIcon({ emoji, icon, size = 20, color, sw = 1.7, style }) {
  const T = useTokens();
  const d = icon ? ICONS[icon] : iconFor(emoji);
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"><Path d={d} stroke={color || T.ink} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" /></Svg>
    </View>
  );
}
