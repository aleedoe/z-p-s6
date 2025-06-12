import { z } from 'zod';

export const createScheduleSchema = z.object({
    employeeId: z.string(),
    date: z.string().datetime(),
    shiftStart: z.string().datetime(),
    shiftEnd: z.string().datetime(),
});

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;