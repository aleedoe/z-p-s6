import { Router } from 'express';
import EmployeeController from '../controllers/admin/employee.controller';
import ScheduleController from '../controllers/admin/schedule.controller';
import AttendanceController from '../controllers/admin/attendance.controller'; // Fixed import
import validate from '../middlewares/validate.middleware';
import {
    createEmployeeSchema,
    updateEmployeeSchema,
} from '../validations/employee.validation';
import { createScheduleSchema } from '../validations/schedule.validation';

const router = Router();

// Employee routes
router.get('/employees', EmployeeController.getEmployees);
router.post(
    '/employees',
    validate(createEmployeeSchema),
    EmployeeController.createEmployee
);
router.get('/employees/:id', EmployeeController.getEmployee);
router.put(
    '/employees/:id',
    validate(updateEmployeeSchema),
    EmployeeController.updateEmployee
);
router.delete('/employees/:id', EmployeeController.deleteEmployee);

// Schedule routes
router.get('/schedules', ScheduleController.getSchedules);
router.post(
    '/schedules',
    validate(createScheduleSchema),
    ScheduleController.createSchedule
);
router.put('/schedules/:id', ScheduleController.updateSchedule);
router.delete('/schedules/:id', ScheduleController.deleteSchedule);

// Attendance routes
router.get('/attendance/daily', AttendanceController.getDailyAttendance);
router.get('/attendance/monthly', AttendanceController.getMonthlyAttendance);

export default router;