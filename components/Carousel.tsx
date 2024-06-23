import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import SideSwipe from 'react-native-sideswipe';
import CarouselCard from '@/(auth)/CarouselCard'
import {
    moderateScale,
    verticalScale,
} from 'react-native-size-matters';

interface CustomCarouselProps {
    data: { title: string; text: string; image: any }[];
}

const Carousel: React.FC<CustomCarouselProps> = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { width } = Dimensions.get('window');
    const contentOffset = (width - 340) / 2; // Adjusted width to match CarouselCard width

    return (
        <SideSwipe
            index={currentIndex}
            itemWidth={moderateScale(320)} // Width of CarouselCard
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
    );
};

export default Carousel;
