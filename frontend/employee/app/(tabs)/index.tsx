import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { ScheduleCard } from '@/components/ScheduleCard';
import { Button } from '@/components/Button';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { getTodaySchedule } from '@/api/employee';
import { Schedule } from '@/types';
import { Calendar, Clock, QrCode } from 'lucide-react-native';

export default function HomeScreen() {
    const [todaySchedule, setTodaySchedule] = useState<Schedule | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const { user } = useAuthStore();
    const { showToast } = useUIStore();

    const fetchTodaySchedule = async () => {
        try {
            const schedules = await getTodaySchedule();
            if (schedules && schedules.length > 0) {
                setTodaySchedule(schedules[0]);
            } else {
                setTodaySchedule(null);
            }
        } catch (error) {
            console.error('Error fetching today schedule:', error);
            showToast('Gagal memuat jadwal hari ini', 'error');
        }
    };

    useEffect(() => {
        fetchTodaySchedule();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTodaySchedule();
        setRefreshing(false);
    };

    const handleScanQR = () => {
        router.push('/attendance');
    };

    const handleViewSchedule = () => {
        router.push('/schedule');
    };

    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getCurrentDate = () => {
        const now = new Date();
        return now.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Mock data for today's schedule if API is not available
    const mockTodaySchedule: Schedule = {
        id: '1',
        date: new Date().toISOString(),
        startTime: '08:00',
        endTime: '17:00',
        status: 'ongoing',
    };

    // Use mock data if no real data is available (for demo purposes)
    const scheduleToShow = todaySchedule || mockTodaySchedule;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
            }
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Halo, {user?.name || 'Karyawan'}!</Text>
                    <Text style={styles.dateTime}>{getCurrentDate()}</Text>
                </View>
                <View style={styles.timeContainer}>
                    <Clock size={16} color={colors.primary} />
                    <Text style={styles.time}>{getCurrentTime()}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Jadwal Hari Ini</Text>
                {scheduleToShow ? (
                    <View style={styles.scheduleContainer}>
                        <ScheduleCard schedule={scheduleToShow} />
                        {scheduleToShow.status === 'ongoing' && (
                            <Button
                                title="Absen Sekarang"
                                onPress={handleScanQR}
                                icon={<QrCode size={20} color="white" />}
                                style={styles.scanButton}
                            />
                        )}
                    </View>
                ) : (
                    <View style={styles.emptySchedule}>
                        <Calendar size={48} color={colors.secondary} />
                        <Text style={styles.emptyText}>Tidak ada jadwal hari ini</Text>
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Menu Cepat</Text>
                <View style={styles.quickMenu}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleViewSchedule}
                    >
                        <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
                            <Calendar size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.menuText}>Jadwal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleScanQR}
                    >
                        <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
                            <QrCode size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.menuText}>Absensi</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/attendance')}
                    >
                        <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
                            <Clock size={24} color={colors.primary} />
                        </View>
                        <Text style={styles.menuText}>Riwayat</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    dateTime: {
        fontSize: 14,
        color: colors.textLight,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    time: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primary,
        marginLeft: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    scheduleContainer: {
        marginBottom: 16,
    },
    scanButton: {
        marginTop: 8,
    },
    emptySchedule: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
    },
    emptyText: {
        fontSize: 16,
        color: colors.textLight,
        marginTop: 16,
        textAlign: 'center',
    },
    quickMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    menuItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    menuIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    menuText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
    },
});