import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodEffects, ZodError } from 'zod';
import { BadRequestError } from '../utils/errors';

const validate =
    (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // langsung validasi req.body
                req.body = await schema.parseAsync(req.body);
                return next();
            } catch (error: ZodError | any) {
                const errorMessage = error.errors?.[0]?.message || 'Invalid input';
                next(new BadRequestError(errorMessage));
            }
        };

export default validate;