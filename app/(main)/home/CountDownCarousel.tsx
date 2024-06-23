import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItemInfo, Image, Dimensions } from 'react-native';
import { Colors } from 'constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import CarouselCard from './CarouselCard';
import SideSwipe from 'react-native-sideswipe';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface TimeLeft {
    years: number;
    seasons: number;
    months: number;
    timeLeft: string;
    days: number;
}

interface CountdownCarouselProps {
    timeLeft: TimeLeft;
}

const CountdownCarousel: React.FC<CountdownCarouselProps> = ({ timeLeft }) => {
    const carouselRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { width } = Dimensions.get('window');

    const contentOffset = (width - 340) / 2; // Adjusted width to match CarouselCard width

    const data = [
        {
            image: require('assets/images/home.png'),
            title: 'Time Left',
            value: timeLeft.timeLeft || 'Calculating ...',
            text: "Time is fleeting, make it meaningful."
        },
        {
            image: require('assets/images/home.png'),
            title: 'Months Left',
            value: timeLeft.months || 'Calculating ...',
            text: "Cherish every month as a new beginning."
        },

        {
            image: require('assets/images/home.png'),
            title: 'Seasons Left',
            value: timeLeft.seasons || 'Calculating ...',
            text: "Embrace the beauty of every season."
        },
        {
            image: require('assets/images/home.png'),
            title: 'Years Left',
            value: timeLeft.years || 'Calculating ...',
            text: "Make each year count."
        },
        {
            image: require('assets/images/home.png'),
            title: 'Days Left',
            value: timeLeft.days || 'Calculating ...',
            text: "Waste no more time arguing what a good man should be. Be one."
        }

    ];

    return (
        <>
            <SideSwipe
                index={currentIndex}
                itemWidth={Dimensions.get('window').width * 0.85} // Width of CarouselCard
                style={{ width }}
                data={data}
                contentOffset={contentOffset}
                onIndexChange={index => setCurrentIndex(index)}
                renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
                    <CarouselCard
                        {...item}
                        index={itemIndex}
                        currentIndex={currentIndex}
                        animatedValue={animatedValue}
                    />
                )}
            />
            <View style={styles.paginationContainer}>
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
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carousel: {
        flexGrow: 0,
    },
    contentContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemContainer: {
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').height * 0.6,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.light.tabIconDefault,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    itemContent: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        fontSize: 20,
        color: '#333',
        marginBottom: 10,
    },
    value: {
        fontSize: 50,
        color: '#333',
    },
    prompt: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
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

export default CountdownCarousel;
