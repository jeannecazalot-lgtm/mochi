// ═══════════════════════════════════════════════════════════════════
// Repassage RÉEL (SPECS §6, table swap_requests) — fonctionne dès qu'un
// vrai binôme a rejoint le foyer (sinon les boutons restent en démo).
//  · requestSwap : je propose de repasser MON occurrence à l'autre
//  · resolveSwap : l'autre accepte (l'occurrence change de porteur) ou refuse
// Le compteur « 3 refus/semaine → refaites le setup » se lira dans ces lignes.
// ═══════════════════════════════════════════════════════════════════
import { read, mutate, uuid } from './store';
import { supabase } from './supabase';
import { occStore } from './demo-core';
import { getUid, getPartnerUid } from './identity';

export async function requestSwap(occId) {
  const from = getUid();
  const to = getPartnerUid();
  if (!from || !to) return { ok: false, reason: 'binome_simule' };
  const occs = await read('occurrences');
  const o = occs.find(x => x.id === occId);
  if (!o) return { ok: false, reason: 'introuvable' };
  const swaps = await read('swap_requests');
  if (swaps.some(s => s.occurrence_id === occId && s.status === 'pending')) return { ok: true, already: true };
  await mutate('swap_requests', {
    id: uuid(), household_id: o.household_id, occurrence_id: occId,
    from_user: from, to_user: to, status: 'pending',
  });
  occStore.bump();
  return { ok: true };
}

export async function resolveSwap(swapId, accept) {
  const swaps = await read('swap_requests');
  const sw = swaps.find(s => s.id === swapId);
  if (!sw) return false;
  await mutate('swap_requests', { ...sw, status: accept ? 'accepted' : 'refused', resolved_at: new Date().toISOString() });
  if (accept) {
    const occs = await read('occurrences');
    const o = occs.find(x => x.id === sw.occurrence_id);
    if (o) await mutate('occurrences', { ...o, assignee_id: sw.to_user });
    // pas encore en cache (temps réel en retard) : changement de porteur direct au serveur
    else { try { await supabase.from('occurrences').update({ assignee_id: sw.to_user }).eq('id', sw.occurrence_id); } catch (e) { /* rejoué au prochain pull */ } }
  }
  occStore.bump();
  return true;
}

// propositions me concernant (à traiter) + acceptées récentes, pour le fil
export async function mySwaps() {
  const uid = getUid();
  if (!uid) return { pending: [], resolved: [] };
  const swaps = await read('swap_requests');
  return {
    pending: swaps.filter(s => s.status === 'pending' && s.to_user === uid),
    resolved: swaps.filter(s => s.status !== 'pending' && (s.to_user === uid || s.from_user === uid)),
  };
}
