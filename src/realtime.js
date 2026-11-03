// ═══════════════════════════════════════════════════════════════════
// Realtime Supabase : les deux téléphones se voient. Abonné aux tables
// du foyer (publication déjà en place, migration 0001) ; à chaque
// changement distant on rapatrie la table et l'UI se re-rend (occStore).
// ═══════════════════════════════════════════════════════════════════
import { supabase } from './supabase';
import { pull } from './store';
import { occStore } from './demo-core';
import { loadPartner } from './identity';
import { mochiStore } from './mochi-state';

let channel = null;
let currentHid = null;

export function startRealtime(householdId) {
  if (!householdId || householdId === currentHid) return;
  if (channel) { supabase.removeChannel(channel); channel = null; }
  // le client garde les canaux par sujet : s'il en reste un déjà abonné à ce foyer
  // (rechargement, déconnexion/reconnexion), le réutiliser plante avec
  // « cannot add postgres_changes callbacks after subscribe() » — vu au simulateur le 5 sept 2026
  supabase.getChannels().filter(c => c.topic === `realtime:foyer:${householdId}`).forEach(c => supabase.removeChannel(c));
  currentHid = householdId;
  const refresh = table => async () => {
    try { await pull(table, householdId); occStore.bump(); } catch (e) { /* re-pull au prochain événement */ }
  };
  channel = supabase.channel(`foyer:${householdId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'occurrences', filter: `household_id=eq.${householdId}` }, refresh('occurrences'))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `household_id=eq.${householdId}` }, refresh('tasks'))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'swap_requests', filter: `household_id=eq.${householdId}` }, refresh('swap_requests'))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'malus', filter: `household_id=eq.${householdId}` }, refresh('malus'))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses', filter: `household_id=eq.${householdId}` }, refresh('expenses'))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'activity', filter: `household_id=eq.${householdId}` }, refresh('activity'))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notes', filter: `household_id=eq.${householdId}` }, refresh('notes'))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'events', filter: `household_id=eq.${householdId}` }, refresh('events'))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'setup_drafts', filter: `household_id=eq.${householdId}` }, refresh('setup_drafts'))
    // Mochi qu'on élève (migration 0013) : l'état et le journal bougent sur les deux téléphones
    .on('postgres_changes', { event: '*', schema: 'public', table: 'mochi_state', filter: `household_id=eq.${householdId}` }, async () => { try { await pull('mochi_state', householdId); mochiStore.bump(); } catch (e) { /* re-pull au prochain */ } })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'mochi_events', filter: `household_id=eq.${householdId}` }, async () => { try { await pull('mochi_events', householdId); await pull('mochi_inventory', householdId); mochiStore.bump(); } catch (e) { /* idem */ } })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'household_members', filter: `household_id=eq.${householdId}` }, () => { occStore.bump(); loadPartner(householdId); })
    .subscribe();
}
