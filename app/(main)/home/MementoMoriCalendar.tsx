import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, Image } from 'react-native';
import { Colors } from 'constants/Colors';
import { useSelector } from 'react-redux';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { calendarQuotes } from 'constants/CalendarQuotes';
import { IconButton } from 'react-native-paper';

const { width } = Dimensions.get('window');

const calculateGrid = (yearsLeft: number) => {
    const grid = [];
    for (let i = 0; i < 80; i++) {
        grid.push({
            color: i < (80 - (yearsLeft + 2)) ? Colors.light.tabIconDefault : Colors.light.tabIconSelected,
            quote: calendarQuotes[i]  // Assign a unique quote for each year
        });
    }
    return grid;
};

const MementoMoriCalendar: React.FC = () => {
    const timeLeft = useSelector((state: any) => state.user.timeLeft);
    const grid = calculateGrid(Number(timeLeft?.years));
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState('');

    const handleSquarePress = (quote: string, index) => {
        // disable the click event if the year is not yet reached
        if (index >= (80 - (Number(timeLeft?.years) + 2))) return;

        setSelectedQuote(quote);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Memento Mori Calendar</Text>
            <View style={styles.gridContainer}>
                {grid.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.gridItem, { backgroundColor: item.color }]}
                        onPress={() => handleSquarePress(item.quote, index)}
                    />
                ))}
            </View>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                style={styles.modal}
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modelContent}>
                        <Image
                            source={require('assets/images/quote.png')}
                            style={styles.quoteImage}
                        />
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <IconButton
                                icon="close"
                                iconColor={Colors.light.tabIconSelected}
                                size={moderateScale(18)}
                                style={styles.closeButton}
                                onPress={closeModal}
                            />
                        </View>
                        <Text style={styles.modalText}>{selectedQuote}</Text>
                    </View>
                    {/* <AdBanner /> */}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: moderateScale(20),
    },
    title: {
        fontSize: 24,
        letterSpacing: 1,
        fontFamily: 'Roboto-Bold',
        color: Colors.light.text,
        marginBottom: verticalScale(20),
    },
    gridContainer: {
        width: width - moderateScale(40),
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridItem: {
        width: (width - moderateScale(40)) / 7.5,
        height: (width - moderateScale(40)) / 7.5,
        margin: moderateScale(1.5),
        borderRadius: 12,
    },
    modal: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    quoteImage: {
        width: moderateScale(160),
        height: moderateScale(160),
        position: 'absolute',
        top: -moderateScale(80),
        left: -moderateScale(30),
        zIndex: 100,
    },
    modelContent: {
        width: width - moderateScale(40),
        backgroundColor: Colors.light.background,
        padding: moderateScale(10),
        borderRadius: 6,
        position: 'relative',
    },
    modalText: {
        fontSize: 18,
        padding: moderateScale(10),
        textAlign: 'left',
        letterSpacing: 0.5,
        fontFamily: 'Roboto-Regular',
        marginBottom: verticalScale(20),
    },
    closeButton: {
        borderRadius: 100,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default MementoMoriCalendar;
