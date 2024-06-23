// app/(main)/swiper/index.tsx
import CustomOutlineButton from 'components/buttons/CustomOutlineButton';
import CustomPrimaryButton from 'components/buttons/CustomPrimaryButton';
import RedirectButton from 'components/buttons/RedirectButton';
import { auth } from 'constants/firebaseConfig';
import { useSnackbar } from 'context/SnackbarContext';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
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
            <RedirectButton
                title='Notifications'
                icon='bell'
                onPress={() => {
                    router.push('(main)/settings/NotificationSettings');
                }}
            />
            <RedirectButton
                title='Logout'
                icon='log-out'
                onPress={() => {
                    handleLogout();
                }}
            />
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
    }
});

export default SettingsScreen;
