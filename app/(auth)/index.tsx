import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, Image, StyleSheet, TouchableWithoutFeedback, PanResponder } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Colors } from 'constants/Colors'; // Assuming you have a Colors file for your app
import { useNavigation } from '@react-navigation/native'; // Assuming you're using React Navigation
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AuthLayout from './_layout';

const HomeScreen: React.FC = () => {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: slideAnim }], { useNativeDriver: false }),
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dx > Dimensions.get('window').width / 2) {
                    Animated.timing(slideAnim, {
                        toValue: Dimensions.get('window').width,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        router.push('/(auth)/AuthScreen');
                    });
                } else {
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const textOpacity = slideAnim.interpolate({
        inputRange: [0, Dimensions.get('window').width / 2],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: Dimensions.get('window').width - moderateScale(60) - moderateScale(50),
            duration: 1000,
            useNativeDriver: true,
        }).start();
        // after the animation is done, reset the value to 0
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
        }).start();

        return () => {
            slideAnim.setValue(0);
        };
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require('assets/images/home.png')}
                style={styles.image}
            />
            <Text style={styles.title}>Reflect</Text>
            <Text style={styles.subtitle}>Live with purpose</Text>
            <View style={styles.slideContainer}>

                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.authButton,
                        {
                            transform: [{ translateX: slideAnim }],
                        },
                    ]}
                >

                    <Entypo
                        name="chevron-right"
                        size={24}
                        color={Colors.light.background}
                    />
                </Animated.View>
                <Animated.Text style={[styles.slideText, { opacity: textOpacity }]}>
                    Slide to Start
                </Animated.Text>
            </View>
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
    image: {
        width: moderateScale(200),
        height: verticalScale(200),
        marginBottom: verticalScale(20),
    },
    title: {
        fontSize: 40,
        fontFamily: 'Roboto-Bold',
        letterSpacing: 2,
        color: Colors.light.text,
        marginTop: verticalScale(20),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        width: '80%',
        color: '#888',
        marginTop: verticalScale(10),
        textAlign: 'center',
    },
    slideContainer: {
        width: Dimensions.get('window').width - moderateScale(60),
        height: moderateScale(50),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ddd',
        borderRadius: moderateScale(10),
        overflow: 'hidden',
        position: 'absolute',
        bottom: verticalScale(40),
        elevation: 3,
    },
    authButton: {
        width: moderateScale(50),
        height: moderateScale(50),
        backgroundColor: Colors.light.tabIconSelected,
        borderRadius: moderateScale(10),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    slideText: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        textTransform: 'uppercase',
        letterSpacing: 1.1,
        color: Colors.light.tabIconSelected,
        marginRight: scale(12),
    },
});

export default HomeScreen;
