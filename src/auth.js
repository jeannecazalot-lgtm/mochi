// ═══════════════════════════════════════════════════════════════════
// Auth — Apple (à brancher : expo-apple-authentication) + lien magique
// e-mail. Expose un hook useSession() pour le gate de navigation.
// ═══════════════════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export function useSession() {
  const [session, setSession] = useState(undefined); // undefined = en cours de lecture
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);
  return session;
}

export async function signInWithEmail(email) {
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: 'mochi://auth' } });
  return { ok: !error, error: error?.message };
}

export async function signOut() { await supabase.auth.signOut(); }
