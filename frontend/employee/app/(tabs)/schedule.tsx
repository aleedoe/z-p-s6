import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { colors } from '@/constants/colors';
import { ScheduleCard } from '@/components/ScheduleCard';
import { useUIStore } from '@/store/uiStore';
import { getSchedule } from '@/api/employee';
import { Schedule } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

export default function ScheduleScreen() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekDates, setWeekDates] = useState<Date[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const { showToast } = useUIStore();

    useEffect(() => {
        generateWeekDates(selectedDate);
        fetchSchedules();
    }, [selectedDate]);

    const generateWeekDates = (currentDate: Date) => {
        const dates: Date[] = [];
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date);
        }

        setWeekDates(dates);
    };

    const fetchSchedules = async () => {
        try {
            const startDate = weekDates[0]?.toISOString().split('T')[0];
            const endDate = weekDates[6]?.toISOString().split('T')[0];

            if (startDate && endDate) {
                const data = await getSchedule(startDate, endDate);
                setSchedules(data);
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
            showToast('Gagal memuat jadwal', 'error');

            // Mock data for demo purposes
            setSchedules(getMockSchedules());
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSchedules();
        setRefreshing(false);
    };

    const goToPreviousWeek = () => {
        const prevWeek = new Date(selectedDate);
        prevWeek.setDate(selectedDate.getDate() - 7);
        setSelectedDate(prevWeek);
    };

    const goToNextWeek = () => {
        const nextWeek = new Date(selectedDate);
        nextWeek.setDate(selectedDate.getDate() + 7);
        setSelectedDate(nextWeek);
    };

    const selectDate = (date: Date) => {
        setSelectedDate(date);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const isSelectedDate = (date: Date) => {
        return (
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear()
        );
    };

    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    };

    const getDayName = (date: Date) => {
        return date.toLocaleDateString('id-ID', { weekday: 'short' });
    };

    const getSchedulesForDate = (date: Date) => {
        const dateString = date.toISOString().split('T')[0];
        return schedules.filter(schedule => schedule.date.split('T')[0] === dateString);
    };

    // Mock data for demo purposes
    const getMockSchedules = (): Schedule[] => {
        const mockSchedules: Schedule[] = [];

        // Add schedules for some days in the week
        for (let i = 0; i < weekDates.length; i++) {
            // Skip some days to simulate days off
            if (i % 2 === 0) {
                const date = weekDates[i];
                mockSchedules.push({
                    id: `mock-${i}`,
                    date: date.toISOString(),
                    startTime: '08:00',
                    endTime: '17:00',
                    status: isToday(date) ? 'ongoing' : date < new Date() ? 'completed' : 'upcoming',
                });
            }
        }

        return mockSchedules;
    };

    const schedulesForSelectedDate = getSchedulesForDate(selectedDate);

    return (
        <View style={styles.container}>
            <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={goToPreviousWeek} style={styles.navButton}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.monthYear}>{formatMonthYear(selectedDate)}</Text>
                <TouchableOpacity onPress={goToNextWeek} style={styles.navButton}>
                    <ChevronRight size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.weekContainer}>
                {weekDates.map((date, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dayContainer,
                            isSelectedDate(date) && styles.selectedDayContainer,
                        ]}
                        onPress={() => selectDate(date)}
                    >
                        <Text
                            style={[
                                styles.dayName,
                                isSelectedDate(date) && styles.selectedDayText,
                            ]}
                        >
                            {getDayName(date)}
                        </Text>
                        <View
                            style={[
                                styles.dateCircle,
                                isToday(date) && styles.todayCircle,
                                isSelectedDate(date) && styles.selectedDateCircle,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.dateText,
                                    isToday(date) && styles.todayText,
                                    isSelectedDate(date) && styles.selectedDateText,
                                ]}
                            >
                                {date.getDate()}
                            </Text>
                        </View>
                        {getSchedulesForDate(date).length > 0 && (
                            <View style={styles.scheduleIndicator} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={styles.scheduleList}
                contentContainerStyle={styles.scheduleListContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                }
            >
                <Text style={styles.dateHeader}>
                    {selectedDate.toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                </Text>

                {schedulesForSelectedDate.length > 0 ? (
                    schedulesForSelectedDate.map(schedule => (
                        <ScheduleCard key={schedule.id} schedule={schedule} />
                    ))
                ) : (
                    <View style={styles.emptySchedule}>
                        <Text style={styles.emptyText}>Tidak ada jadwal untuk tanggal ini</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    navButton: {
        padding: 8,
    },
    monthYear: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    weekContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    dayContainer: {
        alignItems: 'center',
        width: 40,
    },
    selectedDayContainer: {
        backgroundColor: 'transparent',
    },
    dayName: {
        fontSize: 12,
        color: colors.textLight,
        marginBottom: 4,
    },
    selectedDayText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    dateCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    todayCircle: {
        backgroundColor: colors.primaryLight,
    },
    selectedDateCircle: {
        backgroundColor: colors.primary,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    todayText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    selectedDateText: {
        color: 'white',
        fontWeight: 'bold',
    },
    scheduleIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
    },
    scheduleList: {
        flex: 1,
    },
    scheduleListContent: {
        padding: 16,
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
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
        textAlign: 'center',
    },
});