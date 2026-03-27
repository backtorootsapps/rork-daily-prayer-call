import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    console.log('[Notifications] Web platform - skipping permissions');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('[Notifications] Permission not granted');
    return false;
  }

  console.log('[Notifications] Permission granted');
  return true;
}

export async function scheduleDailyPrayerReminder(
  prayerTime: string,
  userName: string
): Promise<string | null> {
  if (Platform.OS === 'web') {
    console.log('[Notifications] Web platform - skipping scheduling');
    return null;
  }

  try {
    await cancelAllPrayerReminders();

    const [hours, minutes] = prayerTime.split(':').map(Number);

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🙏 Daily Prayer Call',
        body: `${userName}, your moment with God is here. Answer the call.`,
        sound: true,
        data: { type: 'prayer_reminder' },
        categoryIdentifier: 'prayer_call',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
    });

    console.log(`[Notifications] Scheduled daily reminder at ${hours}:${minutes}, id: ${identifier}`);
    return identifier;
  } catch (error) {
    console.error('[Notifications] Error scheduling notification:', error);
    return null;
  }
}

export async function cancelAllPrayerReminders(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[Notifications] Cancelled all scheduled notifications');
  } catch (error) {
    console.error('[Notifications] Error cancelling notifications:', error);
  }
}

export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  if (Platform.OS === 'web') {
    return [];
  }

  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('[Notifications] Scheduled notifications:', notifications.length);
    return notifications;
  } catch (error) {
    console.error('[Notifications] Error getting scheduled notifications:', error);
    return [];
  }
}
