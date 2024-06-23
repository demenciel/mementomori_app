import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleDailyNotification, cancelDailyNotification, scheduleMultipleNotifications, cancelAllNotifications } from 'services/NotificationService';
import { Colors } from 'constants/Colors';
import TopBar from '../TopBar';
import CustomPrimaryButton from 'components/buttons/CustomPrimaryButton';
import SwitchNotifiction from './SwitchNotifiction';
import { scale, verticalScale } from 'react-native-size-matters';
import CustomOutlineButton from 'components/buttons/CustomOutlineButton';
import CustomPicker from 'components/CustomPicker';
import { useSnackbar } from 'context/SnackbarContext';
/* import {
    BannerAd,
    BannerAdSize,
    TestIds,
} from 'react-native-google-mobile-ads'; */

const NotificationSettings: React.FC = () => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [triggerTime, setTriggerTime] = useState<Date>(new Date());
    const [frequency, setFrequency] = useState<number>(1);
    const [timeLeft, setTimeLeft] = useState<string>('years-left');

    /* const adUnitBannerId = __DEV__
        ? TestIds.BANNER
        : process.env.EXPO_PUBLIC_ADMOB_ANDROID_PROFILE_BANNER_ID */


    useEffect(() => {
        const loadSettings = async () => {
            const enabled = await AsyncStorage.getItem('notificationsEnabled');
            const time = await AsyncStorage.getItem('notificationTime');
            const storedFrequency = await AsyncStorage.getItem('notificationFrequency');
            const timeLeft = await AsyncStorage.getItem('timeLeft');
            if (enabled !== null) {
                setNotificationsEnabled(enabled === 'true');
            }
            if (time !== null) {
                setTriggerTime(new Date(time));
            }
            if (storedFrequency !== null) {
                setFrequency(parseInt(storedFrequency));
            }
            if (timeLeft !== null) {
                setTimeLeft(timeLeft);
            }
        };
        loadSettings();
    }, []);

    const handleSaveSettings = async () => {
        await AsyncStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
        await AsyncStorage.setItem('notificationTime', triggerTime.toISOString());
        await AsyncStorage.setItem('notificationFrequency', frequency.toString());
        await AsyncStorage.setItem('timeLeft', timeLeft);

        if (notificationsEnabled) {
            await cancelAllNotifications();
            await scheduleMultipleNotifications(triggerTime, frequency, timeLeft);
        } else {
            await cancelAllNotifications();
        }

        showSnackbar('Settings saved', 1000, 'green');
        setOpen(false);
    };

    const handleToggleSwitch = () => {
        if (notificationsEnabled) {
            setNotificationsEnabled(false);
            setOpen(false);
        } else {
            setNotificationsEnabled(true);
            setOpen(true);
        }
    };

    const handleTimeChange = (event: any, selectedDate: Date | undefined) => {
        if (event.type === 'dismissed') {
            setOpen(false);
        } else {
            const currentDate = selectedDate || triggerTime;
            setTriggerTime(currentDate);
            setOpen(false);
        }
    };

    return (
        <>
            <TopBar onPress={() => {
                handleSaveSettings();
                router.back();
            }} title="Notification Settings" />
            <View style={styles.container}>
                <View style={styles.notificationsContainer}>
                    <SwitchNotifiction
                        onPress={handleToggleSwitch}
                        value={notificationsEnabled}
                        text="Enable Notifications"
                    />
                    <CustomOutlineButton
                        title="Set Notification Time"
                        icon='clock'
                        iconStyle={{ color: Colors.light.tabIconSelected }}
                        textStyle={{ color: Colors.light.text }}
                        disabled={!notificationsEnabled}
                        iconSide='right'
                        onPress={() => setOpen(true)}
                        style={{ paddingHorizontal: scale(5), paddingVertical: verticalScale(20), justifyContent: 'space-between' }}
                    />
                    <CustomPicker
                        selectedValue={frequency.toString()}
                        onValueChange={(value) => setFrequency(parseInt(value))}
                        options={[
                            { label: 'Once Daily', value: '1' },
                            { label: 'Every hour', value: '20' },
                            { label: 'Every 2 hours', value: '10' },
                            { label: 'Every 4 hours', value: '5' },
                            { label: 'Every 8 hours', value: '2' },
                        ]}
                        label="Frequency"
                    />
                    <CustomPicker
                        selectedValue={timeLeft.toString()}
                        onValueChange={(value) => setTimeLeft(value)}
                        options={[
                            { label: 'Years left', value: 'years-left' },
                            { label: 'Seasons left', value: 'seasons-left' },
                            { label: 'Months left', value: 'months-left' },
                            { label: 'Days left', value: 'days-left' },
                        ]}
                        label="Time Left Format"
                    />
                </View>
                <View style={styles.bottomContainer}>
                    <CustomPrimaryButton
                        title="Save"
                        onPress={() => {
                            handleSaveSettings();
                            setTimeout(() => {
                                router.back();
                            }, 400);
                        }}
                    />
                </View>
                {/*  <View style={styles.bannerAd}>
                    <BannerAd
                        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                        unitId={adUnitBannerId}
                        onAdLoaded={() => {
                            console.log('Advert loaded');
                        }}
                        onAdFailedToLoad={error => {
                            console.error('Advert failed to load: ', error);
                        }}
                    />
                </View> */}
            </View>
            {open && (
                <View style={styles.setting}>
                    <DateTimePicker
                        value={triggerTime}
                        mode="time"
                        display="default"

                        style={{
                            backgroundColor: Colors.light.background,
                        }}
                        onChange={handleTimeChange}
                    />
                </View>
            )}

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: verticalScale(20),
        backgroundColor: Colors.light.background,
    },
    notificationsContainer: {
        marginBottom: verticalScale(20),
        width: '100%',
        height: '100%',
    },
    bottomContainer: {
        width: '100%',
        position: 'absolute',
        justifyContent: 'center',
        bottom: verticalScale(140),
    },
    setting: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    bannerAd: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        // make sticky
        position: 'absolute',
        bottom: 0,
    },
});

export default NotificationSettings;
