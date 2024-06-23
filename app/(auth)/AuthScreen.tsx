import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, Image, StyleSheet, TouchableWithoutFeedback, PanResponder } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Colors } from 'constants/Colors'; // Assuming you have a Colors file for your app
import { useNavigation } from '@react-navigation/native'; // Assuming you're using React Navigation
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import useKeyboard from 'hooks/useKeyboard';
import CustomTextInput from 'components/text/CustomTextInput';
import CustomPrimaryButton from 'components/buttons/CustomPrimaryButton';
import { useSnackbar } from 'context/SnackbarContext';
import CustomOutlineButton from 'components/buttons/CustomOutlineButton';

const AuthScreen: React.FC = () => {
    const { showSnackbar } = useSnackbar();
    const router = useRouter();
    const keyboard = useKeyboard();

    const handleSignup = () => {
        router.push('(auth)/SignupScreen')
    };

    const handleLogin = () => {
        router.push('(auth)/LoginScreen')
    };


    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome Warrior !</Text>
                </View>
                <Image
                    source={require('assets/images/samurai.png')}
                    style={styles.image}
                />
                <View style={styles.bottomContainer}>
                    <CustomPrimaryButton
                        title="Sign Up"
                        onPress={handleSignup}

                    />
                    <CustomOutlineButton
                        title="Sign In"
                        onPress={handleLogin}
                    />
                </View>
            </View>
        </>
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
    image: {
        width: moderateScale(300),
        height: verticalScale(300),
        marginBottom: verticalScale(80),
    },
    header: {
        marginBottom: moderateScale(20),
        // top right
        position: 'absolute',
        top: moderateScale(60),
        left: moderateScale(20),
    },
    title: {
        fontSize: 28,
        fontFamily: 'Roboto-Bold',
        color: Colors.light.text,
    },
    content: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomContainer: {
        width: '100%',
        position: 'absolute',
        height: (verticalScale(120)),
        bottom: moderateScale(40),
        justifyContent: 'space-between',
    },
});


export default AuthScreen;
