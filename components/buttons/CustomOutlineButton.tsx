import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from 'constants/Colors';
import Entypo from '@expo/vector-icons/Entypo';

interface CustomPrimaryButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    style?: object;
    textStyle?: object;
    iconStyle?: object;
    iconSide?: 'left' | 'right';
}

const CustomOutlineButton: React.FC<CustomPrimaryButtonProps> = ({
    title,
    onPress,
    disabled = false,
    loading,
    icon,
    style,
    textStyle,
    iconStyle,
    iconSide = 'left',
    ...rest
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                style,
                disabled && styles.disabledContainer
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            {...rest}
        >
            {loading ? (
                <ActivityIndicator size="small" color={Colors.light.text} />
            ) : (
                <>
                    {
                        iconSide === 'left' && icon && (
                            <Entypo
                                name={icon}
                                size={24}
                                color={Colors.light.text}
                                style={[styles.icon, iconStyle]}
                            />
                        )
                    }
                    <Text style={[styles.text, textStyle]}>{title}</Text>
                    {
                        iconSide === 'right' && icon && (
                            <Entypo
                                name={icon}
                                size={24}
                                color={Colors.light.text}
                                style={[styles.icon, iconStyle]}
                            />
                        )

                    }
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.light.tabIconSelected,
        borderRadius: moderateScale(12.5),
        paddingVertical: moderateScale(16),
        paddingHorizontal: moderateScale(15),
    },
    disabledContainer: {
        backgroundColor: Colors.light.tabIconDefault,
    },
    text: {
        fontSize: moderateScale(16),
        fontFamily: 'Roboto-Regular',
        letterSpacing: 1.6,
        color: Colors.light.tabIconSelected,
        marginLeft: moderateScale(10),
    },
    icon: {
        marginRight: moderateScale(10),
    },
});

export default CustomOutlineButton;
