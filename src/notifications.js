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
