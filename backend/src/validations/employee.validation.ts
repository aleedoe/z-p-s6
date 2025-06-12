import { z } from 'zod';

export const createEmployeeSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(3),
    phone: z.string().optional(),
    role: z.enum(['ADMIN', 'EMPLOYEE']).optional(),
});

export const updateEmployeeSchema = z.object({
    name: z.string().min(3).optional(),
    phone: z.string().optional(),
    isActive: z.boolean().optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;