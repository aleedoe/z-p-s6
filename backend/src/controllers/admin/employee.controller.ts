import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../utils/prisma';
import { BadRequestError } from '../../utils/errors';

class EmployeeController {
    async createEmployee(req: Request, res: Response) {
        const { email, password, name, phone, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new BadRequestError('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                role: role || 'EMPLOYEE',
            },
        });

        res.json({
            status: 'success',
            data: {
                id: employee.id,
                email: employee.email,
                name: employee.name,
                role: employee.role,
            },
        });
    }

    async getEmployees(req: Request, res: Response) {
        const employees = await prisma.user.findMany({
            where: { role: 'EMPLOYEE' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isActive: true,
                createdAt: true,
            },
        });

        res.json({ status: 'success', data: employees });
    }

    async getEmployee(req: Request, res: Response) {
        const { id } = req.params;

        const employee = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isActive: true,
                createdAt: true,
            },
        });

        if (!employee) {
            throw new BadRequestError('Employee not found');
        }

        res.json({ status: 'success', data: employee });
    }

    async updateEmployee(req: Request, res: Response) {
        const { id } = req.params;
        const { name, phone, isActive } = req.body;

        const employee = await prisma.user.update({
            where: { id },
            data: { name, phone, isActive },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isActive: true,
            },
        });

        res.json({ status: 'success', data: employee });
    }

    async deleteEmployee(req: Request, res: Response) {
        const { id } = req.params;

        await prisma.user.delete({ where: { id } });

        res.json({ status: 'success', message: 'Employee deleted successfully' });
    }
}

export default new EmployeeController();