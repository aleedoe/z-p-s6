import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { sendEmail } from '../services/email.service';
import { config } from '../utils/config';

class AuthController {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const accessToken = jwt.sign(
            { userId: user.id, role: user.role },
            config.jwtSecret,
            { expiresIn: parseInt(config.jwtExpiresIn, 10) }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            config.refreshTokenSecret,
            { expiresIn: parseInt(config.refreshTokenExpiresIn, 10) }
        );

        res.json({
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            },
        });
    }

    async refreshToken(req: Request, res: Response) {
        const { refreshToken } = req.body;

        try {
            const decoded = jwt.verify(
                refreshToken,
                config.refreshTokenSecret
            ) as { userId: string };

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });

            if (!user || !user.isActive) {
                throw new UnauthorizedError('User not found or inactive');
            }

            const newAccessToken = jwt.sign(
                { userId: user.id, role: user.role },
                config.jwtSecret,
                { expiresIn: parseInt(config.jwtExpiresIn, 10) }
            );

            res.json({
                status: 'success',
                data: {
                    accessToken: newAccessToken,
                },
            });
        } catch (error) {
            throw new UnauthorizedError('Invalid refresh token');
        }
    }

    async logout(req: Request, res: Response) {
        // Token blacklisting bisa diterapkan di sini
        res.json({ status: 'success', message: 'Logged out successfully' });
    }

    async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Jangan beri tahu apakah email ada untuk alasan keamanan
            throw new BadRequestError('If the email exists, a reset link will be sent');
        }

        const resetToken = jwt.sign(
            { userId: user.id },
            config.jwtSecret + user.password,
            { expiresIn: '15m' }
        );

        const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}&id=${user.id}`;

        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            html: `Please click <a href="${resetUrl}">here</a> to reset your password.`,
        });

        res.json({
            status: 'success',
            message: 'If the email exists, a reset link will be sent',
        });
    }
}

export default new AuthController();
