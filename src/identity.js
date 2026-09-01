// ═══════════════════════════════════════════════════════════════════
// Identité RÉELLE — le profil Supabase (prénom + photo du 06) affiché
// partout à la place du « Ketley » de démo. Chargée une fois au premier
// écran qui la demande ; repli silencieux sur la démo sans session.
// Le binôme reste le Julian simulé tant que l'invitation réelle n'existe pas.
// ═══════════════════════════════════════════════════════════════════
import { useSyncExternalStore } from 'react';
import { supabase } from './supabase';
import { me as demoMe } from './demo';

let real = null;
let started = false;
const subs = new Set();
let version = 0;
const notify = () => { version++; subs.forEach(f => f()); };

export async function loadIdentity() {
  if (started) return real;
  started = true;
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return null;
    const { data: p } = await supabase.from('profiles').select('first_name, avatar_url').eq('id', data.session.user.id).maybeSingle();
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
