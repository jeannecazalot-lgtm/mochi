// ═══════════════════════════════════════════════════════════════════
// mochi-state.js — la logique de « Mochi qu'on élève » (migration 0013, recette §1).
//  · vérité = mochi_events (journal), cache lisible = mochi_state (une ligne par foyer)
//  · énergie du jour : DÉRIVÉE des occurrences du foyer dues aujourd'hui (pas de table)
//  · tick() à l'ouverture / retour au premier plan / changement de jour :
//    cœurs (ratées), éclosion, retour de balade, départ en balade, clôture de semaine
// Tout passe par mutate() (file offline-first) ; les deux téléphones se voient via realtime.
// ═══════════════════════════════════════════════════════════════════
import { useSyncExternalStore } from 'react';
import { read, mutate, pull, uuid } from './store';
import { setup, loadSetup, thresholdsOf } from './setup-state';
import { getUid } from './identity';
import { localIso, addDaysIso } from './dates';
import { weekStartIso } from './malus-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleMochiReturn } from './notifications';
import items from './data/mochi-items.json';

export const STAGES = ['egg', 'mini', 'mochi', 'maxi', 'dore'];
export const STAGE_AT = { mochi: 3, maxi: 8, dore: 16 };           // semaines saines cumulées
export const stageFor = hw => (hw >= STAGE_AT.dore ? 'dore' : hw >= STAGE_AT.maxi ? 'maxi' : hw >= STAGE_AT.mochi ? 'mochi' : 'mini');
export const PEARLS = { mission: 3, mental: 4, together: 5, walk: 12, smallWalk: 5, checkin: 1, quest: 30 };
export const WALK_MS = 2 * 3600e3;
const PLACES_BY_STAGE = { egg: [], mini: ['jardin'], mochi: ['jardin', 'riviere'], maxi: ['jardin', 'riviere', 'foret', 'ville'], dore: ['jardin', 'riviere', 'foret', 'ville', 'plage', 'montagne'] };
export const MOMENTS = ['hatch', 'walk_return', 'stage_up'];
export const demoFlags = { checkin: {} }; // mode démo : mémoire de session (pas de foyer)       // montrés en plein écran à chacun

let version = 0; const subs = new Set();
export const mochiStore = {
  bump() { version++; subs.forEach(f => f()); },
  useVersion: () => useSyncExternalStore(cb => (subs.add(cb), () => subs.delete(cb)), () => version),
};
const isLive = o => o.status !== 'skipped';
const hid = () => setup.householdId;
const nowIso = () => new Date().toISOString();

export async function getMochi() { const rows = await read('mochi_state'); return rows.find(r => r.household_id === hid()) || null; }
export async function refreshMochi() {
  await loadSetup(); if (!hid()) return null;
  await Promise.all(['mochi_state', 'mochi_events', 'mochi_inventory', 'mochi_checkins'].map(t => pull(t, hid()).catch(() => null)));
  mochiStore.bump();
  return getMochi();
}
async function patch(changes) {
  const m = await getMochi(); if (!m) return null;
  const row = { ...m, ...changes, updated_at: nowIso() };
  await mutate('mochi_state', row); mochiStore.bump();
  return row;
}
async function event(type, extra = {}) {
  const e = { id: uuid(), household_id: hid(), type, actor_id: 'actor_id' in extra ? extra.actor_id : getUid(), occurrence_id: extra.occurrence_id || null, payload: extra.payload || {}, seen_by: extra.seen_by || [], created_at: nowIso() };
  await mutate('mochi_events', e);
  return e;
}

// ── énergie du jour : missions du FOYER dues aujourd'hui (les deux ensemble) ─────────────
export function energyOf(occs, iso = localIso()) {
  const today = occs.filter(o => isLive(o) && o.due_date === iso);
  return { done: today.filter(o => o.status === 'done').length, total: today.length };
}
export const pearlsFor = (occ, task) => (!occ.assignee_id ? PEARLS.together : task?.mental_load ? PEARLS.mental : PEARLS.mission);

// ── une mission vient d'être cochée (appelé par l'écran après toggleOccurrence) ──────────
export async function onMissionDone(occ, task, { wasMissed = false } = {}) {
  const m = await getMochi(); if (!m) return;
  const delta = pearlsFor(occ, task);
  await event('pearls', { occurrence_id: occ.id, payload: { delta, reason: 'mission' } });
  const changes = { pearls: (m.pearls || 0) + delta };
  if (wasMissed && m.hearts < 5) { await event('heart_gained', { occurrence_id: occ.id, payload: { reason: 'rattrapage' } }); changes.hearts = m.hearts + 1; }
  await patch(changes);
  await checkHatch(); await checkWalk();
}

// ── éclosion : quand le duo est formé, c'est-à-dire dès que le foyer a deux membres (décision Jeanne 4 nov 2026 :
// « il éclot quand ils créent leur session à deux »). L'écran Duo formé est le moment de l'éclosion.
export async function checkHatch() {
  const m = await getMochi(); if (!m || m.stage !== 'egg') return false;
  const members = await read('household_members');
  if (members.filter(x => x.household_id === hid()).length < 2) return false;
  await event('hatch', { actor_id: null });
  await patch({ stage: 'mini', hatched_at: nowIso() });
  return true;
}

// ── balade : jauge pleine → il part 2 h (pas si patraque/malade, pas deux fois le même jour) ─
export async function checkWalk() {
  const m = await getMochi(); if (!m || m.stage === 'egg' || m.walk_status !== 'home' || m.hearts <= 2) return false;
  const occs = await read('occurrences'); const { done, total } = energyOf(occs);
  if (!total || done < total) return false;
  const evs = await read('mochi_events'); const today = localIso();
  if (evs.some(e => e.type === 'walk_start' && String(e.created_at).slice(0, 10) === today)) return false;
  const t = Date.now();
  await event('walk_start', { actor_id: null, payload: { kind: 'full' } });
  await event('pearls', { actor_id: null, payload: { delta: PEARLS.walk, reason: 'journee_pleine' } });
  await patch({ pearls: (m.pearls || 0) + PEARLS.walk, walk_status: 'away', walk_started_at: new Date(t).toISOString(), walk_returns_at: new Date(t + WALK_MS).toISOString() });
  scheduleMochiReturn(new Date(t + WALK_MS)).catch(() => {});
  return true;
}
// ── retour : un souvenir du lieu débloqué par le stade (jamais deux fois le même) ──────────
export async function checkReturn() {
  const m = await getMochi(); if (!m || m.walk_status !== 'away' || !m.walk_returns_at || Date.now() < Date.parse(m.walk_returns_at)) return false;
  const inv = await read('mochi_inventory'); const owned = new Set(inv.filter(i => i.household_id === hid()).map(i => i.item_key));
  const places = PLACES_BY_STAGE[m.stage] || ['jardin'];
  const pool = items.souvenirs.filter(s => places.includes(s.place) && !owned.has(s.key));
  const pick = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  const ev = await event('walk_return', { actor_id: null, payload: { souvenir_key: pick?.key || null, place: pick?.place || null } });
  if (pick) await mutate('mochi_inventory', { id: uuid(), household_id: hid(), item_key: pick.key, kind: 'souvenir', source: 'walk', placed: true, event_id: ev.id, acquired_by: null, acquired_at: nowIso() });
  await patch({ walk_status: 'home', walk_started_at: null, walk_returns_at: null });
  return true;
}

// ── cœurs : une ratée assignée = −1 (plancher 1), une seule fois par occurrence ; à 1 → malade ─
export async function sweepHearts() {
  const m = await getMochi(); if (!m) return false;
  const [occs, evs] = await Promise.all([read('occurrences'), read('mochi_events')]);
  const lost = new Set(evs.filter(e => e.type === 'heart_lost').map(e => e.occurrence_id));
  const missed = occs.filter(o => o.status === 'missed' && o.assignee_id && !lost.has(o.id));
  if (!missed.length) return false;
  let hearts = m.hearts;
  for (const o of missed) { await event('heart_lost', { actor_id: o.assignee_id, occurrence_id: o.id }); hearts = Math.max(1, hearts - 1); }
  await patch({ hearts });
  if (hearts === 1 && m.hearts > 1) await event('sick', { actor_id: null });
  return true;
}

// ── clôture de la semaine passée (idempotente) : saine = balance < seuil, ≥ 80 % faites, pas malade ─
export async function closeWeekIfNeeded() {
  const m = await getMochi(); if (!m || m.stage === 'egg') return false;
  const lastMonday = weekStartIso(addDaysIso(-7)); const thisMonday = weekStartIso();
  const evs = await read('mochi_events');
  if (evs.some(e => e.type === 'week_closed' && e.payload?.week_start === lastMonday)) return false;
  const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]);
  const byTask = Object.fromEntries(tasks.map(t => [t.id, t]));
  const week = occs.filter(o => isLive(o) && o.due_date >= lastMonday && o.due_date < thisMonday);
  if (!week.length) return false; // rien de prévu : la semaine ne compte pas, ni en bien ni en mal
  const done = week.filter(o => o.status === 'done'), missed = week.filter(o => o.status === 'missed');
  const donePct = done.length / Math.max(1, done.length + missed.length);
  const mins = {}; for (const o of done) { const k = o.assignee_id || 'both'; mins[k] = (mins[k] || 0) + (o.duration_min || byTask[o.task_id]?.duration_min || 15); }
  const people = Object.keys(mins).filter(k => k !== 'both'); const both = (mins.both || 0) / Math.max(1, people.length || 2);
  const loads = people.map(k => mins[k] + both); const tot = loads.reduce((a, b) => a + b, 0) || 1;
  const gapPct = loads.length >= 2 ? Math.abs(loads[0] - loads[1]) / tot * 100 : 100;
  const sick = evs.some(e => e.type === 'sick' && String(e.created_at).slice(0, 10) >= lastMonday && String(e.created_at).slice(0, 10) < thisMonday);
  const healthy = gapPct < thresholdsOf().warn && donePct >= 0.8 && !sick;
  await event('week_closed', { actor_id: null, payload: { week_start: lastMonday, healthy, done_pct: Math.round(donePct * 100), gap_pct: Math.round(gapPct), sick } });
  if (!healthy) return true;
  const hw = (m.healthy_weeks || 0) + 1; const next = stageFor(hw);
  await patch({ healthy_weeks: hw, stage: STAGES.indexOf(next) > STAGES.indexOf(m.stage) ? next : m.stage });
  if (STAGES.indexOf(next) > STAGES.indexOf(m.stage)) await event('stage_up', { actor_id: null, payload: { from: m.stage, to: next } });
  return true;
}

// ── check-in du matin / du soir : 1 perle, une fois par moment et par jour ─────────────────
export async function checkin(mood, moment = 'morning') {
  const uid = getUid(); if (!uid || !hid()) return null;
  const day = localIso(); const rows = await read('mochi_checkins');
  const existing = rows.find(r => r.user_id === uid && r.day === day && r.moment === moment);
  const row = { id: existing?.id || uuid(), household_id: hid(), user_id: uid, day, moment, mood, created_at: existing?.created_at || nowIso() };
  await mutate('mochi_checkins', row);
  if (!existing) { const m = await getMochi(); if (m) { await event('pearls', { payload: { delta: PEARLS.checkin, reason: 'checkin' } }); await patch({ pearls: (m.pearls || 0) + PEARLS.checkin }); } }
  return row;
}

// ── moments plein écran pas encore vus par moi ────────────────────────────────────────────
export async function unseenMoments() {
  const uid = getUid(); const evs = await read('mochi_events');
  return evs.filter(e => e.household_id === hid() && MOMENTS.includes(e.type) && !(e.seen_by || []).includes(uid)).sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
}
export async function markSeen(ev) { const uid = getUid(); if (!uid) return; await mutate('mochi_events', { ...ev, seen_by: [...(ev.seen_by || []), uid] }); mochiStore.bump(); }

// ── à l'ouverture, au retour au premier plan, au changement de jour ────────────────────────
export async function tick() {
  const m = await refreshMochi(); if (!m) return null;
  await sweepHearts(); await checkHatch(); await checkReturn(); await checkWalk(); await closeWeekIfNeeded();
  mochiStore.bump();
  return getMochi();
}

// ── boutique : un objet ou une tenue contre des perles communes (jamais d'utilitaire derrière) ─────
export async function buyItem(item, kind = 'object') {
  const m = await getMochi(); if (!m) return { ok: false, reason: 'no_mochi' };
  if ((m.pearls || 0) < item.price) return { ok: false, reason: 'pearls' };
  const inv = await read('mochi_inventory');
  if (inv.some(i => i.household_id === hid() && i.item_key === item.key)) return { ok: false, reason: 'owned' };
  const ev = await event('pearls', { payload: { delta: -item.price, reason: 'shop', item_key: item.key } });
  await mutate('mochi_inventory', { id: uuid(), household_id: hid(), item_key: item.key, kind, source: 'shop', placed: true, event_id: ev.id, acquired_by: getUid(), acquired_at: nowIso() });
  await patch({ pearls: (m.pearls || 0) - item.price });
  return { ok: true };
}

// ── nom choisi à l'onboarding (avant tout foyer) : appliqué au premier Mochi réel vu, puis effacé ──
const NAME_K = 'mochi:pendingName';
export async function setPendingName(name) { try { await AsyncStorage.setItem(NAME_K, String(name || '').trim()); } catch (e) { /* ignore */ } }
export async function applyPendingName() {
  try {
    const name = (await AsyncStorage.getItem(NAME_K) || '').trim(); if (!name) return false;
    const m = await getMochi(); if (!m) return false;
    if (!m.name || m.name === 'Mochi') await patch({ name });
    await AsyncStorage.removeItem(NAME_K); return true;
  } catch (e) { return false; }
}
export async function renameMochi(name) { const m = await getMochi(); if (!m) return false; await patch({ name: String(name || 'Mochi').trim() || 'Mochi' }); return true; }
