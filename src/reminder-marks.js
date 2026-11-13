// « Petit rappel » visible sur la mission (Jeanne, 13 nov 2026 : « quand j'ai fait un petit rappel sur une
// mission, ce serait bien que quelque part ça me l'affiche ») : chez moi « Rappel envoyé · 9:12 »,
// chez l'autre « Jeanne te l'a rappelée ». Le dernier rappel (ou « c'est ton tour ») par occurrence.
import { fmtClock } from './lang';
import { partner } from './demo';
import copy from './copy';

const KINDS = new Set(['reminder', 'turn', 'deadline']);
const fill = (str, vars) => String(str || '').replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export function reminderMarks(acts, uid) {
  const last = {};
  for (const a of acts) {
    if (a.type !== 'ping' || !KINDS.has(a.preset_key) || !a.occurrence_id) continue;
    if (!last[a.occurrence_id] || String(a.created_at) > String(last[a.occurrence_id].created_at)) last[a.occurrence_id] = a;
  }
  const out = {};
  for (const [occ, a] of Object.entries(last)) {
    out[occ] = a.actor_id === uid
      ? fill(copy.home.reminderSent, { time: fmtClock(new Date(a.created_at)) })
      : fill(copy.home.reminderGot, { name: partner.first_name });
  }
  return out;
}
