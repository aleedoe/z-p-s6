import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Mail, Phone, MapPin, LogOut, User, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();
    const { showLoading, hideLoading, showToast } = useUIStore();
    const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);

    const handleLogout = () => {
        Alert.alert(
            'Konfirmasi Logout',
            'Apakah anda yakin ingin keluar dari aplikasi?',
            [
                {
                    text: 'Batal',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        showLoading('Sedang logout...');
                        try {
                            await logout();
                            hideLoading();
                            showToast('Berhasil logout', 'success');
                        } catch (error) {
                            hideLoading();
                            showToast('Gagal logout', 'error');
                        }
                    },
                },
            ]
        );
    };

    const handleChangePhoto = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                showToast('Izin akses galeri diperlukan', 'warning');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setProfileImage(result.assets[0].uri);
                showToast('Foto profil berhasil diubah', 'success');
            }
        } catch (error) {
            showToast('Gagal mengubah foto profil', 'error');
        }
    };

    // Mock user data if not available
    const mockUser = {
        id: '1',
        name: 'Budi Santoso',
        email: 'budi.santoso@joglonarto.com',
        role: 'Pelayan',
        phone: '081234567890',
        address: 'Jl. Malioboro No. 123, Yogyakarta',
        joinDate: '01 Januari 2023',
    };

    const userInfo = user || mockUser;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.profileHeader}>
                <View style={styles.profileImageContainer}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.profileImagePlaceholder}>
                            <User size={60} color={colors.secondary} />
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.changePhotoButton}
                        onPress={handleChangePhoto}
                    >
                        <Camera size={20} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.name}>{userInfo.name}</Text>
                <Text style={styles.role}>{userInfo.role}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
                <View style={styles.infoCard}>
                    <View style={styles.infoItem}>
                        <Mail size={20} color={colors.primary} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{userInfo.email}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoItem}>
                        <Phone size={20} color={colors.primary} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Nomor Telepon</Text>
                            <Text style={styles.infoValue}>{(userInfo as any).phone || '-'}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoItem}>
                        <MapPin size={20} color={colors.primary} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Alamat</Text>
                            <Text style={styles.infoValue}>{(userInfo as any).address || '-'}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informasi Karyawan</Text>
                <View style={styles.infoCard}>
                    <View style={styles.infoItem}>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>ID Karyawan</Text>
                            <Text style={styles.infoValue}>{userInfo.id}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoItem}>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Tanggal Bergabung</Text>
                            <Text style={styles.infoValue}>{(userInfo as any).joinDate || '-'}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <Button
                title="Logout"
                onPress={handleLogout}
                variant="outline"
                icon={<LogOut size={20} color={colors.primary} />}
                style={styles.logoutButton}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        padding: 16,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: colors.primary,
    },
    profileImagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.primary,
    },
    changePhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.background,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    role: {
        fontSize: 16,
        color: colors.secondary,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
    },
    infoCard: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: colors.border,
    },
    infoItem: {
        flexDirection: 'row',
        paddingVertical: 12,
    },
    infoContent: {
        flex: 1,
        marginLeft: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
    },
    logoutButton: {
        marginTop: 8,
    },
});