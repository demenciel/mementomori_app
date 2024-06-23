import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from 'constants/firebaseConfig';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from 'constants/Colors';
import { useSnackbar } from 'context/SnackbarContext';
import { IconButton } from 'react-native-paper';
import CustomTextInput from 'components/text/CustomTextInput';
import CustomPrimaryButton from 'components/buttons/CustomPrimaryButton';
import { router } from 'expo-router';
import useKeyboard from 'hooks/useKeyboard';

const PasswordRecovery: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const keyboard = useKeyboard();
    const { showSnackbar } = useSnackbar();

    const handlePasswordReset = () => {
        if (email === '') {
            showSnackbar('Please enter your email', 3000, 'red');
            return;
        }

        setLoading(true);
        sendPasswordResetEmail(auth, email)
            .then(() => {
                showSnackbar('Password reset email sent', 3000, 'green');
            })
            .catch((error) => {
                console.log(error);
                showSnackbar('Error sending password reset email', 3000, 'red');
            }).finally(() => {
                setLoading(false);
            });
    };

    return (
        <View style={styles.container}>
            <IconButton
                icon="chevron-left"
                style={styles.backButton}
                iconColor={Colors.light.text}
                size={moderateScale(32)}
                onPress={() => {
                    router.push('/(auth)/LoginScreen');
                }}
            />
            <Text style={styles.title}>Password Recovery</Text>
            <CustomTextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {
                !keyboard && (
                    <CustomPrimaryButton
                        title="Send Email"
                        style={styles.button}
                        onPress={handlePasswordReset}
                        loading={loading}
                    />
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        padding: moderateScale(20),
    },
    backButton: {
        position: 'absolute',
        top: verticalScale(20),
        left: scale(10),
    },
    title: {
        fontSize: moderateScale(24),
        fontFamily: 'Roboto-Bold',
        color: Colors.light.text,
        marginBottom: moderateScale(20),
    },
    input: {
        width: '100%',
        padding: moderateScale(10),
        borderWidth: 1,
        borderColor: Colors.light.tabIconDefault,
        borderRadius: moderateScale(8),
        backgroundColor: Colors.light.background,
        marginBottom: moderateScale(20),
        fontSize: moderateScale(16),
        color: Colors.light.text,
    },
    button: {
        marginTop: moderateScale(20),
    },
    buttonText: {
        fontSize: moderateScale(16),
        color: Colors.light.background,
        fontFamily: 'Roboto-Bold',
    },
});

export default PasswordRecovery;
