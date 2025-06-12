import { Router } from 'express';
import AttendanceController from '../controllers/employee/attendance.controller';
import validate from '../middlewares/validate.middleware';
import { checkInSchema } from '../validations/attendance.validation';
import scheduleController from '../controllers/admin/schedule.controller';

const router = Router();

// Schedule routes
router.get('/schedule', scheduleController.getSchedules);

// Attendance routes
router.post(
    '/attendance/check-in',
    validate(checkInSchema),
    AttendanceController.checkIn
);
router.get('/attendance/history', AttendanceController.getAttendanceHistory);

export default router;