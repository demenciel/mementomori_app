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
}

const CustomPrimaryButton: React.FC<CustomPrimaryButtonProps> = ({
    title,
    onPress,
    disabled = false,
    loading,
    icon,
    style,
    textStyle,
    iconStyle,
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
                    {icon && (
                        <Entypo
                            name={icon}
                            size={24}
                            color={Colors.light.text}
                            style={[styles.icon, iconStyle]}
                        />
                    )}
                    <Text style={[styles.text, textStyle, {
                        color: disabled ? Colors.light.text : Colors.light.background
                    }]}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: Colors.light.tabIconSelected,
        borderRadius: moderateScale(12.5),
        paddingVertical: moderateScale(16),
        paddingHorizontal: moderateScale(15),
    },
    disabledContainer: {
        backgroundColor: Colors.light.text,
    },
    text: {
        fontSize: moderateScale(16),
        fontFamily: 'Roboto-Regular',
        letterSpacing: 1.6,
        marginLeft: moderateScale(10),
    },
    icon: {
        marginRight: moderateScale(10),
    },
});

export default CustomPrimaryButton;
