// Pastille de la bulle Suivi (Jeanne, 13 nov 2026 : « quand j'ai des notifs, un petit 1, un petit 2 »).
// Non lu = ce que l'AUTRE a fait ou envoyé depuis ma dernière visite du Suivi :
// ses missions faites, ses messages (table activity), ses propositions de reprise en attente.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { read } from './store';
import { getUid } from './identity';

const KEY = 'mochi.suivi.seenAt';

export async function markSuiviSeen() {
  await AsyncStorage.setItem(KEY, new Date().toISOString()).catch(() => {});
}

export async function unreadSuivi() {
  const uid = getUid();
  if (!uid) return 0;
  const seen = (await AsyncStorage.getItem(KEY).catch(() => null)) || new Date(Date.now() - 2 * 86400e3).toISOString();
  const [occs, acts, swaps] = await Promise.all([read('occurrences'), read('activity'), read('swap_requests').catch(() => [])]);
  // ses missions faites comptent par jour (le Suivi les regroupe en une ligne par jour)
  const doneDays = new Set(occs.filter(o => o.status === 'done' && o.done_by && o.done_by !== uid && String(o.done_at) > seen).map(o => String(o.done_at).slice(0, 10)));
  const msgs = acts.filter(a => a.actor_id !== uid && String(a.created_at) > seen).length;
  const pending = swaps.filter(s => s.status === 'pending' && s.to_user === uid && String(s.created_at) > seen).length;
  return doneDays.size + msgs + pending;
}
