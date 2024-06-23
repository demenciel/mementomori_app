import React, { createContext, useContext, useState } from 'react';
import { Snackbar } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';

interface SnackbarContextData {
    showSnackbar: (message: string, duration?: number, color?: string) => void;
}

const SnackbarContext = createContext<SnackbarContextData | undefined>(undefined);

export const SnackbarProvider: React.FC = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [duration, setDuration] = useState(3000);
    const [color, setColor] = useState('red');

    const showSnackbar = (msg: string, dur = 3000, col?: string) => {
        setMessage(msg);
        setDuration(dur);
        setVisible(true);
        if (col) setColor(col);
    };

    const onDismiss = () => {
        setVisible(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                visible={visible}
                elevation={3}
                style={{
                    backgroundColor: color, position: 'absolute',
                    bottom: moderateScale(30),
                    zIndex: 9999,
                    borderRadius: 12.5,
                }}
                onDismiss={onDismiss}
                duration={duration}
                action={{
                    label: 'OK',
                    onPress: () => {
                        setVisible(false);
                    },
                }}
            >
                {message}
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = (): SnackbarContextData => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};
