// app/(main)/swiper/index.tsx
import { doc, setDoc } from '@firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarPicker from 'components/CalendarPicker';
import CustomPrimaryButton from 'components/buttons/CustomPrimaryButton';
import CustomTextInput from 'components/text/CustomTextInput';
import { db } from 'constants/firebaseConfig';
import { useSnackbar } from 'context/SnackbarContext';
import useKeyboard from 'hooks/useKeyboard';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { verticalScale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile } from 'store/slices/userSlice';

const ProfileScreen: React.FC = () => {
    const dispatch = useDispatch();
    const { showSnackbar } = useSnackbar();
    const keyboard = useKeyboard();
    const user = useSelector((state: any) => state.user.profile);
    const token = useSelector((state: any) => state.auth.token);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [name, setName] = React.useState<string>(user?.name);
    const [email, setEmail] = React.useState<string>(user?.email);
    const [password, setPassword] = React.useState<string>('');
    const [dateOfBirth, setDateOfBirth] = React.useState<string | Date>(new Date(user?.dateOfBirth));


    const validateEmailFormat = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const uid = await AsyncStorage.getItem('uid');
            if (!token || !uid) {
                throw new Error('Token or uid not found');
            }
            await setDoc(doc(db, 'users', uid), {
                name,
                email,
                dateOfBirth: dateOfBirth.toString(),
                createdAt: new Date().toISOString(),
            });
            dispatch(setUserProfile({
                id: uid,
                name,
                email,
                dateOfBirth: dateOfBirth.toString(),
            }));
            showSnackbar('Profile updated successfully', 3000, 'green');
        } catch (error) {
            console.log(error);
            showSnackbar('Error updating profile', 3000, 'red');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>

            <View style={styles.basicInformation}>
                <Avatar.Image size={160} source={
                    user?.profileImage
                        ? { uri: user.profileImage }
                        : require('assets/images/home.png')
                }
                    style={{ backgroundColor: 'transparent' }}
                />
            </View>
            <View style={[styles.userInfoContainer, {
                justifyContent: keyboard ? 'center' : 'flex-start'
            }]}>
                <CustomTextInput
                    placeholder="Name"
                    inputValue={name}
                    setInputValue={setName}
                    style={{ marginBottom: verticalScale(20) }}
                    inputConditions={(text) => text.length <= 20}
                    icon="user"
                    isValid={name?.length > 0}
                />
                <CustomTextInput
                    placeholder="Email"
                    inputValue={email}
                    setInputValue={setEmail}
                    style={{ marginBottom: verticalScale(20) }}
                    inputConditions={(text) => text.length <= 50}
                    icon="mail"
                    isValid={validateEmailFormat(email)}
                />
                <CalendarPicker
                    selectedDate={dateOfBirth}
                    onChange={setDateOfBirth}
                    minimumAge={18}
                />
            </View>
            {
                !keyboard && (
                    <CustomPrimaryButton
                        title="Save"
                        loading={loading}
                        disabled={loading}
                        onPress={() => {
                            handleUpdateProfile();
                        }}
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
        paddingBottom: verticalScale(20)
    },
    basicInformation: {
        alignItems: 'center',
        marginBottom: 20
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10
    },
    userInfoContainer: {
        flex: 1,
        width: '100%',
    }

});

export default ProfileScreen;
