// ═══════════════════════════════════════════════════════════════════
// DONNÉES DE DÉMO — volet social (Activité 22, Ping 18, À faire 20/21).
// Complète src/demo.js sans le modifier. Disparaîtra avec Supabase (table activity).
// ═══════════════════════════════════════════════════════════════════
import { activity, today, me, partner } from './demo';

const d = (offset) => { const x = new Date(today); x.setDate(x.getDate() + offset); return x; };

// heures d'affichage des événements existants (demo.activity n'a que le jour)
const times = { a1: '18:40', a2: '20:55', a3: '21:30', a4: '19:02' };

// événements supplémentaires pour couvrir tous les états de l'artboard 22
const extra = [
  { id: 'a5', type: 'task_done', actor_id: partner.id, task_id: 't-chien-matin', occ_id: 'o4', at: d(0), time: '08:12' },
  { id: 'a6', type: 'swap_proposed', actor_id: partner.id, target_id: me.id, task_id: 't-lessive', occ_id: 'o6', at: d(0), time: '19:02' },
];

// fil complet, du plus récent au plus ancien
export const activityFeed = [...activity.map(a => ({ ...a, time: times[a.id] || '' })), ...extra]
  .sort((a, b) => (b.at - a.at) || String(b.time).localeCompare(String(a.time)));

// réponses préformatées autorisées par type d'événement (clés de copy.activity.replies)
export const replyPresets = {
  task_done: ['thumbs', 'thanks', 'best'],
  ping: ['okTonight', 'alreadyDone'],
};

// ordre des pings de la sheet 18 (clés de copy.pings.options)
export const pingOptions = ['reminder', 'turn', 'deadline', 'takeover'];

// genre du binôme pour « +1 dette pour elle/lui » (plus tard : profil)
export const partnerGender = 'f';
