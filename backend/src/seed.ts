import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Create admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@warungjoglo.com',
            password: adminPassword,
            name: 'Admin Joglo',
            role: 'ADMIN',
            phone: '+6281234567890',
        },
    });

    // Create employees
    const employeePassword = await bcrypt.hash('employee123', 10);
    const employee1 = await prisma.user.create({
        data: {
            email: 'employee1@warungjoglo.com',
            password: employeePassword,
            name: 'Budi Santoso',
            role: 'EMPLOYEE',
            phone: '+628987654321',
        },
    });

    const employee2 = await prisma.user.create({
        data: {
            email: 'employee2@warungjoglo.com',
            password: employeePassword,
            name: 'Ani Wijaya',
            role: 'EMPLOYEE',
            phone: '+628123123123',
        },
    });

    // Create sample schedules
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.schedule.createMany({
        data: [
            {
                employeeId: employee1.id,
                date: today,
                shiftStart: new Date(today.setHours(8, 0, 0, 0)),
                shiftEnd: new Date(today.setHours(16, 0, 0, 0)),
                qrToken: 'qr-token-1-' + today.toISOString(),
            },
            {
                employeeId: employee2.id,
                date: today,
                shiftStart: new Date(today.setHours(10, 0, 0, 0)),
                shiftEnd: new Date(today.setHours(18, 0, 0, 0)),
                qrToken: 'qr-token-2-' + today.toISOString(),
            },
            {
                employeeId: employee1.id,
                date: tomorrow,
                shiftStart: new Date(tomorrow.setHours(12, 0, 0, 0)),
                shiftEnd: new Date(tomorrow.setHours(20, 0, 0, 0)),
                qrToken: 'qr-token-3-' + tomorrow.toISOString(),
            },
        ],
    });

    console.log('Database seeded successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });