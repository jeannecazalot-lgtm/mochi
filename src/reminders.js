// ═══════════════════════════════════════════════════════════════════
// Rappels locaux RÉELS : un récap par jour ayant des occurrences, à
// l'heure choisie au 08 (« Rappel quotidien »). Reprogrammé après chaque
// synchro (« C'est parti ») et chaque déplacement de tâche.
// Permission demandée au moment utile (08), pas au lancement.
// ═══════════════════════════════════════════════════════════════════
import { askNotificationPermission, scheduleAt, cancelAll } from './notifications';
import { read } from './store';
import { setup } from './setup-state';
import copy from './data/copy.json';
import { localIso } from './dates';

const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

export async function rescheduleReminders() {
  try {
    const ok = await askNotificationPermission();
    if (!ok) return false;
    await cancelAll();
    const [occs, tasks, events, notes] = await Promise.all([read('occurrences'), read('tasks'), read('events').catch(() => []), read('notes').catch(() => [])]);
    // événements du jour (+ leur note) dans le récap — retour Ketley 12 sept 2026
    const evByDay = {};
    for (const ev of events || []) { if (ev.deleted_at || !ev.starts_at) continue; (evByDay[localIso(new Date(ev.starts_at))] ||= []).push(ev); }
    // pense-bêtes avec rappel : dans le récap de leur jour
    for (const n of notes || []) { if (n.deleted_at || n.done || !n.remind || !n.due_date) continue; (evByDay[n.due_date] ||= []).push({ emoji: n.emoji || '📌', title: n.title || n.body, details: { note: n.title ? n.body : '' } }); }
    if (!occs.length && !Object.keys(evByDay).length) return true;
    const byTask = Object.fromEntries(tasks.map(tk => [tk.id, tk]));
    const [h, m] = String(setup.reminder || '19:30').split(':').map(Number);
    const t = copy.reminders;
    const days = [...new Set([...occs.map(o => o.due_date), ...Object.keys(evByDay)])].sort();
    for (const dIso of days) {
      const when = new Date(`${dIso}T00:00:00`);
      when.setHours(Number.isFinite(h) ? h : 19, Number.isFinite(m) ? m : 30, 0, 0);
      if (when <= new Date()) continue;
      const dayOccs = occs.filter(o => o.status !== 'skipped' && o.due_date === dIso);
      const titles = dayOccs.map(o => byTask[o.task_id]?.title).filter(Boolean);
      const evs = evByDay[dIso] || [];
      const evLine = evs.map(ev => `${ev.emoji || '📅'} ${ev.title}${ev.details?.note ? ` — ${ev.details.note}` : ''}`).join(' · ');
      const base = dayOccs.length ? fill(dayOccs.length === 1 ? t.bodyOne : t.body, { n: dayOccs.length, list: titles.slice(0, 3).join(' · ') }) : '';
      if (!dayOccs.length && !evs.length) continue;
      await scheduleAt(when, {
        title: t.title,
        body: [base, evLine].filter(Boolean).join('\n'),
        data: { due_date: dIso },
      });
    }
    return true;
  } catch (e) {
    console.warn('[rappels] programmation échouée :', e?.message || e);
    return false;
  }
}
