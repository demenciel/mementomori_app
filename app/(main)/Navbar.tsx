import React, { useEffect, useRef } from 'react';
import { IconButton, TouchableRipple } from 'react-native-paper';
import { Colors } from 'constants/Colors';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useRouter, useSegments } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { triggerManualNotification } from 'services/NotificationService';

const navbarRoutes = ['home', 'profile', 'settings'];

const Navbar = () => {
    const router = useRouter();
    const segments = useSegments();

    // Get the current folder name
    const currentFolder = segments[1] || 'root';

    const buttonWidth = Dimensions.get('window').width / 3;

    const indicatorAnim = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        let targetValue;
        switch (currentFolder) {
            case 'home':
                targetValue = buttonWidth;
                break;
            case 'profile':
                targetValue = buttonWidth * 2;
                break;
            case 'settings':
                targetValue = 0;
                break;
            default:
                targetValue = 0;
                break;
        }

        Animated.timing(indicatorAnim, {
            toValue: targetValue,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [currentFolder]);

    return (
        <View style={styles.navbar}>
            {navbarRoutes.includes(currentFolder) && (
                <Animated.View
                    style={[
                        styles.indicator,
                        {
                            transform: [{ translateX: indicatorAnim }],
                        },
                    ]}
                />
            )}<TouchableRipple
                style={styles.buttonContainer}
                rippleColor="rgba(186, 234, 122, 0.06)"
                onPress={() => {
                    router.push('/(main)/settings');
                }}
            >
                <Ionicons
                    name="settings-outline"
                    size={scale(25)}
                    color={
                        currentFolder === 'settings'
                            ? Colors.light.tabIconSelected
                            : Colors.light.tabIconDefault
                    }
                />
            </TouchableRipple>

            <TouchableRipple
                style={styles.buttonContainer}
                rippleColor="rgba(186, 234, 122, 0.06)"
                onPress={() => {
                    router.push('/(main)/home');
                }}
            >
                <IconButton
                    icon="sword-cross"
                    iconColor={currentFolder === 'home' ? Colors.light.tabIconSelected : Colors.light.tabIconDefault}
                    size={moderateScale(30)}
                />
            </TouchableRipple>
            <TouchableRipple
                style={styles.buttonContainer}
                rippleColor="rgba(186, 234, 122, 0.06)"
                onPress={() => {
                    router.push('/(main)/profile');
                }}
            >
                <Feather
                    name="user"
                    size={scale(25)}
                    color={
                        currentFolder === 'profile'
                            ? Colors.light.tabIconSelected
                            : Colors.light.tabIconDefault
                    }
                />
            </TouchableRipple>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        height: verticalScale(60),
        flexDirection: 'row',
        backgroundColor: Colors.light.background,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingBottom: verticalScale(10),
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center',
    },
    indicator: {
        position: 'absolute',
        top: 0,
        height: verticalScale(4),
        borderRadius: 10,
        width: Dimensions.get('window').width / 3,
        paddingHorizontal: scale(20),
        backgroundColor: Colors.light.tabIconSelected,
    },
});

export default Navbar;
