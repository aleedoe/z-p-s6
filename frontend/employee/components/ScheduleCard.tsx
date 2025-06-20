import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { Schedule } from '@/types';
import { Calendar, Clock } from 'lucide-react-native';

interface ScheduleCardProps {
    schedule: Schedule;
    onPress?: () => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, onPress }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming':
                return colors.primary;
            case 'ongoing':
                return colors.success;
            case 'completed':
                return colors.secondary;
            default:
                return colors.secondary;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'Akan Datang';
            case 'ongoing':
                return 'Sedang Berlangsung';
            case 'completed':
                return 'Selesai';
            default:
                return status;
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={styles.header}>
                <View style={styles.dateContainer}>
                    <Calendar size={18} color={colors.primary} />
                    <Text style={styles.date}>{formatDate(schedule.date)}</Text>
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(schedule.status) },
                    ]}
                >
                    <Text style={styles.statusText}>{getStatusText(schedule.status)}</Text>
                </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.timeContainer}>
                <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Jam Masuk</Text>
                    <View style={styles.timeValue}>
                        <Clock size={16} color={colors.primary} />
                        <Text style={styles.time}>{schedule.startTime}</Text>
                    </View>
                </View>
                <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Jam Pulang</Text>
                    <View style={styles.timeValue}>
                        <Clock size={16} color={colors.primary} />
                        <Text style={styles.time}>{schedule.endTime}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: colors.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginLeft: 8,
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
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: 12,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
});