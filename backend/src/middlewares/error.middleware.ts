import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    InternalServerError,
} from '../utils/errors';

export default function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof AppError) {
        if (err instanceof BadRequestError) {
            logger.warn(err.message);
            return res.status(err.statusCode).json({
                status: 'error',
                message: err.message,
            });
        }

        if (
            err instanceof UnauthorizedError ||
            err instanceof ForbiddenError ||
            err instanceof NotFoundError ||
            err instanceof ConflictError
        ) {
            logger.warn(err.message);
            return res.status(err.statusCode).json({
                status: 'fail',
                message: err.message,
            });
        }

        if (err instanceof InternalServerError) {
            logger.error(err.message);
            return res.status(err.statusCode).json({
                status: 'error',
                message: 'Something went wrong',
            });
        }

        logger.error(err.message);
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    logger.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
}