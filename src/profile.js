// ═══════════════════════════════════════════════════════════════════
// Profil — écran 06. Écrit dans `profiles` (+ photo dans le bucket
// `avatars`). Sans compte encore : session anonyme Supabase, reliée
// plus tard à Apple / e-mail (écran connexion), jamais perdue.
// ═══════════════════════════════════════════════════════════════════
import { supabase } from './supabase';

export async function ensureSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;
  const { data: anon, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return anon.session;
}

async function uploadAvatar(userId, uri) {
  const res = await fetch(uri);
  const blob = await res.arrayBuffer();
  const path = `${userId}/avatar.jpg`;
  const { error } = await supabase.storage.from('avatars').upload(path, blob, { contentType: 'image/jpeg', upsert: true });
  if (error) throw error;
  return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl + `?v=${Date.now()}`;
}

export async function saveIdentity({ firstName, photoUri }) {
  const session = await ensureSession();
  const userId = session.user.id;
  const avatar_url = photoUri && !photoUri.startsWith('http') ? await uploadAvatar(userId, photoUri) : photoUri || null;
  // update (pas upsert) : la ligne existe déjà, créée par le trigger à l'inscription ; la RLS n'autorise que la modif de son propre profil
  const { error } = await supabase.from('profiles').update({ first_name: firstName.trim(), avatar_url }).eq('id', userId);
  if (error) throw error;
  return { userId, avatar_url };
}

export async function loadProfile() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  const { data: p } = await supabase.from('profiles').select('*').eq('id', data.session.user.id).maybeSingle();
  return p;
}
