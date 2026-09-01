// ═══════════════════════════════════════════════════════════════════
// Realtime Supabase : les deux téléphones se voient. Abonné aux tables
// du foyer (publication déjà en place, migration 0001) ; à chaque
// changement distant on rapatrie la table et l'UI se re-rend (occStore).
// ═══════════════════════════════════════════════════════════════════
import { supabase } from './supabase';
import { pull } from './store';
import { occStore } from './demo-core';

let channel = null;
let currentHid = null;

export function startRealtime(householdId) {
  if (!householdId || householdId === currentHid) return;
  if (channel) { supabase.removeChannel(channel); channel = null; }
  currentHid = householdId;
  const refresh = table => async () => {
    try { await pull(table, householdId); occStore.bump(); } catch (e) { /* re-pull au prochain événement */ }
  };
  channel = supabase.channel(`foyer:${householdId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'occurrences', filter: `household_id=eq.${householdId}` }, refresh('occurrences'))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `household_id=eq.${householdId}` }, refresh('tasks'))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'household_members', filter: `household_id=eq.${householdId}` }, () => occStore.bump())
    .subscribe();
}
