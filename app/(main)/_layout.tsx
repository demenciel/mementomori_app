// app/(main)/_layout.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'constants/Colors';
import Navbar from './Navbar';
import { cancelAllNotifications, getNotificationPermissions, scheduleDailyNotification, scheduleMultipleNotifications } from 'services/NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColor } from 'hooks/useThemeColor';
import { useTheme } from 'context/ThemeContext';
import { setUserProfile } from 'store/slices/userSlice';
import { doc, getDoc } from '@firebase/firestore';
import { db } from 'constants/firebaseConfig';
import { useDispatch } from 'react-redux';
import useKeyboard from 'hooks/useKeyboard';

const MainLayout: React.FC = () => {
  const router = useRouter();
  const keyboard = useKeyboard();
  const { theme } = useTheme();
  const themeColors = theme === 'dark' ? Colors.light : Colors.dark;

  useEffect(() => {
    const loadSettings = async () => {
      const enabled = await AsyncStorage.getItem('notificationsEnabled');
      const time = await AsyncStorage.getItem('notificationTime');
      const storedFrequency = await AsyncStorage.getItem('notificationFrequency');
      const timeLeft = await AsyncStorage.getItem('timeLeft');
      const notificationKeys = await AsyncStorage.getAllKeys();
      const notificationIds = notificationKeys.filter(key => key.startsWith('notificationId_'));

      // If notifications are already set, do not set new ones

      if (notificationIds.length > 0) {
        console.log(notificationIds);
        return;
      }

      const notificationTime = time ? new Date(time) : new Date();
      const frequency = storedFrequency ? parseInt(storedFrequency) : 1;
      const timeLeftFormat = timeLeft || 'years-left';

      if (enabled === 'true') {
        await cancelAllNotifications();
        await scheduleMultipleNotifications(notificationTime, frequency, timeLeftFormat);
      } else {
        const status = await getNotificationPermissions();
        if (status === 'granted') {
          await cancelAllNotifications();
          await scheduleMultipleNotifications(notificationTime, frequency, timeLeftFormat);
        }
      }
    };

    loadSettings();
  }, []);

  return (
    <>
      <SafeAreaView edges={['top', 'right', 'left']} style={[styles.container]}>
        <View style={styles.contentContainer}>
          <Slot />
        </View>
      </SafeAreaView>
      {
        !keyboard && (
          <Navbar />
        )
      }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default MainLayout;