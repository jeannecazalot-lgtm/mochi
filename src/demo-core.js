// ═══════════════════════════════════════════════════════════════════
// demo-core.js — dérivés de démo pour les onglets (Accueil, Planning, Budget).
// Ne contient que des calculs sur src/demo.js + des helpers de date.
// Disparaît avec demo.js au profit de Supabase.
// ═══════════════════════════════════════════════════════════════════
import { me, partner, byId, members, occurrences, taskById, balance, activity, today } from './demo';

// ─── dates ──────────────────────────────────────────────────────────
const strip = s => s.replace(/\./g, '').trim();
export const weekdayShort = d => strip(new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(d)).toUpperCase(); // MAR
export const monthShort = d => strip(new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(d)).toUpperCase();     // JUIL
export const monthLong = d => { const m = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(d); return m[0].toUpperCase() + m.slice(1); }; // Juillet
export const fmtHeaderDate = (d = today) => `${weekdayShort(d)} ${d.getDate()} ${monthShort(d)}`; // MAR 7 JUIL
export const fmtDayLabel = d => `${weekdayShort(d)} ${d.getDate()}`; // MER 8
export const fmtDayLower = d => `${weekdayShort(d).toLowerCase()} ${d.getDate()}`; // ven 4
export const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const daysBetween = (a, b) => Math.round((new Date(b.getFullYear(), b.getMonth(), b.getDate()) - new Date(a.getFullYear(), a.getMonth(), a.getDate())) / 86400000);

// lundi → dimanche contenant `today`
export const weekDays = (d = today) => { const dow = (d.getDay() + 6) % 7; const mon = addDays(d, -dow); return Array.from({ length: 7 }, (_, i) => addDays(mon, i)); };

// ─── Accueil ────────────────────────────────────────────────────────
// Mochi penche vers le plus chargé : 1° par point d'écart de balance, plafonné ±12° (lean −1…1).
// Négatif = penche vers le binôme (à gauche, comme l'artboard), positif = vers moi.
export const LEAN_FULL_AT = 12;
export const mochiLean = (b = balance) => Math.max(-1, Math.min(1, (b.me - b.partner) / LEAN_FULL_AT));
export const moreLoaded = (b = balance) => (b.partner > b.me ? partner : me);

export const sumMinutes = occs => occs.reduce((t, o) => t + ((taskById(o.task_id) || {}).duration_min || 0), 0);
export const hasUnreadPing = () => activity.some(a => a.type === 'ping' && a.target_id === me.id && !a.read_at);

// Coche des missions partagée entre l'Accueil et la sheet Mission (démo : la
// vraie coche passera par occurrences.status côté Supabase).
import { useSyncExternalStore } from 'react';
const doneIds = new Set(occurrences.filter(o => o.status === 'done').map(o => o.id));
const doneSubs = new Set();
let doneVersion = 0;
const notifyDone = () => { doneVersion++; doneSubs.forEach(f => f()); };
export const missionDone = {
  has: id => doneIds.has(id),
  toggle(id) { doneIds.has(id) ? doneIds.delete(id) : doneIds.add(id); notifyDone(); },
  set(id, v) { v ? doneIds.add(id) : doneIds.delete(id); notifyDone(); },
  useVersion: () => useSyncExternalStore(cb => (doneSubs.add(cb), () => doneSubs.delete(cb)), () => doneVersion),
};

// ─── Planning ───────────────────────────────────────────────────────
export const MENTAL_COEF = 1.5; // coefficient charge mentale (SPECS §3) — à lire depuis la base plus tard
export const fmtCoef = n => String(n).replace('.', ',');
export const occurrencesOn = d => occurrences.filter(o => sameDay(o.due_date, d));
// couleurs d'avatars présentes un jour donné (non assigné = les deux)
export const dayDots = d => {
  const set = new Set();
  occurrencesOn(d).forEach(o => { if (o.assignee_id) set.add(byId(o.assignee_id).color); else members.forEach(m => set.add(m.color)); });
  return [...set];
};
// groupes jour → occurrences restantes (pending), d'aujourd'hui à la fin de la semaine (l'artboard ne montre pas les faites)
export const planningGroups = () => weekDays().filter(d => daysBetween(today, d) >= 0).map(d => ({ date: d, items: occurrencesOn(d).filter(o => o.status === 'pending') })).filter(g => g.items.length);

// ─── Budget ─────────────────────────────────────────────────────────
export const expenseCategories = ['courses', 'sorties', 'maison', 'enfants', 'sante', 'autre'];
export const sortedByDate = list => [...list].sort((a, b) => b.spent_on - a.spent_on);
