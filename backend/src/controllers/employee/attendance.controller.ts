import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import { BadRequestError } from '../../utils/errors';
import { sendPushNotification } from '../../services/firebase.service';

class AttendanceController {
    async checkIn(req: Request, res: Response) {
        const { qrToken } = req.body;
        const employeeId = req.user!.id;

        // Find the schedule for this QR token
        const schedule = await prisma.schedule.findFirst({
            where: {
                qrToken,
                date: {
                    lte: new Date(new Date().setHours(23, 59, 59, 999)),
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
                employeeId,
                isActive: true,
            },
        });

        if (!schedule) {
            throw new BadRequestError('Invalid QR code or schedule not found');
        }

        // Check if already checked in
        const existingAttendance = await prisma.attendance.findFirst({
            where: {
                scheduleId: schedule.id,
                employeeId,
            },
        });

        if (existingAttendance) {
            throw new BadRequestError('Already checked in for this schedule');
        }

        // Create attendance record
        const attendance = await prisma.attendance.create({
            data: {
                employeeId,
                scheduleId: schedule.id,
                checkIn: new Date(),
            },
            include: {
                employee: {
                    select: {
                        name: true,
                    },
                },
                schedule: {
                    select: {
                        shiftStart: true,
                        shiftEnd: true,
                    },
                },
            },
        });

        // Notify admin
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { id: true },
        });

        for (const admin of admins) {
            await sendPushNotification(admin.id, {
                title: 'Employee Check-In',
                body: `${attendance.employee.name} has checked`,
            });
        }

        res.json({
            status: 'success',
            data: attendance,
        });
    }

    async getAttendanceHistory(req: Request, res: Response) {
        const employeeId = req.user!.id;
        const { startDate, endDate } = req.query;

        const where: any = { employeeId };

        if (startDate && endDate) {
            where.checkIn = {
                gte: new Date(startDate as string),
                lte: new Date(endDate as string),
            };
        }

        const attendance = await prisma.attendance.findMany({
            where,
            orderBy: { checkIn: 'desc' },
            include: {
                schedule: {
                    select: {
                        date: true,
                        shiftStart: true,
                        shiftEnd: true,
                    },
                },
            },
        });

        res.json({ status: 'success', data: attendance });
    }
}

export default new AttendanceController();