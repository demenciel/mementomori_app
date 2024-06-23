import { Colors } from 'constants/Colors';
import React, { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface CarouselCardProps {
    title: string;
    text: string;
    value: number | string;
    image: any;
    index: number;
    currentIndex: number;
    animatedValue: Animated.Value;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ title, value, text, image, index, currentIndex, animatedValue }) => {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: currentIndex === index ? 1.01 : 1,
            useNativeDriver: true,
            friction: 5,
            tension: 40,
        }).start();
    }, [currentIndex, index, scale]);

    const opacity = animatedValue.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [0.28, 1, 0.28],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
            {/* <LinearGradient
                // Background Linear Gradient
                colors={['rgba(0,0,0,0.4)', 'transparent']}
                style={styles.background}
            /> */}
            <Image source={image} style={styles.image} />
            <View style={styles.itemContent}>
                <View style={styles.itemContentTextContainer}>
                    {
                        value.toString().length > 4 && (
                            <Text style={styles.title}>{title}</Text>
                        )
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Text style={[styles.value, {
                            fontSize: value.toString().length > 4 ? 18 : 42,
                        }]}>{value}</Text>
                        {value.toString().length <= 4 && (
                            <Text style={styles.title}>{title}</Text>
                        )}
                    </View>
                    <Text style={styles.prompt}>{text}</Text>
                </View>
                {/* <View style={styles.paginationContainer}>
                    <View style={styles.pagination}>
                        {data.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    { backgroundColor: index === currentIndex ? Colors.light.tint : Colors.light.tabIconDefault },
                                ]}
                            />
                        ))}
                    </View>
                </View> */}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: Dimensions.get('window').width * 0.8,
        height: verticalScale(460),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12.5,
        marginHorizontal: moderateScale(10),
        padding: moderateScale(10),
    },
    background: {
        position: 'absolute',
        borderRadius: 12.5,
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    image: {
        width: '100%',
        height: '60%',
        borderRadius: 10,
    },
    itemContentTextContainer: {
        padding: 10,
        textAlign: 'left',
        fontFamily: 'Roboto-Regular',
        alignItems: 'flex-start',
    },
    textContainer: {
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        letterSpacing: 1.2,
        color: Colors.light.text,
        textAlign: 'center',
        marginBottom: verticalScale(5),
    },
    itemContent: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row'
    },
    value: {
        fontSize: 50,
        color: '#333',
        marginRight: 10,
    },
    prompt: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        textAlign: 'left',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    paginationContainer: {
        width: '100%',
        alignItems: 'center',
    },
    dot: {
        width: scale(10),
        height: verticalScale(10),
        borderRadius: 5,
        marginHorizontal: scale(5),
        borderWidth: 1,
        borderColor: Colors.light.icon,
    },
});

export default CarouselCard;
