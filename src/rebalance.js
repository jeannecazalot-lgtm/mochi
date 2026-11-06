// ═══════════════════════════════════════════════════════════════════
// rebalance.js — la Balance agit (décision Jeanne 6 nov 2026 : « elle juge sans aider »).
//  · suggestRebalance() : combien de missions à venir cette semaine passeraient de celui qui porte le plus
//    à l'autre pour rapprocher les deux (fait + prévu), sans rien écrire.
//  · rebalanceWeek() : applique la suggestion (porteur changé sur les occurrences, l'autre est prévenu).
//  · handTask(taskId) : passe à l'autre la prochaine occurrence de cette tâche (« ce qui pèse » → « → Julian »).
// ═══════════════════════════════════════════════════════════════════
import { read, mutate } from './store';
import { getUid, getPartnerUid } from './identity';
import { localIso, addDaysIso } from './dates';
import { occStore } from './demo-core';
import { logActivity } from './activity-actions';
import { pushToPartner } from './push';
import { rescheduleReminders } from './reminders';
import { computeRealBalance } from './balance-real';
import { weekDays } from './demo-core';

const minsOf = (o, byTask) => o.duration_min || byTask[o.task_id]?.duration_min || 15;

async function weekState() {
  const uid = getUid(), puid = getPartnerUid();
  if (!uid || !puid) return null;
  const [occs, tasks] = await Promise.all([read('occurrences'), read('tasks')]);
  const byTask = Object.fromEntries(tasks.map(t => [t.id, t]));
  const wk = weekDays(new Date()).map(localIso); const today = localIso(); const sunday = wk[6];
  const bal = computeRealBalance(occs, uid);
  // charge « fait + prévu » de chacun sur la semaine : minutes faites (balance) + minutes à venir assignées
  const load = { [uid]: bal.parts[0].minutes, [puid]: bal.parts[1].minutes };
  const upcoming = occs.filter(o => o.status === 'pending' && o.assignee_id && o.due_date >= today && o.due_date <= sunday);
  for (const o of upcoming) if (o.assignee_id in load) load[o.assignee_id] += minsOf(o, byTask);
  const top = load[uid] >= load[puid] ? uid : puid, other = top === uid ? puid : uid;
  return { uid, puid, occs, tasks, byTask, load, top, other, upcoming, today, sunday };
}

export async function suggestRebalance() {
  const st = await weekState(); if (!st) return { n: 0, moves: [] };
  const { load, top, other, upcoming, byTask } = st;
  let gap = load[top] - load[other];
  // on déplace les missions à venir du plus chargé, les plus longues d'abord, tant que ça réduit l'écart
  const cands = upcoming.filter(o => o.assignee_id === top).sort((a, b) => minsOf(b, byTask) - minsOf(a, byTask));
  const moves = [];
  for (const o of cands) { const m = minsOf(o, byTask); if (gap - 2 * m < -gap * 0.5) continue; if (gap <= 0) break; moves.push(o); gap -= 2 * m; }
  return { n: moves.length, moves, to: other, from: top, gap: Math.max(0, gap) };
}

export async function rebalanceWeek() {
  const s = await suggestRebalance(); if (!s.n) return { ok: false, n: 0 };
  const tasks = await read('tasks');
  for (const o of s.moves) await mutate('occurrences', { ...o, assignee_id: s.to });
  const vars = { n: s.n, name: '' };
  logActivity({ type: 'ping', preset_key: 'rebalanced', payload: { n: s.n } }).catch(() => {});
  pushToPartner('rebalanced', { n: s.n }, '/(tabs)/planning');
  occStore.bump(); rescheduleReminders();
  return { ok: true, n: s.n, to: s.to, first: tasks.find(t => t.id === s.moves[0]?.task_id)?.title || '' };
}

export async function handTask(taskId) {
  const st = await weekState(); if (!st) return { ok: false };
  const { uid, puid, upcoming, byTask } = st;
  const next = upcoming.filter(o => o.task_id === taskId && o.assignee_id === uid).sort((a, b) => a.due_date.localeCompare(b.due_date))[0];
  if (!next) return { ok: false, reason: 'aucune' };
  await mutate('occurrences', { ...next, assignee_id: puid });
  const vars = { task: (byTask[taskId]?.title || '…').toLowerCase() };
  logActivity({ type: 'ping', preset_key: 'handed', occurrence_id: next.id, payload: vars }).catch(() => {});
  pushToPartner('handed', vars, '/(tabs)/planning');
  occStore.bump(); rescheduleReminders();
  return { ok: true, due: next.due_date };
}
