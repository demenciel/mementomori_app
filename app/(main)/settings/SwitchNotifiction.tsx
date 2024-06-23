import { Colors } from 'constants/Colors'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Switch, Text } from 'react-native-paper'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'


interface SwitchNotificationProps {
    onPress: () => void
    value: boolean
    text: string
}

const SwitchNotifiction: React.FC<SwitchNotificationProps> = ({ onPress, value, text }) => {
    return (
        <View style={styles.container}>
            <View style={styles.setting}>
                <Text style={styles.label}>{text}</Text>
                <Switch
                    color={Colors.light.tabIconSelected}
                    trackColor={{ false: Colors.light.text, true: Colors.light.tint }}
                    onValueChange={onPress}
                    value={value}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.light.tabIconSelected,
        borderRadius: moderateScale(12.5),
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(10),
        marginBottom: verticalScale(20),
    },
    setting: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 20,
        letterSpacing: 0.5,
        color: Colors.light.text,
        fontFamily: 'Roboto-Regular',
    },
})

export default SwitchNotifiction