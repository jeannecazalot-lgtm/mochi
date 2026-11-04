// ═══════════════════════════════════════════════════════════════════
// Rappels locaux (expo-notifications) — SDK 57.
// Permission demandée AU MOMENT UTILE (écran 08, heure de rappel),
// jamais au lancement. Phrase d'usage dans app.json.
// ═══════════════════════════════════════════════════════════════════
import * as Notifications from 'expo-notifications';
import copy from './data/copy.json';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

export async function askNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true, allowBadge: false } });
  return status === 'granted';
}

export function scheduleAt(date, { title, body, data }) {
  return Notifications.scheduleNotificationAsync({
    content: { title, body, data },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
  });
}

export const cancelAll = () => Notifications.cancelAllScheduledNotificationsAsync();

// Les notifications déjà affichées des jours précédents (récap d'hier, pings d'avant-hier…)
// s'effacent du centre de notifications à l'ouverture de l'app et au changement de jour
// (demande Jeanne, 15 sept 2026). Celles d'aujourd'hui restent.
export async function clearOldNotifications() {
  try {
    const shown = await Notifications.getPresentedNotificationsAsync();
    const midnight = new Date(); midnight.setHours(0, 0, 0, 0);
    for (const n of shown) {
      const raw = Number(n.date) || 0;
      const ts = raw > 1e12 ? raw : raw * 1000; // iOS livre des secondes, Android des millisecondes
      if (ts < midnight.getTime()) await Notifications.dismissNotificationAsync(n.request.identifier);
    }
  } catch (e) { /* pas de permission ou plateforme sans centre de notifications */ }
}

// Mochi qu'on élève (4 nov 2026) : au départ en balade, une notification locale à l'heure du retour
// (seulement si la permission a déjà été donnée au 08 — jamais de demande ici). Reprogrammée par
// rescheduleReminders (qui annule tout) tant que Mochi est dehors.
const WALK_ID = 'mochi-walk-return';
export async function scheduleMochiReturn(date) {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted' || !(date instanceof Date) || date <= new Date()) return false;
    await Notifications.cancelScheduledNotificationAsync(WALK_ID).catch(() => {});
    const t = copy.mochiNotifs;
    await Notifications.scheduleNotificationAsync({
      identifier: WALK_ID,
      content: { title: t.walkReturnTitle, body: t.walkReturnBody, data: { mochi: 'walk_return' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
    });
    return true;
  } catch (e) { return false; }
}
