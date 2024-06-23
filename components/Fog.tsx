// Fog.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Fog: React.FC = () => {
    const fogAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fogAnim, {
                    toValue: 1,
                    duration: 8000,
                    useNativeDriver: true,
                }),
                Animated.timing(fogAnim, {
                    toValue: 0,
                    duration: 8000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fogAnim]);

    const fogTranslateX = fogAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    const fogOpacity = fogAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.5, 0.8, 0.5],
    });

    return (
        <View style={StyleSheet.absoluteFillObject}>
            {/* <Animated.Image
                source={require('assets/images/fog.png')}
                style={[
                    styles.fog,
                    {
                        transform: [{ translateX: fogTranslateX }],
                        opacity: fogOpacity,
                    },
                ]}
                resizeMode="cover"
            /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    fog: {
        width: width * 2,
        height: height,
        position: 'absolute',
    },
});

export default Fog;
