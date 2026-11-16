// ═════════════════════════════════════════════════════════════════
// Mesure minimale (Jeanne, 15 nov 2026). Quelques moments clés écrits dans la table `app_events`
// (migration 0020) : pas d'outil tiers, pas de pub. Envoi « au mieux » : jamais bloquant, jamais d'erreur visible.
// Liste des moments et lecture des chiffres : docs/mesure.sql.
// ═════════════════════════════════════════════════════════════════
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, SUPABASE_READY } from './supabase';
import { setup } from './setup-state';
import { localIso } from './dates';
import { uuid } from './store';

const DEVICE_KEY = 'mochi.track.device';
const OPEN_KEY = 'mochi.track.openDay';
let deviceId = null;

async function getDeviceId() {
  if (deviceId) return deviceId;
  try { deviceId = await AsyncStorage.getItem(DEVICE_KEY); } catch (e) { /* */ }
  if (!deviceId) { deviceId = uuid(); AsyncStorage.setItem(DEVICE_KEY, deviceId).catch(() => {}); }
  return deviceId;
}

// renvoie true si la ligne est bien écrite (jamais d'erreur levée)
export function track(name, props = {}) {
  if (!SUPABASE_READY) return Promise.resolve(false);
  return (async () => {
    const { data } = await supabase.auth.getSession().catch(() => ({ data: null }));
    const uid = data?.session?.user?.id || null;
    const { error } = await supabase.from('app_events').insert({
      name, props, user_id: uid, household_id: setup.householdId || null, device_id: await getDeviceId(),
      app_version: Constants.expoConfig?.version || null, platform: Platform.OS, dev: !!__DEV__,
    });
    return !error;
  })().catch(() => false);
}

// une fois par jour et par appareil : la base des chiffres de rétention
export async function trackDailyOpen() {
  try {
    const today = localIso();
    if ((await AsyncStorage.getItem(OPEN_KEY)) === today) return;
    if (await track('app_open')) await AsyncStorage.setItem(OPEN_KEY, today); // marqué fait seulement si bien écrit
  } catch (e) { /* */ }
}
