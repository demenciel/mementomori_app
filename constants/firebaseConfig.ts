import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJep5q7s_bsnlP9yRfU5TqT3lZ77_Flls" || process.env.EXPO_FIREBASE_API_KEY,
    authDomain: "mementomori-babc5.firebaseapp.com" || process.env.EXPO_FIREBASE_AUTH_DOMAIN,
    projectId: "mementomori-babc5" || process.env.EXPO_FIREBASE_PROJECT_ID,
    storageBucket: "mementomori-babc5.appspot.com" || process.env.EXPO_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: "322951360709" || process.env.EXPO_FIREBASE_MESSAGING_SENDER_ID,
    appId: "1:322951360709:web:d90c355f5d492a6c9480ac" || process.env.EXPO_FIREBASE_APP_ID,
    measurementId: "G-S0H8KJ306L" || process.env.EXPO_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);


// initialize auth

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
