import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from 'constants/Colors';
import Entypo from '@expo/vector-icons/Entypo';

interface RedirectButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    style?: object;
    textStyle?: object;
    iconStyle?: object;
}

const RedirectButton: React.FC<RedirectButtonProps> = ({
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
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Entypo
                            name={icon}
                            size={24}
                            color={Colors.light.background}
                            style={iconStyle}
                        />
                        <Text style={[styles.text, textStyle, {
                            color: disabled ? Colors.light.text : Colors.light.background
                        }]}>{title}</Text>
                    </View>
                    <Entypo
                        name={'chevron-right'}
                        size={24}
                        color={Colors.light.background}
                        style={[styles.icon, iconStyle]}
                    />
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
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: Colors.light.tint,
        borderRadius: moderateScale(12.5),
        paddingVertical: moderateScale(16),
        paddingHorizontal: moderateScale(15),
        marginVertical: moderateScale(10),
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

export default RedirectButton;
