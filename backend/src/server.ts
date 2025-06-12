import app from './app';
import { PrismaClient } from '@prisma/client';
import { scheduleJobs } from './jobs';
import logger from './utils/logger';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function main() {
    // Schedule background jobs
    scheduleJobs();

    const server = app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });

    process.on('SIGTERM', () => {
        logger.info('SIGTERM received. Shutting down gracefully');
        server.close(() => {
            prisma.$disconnect();
            logger.info('Server closed');
            process.exit(0);
        });
    });
}

main().catch(async (e) => {
    logger.error(e);
    await prisma.$disconnect();
    process.exit(1);
});