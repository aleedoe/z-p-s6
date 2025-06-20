import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl, Modal } from 'react-native';
import { colors } from '@/constants/colors';
import { AttendanceItem } from '@/components/AttendanceItem';
import { QRScanner } from '@/components/QRScanner';
import { Button } from '@/components/Button';
import { useUIStore } from '@/store/uiStore';
import { getAttendanceHistory, checkInAttendance } from '@/api/employee';
import { Attendance } from '@/types';
import { QrCode, Calendar, ChevronDown } from 'lucide-react-native';

export default function AttendanceScreen() {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const { showLoading, hideLoading, showToast } = useUIStore();

    useEffect(() => {
        fetchAttendanceHistory();
    }, [selectedMonth, selectedYear]);

    const fetchAttendanceHistory = async () => {
        try {
            const month = (selectedMonth + 1).toString().padStart(2, '0');
            const year = selectedYear.toString();

            const data = await getAttendanceHistory(month, year);
            setAttendances(data);
        } catch (error) {
            console.error('Error fetching attendance history:', error);
            showToast('Gagal memuat riwayat absensi', 'error');

            // Mock data for demo purposes
            setAttendances(getMockAttendances());
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAttendanceHistory();
        setRefreshing(false);
    };

    const handleScanQR = () => {
        setShowScanner(true);
    };

    const handleCloseScanner = () => {
        setShowScanner(false);
    };

    const handleQRScanned = async (data: string) => {
        showLoading('Memproses absensi...');

        try {
            await checkInAttendance(data);
            hideLoading();
            setShowScanner(false);
            showToast('Absensi berhasil', 'success');
            fetchAttendanceHistory();
        } catch (error) {
            hideLoading();
            setShowScanner(false);
            showToast(
                error instanceof Error ? error.message : 'Absensi gagal, silakan coba lagi',
                'error'
            );
        }
    };

    const handleMonthYearSelect = (month: number, year: number) => {
        setSelectedMonth(month);
        setSelectedYear(year);
        setShowMonthPicker(false);
    };

    const getMonthName = (month: number) => {
        const date = new Date();
        date.setMonth(month);
        return date.toLocaleString('id-ID', { month: 'long' });
    };

    // Mock data for demo purposes
    const getMockAttendances = (): Attendance[] => {
        const mockAttendances: Attendance[] = [];
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            // Skip weekends and some random days
            if (i % 7 !== 0 && i % 7 !== 6 && Math.random() > 0.3) {
                const date = new Date(selectedYear, selectedMonth, i);

                // Skip future dates
                if (date > new Date()) continue;

                const isLate = Math.random() > 0.8;

                mockAttendances.push({
                    id: `mock-${i}`,
                    date: date.toISOString(),
                    checkInTime: isLate ? '08:15' : '07:55',
                    checkOutTime: '17:05',
                    status: isLate ? 'late' : 'on-time',
                });
            }
        }

        return mockAttendances.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.monthSelector}
                    onPress={() => setShowMonthPicker(true)}
                >
                    <Calendar size={20} color={colors.primary} />
                    <Text style={styles.monthYear}>
                        {getMonthName(selectedMonth)} {selectedYear}
                    </Text>
                    <ChevronDown size={20} color={colors.primary} />
                </TouchableOpacity>

                <Button
                    title="Scan QR"
                    onPress={handleScanQR}
                    icon={<QrCode size={20} color="white" />}
                    size="small"
                />
            </View>

            <ScrollView
                style={styles.attendanceList}
                contentContainerStyle={styles.attendanceListContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                }
            >
                {attendances.length > 0 ? (
                    attendances.map(attendance => (
                        <AttendanceItem key={attendance.id} attendance={attendance} />
                    ))
                ) : (
                    <View style={styles.emptyAttendance}>
                        <Text style={styles.emptyText}>Tidak ada riwayat absensi untuk bulan ini</Text>
                    </View>
                )}
            </ScrollView>

            {/* Month Picker Modal */}
            <Modal
                visible={showMonthPicker}
                transparent
                animationType="fade"
                onRequestClose={() => setShowMonthPicker(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowMonthPicker(false)}
                >
                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <Text style={styles.modalTitle}>Pilih Bulan</Text>
                        <View style={styles.monthGrid}>
                            {Array.from({ length: 12 }, (_, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[
                                        styles.monthItem,
                                        selectedMonth === i && styles.selectedMonthItem,
                                    ]}
                                    onPress={() => handleMonthYearSelect(i, selectedYear)}
                                >
                                    <Text
                                        style={[
                                            styles.monthItemText,
                                            selectedMonth === i && styles.selectedMonthItemText,
                                        ]}
                                    >
                                        {getMonthName(i)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.yearSelector}>
                            <TouchableOpacity
                                style={styles.yearButton}
                                onPress={() => setSelectedYear(selectedYear - 1)}
                            >
                                <Text style={styles.yearButtonText}>{selectedYear - 1}</Text>
                            </TouchableOpacity>
                            <Text style={styles.currentYear}>{selectedYear}</Text>
                            <TouchableOpacity
                                style={styles.yearButton}
                                onPress={() => setSelectedYear(selectedYear + 1)}
                                disabled={selectedYear >= new Date().getFullYear()}
                            >
                                <Text
                                    style={[
                                        styles.yearButtonText,
                                        selectedYear >= new Date().getFullYear() && styles.disabledText,
                                    ]}
                                >
                                    {selectedYear + 1}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* QR Scanner Modal */}
            {showScanner && (
                <QRScanner onScan={handleQRScanned} onClose={handleCloseScanner} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    monthYear: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginHorizontal: 8,
    },
    attendanceList: {
        flex: 1,
    },
    attendanceListContent: {
        padding: 16,
    },
    emptyAttendance: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
        marginTop: 16,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textLight,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.background,
        borderRadius: 16,
        padding: 20,
        width: '80%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
        textAlign: 'center',
    },
    monthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    monthItem: {
        width: '30%',
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: colors.card,
    },
    selectedMonthItem: {
        backgroundColor: colors.primary,
    },
    monthItemText: {
        fontSize: 14,
        color: colors.text,
    },
    selectedMonthItemText: {
        color: 'white',
        fontWeight: 'bold',
    },
    yearSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    yearButton: {
        padding: 8,
    },
    yearButtonText: {
        fontSize: 16,
        color: colors.primary,
    },
    currentYear: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginHorizontal: 16,
    },
    disabledText: {
        color: colors.textLight,
    },
});