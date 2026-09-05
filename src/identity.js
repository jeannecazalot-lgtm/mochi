// ═══════════════════════════════════════════════════════════════════
// Identité RÉELLE — le profil Supabase (prénom + photo du 06) affiché
// partout à la place du « Ketley » de démo. Chargée une fois au premier
// écran qui la demande ; repli silencieux sur la démo sans session.
// Le binôme reste le Julian simulé tant que l'invitation réelle n'existe pas.
// ═══════════════════════════════════════════════════════════════════
import { useSyncExternalStore } from 'react';
import { supabase } from './supabase';
import { me as demoMe, partner as demoPartner } from './demo';

let real = null;
let uidVal = null;
let started = false;
export const getUid = () => uidVal; // id Supabase de la session (null hors ligne)
const subs = new Set();
let version = 0;
const notify = () => { version++; subs.forEach(f => f()); };

// valeurs de démo d'origine, pour tout remettre à plat à la déconnexion / au changement
// de binôme (5 sept 2026 : l'ancien uid et le prénom/photo de l'ancien binôme hantaient
// le nouveau compte jusqu'au redémarrage de l'app)
const pick = o => ({ first_name: o.first_name, initial: o.initial, avatar_url: o.avatar_url ?? null });
const DEFAULT_ME = pick(demoMe);
const DEFAULT_PARTNER = pick(demoPartner);
// on quitte le foyer : le binôme redevient celui de démo, mon profil reste
export function resetPartner() {
  partnerUidVal = null;
  Object.assign(demoPartner, DEFAULT_PARTNER);
  notify();
}
export function resetIdentity() {
  real = null; uidVal = null; started = false; partnerUidVal = null;
  Object.assign(demoMe, DEFAULT_ME);
  Object.assign(demoPartner, DEFAULT_PARTNER);
  notify();
}

export async function loadIdentity() {
  // l'uid suit TOUJOURS la session courante (déconnexion/reconnexion sans
  // redémarrage, 5 sept 2026) ; le profil, lui, n'est chargé qu'une fois par compte
  let session = null;
  try { session = (await supabase.auth.getSession()).data.session; } catch (e) { return real; }
  if (!session) return null;
  if (uidVal && uidVal !== session.user.id) { started = false; real = null; }
  uidVal = session.user.id;
  if (started) return real;
  started = true;
  try {
    const { data: p } = await supabase.from('profiles').select('first_name, avatar_url').eq('id', session.user.id).maybeSingle();
    if (p && (p.first_name || p.avatar_url)) {
      const name = (p.first_name || '').trim();
      real = { first_name: name || demoMe.first_name, avatar_url: p.avatar_url || null, initial: (name || demoMe.initial)[0].toUpperCase() };
      // substitution À LA SOURCE : tous les écrans qui lisent me/byId() de la démo
      // affichent le vrai prénom sans être modifiés un par un
      demoMe.first_name = real.first_name;
      demoMe.initial = real.initial;
      demoMe.avatar_url = real.avatar_url;
      notify();
    }
  } catch (e) { /* hors ligne : la démo suffit */ }
  return real;
}

// abonnement pour re-rendre quand le profil arrive (Accueil, 12…)
export const useIdentity = () => { useSyncExternalStore(cb => (subs.add(cb), () => subs.delete(cb)), () => version); return real; };

// identité appliquée IMMÉDIATEMENT depuis le 06 (retour du test à deux, 2 sept :
// « j'ai un rond avec un K » — la substitution attendait l'aller-retour serveur)
export function setLocalIdentity({ firstName, avatarUrl }) {
  const name = (firstName || '').trim();
  if (!name && !avatarUrl) return;
  real = { first_name: name || demoMe.first_name, avatar_url: avatarUrl ?? demoMe.avatar_url ?? null, initial: (name || demoMe.initial)[0].toUpperCase() };
  demoMe.first_name = real.first_name;
  demoMe.initial = real.initial;
  demoMe.avatar_url = real.avatar_url;
  notify();
}

// ─── binôme RÉEL (2 sept 2026) : quand quelqu'un rejoint le foyer, son prénom
// et sa photo remplacent le « Julian » simulé à la source (comme pour moi).
// L'id de démo est conservé (les calculs d'affichage s'y réfèrent) ; l'uid réel
// vit à côté pour les écritures (repassage, assignations).
let partnerUidVal = null;
export const getPartnerUid = () => partnerUidVal;

export async function loadPartner(householdId) {
  if (!householdId) return null;
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return null;
    const uid = data.session.user.id;
    const { data: members } = await supabase.from('household_members').select('user_id').eq('household_id', householdId);
    const other = (members || []).find(m => m.user_id !== uid);
    if (!other) return null;
    partnerUidVal = other.user_id;
    const { data: p } = await supabase.from('profiles').select('first_name, avatar_url').eq('id', other.user_id).maybeSingle();
    const name = (p?.first_name || '').trim();
    if (name || p?.avatar_url) {
      if (name) { demoPartner.first_name = name; demoPartner.initial = name[0].toUpperCase(); }
      demoPartner.avatar_url = p?.avatar_url || null;
    } else {
      Object.assign(demoPartner, DEFAULT_PARTNER); // binôme sans profil : jamais le prénom d'un ancien binôme
    }
    notify();
    return other.user_id;
  } catch (e) { return null; }
}
