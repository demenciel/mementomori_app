import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from 'constants/firebaseConfig';
import CountdownCarousel from './CountDownCarousel';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { setTimeLeftRedux } from 'store/slices/userSlice';
import { IconButton } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { useRouter } from 'expo-router';

const MainPage: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state: any) => state.user.profile);
    const userTimeLeft = useSelector((state: any) => state.user.timeLeft);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [years, setYears] = useState<number>(0);
    const [seasons, setSeasons] = useState<number>(0);
    const [months, setMonths] = useState<number>(0);
    const [days, setDays] = useState<number>(0);
    const [yearsPassed, setYearsPassed] = useState<number>(0);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const docRef = doc(db, 'users', user.id);
                await getDoc(docRef).then((docSnap) => {

                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        const dateOfBirth = new Date(userData.dateOfBirth);
                        const estimatedDeathDate = new Date(dateOfBirth.setFullYear(dateOfBirth.getFullYear() + 80));
                        calculateYearsSeasonsMonths(estimatedDeathDate);
                        calculateTimeLeft(estimatedDeathDate);
                    }
                }).catch((error) => {
                    console.log('Error getting user profile:', error);
                });
            }
        };

        onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserData();
            } else {
                setLoading(false);
            }
        });
    }, []);

    const calculateTimeLeft = (endDate: Date) => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endDate.getTime() - now;

            const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365.25));
            const months = Math.floor((distance % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30));
            const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${years}y ${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`);
            setLoading(false);

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft('Time is up!');
            }
        }, 1000);
    };

    const setAsyncStorageData = async (data: any) => {
        await AsyncStorage.setItem('years', data.years.toString());
        await AsyncStorage.setItem('seasons', data.seasons.toString());
        await AsyncStorage.setItem('months', data.months.toString());
        await AsyncStorage.setItem('days', data.days.toString());
    }

    const calculateYearsSeasonsMonths = useCallback(async (endDate: Date) => {
        const now = new Date().getTime();
        const distance = endDate.getTime() - now;

        // Calculate total years left
        const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365.25));
        const remainingTimeAfterYears = distance % (1000 * 60 * 60 * 24 * 365.25);

        // Calculate total months left (considering the varying days in months)
        const months = Math.floor(remainingTimeAfterYears / (1000 * 60 * 60 * 24 * 30.44)); // Average days in a month (30.44)
        const remainingTimeAfterMonths = remainingTimeAfterYears % (1000 * 60 * 60 * 24 * 30.44);

        // Calculate total days left
        const days = Math.floor(remainingTimeAfterMonths / (1000 * 60 * 60 * 24));

        // Calculate total seasons left
        const totalSeasons = Math.floor((years * 12 + months) / 3);

        // Calculate days left considering exact days in each month
        const startDate = new Date();
        const endDateDate = new Date(endDate);
        let daysExact = 0;
        for (let d = new Date(startDate); d <= endDateDate; d.setDate(d.getDate() + 1)) {
            daysExact++;
        }

        setYearsPassed(80 - years);
        setDays(daysExact);
        setYears(years);
        setSeasons(totalSeasons);
        setMonths(years * 12 + months);
        dispatch(setTimeLeftRedux({
            years: years,
            seasons: totalSeasons,
            months: years * 12 + months,
            days: daysExact,
            yearsPassed: 80 - years,
            timeLeft: `${years} years, ${months} months, ${days} days`,
        }));
        setAsyncStorageData({
            years: years,
            seasons: totalSeasons,
            months: years * 12 + months,
            days: daysExact,
        });
    }, [userTimeLeft]);

    const handleCalendarNavigation = () => {
        router.push({
            pathname: '/(main)/home/MementoMoriCalendar'
        });
    };

    return (
        <View style={styles.container}>
            <IconButton
                rippleColor='rgba(10, 126, 164, 0.3)'
                style={styles.calendarIcon}
                icon="calendar-month-outline"
                iconColor={Colors.light.tabIconSelected}
                size={moderateScale(30)}
                onPress={() => {
                    // Navigate to the calendar page
                    handleCalendarNavigation();
                }}
            />
            <CountdownCarousel
                timeLeft={{
                    years: years,
                    seasons: seasons,
                    months: months,
                    timeLeft: timeLeft,
                    days: days,
                }}
            />
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
    },
    calendarIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
        borderWidth: 1,
        borderColor: Colors.light.tabIconSelected,
    },
    gradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 20,
        color: Colors.light.text,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Roboto-Bold',
        color: Colors.light.text,
        marginBottom: 20,
    },
    countdown: {
        fontSize: 40,
        fontFamily: 'Roboto-Bold',
        color: Colors.light.tabIconSelected,
    },
});

export default MainPage;
