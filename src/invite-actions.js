// ═══════════════════════════════════════════════════════════════════
// Invitation RÉELLE (écran 09) et « rejoindre avec un code » — la RPC
// accept_invitation (migration 0001) fait entrer le binôme dans le foyer.
// En ligne uniquement : partager une invitation sans réseau n'a pas de sens.
// ═══════════════════════════════════════════════════════════════════
import { supabase } from './supabase';
import { ensureSession } from './profile';
import { uuid, pull } from './store';
import { saveHouseholdId } from './setup-state';
import { loadPartner } from './identity';

// 6 caractères lisibles (pas de I/L/O/0/1)
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const genCode = () => Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');

// crée (ou réutilise) l'invitation en cours de mon foyer → { code } | null
export async function createInvitation() {
  try {
    const session = await ensureSession();
    const uid = session.user.id;
    const { data: mine } = await supabase.from('household_members').select('household_id').eq('user_id', uid).maybeSingle();
    if (!mine) return null; // pas encore de foyer : le setup n'est pas passé par « C'est parti »
    const { data: existing } = await supabase.from('invitations')
      .select('code').eq('household_id', mine.household_id).is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (existing) return { code: existing.code };
    const code = genCode();
    const { error } = await supabase.from('invitations').insert({ id: uuid(), household_id: mine.household_id, code, created_by: uid });
    if (error) return null;
    return { code };
  } catch (e) { return null; }
}

// rejoint un foyer avec un code, puis rapatrie ses données
export async function joinWithCode(code) {
  try {
    await ensureSession();
    const { data: hid, error } = await supabase.rpc('accept_invitation', { p_code: String(code).trim().toUpperCase() });
    if (error) return { ok: false, reason: error.message };
    saveHouseholdId(hid);
    await Promise.all(['tasks', 'occurrences', 'task_pains'].map(tb => pull(tb, hid)));
    loadPartner(hid); // le prénom/photo de l'autre remplace le binôme simulé
    return { ok: true, householdId: hid };
  } catch (e) { return { ok: false, reason: e?.message || 'réseau' }; }
}
