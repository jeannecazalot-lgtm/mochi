// ═══════════════════════════════════════════════════════════════════
// draft-sync.js — le choix des tâches À DEUX (décision Jeanne 15 sept 2026). La liste en cours de
// sélection (écran 10) vit dans `setup_drafts` (une ligne par foyer, migration 0012) : chaque coche
// part tout de suite, l'autre téléphone la reçoit par le temps réel. `by` = qui a coché quoi.
// status 'done' = l'un des deux a validé le 12 : l'autre quitte le 10, son Accueil se remplit.
// ═══════════════════════════════════════════════════════════════════
import { read, mutate, pull } from './store';
import { loadSetup, setup } from './setup-state';
import { getUid } from './identity';

let timer = null;
export async function loadDraft() {
  await loadSetup();
  const hid = setup.householdId;
  if (!hid) return null;
  try { await pull('setup_drafts', hid); } catch (e) { /* hors ligne : cache */ }
  return (await read('setup_drafts')).find(d => d.household_id === hid) || null;
}
// écriture groupée (400 ms) : une rafale de coches = une seule ligne envoyée
export function pushDraft(tasks, status = 'open') {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    await loadSetup();
    const hid = setup.householdId; const uid = getUid();
    if (!hid || !uid) return;
    await mutate('setup_drafts', { household_id: hid, tasks, status, updated_by: uid, updated_at: new Date().toISOString() });
  }, status === 'done' ? 0 : 400);
}
export const draftIsMine = d => !!d && d.updated_by === getUid();
