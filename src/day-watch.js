// ═══════════════════════════════════════════════════════════════════
// day-watch.js — l'app suit le jour RÉEL (retour Jeanne, 8 sept 2026 : l'Accueil
// affichait encore « LUN 7 SEPT » le mardi à 14 h 30, la tâche du jour dans « À venir »).
// Au passage de minuit et à chaque retour au premier plan, si la date a changé,
// on « bumpe » les occurrences : tous les écrans réels se recalculent avec localIso().
// ═══════════════════════════════════════════════════════════════════
import { AppState } from 'react-native';
import { localIso } from './dates';
import { occStore } from './demo-core';

let lastDay = localIso();
let timer = null;

function schedule() {
  clearTimeout(timer);
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5); // 00:00:05
  timer = setTimeout(check, Math.max(1000, next - now));
}
export function check() {
  const today = localIso();
  if (today !== lastDay) { lastDay = today; occStore.bump(); }
  schedule();
}
export function startDayWatch() {
  schedule();
  const sub = AppState.addEventListener('change', s => { if (s === 'active') check(); });
  return () => { clearTimeout(timer); sub.remove(); };
}
