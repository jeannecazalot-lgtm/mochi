// ═══════════════════════════════════════════════════════════════════
// Données de la sheet Tâche v2 (validée par Jeanne le 6 sept 2026).
// Charge l'occurrence + sa tâche (réelles via le store, démo en repli),
// enregistre la règle (tasks) et la validation (occurrence + dépense).
// ═══════════════════════════════════════════════════════════════════
import { read, mutate, uuid } from './store';
import { occStore } from './demo-core';
import { toggleOccurrence, applyRuleToOccurrences } from './occ-actions';
import { getUid, getPartnerUid } from './identity';
import { loadSetup, setup } from './setup-state';
import { occurrences as demoOccs, taskById, me, partner } from './demo';
import { localIso } from './dates';

// « Qui s'en occupe » de la sheet ↔ colonnes assign_mode / fixed_assignee
export const whoOf = (task, uid) => task.assign_mode === 'alternate' ? 'alt'
  : task.assign_mode === 'fixed' ? ((task.fixed_assignee && task.fixed_assignee === (uid || me.id)) ? 'me' : 'partner')
    : 'auto';
export const whoToCols = (who, uid) => who === 'alt' ? { assign_mode: 'alternate', fixed_assignee: null }
  : who === 'me' ? { assign_mode: 'fixed', fixed_assignee: uid || me.id }
    : who === 'partner' ? { assign_mode: 'fixed', fixed_assignee: getPartnerUid() || partner.id }
      : { assign_mode: 'auto', fixed_assignee: null };

// occurrence + tâche au format de la sheet ; `real` = vit dans le store local
export async function loadMission({ occId, tid, title, mins }) {
  const occs = await read('occurrences');
  const row = occs.find(o => o.id === occId);
  if (row) {
    const tasks = await read('tasks');
    const tk = tasks.find(x => x.id === row.task_id) || {};
    const uid = getUid();
    return {
      real: true, occ: row, dueIso: row.due_date,
      mine: !row.assignee_id || !uid || row.assignee_id === uid,
      // jours où la même tâche est déjà prévue : « Déplacer à » les grise au lieu de refuser en silence
      // (retour Ketlon 7 sept 2026 : « je peux pas appuyer sur une autre date »)
      busy: occs.filter(o => o.id !== occId && o.task_id === row.task_id && o.kind === row.kind && o.status !== 'skipped').map(o => o.due_date),
      task: { id: tk.id || row.task_id, title: tk.title || String(title || '…'), duration_min: tk.duration_min || Number(mins) || 15,
        window_days: tk.window_days || [], who: whoOf(tk, uid), note: tk.note || '' },
    };
  }
  const demo = demoOccs.find(o => o.id === occId) || (title ? null : demoOccs.find(o => o.assignee_id === me.id && o.status !== 'done'));
  const tk = demo ? taskById(demo.task_id) : null;
  if (!tk && !title) return null;
  return {
    real: false, occ: demo || { id: occId }, dueIso: demo ? localIso(demo.due_date) : localIso(),
    mine: !demo || demo.assignee_id === me.id, busy: [],
    task: { id: tid ? String(tid) : tk?.id || null, title: tk?.title || String(title), duration_min: tk?.duration_min || Number(mins) || 15,
      window_days: [], who: tk ? whoOf(tk) : 'auto', note: '' },
  };
}

// la règle : jours, qui, durée, note → ligne tasks (réel seulement)
export async function saveRule(taskId, rule) {
  const rows = await read('tasks');
  const row = rows.find(r => r.id === taskId);
  if (!row) return false;
  const next = { ...row, window_days: rule.window_days, duration_min: rule.duration_min, note: rule.note || null, ...whoToCols(rule.who, getUid()) };
  await mutate('tasks', next);
  await applyRuleToOccurrences(next, rule); // les prochaines occurrences suivent (7 sept 2026)
  occStore.bump();
  return true;
}

// « C'est fait » : occurrence validée (minutes réelles) + dépense éventuelle
export async function completeMission(occ, task, minutes, amountCents) {
  await toggleOccurrence(String(occ.id), true, minutes);
  if (!amountCents) return;
  await loadSetup();
  const hid = setup.householdId;
  const uid = getUid();
  if (!hid || !uid) return; // démo : rien à écrire
  const households = await read('households');
  const currency = households.find(h => h.id === hid)?.currency || 'EUR';
  await mutate('expenses', {
    id: uuid(), household_id: hid, title: task.title, emoji: null, amount_cents: amountCents, currency,
    paid_by: uid, split_mode: 'equal', category: 'autre', spent_on: localIso(), created_by: uid,
  });
  occStore.bump();
}

export const parseAmount = s => Math.round(parseFloat(String(s || '').replace(',', '.').replace(/[^\d.]/g, '')) * 100) || 0;
