#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════
// Bot temps réel — « les deux téléphones se voient » : Bob s'abonne au
// canal du foyer (comme src/realtime.js), Alice coche une mission, Bob
// doit recevoir l'événement en quelques secondes. Comptes jetables.
//   node scripts/bot-realtime.js
// ═══════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const env = Object.fromEntries(fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8')
  .split('\n').filter(l => l.includes('=') && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; }));
const URL = env.EXPO_PUBLIC_SUPABASE_URL, KEY = env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const uuid = () => crypto.randomUUID();
const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })();

async function anonClient() {
  const c = createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await c.auth.signInAnonymously();
  if (error) throw error;
  return { c, uid: data.user.id };
}
const ok = (cond, label, detail = '') => { console.log(`${cond ? '✓' : '✗'} ${label}${cond || !detail ? '' : ` — ${detail}`}`); return cond; };

(async () => {
  console.log('── bot temps réel · ' + new Date().toLocaleString('fr-FR') + ' ──');
  const A = await anonClient(), B = await anonClient();
  const HA = uuid(), code = 'RT' + uuid().slice(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, 'X');
  let r = await A.c.from('households').insert({ id: HA, created_by: A.uid });
  ok(!r.error, 'foyer créé', r.error?.message);
  r = await A.c.from('household_members').insert({ household_id: HA, user_id: A.uid, slot: 1 });
  ok(!r.error, 'Alice membre', r.error?.message);
  await A.c.from('invitations').insert({ id: uuid(), household_id: HA, code, created_by: A.uid });
  const j = await B.c.rpc('accept_invitation', { p_code: code });
  ok(j.data === HA, 'Bob a rejoint', j.error?.message);
  const taskId = uuid(), occId = uuid();
  await A.c.from('tasks').insert({ id: taskId, household_id: HA, title: 'Poubelles', emoji: '•', created_by: A.uid });
  r = await A.c.from('occurrences').insert({ id: occId, household_id: HA, task_id: taskId, due_date: today, assignee_id: A.uid });
  ok(!r.error, 'occurrence du jour créée', r.error?.message);

  // Bob s'abonne exactement comme l'app (src/realtime.js)
  // variantes de diagnostic : --self (Alice s'abonne à ses propres changements),
  // --nofilter (sans filtre household_id)
  const SELF = process.argv.includes('--self'), NOFILTER = process.argv.includes('--nofilter');
  const sub = SELF ? A : B;
  const spec = { event: '*', schema: 'public', table: 'occurrences', ...(NOFILTER ? {} : { filter: `household_id=eq.${HA}` }) };
  console.log(`  (abonné : ${SELF ? 'Alice elle-même' : 'Bob'} · filtre : ${NOFILTER ? 'aucun' : 'household_id'})`);
  let resolveEvent; const got = new Promise(res => { resolveEvent = res; });
  const t0 = Date.now();
  const status = await new Promise(res => {
    sub.c.channel(`foyer:${HA}`)
      .on('postgres_changes', spec, payload => { if (payload.eventType === 'UPDATE' && payload.new?.id === occId) resolveEvent(payload); else console.log(`  · autre événement ignoré : ${payload.eventType}`); })
      .subscribe(s => { if (s === 'SUBSCRIBED' || s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') res(s); });
    setTimeout(() => res('TIMEOUT_LOCAL'), 15000);
  });
  ok(status === 'SUBSCRIBED', `Bob abonné au canal du foyer (${status}, ${Date.now() - t0} ms)`);

  // Alice coche → Bob doit voir passer l'UPDATE
  const t1 = Date.now();
  r = await A.c.from('occurrences').update({ status: 'done', done_at: new Date().toISOString(), done_by: A.uid, duration_min: 5 }).eq('id', occId);
  ok(!r.error, 'Alice coche la mission', r.error?.message);
  const ev = await Promise.race([got, new Promise(res => setTimeout(() => res(null), 10000))]);
  const passed = ev && ev.eventType === 'UPDATE' && ev.new?.id === occId && ev.new?.status === 'done';
  ok(passed, `Bob reçoit l'événement temps réel${ev ? ` (${ev.eventType}, ${Date.now() - t1} ms)` : ' — rien en 10 s'}`);

  await B.c.removeAllChannels(); await A.c.removeAllChannels();
  console.log(passed && status === 'SUBSCRIBED' ? '\n✓✓ temps réel OK' : '\n✗ temps réel KO');
  process.exit(passed ? 0 : 1);
})().catch(e => { console.error('bot planté :', e?.message || e); process.exit(3); });
