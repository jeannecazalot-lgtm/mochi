// ═══════════════════════════════════════════════════════════════════
// Fil Activité RÉEL (table `activity`, 7 sept 2026) — zéro texte libre :
//  · ping_reply  : réaction rapide sous « X a terminé … » (preset_key = thumbs | thanks | best)
//  · ping        : information préformatée (preset_key = tookOver | ruleChanged | taskCreated,
//                  le texte vit dans copy.activity.presets, les variables dans payload)
// Décision Jeanne 7 sept 2026 : toute modif de tâche par l'un apparaît chez l'autre ;
// la notification push viendra avec la passe notifications.
// ═══════════════════════════════════════════════════════════════════
import { read, mutate, uuid } from './store';
import { occStore } from './demo-core';
import { getUid, getPartnerUid } from './identity';
import { loadSetup, setup } from './setup-state';
import { pushToPartner } from './push';
import copy from './data/copy.json';

export async function logActivity({ type, preset_key, occurrence_id = null, payload = {} }) {
  await loadSetup();
  const hid = setup.householdId;
  const uid = getUid();
  if (!hid || !uid) return false; // démo : rien à écrire
  await mutate('activity', {
    id: uuid(), household_id: hid, type, actor_id: uid, target_id: getPartnerUid() || null,
    occurrence_id, preset_key, payload, created_at: new Date().toISOString(),
  });
  occStore.bump();
  return true;
}

// réaction rapide sous une mission terminée par l'autre
export const react = (occId, key) => {
  pushToPartner('reaction', { reply: String(copy.activity.replies[key] || key).replace('{name}', '').trim() });
  return logActivity({ type: 'ping_reply', preset_key: key, occurrence_id: occId });
};

// Ping réel vers l'autre (10 sept 2026, tâche de l'autre en retard : « je devrais pouvoir le ping ») :
// une ligne `activity` type ping (preset = clé copy.pings) + une notification push.
export async function sendPing(occId, key = 'reminder') {
  const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]);
  const o = occs.find(x => x.id === occId);
  const task = (tasks.find(x => x.id === o?.task_id)?.title || '…');
  pushToPartner(key, { task: task.toLowerCase() }, '/(tabs)/planning');
  return logActivity({ type: 'ping', preset_key: key, occurrence_id: occId || null, payload: { task: task.toLowerCase() } });
}
