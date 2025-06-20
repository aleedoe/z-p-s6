import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, TextInputProps, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    leftIcon,
    rightIcon,
    secureTextEntry,
    ...props
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error && styles.inputError]}>
                {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        leftIcon && styles.inputWithLeftIcon,
                        (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
                    ]}
                    placeholderTextColor={colors.textLight}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    {...props}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.rightIconContainer}
                        onPress={togglePasswordVisibility}
                    >
                        {isPasswordVisible ? (
                            <EyeOff size={20} color={colors.secondary} />
                        ) : (
                            <Eye size={20} color={colors.secondary} />
                        )}
                    </TouchableOpacity>
                )}
                {rightIcon && !secureTextEntry && (
                    <View style={styles.rightIconContainer}>{rightIcon}</View>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: colors.text,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.background,
    },
    input: {
        flex: 1,
        height: 48,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.text,
    },
    inputWithLeftIcon: {
        paddingLeft: 8,
    },
    inputWithRightIcon: {
        paddingRight: 8,
    },
    leftIconContainer: {
        paddingLeft: 16,
    },
    rightIconContainer: {
        paddingRight: 16,
    },
    inputError: {
        borderColor: colors.error,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        marginTop: 4,
    },
});