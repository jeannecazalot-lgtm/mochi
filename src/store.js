// ═══════════════════════════════════════════════════════════════════
// Cache local offline-first (squelette).
//  · read(table)        → dernière copie locale (AsyncStorage)
//  · mutate(table, row) → écrit en local, empile dans la file, pousse
//                          si réseau ; rejoué au retour réseau (upsert
//                          idempotent : id généré côté client)
//  · pull(table, hid)   → lignes updated_at > dernier sync du foyer
// Le détail (conflits, realtime) se précise écran par écran.
// ═══════════════════════════════════════════════════════════════════
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Crypto from 'expo-crypto';
import { supabase, SUPABASE_READY } from './supabase';

const K = { table: t => `mochi:t:${t}`, queue: 'mochi:queue', sync: t => `mochi:sync:${t}` };
export const uuid = () => Crypto.randomUUID();

export async function read(table) {
  const raw = await AsyncStorage.getItem(K.table(table));
  return raw ? JSON.parse(raw) : [];
}

async function writeLocal(table, row) {
  const rows = await read(table);
  const i = rows.findIndex(r => r.id === row.id);
  if (i >= 0) rows[i] = { ...rows[i], ...row }; else rows.push(row);
  await AsyncStorage.setItem(K.table(table), JSON.stringify(rows));
  return rows;
}

export async function mutate(table, row) {
  const rows = await writeLocal(table, row);
  const q = JSON.parse((await AsyncStorage.getItem(K.queue)) || '[]');
  q.push({ table, row, at: Date.now() });
  await AsyncStorage.setItem(K.queue, JSON.stringify(q));
  flush();
  return rows;
}

let flushing = false;
export async function flush() {
  if (flushing || !SUPABASE_READY) return;
  const net = await NetInfo.fetch();
  if (!net.isConnected) return;
  flushing = true;
  try {
    let q = JSON.parse((await AsyncStorage.getItem(K.queue)) || '[]');
    while (q.length) {
      const { table, row } = q[0];
      const { error } = await supabase.from(table).upsert(row);
      if (error) break;
      q.shift();
      await AsyncStorage.setItem(K.queue, JSON.stringify(q));
    }
  } finally { flushing = false; }
}

export async function pull(table, householdId) {
  if (!SUPABASE_READY) return read(table);
  const since = (await AsyncStorage.getItem(K.sync(table))) || '1970-01-01';
  const { data, error } = await supabase.from(table).select('*').eq('household_id', householdId).gt('updated_at', since);
  if (error || !data) return read(table);
  let rows = await read(table);
  for (const r of data) { const i = rows.findIndex(x => x.id === r.id); if (i >= 0) rows[i] = r; else rows.push(r); }
  await AsyncStorage.setItem(K.table(table), JSON.stringify(rows));
  await AsyncStorage.setItem(K.sync(table), new Date().toISOString());
  return rows;
}

NetInfo.addEventListener(s => { if (s.isConnected) flush(); });
