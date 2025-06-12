import { z } from 'zod';

export const checkInSchema = z.object({
    qrToken: z.string(),
    location: z.string().min(3),
});

export type CheckInInput = z.infer<typeof checkInSchema>;