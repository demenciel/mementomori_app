// app/(main)/swiper/index.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomOutlineButton from 'components/buttons/CustomOutlineButton';
import CustomPrimaryButton from 'components/buttons/CustomPrimaryButton';
import RedirectButton from 'components/buttons/RedirectButton';
import { Colors } from 'constants/Colors';
import { auth } from 'constants/firebaseConfig';
import { useSnackbar } from 'context/SnackbarContext';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import { useDispatch } from 'react-redux';
import { logout } from 'store/slices/authSlice';

const SettingsScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();
    const router = useRouter();


    const handleLogout = () => {
        signOut(auth).then(() => {
            dispatch(logout());
            router.replace('(auth)/');
        }).catch((error) => {
            showSnackbar(
                'Something went wrong. Please try again.',
                3000,
                'red'
            );
            console.log(error);
        })
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Settings
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.subtitle}>
                    Notifications
                </Text>
                <RedirectButton
                    title='Push Notifications'
                    icon='bell'
                    onPress={() => {
                        router.push('(main)/settings/NotificationSettings');
                    }}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.subtitle}>
                    Account
                </Text>
                <RedirectButton
                    title='Logout'
                    icon='log-out'
                    onPress={() => {
                        handleLogout();
                    }}
                />
                <RedirectButton
                    title='Delete'
                    icon='trash'
                    onPress={() => {
                        router.push('(main)/settings/DeleteAccountScreen');
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingVertical: verticalScale(20),
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        height: verticalScale(50),
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.tabIconDefault,
    },
    section: {
        width: '100%',
        paddingVertical: verticalScale(10),
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Roboto-Bold',
    },
    subtitle: {
        fontSize: 20,
        width: '100%',
        textAlign: 'left',
        fontFamily: 'Roboto-Bold',
        marginVertical: verticalScale(10),
    },
});

export default SettingsScreen;
