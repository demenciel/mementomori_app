// app/(main)/swiper/index.tsx
import Entypo from '@expo/vector-icons/FontAwesome';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from 'constants/Colors';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton, TouchableRipple } from 'react-native-paper';
import { scale, verticalScale } from 'react-native-size-matters';
import { useRouter, useSegments } from 'expo-router';

interface TopBarProps {
    title: string;
    onPress?: () => void;
}


const TopBar: React.FC<TopBarProps> = ({ title, onPress }) => {
    const router = useRouter();
    const segments = useSegments();

    return (
        <View style={styles.container}>
            <IconButton
                style={styles.button}
                icon={() => <Ionicons name="chevron-back" size={26} color={Colors.light.text} />}
                onPress={() => {
                    if (onPress) {
                        onPress();
                    }
                    router.back();
                }}
            />
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: verticalScale(60),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(20),
    },
    title: {
        fontSize: scale(18),
        color: Colors.light.text,
        fontFamily: 'Roboto-Bold',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: scale(0),
    }
});
export default TopBar;
