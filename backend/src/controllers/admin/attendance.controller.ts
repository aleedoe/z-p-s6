import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import { BadRequestError } from '../../utils/errors';

class AttendanceController {
    async getDailyAttendance(req: Request, res: Response) {
        const { date } = req.query;

        if (!date || typeof date !== 'string') {
            throw new BadRequestError('Date parameter is required');
        }

        const targetDate = new Date(date);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const attendance = await prisma.attendance.findMany({
            where: {
                checkIn: {
                    gte: targetDate,
                    lt: nextDay,
                },
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                schedule: {
                    select: {
                        shiftStart: true,
                        shiftEnd: true,
                        location: true,
                    },
                },
            },
            orderBy: {
                checkIn: 'asc',
            },
        });

        res.json({
            status: 'success',
            data: attendance,
        });
    }

    async getMonthlyAttendance(req: Request, res: Response) {
        const { month, year } = req.query;

        if (!month || !year || typeof month !== 'string' || typeof year !== 'string') {
            throw new BadRequestError('Month and year parameters are required');
        }

        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0);
        endDate.setHours(23, 59, 59, 999);

        // Get all attendance records for the month
        const attendance = await prisma.attendance.findMany({
            where: {
                checkIn: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                schedule: {
                    select: {
                        date: true,
                        shiftStart: true,
                        shiftEnd: true,
                        location: true,
                    },
                },
            },
        });

        // Group by employee
        const employeeMap = new Map<string, any>();
        attendance.forEach((record: { employeeId: string; employee: any; }) => {
            if (!employeeMap.has(record.employeeId)) {
                employeeMap.set(record.employeeId, {
                    employee: record.employee,
                    records: [],
                });
            }
            employeeMap.get(record.employeeId).records.push(record);
        });

        // Convert to array format
        const result = Array.from(employeeMap.values());

        res.json({
            status: 'success',
            data: result,
        });
    }
}

export default new AttendanceController();