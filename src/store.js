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

// vide la copie locale d'une table (le serveur, lui, dédoublonne par ses contraintes)
export async function resetLocal(table) { await AsyncStorage.setItem(K.table(table), '[]'); }
// oublie aussi la date de dernière synchro : la prochaine pull() reprend TOUT
// (changement de foyer / de compte — 5 sept 2026 : le rejoignant repartait d'un
// filigrane périmé et ratait les lignes plus anciennes)
export async function resetTable(table) { await resetLocal(table); await AsyncStorage.removeItem(K.sync(table)); }
export const SYNCED_TABLES = ['occurrences', 'tasks', 'task_pains', 'malus', 'swap_requests', 'household_members', 'households'];
// nouveau compte / nouveau foyer : cache, filigranes ET file de mutations
export async function resetAll() {
  await Promise.all(SYNCED_TABLES.map(resetTable));
  await AsyncStorage.setItem(K.queue, '[]');
}

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

// Clés primaires composites (les autres tables ont un `id`)
const PK = { household_members: ['household_id', 'user_id'], task_pains: ['task_id', 'user_id'] };

// Poussée idempotente SANS upsert : `ON CONFLICT` exige un droit de lecture
// que la RLS ne donne pas encore au moment de créer son foyer (constaté le
// 1er sept 2026 : 403 sur households). Insert d'abord ; en cas de doublon
// (rejouage de la file), update ciblé sur la clé primaire.
async function push(table, row) {
  const { error } = await supabase.from(table).insert(row);
  if (!error) return null;
  const dup = error.code === '23505' || /duplicate|already exists/i.test(error.message || '');
  if (!dup) return error;
  let q = supabase.from(table).update(row);
  for (const k of PK[table] || ['id']) q = q.eq(k, row[k]);
  const { error: e2 } = await q;
  return e2 || null;
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
      const error = await push(table, row);
      if (error) {
        // refus définitif (contrainte 23xxx, donnée 22xxx, RLS 42501) : on jette cette
        // mutation pour ne pas bloquer les suivantes — un réseau absent, lui, fait attendre
        const definitive = /^(22|23|42)/.test(String(error.code || ''));
        console.warn(`[store] push ${table} ${definitive ? 'rejeté' : 'bloqué'} :`, error.message || error.code);
        if (!definitive) break;
      }
      q.shift();
      await AsyncStorage.setItem(K.queue, JSON.stringify(q));
    }
  } finally { flushing = false; }
}

export async function pull(table, householdId) {
  if (!SUPABASE_READY) return read(table);
  const since = (await AsyncStorage.getItem(K.sync(table))) || '1970-01-01';
  // task_pains n'a pas de household_id (clé task+user) : la RLS suffit à filtrer —
  // avec le filtre, la requête échouait en silence et les pénibilités ne descendaient
  // jamais ; et sans clé composite, toutes ses lignes s'écrasaient dans rows[0]
  let q = supabase.from(table).select('*').gt('updated_at', since);
  if (table !== 'task_pains') q = q.eq('household_id', householdId);
  const { data, error } = await q;
  if (error || !data) return read(table);
  const keys = PK[table] || ['id'];
  const same = (a, b) => keys.every(k => a[k] === b[k]);
  let rows = await read(table);
  for (const r of data) { const i = rows.findIndex(x => same(x, r)); if (i >= 0) rows[i] = r; else rows.push(r); }
  await AsyncStorage.setItem(K.table(table), JSON.stringify(rows));
  await AsyncStorage.setItem(K.sync(table), new Date().toISOString());
  return rows;
}

// vide la file jusqu'au bout (flush() rend la main si un autre tourne déjà)
export async function drain(tries = 10) {
  for (let i = 0; i < tries; i++) {
    await flush();
    const q = await AsyncStorage.getItem(K.queue);
    if (!q || q === '[]') return true;
    await new Promise(r => setTimeout(r, 600));
  }
  return false;
}

NetInfo.addEventListener(s => { if (s.isConnected) flush(); });
