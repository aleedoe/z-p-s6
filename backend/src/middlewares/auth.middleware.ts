import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

interface JwtPayload {
    userId: string;
    role: string;
}

export const authenticate = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader?.startsWith('Bearer ')) {
                throw new UnauthorizedError('Authentication token missing');
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });

            if (!user || !user.isActive) {
                throw new UnauthorizedError('User not found or inactive');
            }

            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                throw new ForbiddenError('Insufficient permissions');
            }

            req.user = user;
            next();
        } catch (error) {
            next(error);
        }
    };
};