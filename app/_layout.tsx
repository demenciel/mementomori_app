import React, { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { Provider as PaperProvider, ThemeProvider } from 'react-native-paper'; // Import PaperProvider

import store from 'store';
import { SnackbarProvider, useSnackbar } from 'context/SnackbarContext';
import { login, logout } from 'store/slices/authSlice';
import { requestNotificationPermissions } from 'services/NotificationService';
import { Colors } from 'constants/Colors';
import { doc, getDoc } from '@firebase/firestore';
import { db } from 'constants/firebaseConfig';
import { setUserProfile } from 'store/slices/userSlice';

const fetchFonts = () => {
  return Font.loadAsync({
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
  });
};

const AppLayout = () => {
  const router = useRouter();
  const dispatch = store.dispatch;
  const [fontLoaded, setFontLoaded] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const loadFontsAndCheckToken = async () => {
      await fetchFonts();
      setFontLoaded(true);

      const setUser = async () => {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUid = await AsyncStorage.getItem('uid');

        if (!storedToken || !storedUid) {
          dispatch(logout());
          router.push({ pathname: '/(auth)' });
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, 'users', storedUid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            dispatch(setUserProfile({
              id: storedUid,
              name: userData.name,
              email: userData.email,
              dateOfBirth: new Date(userData.dateOfBirth).toISOString(),
            }));
            dispatch(login(storedToken));
            router.replace('(main)/home');
          } else {
            throw new Error('User document does not exist');
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
          dispatch(logout());
          router.replace('(auth)');
        }
      }

      setUser();
      requestNotificationPermissions();
    };

    loadFontsAndCheckToken();
  }, [dispatch, router]);

  if (!fontLoaded) {
    return null;
  }

  return (
    <Stack
      // hide the header
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

I18nManager.forceRTL(false);
export default function Layout() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <PaperProvider>
          <SnackbarProvider>
            <AppLayout />
          </SnackbarProvider>
        </PaperProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
