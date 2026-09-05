// ═══════════════════════════════════════════════════════════════════
// Invitation RÉELLE (écran 09) et « rejoindre avec un code » — la RPC
// accept_invitation (migration 0001) fait entrer le binôme dans le foyer.
// En ligne uniquement : partager une invitation sans réseau n'a pas de sens.
// ═══════════════════════════════════════════════════════════════════
import { supabase } from './supabase';
import { ensureSession } from './profile';
import { uuid, pull, resetAll } from './store';
import { loadSetup, setup, saveHouseholdId, clearSetup } from './setup-state';
import { loadPartner, loadIdentity, resetPartner } from './identity';

// Lien universel (3 sept 2026) : hébergé sur GitHub Pages (AASA du domaine →
// l'app s'ouvre au tap si installée, sinon page d'atterrissage avec le code).
export const inviteUrl = (code) => `https://jeannecazalot-lgtm.github.io/j/?code=${code}`;

// 6 caractères lisibles (pas de I/L/O/0/1)
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const genCode = () => Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');

// Le foyer naît DÈS l'invitation (bug du test à deux, 2 sept : le 09 arrive
// AVANT le « C'est parti » du 12 qui créait le foyer → l'app retombait sur le
// lien de démo mentalfree.app). Créé ici s'il manque ; syncSetup le réutilise.
async function ensureHousehold(uid) {
  const { data: mine } = await supabase.from('household_members').select('household_id').eq('user_id', uid).maybeSingle();
  if (mine) { saveHouseholdId(mine.household_id); return mine.household_id; }
  await loadSetup();
  const householdId = uuid();
  const { error: e1 } = await supabase.from('households').insert({ id: householdId, created_by: uid });
  if (e1) return null;
  const { error: e2 } = await supabase.from('household_members').insert({
    household_id: householdId, user_id: uid, slot: 1,
    availability: setup.availability || {}, weekly_minutes: setup.weekly_minutes || 300,
  });
  if (e2) return null;
  saveHouseholdId(householdId);
  return householdId;
}

// crée (ou réutilise) l'invitation en cours de mon foyer → { code } | null
export async function createInvitation() {
  try {
    const session = await ensureSession();
    const uid = session.user.id;
    const householdId = await ensureHousehold(uid);
    if (!householdId) return null;
    const { data: existing } = await supabase.from('invitations')
      .select('code').eq('household_id', householdId).is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (existing) return { code: existing.code };
    const code = genCode();
    const { error } = await supabase.from('invitations').insert({ id: uuid(), household_id: householdId, code, created_by: uid });
    if (error) return null;
    return { code };
  } catch (e) { return null; }
}

// quitter son foyer (profil, décision Jeanne 5 sept 2026) : ma ligne membre disparaît,
// le foyer et ses données restent à l'autre ; localement on repart de zéro (le profil
// — prénom, photo — est conservé). Ensuite : écran 09, créer ou rejoindre un foyer.
export async function leaveHousehold() {
  try {
    const session = await ensureSession();
    const { error } = await supabase.from('household_members').delete().eq('user_id', session.user.id);
    if (error) return { ok: false, reason: error.message };
    clearSetup();
    await resetAll();
    resetPartner();
    return { ok: true };
  } catch (e) { return { ok: false, reason: e?.message || 'réseau' }; }
}

// rejoint un foyer avec un code, puis rapatrie ses données
export async function joinWithCode(code) {
  try {
    await ensureSession();
    const { data: hid, error } = await supabase.rpc('accept_invitation', { p_code: String(code).trim().toUpperCase() });
    if (error) return { ok: false, reason: error.message };
    saveHouseholdId(hid);
    await loadIdentity(); // uid + profil de LA session qui vient de rejoindre
    await resetAll(); // nouveau foyer : cache, filigranes et file repartent de zéro
    await Promise.all(['tasks', 'occurrences', 'task_pains', 'swap_requests', 'malus'].map(tb => pull(tb, hid)));
    loadPartner(hid); // le prénom/photo de l'autre remplace le binôme simulé
    return { ok: true, householdId: hid };
  } catch (e) { return { ok: false, reason: e?.message || 'réseau' }; }
}
