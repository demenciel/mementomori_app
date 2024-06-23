import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, Image, StyleSheet, TouchableWithoutFeedback, PanResponder } from 'react-native';
import { useDispatch } from 'react-redux';
import { Colors } from 'constants/Colors'; // Assuming you have a Colors file for your app
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useRouter } from 'expo-router';
import useKeyboard from 'hooks/useKeyboard';
import CustomTextInput from 'components/text/CustomTextInput';
import CustomPrimaryButton from 'components/buttons/CustomPrimaryButton';
import { useSnackbar } from 'context/SnackbarContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from 'constants/firebaseConfig';
import { doc, getDoc } from '@firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserProfile } from 'store/slices/userSlice';
import { login } from 'store/slices/authSlice';

const LoginScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const keyboard = useKeyboard();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const validateEmailFormat = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleFirebaseLogin = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('uid', user.uid);

                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    dispatch(setUserProfile({
                        id: user.uid,
                        name: userData.name,
                        email: userData.email,
                        dateOfBirth: new Date(userData.dateOfBirth).toISOString(),
                    }));
                    dispatch(login(token));
                    router.push({ pathname: '/(main)/home' });
                } else {
                    throw new Error('User document does not exist');
                }
            }
        } catch (error) {
            showSnackbar('Invalid email or password', 3000, 'red');
        } finally {
            setLoading(false);
        }
    }

    const handleNext = () => {
        if (!email || !password) {
            showSnackbar('Please fill in all fields', 3000, 'red');
            return;
        }
        if (!validateEmailFormat(email)) {
            showSnackbar('Invalid email format', 3000, 'red');
            return;
        }
        handleFirebaseLogin();
    }

    return (
        <>
            <View style={styles.container}>
                {
                    !keyboard && (
                        <View style={styles.header}>
                            <Text style={styles.title}>Welcome Back Warrior !</Text>
                        </View>
                    )
                }
                <View style={[styles.content, {
                    height: keyboard ? '100%' : '60%',
                }]}>
                    <Image
                        source={require('assets/images/home.png')}
                        style={styles.image}
                    />
                    <CustomTextInput
                        placeholder="Email"
                        inputValue={email}
                        setInputValue={setEmail}
                        inputConditions={(text) => text.length <= 50}
                        icon="mail"
                        isValid={validateEmailFormat(email)}
                    />
                    <CustomTextInput
                        placeholder="Password"
                        hidden={true}
                        inputValue={password}
                        setInputValue={setPassword}
                        inputConditions={(text) => text.length <= 50}
                        icon="lock"
                    />
                    <TouchableWithoutFeedback
                        onPress={() => router.push({
                            pathname: '/(auth)/PasswordRecovery',
                        })}
                    >
                        <Text
                            style={{
                                color: Colors.light.text,
                                fontFamily: 'Roboto-Regular',
                                fontSize: 16,
                                alignSelf: 'flex-end',
                            }}
                        >Forgot Password ?</Text>
                    </TouchableWithoutFeedback>
                </View>
                {
                    !keyboard && (
                        <View style={styles.bottomContainer}>
                            <CustomPrimaryButton
                                title="Next"
                                loading={loading}
                                disabled={loading}
                                onPress={handleNext}
                            />
                        </View>
                    )
                }
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
        width: moderateScale(200),
        height: verticalScale(200),
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
        position: 'absolute',
        bottom: moderateScale(40),
        width: '100%',
    },
});


export default LoginScreen;
