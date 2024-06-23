// app/(main)/_layout.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'constants/Colors';

const AuthLayout: React.FC = () => {
    return (
        <>
            <SafeAreaView edges={['top', 'right', 'left']} style={styles.container}>
                <View style={styles.contentContainer}>
                    <Slot />
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        position: 'relative',
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    navbarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default AuthLayout;