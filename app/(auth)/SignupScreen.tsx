// app/(auth)/signup/UserDetailsForm.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from 'constants/Colors';
import CustomTextInput from 'components/text/CustomTextInput';
import { moderateScale } from 'react-native-size-matters';
import useKeyboard from 'hooks/useKeyboard';
import CalendarPicker from 'components/CalendarPicker';
import { useSnackbar } from 'context/SnackbarContext';
import { useDispatch, useSelector } from 'react-redux';
import CustomPrimaryButton from 'components/buttons/CustomPrimaryButton';
import { auth, db } from 'constants/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from '@firebase/firestore';
import { login } from 'store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserProfile } from 'store/slices/userSlice';

const SignupScreen: React.FC = () => {
    const { showSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [dateOfBirth, setDateOfBirth] = useState<Date | string>('');
    const keyboard = useKeyboard();
    const router = useRouter();

    useEffect(() => {
        if (!keyboard) {
            Keyboard.dismiss();
        }
    }, [dateOfBirth]);

    const validateEmailFormat = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const validatePassword = (password: string) => {
        // make sure password is at least 8 characters long and contains at least one number
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    const handleSignupFirebase = async () => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            if (user) {
                await setDoc(doc(db, 'users', user.uid), {
                    name,
                    email,
                    dateOfBirth: dateOfBirth?.toString(),
                    createdAt: new Date().toString(),
                });

                const token = await user.getIdToken();
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('uid', user.uid);

                dispatch(setUserProfile({
                    id: user.uid,
                    name,
                    email,
                    dateOfBirth: new Date(dateOfBirth).toISOString(),
                }));
                dispatch(login(token));
                router.replace('/(main)/home');
            }
        } catch (error) {
            // error message from Firebase
            const errorMessage = error.message;
            if (errorMessage) {
                errorMessage.includes('email-already-in-use') && showSnackbar('Email already in use.', 3000, 'red');
                errorMessage.includes('weak-password') && showSnackbar('Password is too weak.', 3000, 'red');
            } else {
                showSnackbar('An error occurred. Please try again.', 3000, 'red');
            }
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    const handleNext = () => {
        if (!name || !email || !dateOfBirth) {
            showSnackbar('Please fill in all fields', 3000, 'red');
            return;
        }
        if (!validateEmailFormat(email)) {
            showSnackbar('Invalid email format', 3000, 'red');
            return;
        }
        if (!validatePassword(password)) {
            showSnackbar('Password must be at least 8 characters long and contain at least one number', 3000, 'red');
            return;
        }
        handleSignupFirebase();
    };

    return (
        <>
            <View style={styles.container}>
                {
                    !keyboard && (
                        <View style={styles.header}>
                            <Text style={styles.title}>Warrior Details</Text>
                        </View>
                    )
                }
                <View style={[styles.content, {
                    height: keyboard ? '100%' : '55%',
                }]}>
                    <CustomTextInput
                        placeholder="Name"
                        inputValue={name}
                        setInputValue={setName}
                        inputConditions={(text) => text.length <= 20}
                        icon="user"
                        isValid={name.length > 0}
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
                        isValid={validatePassword(password)}
                    />
                    <CalendarPicker
                        selectedDate={dateOfBirth}
                        onChange={setDateOfBirth}
                        minimumAge={18}
                    />
                </View>
                {
                    !keyboard && (
                        <View style={styles.bottomContainer}>
                            <CustomPrimaryButton
                                title="Next"
                                onPress={() => {
                                    handleNext();
                                }}
                                loading={loading}
                                disabled={loading}
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

export default SignupScreen;
