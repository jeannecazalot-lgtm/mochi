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
import { pushToPartner } from './push';

export async function requestSwap(occId) {
  const from = getUid();
  const to = getPartnerUid();
  if (!from || !to) return { ok: false, reason: 'binome_simule' };
  const occs = await read('occurrences');
  const o = occs.find(x => x.id === occId);
  if (!o) return { ok: false, reason: 'introuvable' };
  if (o.status === 'done') return { ok: false, reason: 'deja_fait' }; // test du 6 sept 2026 : repassage envoyé sur une mission cochée
  const swaps = await read('swap_requests');
  if (swaps.some(s => s.occurrence_id === occId && s.status === 'pending')) return { ok: true, already: true };
  await mutate('swap_requests', {
    id: uuid(), household_id: o.household_id, occurrence_id: occId,
    from_user: from, to_user: to, status: 'pending',
  });
  const tasks = await read('tasks');
  pushToPartner('swapRequested', { task: (tasks.find(x => x.id === o.task_id)?.title || '…').toLowerCase() });
  occStore.bump();
  return { ok: true };
}

export async function resolveSwap(swapId, accept) {
  const swaps = await read('swap_requests');
  const sw = swaps.find(s => s.id === swapId);
  if (!sw) return false;
  const occs = await read('occurrences');
  const o = occs.find(x => x.id === sw.occurrence_id);
  // occurrence déjà faite entre-temps : la proposition tombe, le porteur ne bouge pas
  if (accept && o && o.status === 'done') accept = false;
  await mutate('swap_requests', { ...sw, status: accept ? 'accepted' : 'refused', resolved_at: new Date().toISOString() });
  if (accept) {
    const tasks = await read('tasks');
    pushToPartner('swapAccepted', { task: (tasks.find(x => x.id === o?.task_id)?.title || '…').toLowerCase() });
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
  const occs = await read('occurrences');
  const done = new Set(occs.filter(o => o.status === 'done').map(o => o.id));
  return {
    // une proposition sur une mission déjà faite n'a plus de sens : on ne l'affiche pas
    pending: swaps.filter(s => s.status === 'pending' && s.to_user === uid && !done.has(s.occurrence_id)),
    resolved: swaps.filter(s => s.status !== 'pending' && (s.to_user === uid || s.from_user === uid)),
  };
}
