/* import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';
import { verticalScale } from 'react-native-size-matters';

const AdBanner: React.FC = () => {
    // get env variables
    const isTest = __DEV__;
    const adUnitID = Platform.select({
        ios: isTest ? 'ca-app-pub-3940256099942544/2934735716' : process.env.EXPO_ADMOB_IOS_CALENDAR_BANNER_ID, // Test Ad Unit ID
        android: isTest ? 'ca-app-pub-3940256099942544/6300978111' : process.env.EXPO_ADMOB_ANDROID_CALENDAR_BANNER_ID, // Test Ad Unit ID
    });

    return (
        <View style={styles.bannerContainer}>
            <AdMobBanner
                bannerSize="fullBanner"
                adUnitID={adUnitID}
                servePersonalizedAds // true or false
                onDidFailToReceiveAdWithError={(error) => console.log(error)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: verticalScale(10),
    },
});

export default AdBanner;
 */