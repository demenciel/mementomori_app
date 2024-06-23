import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from 'constants/Colors';
import { useSnackbar } from 'context/SnackbarContext';
import CustomOutlineButton from './buttons/CustomOutlineButton';
import {
    moderateScale, verticalScale,
    scale as horizontalScale,
} from 'react-native-size-matters';

interface DateOfBirthPickerProps {
    selectedDate: Date | string | undefined;
    onChange: (date: Date) => void;
    minimumAge: number;
}

const getDefaultDate = (): Date => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today;
};

const getMonthName = (month: number): string => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return months[month];
}

const parseDate = (text: string): Date | null => {
    const parts = text.split('-');
    if (parts.length === 3) {
        const [year, month, day] = parts.map(part => parseInt(part, 10));
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            return new Date(year, month - 1, day);
        }
    }
    return null;
};

const initialYear = new Date().getFullYear() - 18;

const CalendarPicker: React.FC<DateOfBirthPickerProps> = ({ selectedDate, onChange, minimumAge }) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(selectedDate || getDefaultDate());
    const [isValid, setIsValid] = useState<boolean>(true);
    const { showSnackbar } = useSnackbar();
    const [month, setMonth] = useState<number>(date?.getMonth() || new Date().getMonth());
    const [year, setYear] = useState<number>(date?.getFullYear() || new Date().getFullYear());
    const [day, setDay] = useState<number>(date?.getDate() || new Date().getDate());
    const [pickerVisible, setPickerVisible] = useState<{ type: 'year' | 'month' | 'day', visible: boolean }>({ type: 'year', visible: false });

    const validateDate = (date: Date): boolean => {
        const age = getAge(date);
        if (age < minimumAge) {
            showSnackbar(`You must be at least ${minimumAge} years old.`, 5000, 'red');
            setIsValid(false);
            return false;
        } else {
            onChange(date);
            setIsValid(true);
            return true;
        }
    };

    const getAge = (birthDate: Date): number => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age;
    };

    const handleDatePress = (selectedDate: Date) => {
        if (validateDate(selectedDate)) {
            setDate(selectedDate);
            setMonth(selectedDate.getMonth());
            setYear(selectedDate.getFullYear());
            setDay(selectedDate.getDate());
        }
    };

    const renderCalendar = () => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = new Date(year, month, 1).getDay();
        const calendarDays = [];

        for (let i = 0; i < startDay; i++) {
            calendarDays.push({ key: `empty-${i}`, day: null });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = new Date(year, month, day);
            const isSelected = date && date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
            calendarDays.push({ key: day.toString(), day: currentDay, isSelected });
        }

        return (
            <FlatList
                data={calendarDays}
                numColumns={7}
                renderItem={({ item }) => {
                    if (!item.day) {
                        return <View style={styles.emptyDay} />;
                    }
                    return (
                        <TouchableOpacity
                            style={[styles.day, item.isSelected && styles.selectedDay]}
                            onPress={() => handleDatePress(item.day)}
                        >
                            <Text style={[styles.dayText, item.isSelected && styles.selectedDayText]}>
                                {item.day.getDate()}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
                keyExtractor={(item) => item.key}
            />
        );
    };

    const handleMonthChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            if (month === 0) {
                setMonth(11);
                setYear(year - 1);
            } else {
                setMonth(month - 1);
            }
        } else {
            if (month === 11) {
                setMonth(0);
                setYear(year + 1);
            } else {
                setMonth(month + 1);
            }
        }
    };

    const handlePickerSelect = (value: number) => {
        if (pickerVisible.type === 'year') {
            setYear(value);
            handleDatePress(new Date(value, month, day));
        } else if (pickerVisible.type === 'month') {
            setMonth(value);
            handleDatePress(new Date(year, value, day));
        } else {
            setDay(value);
            handleDatePress(new Date(year, month, value));
        }
        setPickerVisible({ ...pickerVisible, visible: false });
    };

    const renderPicker = () => {
        const items = [];
        if (pickerVisible.type === 'year') {
            for (let i = initialYear; i >= initialYear - 100; i--) {
                items.push(i);
            }
        } else if (pickerVisible.type === 'month') {
            for (let i = 0; i < 12; i++) {
                items.push(i);
            }
        } else {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            for (let i = 1; i <= daysInMonth; i++) {
                items.push(i);
            }
        }

        return (
            <Modal
                visible={pickerVisible.visible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setPickerVisible({ ...pickerVisible, visible: false })}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.pickerContainer}>
                        <FlatList
                            data={items}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handlePickerSelect(item)}>
                                    <Text style={styles.pickerItem}>
                                        {
                                            pickerVisible.type === 'month' ? getMonthName(item) : item
                                        }
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => setPickerVisible({ ...pickerVisible, visible: false })}>
                            <Text style={styles.pickerCloseButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            <CustomOutlineButton
                icon='calendar'
                title={
                    date ? date?.toISOString().split('T')[0] : 'Select Date'
                } onPress={() => setOpen(true)}
                iconStyle={{
                    color:
                        date ? Colors.light.tabIconSelected : Colors.light.tabIconDefault
                }}
            />
            <Modal
                visible={open}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setOpen(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Date</Text>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => handleMonthChange('prev')}>
                                <MaterialIcons name="arrow-back" size={24} color={Colors.light.primary} />
                            </TouchableOpacity>
                            <View style={styles.headerDate}>
                                <TouchableOpacity onPress={() => setPickerVisible({ type: 'year', visible: true })}>
                                    <Text style={styles.monthYearText}>{year}</Text>
                                </TouchableOpacity>
                                <Text>{'/'}</Text>
                                <TouchableOpacity onPress={() => setPickerVisible({ type: 'month', visible: true })}>
                                    <Text style={styles.monthYearText}>{month + 1}</Text>
                                </TouchableOpacity>
                                <Text>{'/'}</Text>
                                <TouchableOpacity onPress={() => setPickerVisible({ type: 'day', visible: true })}>
                                    <Text style={styles.monthYearText}>{day}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => handleMonthChange('next')}>
                                <MaterialIcons name="arrow-forward" size={24} color={Colors.light.primary} />
                            </TouchableOpacity>
                        </View>
                        {renderCalendar()}
                        {renderPicker()}
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setOpen(false)}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.closeButton} onPress={() => {
                                if (date) {
                                    setOpen(false);
                                }
                            }}>
                                <Text style={[styles.closeButtonText, {
                                    textAlign: 'right',
                                }]}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.light.background,
        alignItems: 'center',
        borderRadius: 12.5,
        elevation: 3,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.tabIconSelected,
        padding: moderateScale(10),
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        marginLeft: horizontalScale(10),
    },
    modalContainer: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: moderateScale(20),
        width: '90%',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: verticalScale(10),
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    headerDate: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    monthYearText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: horizontalScale(5),
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.light.tabIconSelected,
        borderRadius: 5,
        padding: moderateScale(8),
        marginBottom: verticalScale(10),
    },
    week: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    day: {
        width: horizontalScale(35),
        height: verticalScale(35),
        justifyContent: 'center',
        alignItems: 'center',
        margin: moderateScale(2),
    },
    dayText: {
        fontSize: 16,
    },
    selectedDay: {
        backgroundColor: Colors.light.tabIconSelected,
        borderRadius: 100,
    },
    selectedDayText: {
        color: 'white',
    },
    buttonContainer: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    closeButton: {
        marginTop: 20,
        width: 100,
        alignItems: 'center',
    },
    closeButtonText: {
        color: Colors.light.tabIconSelected,
        width: '100%',
        fontSize: 16,
    },
    dateText: {
        marginTop: verticalScale(20),
    },
    errorText: {
        color: 'red',
        marginTop: verticalScale(10),
    },
    emptyDay: {
        width: horizontalScale(35),
        height: verticalScale(35),
        margin: moderateScale(2),
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: verticalScale(10),
    },
    footerButton: {
        padding: moderateScale(10),
        backgroundColor: Colors.light.tabIconSelected,
        borderRadius: 5,
    },
    footerButtonText: {
        color: 'white',
    },
    pickerContainer: {
        backgroundColor: 'white',
        padding: moderateScale(20),
        height: '50%',
        width: '60%',
        textAlign: 'center',
        borderRadius: 10,
    },
    pickerItem: {
        fontSize: 18,
        width: '100%',
        textAlign: 'center',
        borderBottomColor: Colors.light.tabIconSelected,
        borderBottomWidth: 1,
        padding: moderateScale(10),
    },
    pickerCloseButton: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: verticalScale(20),
        padding: moderateScale(10),
        color: Colors.light.tabIconSelected,
    },

});

export default CalendarPicker;
