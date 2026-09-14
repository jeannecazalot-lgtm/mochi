// ═══════════════════════════════════════════════════════════════════
// Auth — compte RÉEL (décision Jeanne 13 sept 2026 : « il faut se connecter e-mail / Apple », avant
// le prénom). Deux voies :
//   · Apple natif (expo-apple-authentication → jeton d'identité → Supabase signInWithIdToken)
//   · e-mail → code à 6 chiffres reçu par mail → verifyOtp (pas de lien à cliquer)
// Session anonyme existante (foyers de test) : l'e-mail est LIÉ au même utilisateur (updateUser
// + code « email_change »), rien n'est perdu ; Apple ouvre un compte distinct.
// ═══════════════════════════════════════════════════════════════════
import { useEffect, useState } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { supabase } from './supabase';
import { setLocalIdentity } from './identity';

export function useSession() {
  const [session, setSession] = useState(undefined); // undefined = en cours de lecture
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);
  return session;
}

// compte « vrai » = session non anonyme
export const isRealUser = s => !!s && !s.user?.is_anonymous;
export async function currentAccount() {
  const { data } = await supabase.auth.getSession();
  const u = data.session?.user;
  if (!u || u.is_anonymous) return null;
  const apple = (u.identities || []).some(i => i.provider === 'apple');
  return { email: u.email || null, provider: apple ? 'apple' : 'email' };
}

// ─── e-mail : envoi du code ───
export async function sendEmailCode(email) {
  const { data } = await supabase.auth.getSession();
  const anon = data.session?.user?.is_anonymous;
  if (anon) {
    // lier l'e-mail à la session anonyme : même utilisateur, mêmes données
    const { error } = await supabase.auth.updateUser({ email });
    return { ok: !error, linking: true, error: error?.message };
  }
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  return { ok: !error, linking: false, error: error?.message };
}
// ─── e-mail : vérification du code ───
export async function verifyEmailCode(email, token, linking) {
  const { error } = await supabase.auth.verifyOtp({ email, token: String(token).trim(), type: linking ? 'email_change' : 'email' });
  return { ok: !error, error: error?.message };
}

// ─── Apple natif ───
export async function appleAvailable() { try { return await AppleAuthentication.isAvailableAsync(); } catch (e) { return false; } }
export async function signInWithApple() {
  try {
    const rawNonce = Array.from(Crypto.getRandomBytes(16)).map(b => b.toString(16).padStart(2, '0')).join('');
    const hashed = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
    const cred = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      nonce: hashed,
    });
    if (!cred.identityToken) return { ok: false, error: 'no_token' };
    const { error } = await supabase.auth.signInWithIdToken({ provider: 'apple', token: cred.identityToken, nonce: rawNonce });
    if (error) return { ok: false, error: error.message };
    // Apple ne donne le prénom qu'à la première connexion : on le garde tout de suite
    const first = cred.fullName?.givenName;
    if (first) setLocalIdentity({ firstName: first, avatarUrl: null });
    return { ok: true, firstName: first || null };
  } catch (e) {
    if (e?.code === 'ERR_REQUEST_CANCELED') return { ok: false, canceled: true };
    return { ok: false, error: e?.message || 'apple' };
  }
}

export async function signOut() { await supabase.auth.signOut(); }
