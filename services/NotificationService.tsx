import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { quotes } from 'constants/Quotes';

export const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status;
};

export const getNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
}

export const triggerManualNotification = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Remember, Memento Mori",
            body: "A gentle reminder to reflect on life and its impermanence.",
        },
        trigger: null,
    });
}

export const scheduleDailyNotification = async (triggerTime: Date) => {
    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title: "Remember, Memento Mori",
            body: "A gentle reminder to reflect on life and its impermanence.",
        },
        trigger: {
            hour: Number(triggerTime?.getHours()),
            minute: Number(triggerTime?.getMinutes()),
            repeats: true,
        },
    });

    await AsyncStorage.setItem('notificationId', notificationId);
};

export const getTimeLeftFromFormat = async (timeLeftFormat: string): Promise<String> => {
    let time: string | null;
    switch (timeLeftFormat) {
        case 'years-left':
            time = await AsyncStorage.getItem('years');
            return `${time} years`;
        case 'seasons-left':
            time = await AsyncStorage.getItem('seasons');
            return `${time} seasons`;
        case 'months-left':
            time = await AsyncStorage.getItem('months');
            return `${time} months`;
        case 'days-left':
            time = await AsyncStorage.getItem('days');
            return `${time} days`;
        default:
            time = await AsyncStorage.getItem('years');
            return `${time} years`;
    }
};

const MIN_HOUR = 4; // 4 AM
const MAX_HOUR = 23;

export const scheduleMultipleNotifications = async (triggerTime: Date, frequency: number, timeLeftFormat: string) => {
    const interval = (MAX_HOUR - MIN_HOUR) / frequency; // Calculate the interval in hours
    const timeLeft = await getTimeLeftFromFormat(timeLeftFormat);
    const timeLeftString = timeLeft.toString();
    for (let i = 0; i < frequency; i++) {
        const notificationTime = new Date(triggerTime);
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        notificationTime.setHours(triggerTime.getHours() + i * interval);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `Remember, Memento Mori. ${timeLeftString} left.`,
                body: `${randomQuote.text} - ${randomQuote.author}`,
            },
            trigger: {
                hour: notificationTime.getHours(),
                minute: notificationTime.getMinutes(),
                repeats: true,
            },
        }).then(async (notificationId) => {
            await AsyncStorage.setItem(`notificationId_${i}`, notificationId);
        }).catch((error) => {
            console.log(error);
        });
    }
};

export const cancelAllNotifications = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const notificationKeys = keys.filter(key => key.startsWith('notificationId_'));

    for (const key of notificationKeys) {
        const notificationId = await AsyncStorage.getItem(key);
        if (notificationId) {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
            // Remove the notificationId from storage
            await AsyncStorage.removeItem(key);
        }
    }
};

export const cancelDailyNotification = async () => {
    const notificationId = await AsyncStorage.getItem('notificationId');
    if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        await AsyncStorage.removeItem('notificationId');
        await AsyncStorage.removeItem('notificationsEnabled');
        await AsyncStorage.removeItem('notificationTime');
    }
};

// Set notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});