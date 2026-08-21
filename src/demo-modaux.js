// ═══════════════════════════════════════════════════════════════════
// DONNÉES DE DÉMO des modaux (30 événement · 32 pense-bête · 33 mood · 34 notifs).
// Complète src/demo.js sans le modifier. Disparaît au branchement Supabase.
// ═══════════════════════════════════════════════════════════════════
import { me, partner, today, taskById, streak } from './demo';

const d = (offset) => { const x = new Date(today); x.setDate(x.getDate() + offset); return x; };

// 30 · événement social — valeurs initiales des champs locaux
export const demoEvent = {
  emoji: '🎂',
  title: 'Anniv de Sophie',
  date: d(4), time: '20h', place: 'Chez elle',
  budget_cents: 4000,
  dress: 'Casual chic', dress_note: '« pas de jeans »',
  items: [
    { id: 'ev1', label: 'Cadeau (idée + achat)', who: partner.id, minutes: 45 },
    { id: 'ev2', label: 'Trouver babysitter', who: partner.id, minutes: 20 },
    { id: 'ev3', label: 'Réserver Uber retour', who: me.id, minutes: 5 },
    { id: 'ev4', label: 'Carte de la part des deux', who: me.id, minutes: 15 },
  ],
};
export const fmtEventWhen = (ev) => `${new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(ev.date)} · ${ev.time} · ${ev.place}`;

// 32 · pense-bête partagé — `tone` = index dans extraColors.notes
export const demoNotes = [
  { id: 'n1', title: 'Pédiatre Léa', detail: 'Dr Marchand · 01 42 88 12 34 · jeudi 14h', tone: 0, done: false },
  { id: 'n2', title: 'Chaudière', detail: 'Révision avant 15 nov · Garantie ENGIE', tone: 1, done: false },
  { id: 'n3', title: 'Mdp box internet', detail: 'Free · CC91-7K2P-MV04', tone: 2, done: false },
  { id: 'n4', title: 'Anniv Maman J.', detail: '14 mai · idée : foulard', tone: 3, done: false },
  { id: 'n5', title: 'Vétérinaire Pixel', detail: 'Vaccin rappel 22 juin', tone: 4, done: false },
  { id: 'n6', title: 'Code Vélib', detail: 'Borne 16ème · #4407', tone: 0, done: false },
];

// 33 · mood check-in — clés = copy.mood.levels / copy.mood.tags
export const moodLevels = [
  { key: 'light', emoji: '😄' }, { key: 'ok', emoji: '🙂' }, { key: 'meh', emoji: '😐' }, { key: 'heavy', emoji: '😣' }, { key: 'burnt', emoji: '😩' },
];
export const moodTags = ['mental', 'work', 'sleep', 'social', 'money', 'health', 'family'];

// 34 · aperçu lockscreen
export const lockscreen = {
  clock: '9:41', time: '20:30', date: today, network: '5G',
  widget: { gap_min: 18, bars: [10, 14, 16, 18, 12, 20, 16] },
  notifs: [
    { id: 'nt1', kind: 'ping', from: partner, task: taskById('t-vaisselle'), when: 'justNow' },
    { id: 'nt2', kind: 'reminder', task: taskById('t-vaisselle'), when: { minAgo: 5 } },
    { id: 'nt3', kind: 'streak', days: streak.days, record: streak.record, when: 'thisMorning' },
  ],
};
export const fmtLongDate = (date) => new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
