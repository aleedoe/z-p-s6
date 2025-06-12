import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import { BadRequestError } from '../../utils/errors';
import { generateQRToken } from '../../utils/qrGenerator';

class ScheduleController {
    async createSchedule(req: Request, res: Response) {
        const { employeeId, date, shiftStart, shiftEnd } = req.body;

        // Check if employee exists
        const employee = await prisma.user.findUnique({
            where: { id: employeeId },
        });
        if (!employee || employee.role !== 'EMPLOYEE') {
            throw new BadRequestError('Invalid employee ID');
        }

        // Generate unique QR token for this schedule
        const qrToken = generateQRToken();

        const schedule = await prisma.schedule.create({
            data: {
                employeeId,
                date: new Date(date),
                shiftStart: new Date(shiftStart),
                shiftEnd: new Date(shiftEnd),
                qrToken,
            },
        });

        res.json({ status: 'success', data: schedule });
    }

    async getSchedules(req: Request, res: Response) {
        const { date, employeeId } = req.query;

        const where: any = {};
        if (date) {
            const targetDate = new Date(date as string);
            const nextDay = new Date(targetDate);
            nextDay.setDate(nextDay.getDate() + 1);

            where.date = {
                gte: targetDate,
                lt: nextDay,
            };
        }

        if (employeeId) {
            where.employeeId = employeeId as string;
        }

        const schedules = await prisma.schedule.findMany({
            where,
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        res.json({ status: 'success', data: schedules });
    }

    async updateSchedule(req: Request, res: Response) {
        const { id } = req.params;
        const { employeeId, date, shiftStart, shiftEnd, isActive } =
            req.body;

        const schedule = await prisma.schedule.update({
            where: { id },
            data: {
                employeeId,
                date: date ? new Date(date) : undefined,
                shiftStart: shiftStart ? new Date(shiftStart) : undefined,
                shiftEnd: shiftEnd ? new Date(shiftEnd) : undefined,
                isActive,
            },
        });

        res.json({ status: 'success', data: schedule });
    }

    async deleteSchedule(req: Request, res: Response) {
        const { id } = req.params;

        await prisma.schedule.delete({ where: { id } });

        res.json({ status: 'success', message: 'Schedule deleted successfully' });
    }
}

export default new ScheduleController();