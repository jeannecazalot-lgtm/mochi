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
const NUIT = { // bleu marine, pas noir (retour Jeanne 4 nov 2026 : « fond noir trop foncé, pas très lisible »)
  night: true,
  bg: '#141B30', ink: '#F2F0EB', muted: '#8E95AD', line: 'rgba(242,240,235,0.14)', seg: 'rgba(242,240,235,0.14)', accent: '#F08A78', ok: '#9DB894',
  scene: { wall: '#1B2440', floor: '#243052', window: '#2E3B66', sofa: '#4A4048', cushion: '#5C4F55', plant: '#35584A', pot: '#6E4B38', rug: '#2B3758', lamp: '#E6BE72', lampOn: true, frame: '#33405F', shelf: '#3A4668', book1: '#6E4B38', book2: '#35584A', vase: '#4A4048', stool: '#46425A', shadow: 'rgba(0,0,0,0.45)', sun: null, moon: '#F2F0EB' },
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
let mode = 'auto', bedtime = '22:00', night = false, version = 0; // 22 h = décision Jeanne (tableau de bord, 4 nov 2026)
const subs = new Set();
const notify = () => { version++; subs.forEach(f => f()); };
const minutes = hhmm => { const [h, m] = String(hhmm || '22:00').split(':').map(Number); return h * 60 + (m || 0); };
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
compute(); // dès le chargement du module (sinon le premier rendu était toujours « jour »)
setInterval(compute, 60 * 1000);
// lecture hors hook (anciens écrans convertis mécaniquement) : tokens du moment
export const currentTokens = () => (night ? NUIT : JOUR);
// feuille de styles qui suit le mode jour / nuit : `const s = styles(T => StyleSheet.create({...}))`
// (recalculée par palette, mémorisée ; les écrans se re-rendent au prochain montage)
export function styles(build) {
  const cache = new Map();
  return new Proxy({}, { get(_, k) { const T = currentTokens(); let st = cache.get(T); if (!st) { st = build(T); cache.set(T, st); } return st[k]; } });
}
// hook : les écrans repris en DA v3 lisent leurs couleurs ici
export function useTokens() {
  useSyncExternalStore(cb => (subs.add(cb), () => subs.delete(cb)), () => version);
  return night ? NUIT : JOUR;
}
