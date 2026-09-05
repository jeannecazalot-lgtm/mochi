#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════
// Bot « couple » — rejoue contre la base de PROD la vie d'un foyer à deux
// (Alice invite, Bob rejoint, dispatch, missions cochées, décalage,
// repassages accepté/refusé, retard → malus, garde-fous, isolation RLS).
// Uniquement des utilisateurs anonymes jetables : jamais les données de
// Jeanne/Ketley. À lancer avant chaque build :  node scripts/bot-couple.js
// Sort en code 1 si un pas échoue. Les « fragile » ne font pas échouer.
// ═══════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { computeDispatch, placeDays } = require('../src/dispatch.js');

const env = Object.fromEntries(fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8')
  .split('\n').filter(l => l.includes('=') && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; }));
const URL = env.EXPO_PUBLIC_SUPABASE_URL, KEY = env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!URL || !KEY) { console.error('clés Supabase absentes du .env'); process.exit(2); }

const uuid = () => crypto.randomUUID();
const iso = d => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const genCode = () => 'B0T' + Array.from({ length: 3 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');

async function api(tok, method, p, body, prefer = 'return=minimal') {
  const r = await fetch(URL + p, {
    method, headers: { apikey: KEY, Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json', Prefer: prefer },
    body: body ? JSON.stringify(body) : undefined,
  });
  const txt = await r.text();
  let data = null; try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
  return { status: r.status, data };
}
const get = (tok, p) => api(tok, 'GET', p).then(r => r.data);
const post = (tok, table, row) => api(tok, 'POST', `/rest/v1/${table}`, row);
const patch = (tok, table, q, row) => api(tok, 'PATCH', `/rest/v1/${table}?${q}`, row, 'return=representation');
const rpc = (tok, fn, args) => api(tok, 'POST', `/rest/v1/rpc/${fn}`, args);
async function anon(name) {
  const r = await fetch(`${URL}/auth/v1/signup`, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: '{}' });
  const j = await r.json();
  return { name, tok: j.access_token, uid: j.user.id };
}

let failed = 0; const fragile = [];
const ok = (cond, label, detail = '') => { console.log(`${cond ? '✓' : '✗'} ${label}${cond || !detail ? '' : ` — ${typeof detail === 'string' ? detail : JSON.stringify(detail).slice(0, 160)}`}`); if (!cond) failed++; return cond; };
const warn = (label) => { console.log(`△ fragile : ${label}`); fragile.push(label); };

(async () => {
  console.log('── bot couple · ' + new Date().toLocaleString('fr-FR') + ' ──');
  // ── S1 · Alice ouvre l'écran 09 : foyer + invitation ──────────────
  const alice = await anon('Alice');
  const HA = uuid(), code = genCode();
  ok((await post(alice.tok, 'households', { id: HA, created_by: alice.uid })).status === 201, 'S1 Alice crée son foyer');
  const avail = { morning: [0, 0, 0, 2, 0, 1, 0], evening: [1, 1, 0, 0, 1, 0, 2] };
  ok((await post(alice.tok, 'household_members', { household_id: HA, user_id: alice.uid, slot: 1, availability: avail, weekly_minutes: 300 })).status === 201, 'S1 Alice membre slot 1');
  ok((await post(alice.tok, 'invitations', { id: uuid(), household_id: HA, code, created_by: alice.uid })).status === 201, `S1 invitation ${code}`);

  // ── S2 · Bob a lui aussi ouvert le 09 (foyer solo) puis touche le lien ──
  const bob = await anon('Bob');
  const HB = uuid();
  await post(bob.tok, 'households', { id: HB, created_by: bob.uid });
  await post(bob.tok, 'household_members', { household_id: HB, user_id: bob.uid, slot: 1 });
  const j = await rpc(bob.tok, 'accept_invitation', { p_code: code.toLowerCase() });
  ok(j.data === HA, 'S2 Bob rejoint via le code (même en minuscules)', j.data);
  const members = await get(bob.tok, `/rest/v1/household_members?household_id=eq.${HA}&select=user_id,slot&order=slot`);
  ok(Array.isArray(members) && members.length === 2 && members[1].slot === 2, 'S2 foyer à 2, Bob en slot 2', members);
  ok((await get(bob.tok, `/rest/v1/households?id=eq.${HB}`)).length === 0, 'S2 le foyer solo de Bob a disparu');
  const inv = await get(alice.tok, `/rest/v1/invitations?code=eq.${code}&select=accepted_by`);
  ok(inv?.[0]?.accepted_by === bob.uid, 'S2 invitation marquée acceptée par Bob');

  // ── S3 · Alice : « C'est parti » — dispatch réel + tâches + occurrences ──
  const catalog = [
    { id: 'cuisine', label: 'Cuisiner', emoji: '🍳', duration_min: 30, per_week: 7, pain: 2, importance: 4 },
    { id: 'courses', label: 'Faire les courses', emoji: '🛒', duration_min: 60, per_week: 1, pain: 3, importance: 4 },
    { id: 'lessive', label: 'Étendre la lessive', emoji: '🧺', duration_min: 20, per_week: 2, pain: 2, importance: 3 },
    { id: 'poubelles', label: 'Sortir les poubelles', emoji: '🗑️', duration_min: 5, per_week: 3, pain: 3, importance: 5 },
    { id: 'admin', label: 'Papiers & rendez-vous', emoji: '📎', duration_min: 45, per_week: 1, pain: 4, importance: 3, mental_load: true },
  ];
  const disp = computeDispatch({ members: [{ id: alice.uid, weekly_minutes: 300 }, { id: bob.uid, weekly_minutes: 300 }], tasks: catalog });
  ok(disp.items.length === catalog.length, `S3 dispatch : ${disp.items.length} tâches réparties, état ${disp.state}`);
  const realId = {};
  for (const t of catalog) {
    realId[t.id] = uuid();
    const r = await post(alice.tok, 'tasks', { id: realId[t.id], household_id: HA, title: t.label, emoji: t.emoji, catalog_key: t.id, frequency: t.per_week >= 5 ? 'daily' : 'weekly', duration_min: t.duration_min, importance: t.importance, mental_load: !!t.mental_load, created_by: alice.uid });
    if (r.status !== 201) ok(false, `S3 tâche ${t.label}`, r.data);
  }
  ok((await post(alice.tok, 'task_pains', { task_id: realId.admin, user_id: alice.uid, pain: 5 })).status === 201, 'S3 pénibilité perso Alice (déteste les papiers)');
  ok((await post(bob.tok, 'task_pains', { task_id: realId.cuisine, user_id: bob.uid, pain: 1 })).status === 201, 'S3 pénibilité perso Bob (aime cuisiner)');
  const todayDow = (new Date().getDay() + 6) % 7;
  const occs = [];
  for (const it of disp.items) {
    const t = catalog.find(x => x.id === it.task_id);
    const perWeek = Math.max(1, Math.round(it.weekly_min / t.duration_min));
    const offsets = placeDays(perWeek, avail, todayDow);
    offsets.forEach((off, k) => {
      const assignee = it.assignee_id === 'both' ? null : it.assignee_id === 'alt' ? (k % 2 === 0 ? alice.uid : bob.uid) : it.assignee_id;
      occs.push({ id: uuid(), household_id: HA, task_id: realId[t.id], kind: t.mental_load ? 'plan' : 'exec', due_date: addDays(off), assignee_id: assignee });
    });
  }
  const ro = await post(alice.tok, 'occurrences', occs);
  ok(ro.status === 201, `S3 ${occs.length} occurrences de la semaine insérées`, ro.data);
  ok(occs.some(o => o.assignee_id === bob.uid), 'S3 le dispatch attribue bien des tâches à Bob (uid réel)');

  // ── S4 · Bob rapatrie et voit tout (RLS membre) ─────────────────────
  const bobOccs = await get(bob.tok, `/rest/v1/occurrences?household_id=eq.${HA}&select=id,task_id,due_date,assignee_id,status`);
  ok(bobOccs.length === occs.length, `S4 Bob voit les ${occs.length} occurrences`, bobOccs?.length);
  const bobPains = await get(bob.tok, `/rest/v1/task_pains?select=task_id,user_id,pain`);
  ok(Array.isArray(bobPains) && bobPains.length === 2, 'S4 Bob voit les pénibilités des deux (sans filtre household_id)', bobPains);

  // ── S5 · Bob coche une de SES missions ──────────────────────────────
  const mineBob = bobOccs.filter(o => o.assignee_id === bob.uid);
  ok(mineBob.length > 0, 'S5 Bob a des missions à lui');
  const done = mineBob[0];
  const rd = await patch(bob.tok, 'occurrences', `id=eq.${done.id}`, { status: 'done', done_at: new Date().toISOString(), done_by: bob.uid, duration_min: 25, pain: 1, mental_load: false });
  ok(rd.status === 200 && rd.data?.[0]?.status === 'done', 'S5 mission cochée avec copie figée (25 min, pain 1)', rd.data);
  const seenByAlice = await get(alice.tok, `/rest/v1/occurrences?id=eq.${done.id}&select=status,done_by,duration_min`);
  ok(seenByAlice?.[0]?.status === 'done' && seenByAlice[0].done_by === bob.uid, 'S5 Alice voit la mission de Bob faite');

  // ── S6 · Alice décale une mission ; doublon jour refusé par la base ──
  const mineAlice = bobOccs.filter(o => o.assignee_id === alice.uid);
  const mv = mineAlice[0];
  const rm = await patch(alice.tok, 'occurrences', `id=eq.${mv.id}`, { due_date: addDays(10) });
  ok(rm.status === 200 && rm.data?.[0]?.due_date === addDays(10), 'S6 décalage à J+10', rm.data);
  const sameTask = bobOccs.find(o => o.task_id === mv.task_id && o.id !== mv.id);
  if (sameTask) {
    const dup = await patch(alice.tok, 'occurrences', `id=eq.${sameTask.id}`, { due_date: addDays(10) });
    ok(dup.status === 409, 'S6 la base refuse deux occurrences de la même tâche le même jour (409)', dup.status);
  }

  // ── S7 · Repassage accepté : Alice → Bob ───────────────────────────
  const sw1 = uuid();
  ok((await post(alice.tok, 'swap_requests', { id: sw1, household_id: HA, occurrence_id: mv.id, from_user: alice.uid, to_user: bob.uid, status: 'pending' })).status === 201, 'S7 Alice propose un repassage à Bob');
  const pend = await get(bob.tok, `/rest/v1/swap_requests?to_user=eq.${bob.uid}&status=eq.pending&select=id`);
  ok(pend.length === 1 && pend[0].id === sw1, 'S7 Bob voit 1 proposition en attente');
  await patch(bob.tok, 'swap_requests', `id=eq.${sw1}`, { status: 'accepted', resolved_at: new Date().toISOString() });
  const ra = await patch(bob.tok, 'occurrences', `id=eq.${mv.id}`, { assignee_id: bob.uid });
  ok(ra.data?.[0]?.assignee_id === bob.uid, 'S7 accepté → la mission change de porteur');

  // ── S8 · Repassage refusé : Bob → Alice ────────────────────────────
  const bo = mineBob[1] || mineBob[0];
  const sw2 = uuid();
  await post(bob.tok, 'swap_requests', { id: sw2, household_id: HA, occurrence_id: bo.id, from_user: bob.uid, to_user: alice.uid, status: 'pending' });
  await patch(alice.tok, 'swap_requests', `id=eq.${sw2}`, { status: 'refused', resolved_at: new Date().toISOString() });
  const still = await get(alice.tok, `/rest/v1/occurrences?id=eq.${bo.id}&select=assignee_id`);
  ok(still?.[0]?.assignee_id === bob.uid, 'S8 refusé → Bob garde sa mission');

  // ── S9 · Retard → missed + malus (règle SPECS §4) ──────────────────
  const late = { id: uuid(), household_id: HA, task_id: realId.poubelles, kind: 'exec', due_date: addDays(-2), assignee_id: bob.uid };
  ok((await post(alice.tok, 'occurrences', late)).status === 201, 'S9 une occurrence échue depuis 2 jours (poubelles, Bob)');
  await patch(alice.tok, 'occurrences', `id=eq.${late.id}`, { status: 'missed' });
  const pts = Math.round(5 * (1 + 2 * 0.5) * 100) / 100; // importance 5, 2 j de retard
  const monday = (() => { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return iso(d); })();
  ok((await post(alice.tok, 'malus', { id: uuid(), household_id: HA, user_id: bob.uid, occurrence_id: late.id, points: pts, week_start: monday })).status === 201, `S9 malus ${pts} pts pour Bob, semaine du ${monday}`);
  const mal = await get(bob.tok, `/rest/v1/malus?household_id=eq.${HA}&select=points,user_id`);
  ok(mal.length === 1 && Number(mal[0].points) === pts, 'S9 Bob voit son malus');
  const dupMal = await post(bob.tok, 'malus', { id: uuid(), household_id: HA, user_id: bob.uid, occurrence_id: late.id, points: pts, week_start: monday });
  if (dupMal.status === 201) warn('deux téléphones peuvent écrire deux malus pour la même occurrence (pas d\'unicité sur occurrence_id)');
  else ok(true, 'S9 doublon de malus refusé par la base');

  // ── S10 · Garde-fous ────────────────────────────────────────────────
  const carol = await anon('Carol');
  const j2 = await rpc(carol.tok, 'accept_invitation', { p_code: code });
  ok(/invitation_invalid/.test(JSON.stringify(j2.data)), 'S10 un code déjà utilisé est refusé');
  ok(/invitation_invalid/.test(JSON.stringify((await rpc(carol.tok, 'accept_invitation', { p_code: 'ZZZZZZ' })).data)), 'S10 code bidon refusé');
  const code2 = genCode();
  await post(alice.tok, 'invitations', { id: uuid(), household_id: HA, code: code2, created_by: alice.uid });
  const j3 = await rpc(carol.tok, 'accept_invitation', { p_code: code2 });
  ok(j3.data === HA, 'S10 3e membre (Carol) via une nouvelle invitation — foyer 2→10');
  const m3 = await get(carol.tok, `/rest/v1/household_members?household_id=eq.${HA}&select=slot&order=slot`);
  ok(m3.length === 3 && m3[2].slot === 3, 'S10 Carol en slot 3');
  const j4 = await rpc(bob.tok, 'accept_invitation', { p_code: code2 });
  ok(/invitation_invalid|already/.test(JSON.stringify(j4.data)), 'S10 Bob (déjà dans un foyer à 3) ne peut pas rejoindre ailleurs');

  // ── S11 · Isolation : un inconnu ne voit ni ne touche rien ─────────
  const dave = await anon('Dave');
  ok((await get(dave.tok, `/rest/v1/occurrences?household_id=eq.${HA}`)).length === 0, 'S11 un inconnu ne voit aucune occurrence');
  ok((await get(dave.tok, `/rest/v1/household_members?household_id=eq.${HA}`)).length === 0, 'S11 …ni les membres');
  const hack = await patch(dave.tok, 'occurrences', `id=eq.${done.id}`, { status: 'pending' });
  ok(hack.status !== 200 || (hack.data || []).length === 0, 'S11 …et ne peut rien modifier');
  const hackMal = await post(dave.tok, 'malus', { id: uuid(), household_id: HA, user_id: alice.uid, points: 99, week_start: monday });
  ok(hackMal.status !== 201, 'S11 …ni écrire un malus dans le foyer');

  // ── S12 · Départ volontaire ───────────────────────────────────────
  const leave = await api(carol.tok, 'DELETE', `/rest/v1/household_members?user_id=eq.${carol.uid}`);
  ok(leave.status === 204, 'S12 Carol quitte le foyer (delete de sa ligne)');
  ok((await get(alice.tok, `/rest/v1/household_members?household_id=eq.${HA}&select=slot`)).length === 2, 'S12 le foyer repasse à 2');

  console.log(`\n${failed ? `✗ ${failed} échec(s)` : '✓✓ tout passe'} · ${fragile.length} point(s) fragile(s)`);
  fragile.forEach(f => console.log('   △ ' + f));
  console.log(`(foyer de test ${HA.slice(0, 8)} — utilisateurs jetables, données de Jeanne/Ketley jamais touchées)`);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('bot planté :', e); process.exit(3); });
