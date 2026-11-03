// ═══════════════════════════════════════════════════════════════════
// theme-v3.js — tokens de la DA v3 « l'instrument et la créature » (décision Jeanne 3 nov 2026,
// recette docs/recettes/da-v2-mochi-eleve.md §6) + mode nuit (par personne : auto / on / off ;
// auto = entre l'heure de coucher du foyer et 7 h). theme.js (v1) reste pour les écrans non repris.
// ═══════════════════════════════════════════════════════════════════
import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JOUR = {
  night: false,
  bg: '#F7F2E9', ink: '#2B2420', muted: '#9A8F84', line: 'rgba(43,36,32,0.10)', seg: 'rgba(43,36,32,0.08)', accent: '#E0725C', ok: '#7E9463',
  scene: { wall: '#EFE3D3', floor: '#E2CFB8', window: '#FBF2E2', sofa: '#D9A98F', cushion: '#F1CDB8', plant: '#8FA985', pot: '#C27A58', rug: '#EAD9C4', lamp: '#FBE9C8', lampOn: false, frame: '#E3CBB2', shelf: '#D8C2A6', book1: '#C27A58', book2: '#8FA985', vase: '#E8D5BE', stool: '#D4B894', shadow: 'rgba(43,36,32,0.10)', sun: '#FBE9C8', moon: null },
};
const NUIT = {
  night: true,
  bg: '#0E0E10', ink: '#F2F0EB', muted: '#6F6D68', line: 'rgba(255,255,255,0.12)', seg: 'rgba(255,255,255,0.12)', accent: '#E97A6A', ok: '#8FA985',
  scene: { wall: '#17171A', floor: '#1F1F23', window: '#2A2A40', sofa: '#3A3530', cushion: '#4A3F38', plant: '#2F4234', pot: '#5A4030', rug: '#232327', lamp: '#E0B86A', lampOn: true, frame: '#26262B', shelf: '#2C2823', book1: '#5A4030', book2: '#2F4234', vase: '#3A3530', stool: '#33302B', shadow: 'rgba(0,0,0,0.5)', sun: null, moon: '#F2F0EB' },
};
export const TOKENS = { jour: JOUR, nuit: NUIT };
// typo de l'instrument : étiquettes en phrase normale, chiffres tabulaires, pas de capitales espacées
export const type = {
  name: { fontSize: 32, fontWeight: '600', letterSpacing: -1 },
  label: { fontSize: 13.5, fontWeight: '500' },
  num: { fontSize: 15, fontWeight: '600', letterSpacing: -0.4, fontVariant: ['tabular-nums'] },
  body: { fontSize: 16, fontWeight: '500' },
  section: { fontSize: 17, fontWeight: '600' },
  sub: { fontSize: 15.5, lineHeight: 21 },
};
export const layout = { x: 24, air: 1.3, scene: 300, floor: 54, mochi: 150 };

const K = 'mochi:nightMode';
let mode = 'auto', bedtime = '22:30', night = false, version = 0;
const subs = new Set();
const notify = () => { version++; subs.forEach(f => f()); };
const minutes = hhmm => { const [h, m] = String(hhmm || '22:30').split(':').map(Number); return h * 60 + (m || 0); };
function compute() {
  const d = new Date(); const now = d.getHours() * 60 + d.getMinutes();
  const auto = now >= minutes(bedtime) || now < 7 * 60; // du coucher du foyer à 7 h
  const next = mode === 'on' ? true : mode === 'off' ? false : auto;
  if (next !== night) { night = next; notify(); }
}
export const isNight = () => night;
export const getNightMode = () => mode;
export async function loadNightMode(householdBedtime) {
  try { const v = await AsyncStorage.getItem(K); if (v) mode = v; } catch (e) { /* valeur par défaut */ }
  if (householdBedtime) bedtime = householdBedtime;
  compute();
}
export async function setNightMode(m) { mode = m; try { await AsyncStorage.setItem(K, m); } catch (e) { /* ignore */ } compute(); notify(); }
export function setBedtime(t) { bedtime = t; compute(); }
setInterval(compute, 60 * 1000);
// hook : les écrans repris en DA v3 lisent leurs couleurs ici
export function useTokens() {
  useSyncExternalStore(cb => (subs.add(cb), () => subs.delete(cb)), () => version);
  return night ? NUIT : JOUR;
}
