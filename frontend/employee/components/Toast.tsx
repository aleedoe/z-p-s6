import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { colors } from '@/constants/colors';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react-native';

interface ToastProps {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    visible,
    message,
    type,
    onHide,
}) => {
    const opacity = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(3000),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => onHide());
        }
    }, [visible, opacity, onHide]);

    if (!visible) return null;

    const getToastColor = () => {
        switch (type) {
            case 'success':
                return colors.success;
            case 'error':
                return colors.error;
            case 'warning':
                return colors.warning;
            case 'info':
            default:
                return colors.primary;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={24} color="white" />;
            case 'error':
                return <AlertCircle size={24} color="white" />;
            case 'warning':
                return <AlertTriangle size={24} color="white" />;
            case 'info':
            default:
                return <Info size={24} color="white" />;
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor: getToastColor(), opacity },
            ]}
        >
            <View style={styles.iconContainer}>{getIcon()}</View>
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        backgroundColor: colors.primary,
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
    },
    iconContainer: {
        marginRight: 12,
    },
    message: {
        color: 'white',
        fontSize: 16,
        flex: 1,
    },
});