import React, { useState } from 'react';
import { View, TextInput as RNTextInput, StyleSheet, TextInputProps, Keyboard } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from 'constants/Colors';
import Entypo from '@expo/vector-icons/Entypo';

interface CustomTextInputProps extends TextInputProps {
    placeholder: string;
    icon: string;
    style?: any; // Make style optional
    inputValue: string;
    setInputValue: (value: string) => void;
    inputConditions: (text: string) => boolean;
    isValid: boolean;
    hidden?: boolean;
    keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
    placeholder,
    icon,
    style,
    inputValue,
    inputConditions,
    setInputValue,
    isValid,
    hidden,
    keyboardType
}) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const iconColor = () => {
        if (isFocused) {
            return Colors.light.tabIconSelected;
        } else if (isValid) {
            return Colors.light.tabIconSelected;
        } else {
            return Colors.light.text;
        }
    };

    return (
        <View style={[styles.container, isFocused && styles.focusedContainer, isValid && styles.validContainer, style]}>
            <RNTextInput
                value={inputValue}
                onChangeText={(text) => {
                    if (inputConditions(text)) {
                        setInputValue(text);
                    }
                }}
                onFocus={handleFocus}
                secureTextEntry={hidden}
                onBlur={handleBlur}
                keyboardType={keyboardType}
                placeholder={placeholder}
                style={[
                    styles.input,
                    isFocused && styles.focusedInput,
                ]}
                placeholderTextColor={Colors.light.tabIconDefault}
            />
            <Entypo
                name={icon}
                size={24}
                color={iconColor()}
                style={styles.icon}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        borderRadius: moderateScale(12.5),
        paddingVertical: moderateScale(20), // Reduced padding for better alignment
        paddingHorizontal: moderateScale(15),
        borderWidth: 1,
        borderColor: Colors.light.tabIconDefault,
    },
    focusedContainer: {
        borderColor: Colors.light.tabIconSelected,
    },
    validContainer: {
        borderColor: Colors.light.tabIconSelected,
    },
    input: {
        flex: 1,
        fontSize: moderateScale(16),
        color: Colors.light.text,
    },
    icon: {
        marginLeft: moderateScale(10),
    },
    focusedInput: {
        color: Colors.light.text, // Ensure text color remains consistent when focused
    },
});

export default CustomTextInput;
