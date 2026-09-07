// ═══════════════════════════════════════════════════════════════════
// Notifications push ENTRE LES DEUX TÉLÉPHONES (7 sept 2026) — sans serveur :
//  · registerPushToken : mon jeton Expo → profiles.push_token (téléphone réel seulement)
//  · pushToPartner     : lit le jeton de l'autre, envoie via le service push d'Expo
// Les textes vivent dans copy.push. Un échec (hors ligne, pas de jeton) est silencieux :
// l'info arrive de toute façon dans le fil Activité. Rappels du jour : toujours locaux.
// ═══════════════════════════════════════════════════════════════════
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { supabase } from './supabase';
import { getUid, getPartnerUid } from './identity';
import { me } from './demo';
import copy from './data/copy.json';

const fill = (str, vars) => String(str || '').replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const EXPO_PUSH = 'https://exp.host/--/api/v2/push/send';

export async function registerPushToken() {
  try {
    if (!Device.isDevice) return null; // simulateur : pas de jeton APNs
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') return null;
    const uid = getUid();
    if (!uid) return null;
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const { data: token } = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
    if (!token) return null;
    await supabase.from('profiles').update({ push_token: token }).eq('id', uid);
    return token;
  } catch (e) { return null; }
}

// key = clé de copy.push ; vars = variables du texte ; url = route ouverte au tap
export async function pushToPartner(key, vars = {}, url = '/activite') {
  try {
    const puid = getPartnerUid();
    if (!puid) return false;
    const { data: p } = await supabase.from('profiles').select('push_token').eq('id', puid).maybeSingle();
    if (!p?.push_token) return false;
    const body = fill(copy.push[key], { name: me.first_name, ...vars });
    await fetch(EXPO_PUSH, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ to: p.push_token, title: copy.push.title, body, sound: 'default', data: { url } }),
    });
    return true;
  } catch (e) { return false; }
}

// tap sur une notification → la route qu'elle transporte
export function listenNotificationTaps(open) {
  const sub = Notifications.addNotificationResponseReceivedListener(r => {
    const url = r.notification.request.content.data?.url;
    if (url) open(url);
  });
  return () => sub.remove();
}
