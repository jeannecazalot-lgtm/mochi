// ═══════════════════════════════════════════════════════════════════
// Rappels locaux (expo-notifications) — SDK 57.
// Permission demandée AU MOMENT UTILE (écran 08, heure de rappel),
// jamais au lancement. Phrase d'usage dans app.json.
// ═══════════════════════════════════════════════════════════════════
import * as Notifications from 'expo-notifications';

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
