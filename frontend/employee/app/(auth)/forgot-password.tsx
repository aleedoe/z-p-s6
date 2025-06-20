import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useUIStore } from '@/store/uiStore';
import { Mail } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const { showLoading, hideLoading, showToast } = useUIStore();

    const validateEmail = () => {
        if (!email) {
            setError('Email tidak boleh kosong');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Format email tidak valid');
            return false;
        }

        setError('');
        return true;
    };

    const handleSubmit = async () => {
        if (!validateEmail()) return;

        showLoading('Mengirim instruksi reset password...');

        // Simulate API call
        setTimeout(() => {
            hideLoading();
            setSubmitted(true);
            showToast('Instruksi reset password telah dikirim ke email anda', 'success');
        }, 1500);
    };

    const handleBackToLogin = () => {
        router.back();
    };

    if (submitted) {
        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Email Terkirim</Text>
                    <Text style={styles.message}>
                        Kami telah mengirimkan instruksi untuk reset password ke email {email}. Silakan cek inbox atau folder spam anda.
                    </Text>
                    <Button
                        title="Kembali ke Login"
                        onPress={handleBackToLogin}
                        style={styles.button}
                    />
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Lupa Password</Text>
                    <Text style={styles.subtitle}>
                        Masukkan email anda untuk menerima instruksi reset password
                    </Text>

                    <Input
                        label="Email"
                        placeholder="Masukkan email anda"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={error}
                        leftIcon={<Mail size={20} color={colors.secondary} />}
                    />

                    <Button
                        title="Kirim Instruksi Reset"
                        onPress={handleSubmit}
                        style={styles.button}
                    />

                    <Button
                        title="Kembali ke Login"
                        onPress={handleBackToLogin}
                        variant="text"
                        style={styles.backButton}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    contentContainer: {
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textLight,
        marginBottom: 24,
    },
    message: {
        fontSize: 16,
        color: colors.textLight,
        marginBottom: 24,
        lineHeight: 24,
    },
    button: {
        marginTop: 16,
    },
    backButton: {
        marginTop: 16,
    },
});