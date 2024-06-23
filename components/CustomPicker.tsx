import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from 'constants/Colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

interface CustomPickerProps {
    selectedValue: string;
    onValueChange: (value: string) => void;
    options: { label: string; value: string }[];
    label: string;
}

const CustomPicker: React.FC<CustomPickerProps> = ({ selectedValue, onValueChange, options, label }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (value: string) => {
        onValueChange(value);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.picker} onPress={() => setModalVisible(true)}>
                <Text style={styles.selectedValue}>{label}</Text>
                <Text style={[styles.selectedValue, {
                    color: Colors.light.tabIconSelected,
                    fontFamily: 'Roboto-Bold',

                }]}>{options.find(option => option.value === selectedValue)?.label}</Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
                // click outside of the modal to close it
                onDismiss={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        {options.map(option => (
                            <TouchableOpacity key={option.value} style={styles.option} onPress={() => handleSelect(option.value)}>
                                <Text style={[styles.optionText, {
                                    color: option.value === selectedValue ? Colors.light.tabIconSelected : Colors.light.text,
                                    fontFamily: option.value === selectedValue ? 'Roboto-Bold' : 'Roboto-Regular',
                                }]}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: verticalScale(20),
    },
    picker: {
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: moderateScale(12.5),
        borderColor: Colors.light.tabIconSelected,
        paddingVertical: verticalScale(22),
        paddingHorizontal: scale(12),
    },
    selectedValue: {
        fontSize: 16,
        color: Colors.light.text,
        fontFamily: 'Roboto-Regular',
        letterSpacing: 1.6,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    option: {
        padding: 15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    optionText: {
        fontSize: 18,
        color: Colors.light.text,
    },
});

export default CustomPicker;
