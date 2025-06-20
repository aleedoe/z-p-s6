import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon,
}) => {
    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondaryButton;
            case 'outline':
                return styles.outlineButton;
            case 'text':
                return styles.textButton;
            case 'primary':
            default:
                return styles.primaryButton;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'outline':
                return styles.outlineButtonText;
            case 'text':
                return styles.textButtonText;
            case 'primary':
            case 'secondary':
            default:
                return styles.buttonText;
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return styles.smallButton;
            case 'large':
                return styles.largeButton;
            case 'medium':
            default:
                return styles.mediumButton;
        }
    };

    const getTextSizeStyle = () => {
        switch (size) {
            case 'small':
                return styles.smallButtonText;
            case 'large':
                return styles.largeButtonText;
            case 'medium':
            default:
                return styles.mediumButtonText;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getButtonStyle(),
                getSizeStyle(),
                disabled && styles.disabledButton,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'text' ? colors.primary : 'white'}
                    size="small"
                />
            ) : (
                <>
                    {icon && icon}
                    <Text
                        style={[
                            getTextStyle(),
                            getTextSizeStyle(),
                            icon && styles.textWithIcon,
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    primaryButton: {
        backgroundColor: colors.primary,
    },
    secondaryButton: {
        backgroundColor: colors.secondary,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    textButton: {
        backgroundColor: 'transparent',
    },
    smallButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    mediumButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    largeButton: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
    outlineButtonText: {
        color: colors.primary,
        fontWeight: '600',
        textAlign: 'center',
    },
    textButtonText: {
        color: colors.primary,
        fontWeight: '600',
        textAlign: 'center',
    },
    smallButtonText: {
        fontSize: 14,
    },
    mediumButtonText: {
        fontSize: 16,
    },
    largeButtonText: {
        fontSize: 18,
    },
    disabledButton: {
        opacity: 0.6,
    },
    textWithIcon: {
        marginLeft: 8,
    },
});