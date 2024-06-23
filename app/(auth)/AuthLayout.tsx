// AuthLayout.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors'; // Assuming you have a Colors file for your app
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <View style={styles.container}>
            <Image
                source={require('assets/images/home.png')}
                style={styles.image}
            />
            <View style={styles.content}>
                {children}
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
        padding: moderateScale(20),
    },
    image: {
        width: moderateScale(200),
        height: verticalScale(200),
        position: 'absolute',
        top: verticalScale(40),
        alignSelf: 'center',
    },
    content: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: verticalScale(260), // Adjust this value based on the image size and position
    },
});

export default AuthLayout;
