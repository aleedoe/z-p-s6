import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import { startOfDay, endOfDay } from 'date-fns';

export default class DashboardController {
    static async getDashboardStats(req: Request, res: Response) {
        try {
            const todayStart = startOfDay(new Date());
            const todayEnd = endOfDay(new Date());

            // Get total active employees
            const totalEmployees = await prisma.user.count({
                where: {
                    role: 'EMPLOYEE',
                    isActive: true,
                },
            });

            // Get today's schedules count
            const todayScheduled = await prisma.schedule.count({
                where: {
                    date: {
                        gte: todayStart,
                        lte: todayEnd,
                    },
                    isActive: true,
                },
            });

            // Get today's checked in employees
            const todayCheckedIn = await prisma.attendance.count({
                where: {
                    checkIn: {
                        gte: todayStart,
                        lte: todayEnd,
                    },
                },
            });

            // Get pending schedules (schedules without attendance)
            const pendingSchedules = await prisma.schedule.count({
                where: {
                    date: {
                        gte: todayStart,
                        lte: todayEnd,
                    },
                    isActive: true,
                    attendances: {
                        none: {},
                    },
                },
            });

            // Get recent activities (last 3 attendances and schedule changes)
            const recentAttendances = await prisma.attendance.findMany({
                take: 3,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    employee: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            const recentActivities = recentAttendances.map((attendance) => ({
                type: 'CHECK_IN',
                employeeName: attendance.employee.name,
                time: attendance.checkIn,
                createdAt: attendance.createdAt,
            }));

            res.json({
                data: {
                    totalEmployees,
                    todayScheduled,
                    todayCheckedIn,
                    pendingSchedules,
                    recentActivities,
                }
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}