// ═══════════════════════════════════════════════════════════════════
// Client Supabase — LE point d'entrée unique vers la base.
// Credentials dans .env (EXPO_PUBLIC_*, jamais commités). Session Auth
// persistée dans AsyncStorage, rafraîchie automatiquement.
// ═══════════════════════════════════════════════════════════════════
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const SUPABASE_READY = Boolean(url && key);

export const supabase = createClient(url || 'https://placeholder.supabase.co', key || 'placeholder', {
  auth: { storage: AsyncStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});

// rafraîchit le jeton quand l'app repasse au premier plan
AppState.addEventListener('change', state => {
  if (state === 'active') supabase.auth.startAutoRefresh(); else supabase.auth.stopAutoRefresh();
});
