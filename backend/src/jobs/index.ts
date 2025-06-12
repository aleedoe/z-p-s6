import cron from 'node-cron';
import { prisma } from '../utils/prisma';
import { sendEmail } from '../services/email.service';
import { sendPushNotification } from '../services/firebase.service';
import logger from '../utils/logger';

export function scheduleJobs() {
    // Daily check-in reminder at 8 AM
    cron.schedule('0 8 * * *', async () => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            // Find employees with schedules today
            const schedules = await prisma.schedule.findMany({
                where: {
                    date: {
                        gte: today,
                        lt: tomorrow,
                    },
                    isActive: true,
                },
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            fcmToken: true,
                        },
                    },
                },
            });

            for (const schedule of schedules) {
                if (schedule.employee.fcmToken) {
                    await sendPushNotification(schedule.employee.id, {
                        title: 'Reminder: Check-In Today',
                        body: `Don't forget to check in for your shift at ${schedule.shiftStart}`,
                    });
                }

                await sendEmail({
                    to: schedule.employee.email,
                    subject: 'Reminder: Check-In Today',
                    html: `Hi ${schedule.employee.name},<br><br>Don't forget to check in for your shift at ${schedule.shiftStart}.<br><br>Thank you!`,
                });
            }

            logger.info(`Sent ${schedules.length} check-in reminders`);
        } catch (error) {
            logger.error('Failed to send check-in reminders:', error);
        }
    });

    // Monthly attendance report on the 1st of each month at 9 AM
    cron.schedule('0 9 1 * *', async () => {
        try {
            const admins = await prisma.user.findMany({
                where: { role: 'ADMIN' },
                select: { email: true },
            });

            if (admins.length === 0) return;

            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            lastMonth.setDate(1);
            lastMonth.setHours(0, 0, 0, 0);

            const firstDayLastMonth = new Date(lastMonth);
            const firstDayThisMonth = new Date();
            firstDayThisMonth.setDate(1);
            firstDayThisMonth.setHours(0, 0, 0, 0);

            // Get attendance summary
            const attendanceSummary = await prisma.attendance.groupBy({
                by: ['employeeId'],
                where: {
                    checkIn: {
                        gte: firstDayLastMonth,
                        lt: firstDayThisMonth,
                    },
                },
                _count: {
                    id: true,
                },
                orderBy: {
                    _count: {
                        id: 'desc',
                    },
                },
            });

            // Get employee details
            const employeeIds = attendanceSummary.map((a: { employeeId: any; }) => a.employeeId);
            const employees = await prisma.user.findMany({
                where: { id: { in: employeeIds } },
                select: { id: true, name: true, email: true },
            });

            const summaryWithNames = attendanceSummary.map((summary: { employeeId: any; _count: { id: any; }; }) => {
                const employee = employees.find((e: { id: any; }) => e.id === summary.employeeId);
                return {
                    employeeName: employee?.name || 'Unknown',
                    employeeEmail: employee?.email || '',
                    attendanceCount: summary._count.id,
                };
            });

            // Generate HTML for email
            let html = `<h1>Monthly Attendance Report</h1>
                <p>Period: ${firstDayLastMonth.toDateString()} to ${new Date(
                firstDayThisMonth.getTime() - 1
            ).toDateString()}</p>
                <table border="1" cellpadding="5" cellspacing="0">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Email</th>
                      <th>Days Attended</th>
                    </tr>
                  </thead>
                  <tbody>`;

            summaryWithNames.forEach((item: { employeeName: any; employeeEmail: any; attendanceCount: any; }) => {
                html += `<tr>
                <td>${item.employeeName}</td>
                <td>${item.employeeEmail}</td>
                <td>${item.attendanceCount}</td>
              </tr>`;
            });

            html += `</tbody></table>`;

            // Send to all admins
            for (const admin of admins) {
                await sendEmail({
                    to: admin.email,
                    subject: 'Monthly Attendance Report',
                    html,
                });
            }

            logger.info('Sent monthly attendance reports to admins');
        } catch (error) {
            logger.error('Failed to send monthly attendance reports:', error);
        }
    });
}