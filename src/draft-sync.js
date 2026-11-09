// ═══════════════════════════════════════════════════════════════════
// draft-sync.js — le choix des tâches À DEUX (décision Jeanne 15 sept 2026). La liste en cours de
// sélection (écran 10) vit dans `setup_drafts` (une ligne par foyer, migration 0012) : chaque coche
// part tout de suite, l'autre téléphone la reçoit par le temps réel. `by` = qui a coché quoi.
// status 'done' = l'un des deux a validé le 12 : l'autre quitte le 10, son Accueil se remplit.
// ═══════════════════════════════════════════════════════════════════
import { read, mutate, pull } from './store';
import { loadSetup, setup } from './setup-state';
import { getUid } from './identity';
import { supabase, SUPABASE_READY } from './supabase';

let timer = null;
// coches en attente d'envoi : on envoie des GESTES (ajouter / retirer), fusionnés avec la liste du serveur
// (9 nov 2026, test à deux simulateurs : deux coches simultanées → la dernière liste envoyée effaçait l'autre)
let ops = [];
const applyOps = (tasks, list) => {
  let out = [...(tasks || [])];
  for (const o of list) {
    if (o.remove) out = out.filter(x => x.id !== o.remove);
    else if (o.add && !out.some(x => x.id === o.add.id)) out.push(o.add);
  }
  return out;
};
// écriture « si personne n'a écrit entre-temps » : on relit, on fusionne, on écrit à condition que la ligne
// n'ait pas bougé ; sinon on recommence (deux coches à la même seconde, test du 9 nov 2026). false = hors ligne.
async function mergeWrite(hid, uid, change) {
  if (!SUPABASE_READY) return false;
  for (let i = 0; i < 5; i++) {
    const { data: rows, error } = await supabase.from('setup_drafts').select('*').eq('household_id', hid);
    if (error || !rows || !rows.length) return false;
    const cur = rows[0];
    const patch = { ...change(cur), status: 'open', updated_by: uid, updated_at: new Date().toISOString() };
    const { data, error: e2 } = await supabase.from('setup_drafts').update(patch).eq('household_id', hid).eq('updated_at', cur.updated_at).select();
    if (e2) return false;
    if (data && data.length) { try { await pull('setup_drafts', hid); } catch (e) { /* cache */ } return { ...cur, ...patch }; }
    await new Promise(r => setTimeout(r, 120 + Math.random() * 200));
  }
  return false;
}
async function serverRow(hid) {
  try { await pull('setup_drafts', hid); } catch (e) { /* hors ligne : cache */ }
  return (await read('setup_drafts')).find(d => d.household_id === hid) || null;
}
export async function loadDraft() {
  await loadSetup();
  const hid = setup.householdId;
  if (!hid) return null;
  return serverRow(hid);
}
// écriture groupée (400 ms) : une rafale de coches = une seule ligne envoyée.
// `op` = { add: rangée } ou { remove: id } ; sans op (ancien appel), la liste envoyée remplace tout
export function pushDraft(tasks, status = 'open', op = null) {
  if (op) ops.push(op);
  clearTimeout(timer);
  timer = setTimeout(async () => {
    await loadSetup();
    const hid = setup.householdId; const uid = getUid();
    if (!hid || !uid) return;
    const pending = ops; ops = [];
    if (status === 'open' && pending.length && await mergeWrite(hid, uid, cur => ({ tasks: applyOps(cur.tasks, pending), ready: [] }))) return;
    const merged = status === 'open' && pending.length ? applyOps((await serverRow(hid))?.tasks || tasks, pending) : tasks;
    await mutate('setup_drafts', { household_id: hid, tasks: merged, status, ...(status === 'open' ? { ready: [] } : {}), updated_by: uid, updated_at: new Date().toISOString() });
  }, status === 'done' ? 0 : 400);
}
// « C'est bon pour moi » (9 nov 2026) : la liste du serveur + mes gestes pas encore partis, et ma validation
export async function markReady(tasks) {
  clearTimeout(timer);
  await loadSetup();
  const hid = setup.householdId; const uid = getUid();
  if (!hid || !uid) return { ready: [], tasks };
  const pending = ops; ops = [];
  const done = await mergeWrite(hid, uid, c => ({ tasks: applyOps(c.tasks, pending), ready: Array.from(new Set([...(pending.length ? [] : (c.ready || [])), uid])) }));
  if (done) return { ready: done.ready, tasks: done.tasks };
  const cur = await serverRow(hid);
  const merged = cur ? applyOps(cur.tasks, pending) : tasks;
  const ready = Array.from(new Set([...(pending.length ? [] : (cur?.ready || [])), uid]));
  await mutate('setup_drafts', { household_id: hid, tasks: merged, status: 'open', ready, updated_by: uid, updated_at: new Date().toISOString() });
  return { ready, tasks: merged };
}
export const draftIsMine = d => !!d && d.updated_by === getUid();
