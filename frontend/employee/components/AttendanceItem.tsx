import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { Attendance } from '@/types';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react-native';

interface AttendanceItemProps {
    attendance: Attendance;
}

export const AttendanceItem: React.FC<AttendanceItemProps> = ({ attendance }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'on-time':
                return colors.success;
            case 'late':
                return colors.warning;
            case 'absent':
                return colors.error;
            default:
                return colors.secondary;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'on-time':
                return 'Tepat Waktu';
            case 'late':
                return 'Terlambat';
            case 'absent':
                return 'Tidak Hadir';
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'on-time':
                return <CheckCircle size={16} color={colors.success} />;
            case 'late':
                return <Clock size={16} color={colors.warning} />;
            case 'absent':
                return <AlertCircle size={16} color={colors.error} />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.dateContainer}>
                <Text style={styles.date}>{formatDate(attendance.date)}</Text>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(attendance.status) },
                    ]}
                >
                    <Text style={styles.statusText}>{getStatusText(attendance.status)}</Text>
                </View>
            </View>
            <View style={styles.timeContainer}>
                <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Jam Masuk</Text>
                    <View style={styles.timeValue}>
                        <Clock size={16} color={colors.primary} />
                        <Text style={styles.time}>{attendance.checkInTime}</Text>
                    </View>
                </View>
                {attendance.checkOutTime && (
                    <View style={styles.timeBlock}>
                        <Text style={styles.timeLabel}>Jam Pulang</Text>
                        <View style={styles.timeValue}>
                            <Clock size={16} color={colors.primary} />
                            <Text style={styles.time}>{attendance.checkOutTime}</Text>
                        </View>
                    </View>
                )}
            </View>
            <View style={styles.statusContainer}>
                {getStatusIcon(attendance.status)}
                <Text style={[styles.statusDetail, { color: getStatusColor(attendance.status) }]}>
                    {getStatusText(attendance.status)}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    date: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    timeBlock: {
        flex: 1,
    },
    timeLabel: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 4,
    },
    timeValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    time: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginLeft: 6,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 12,
    },
    statusDetail: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    },
});