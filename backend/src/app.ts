import express from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import employeeRoutes from './routes/employee.routes';
import errorHandler from './middlewares/error.middleware';
import { authenticate } from './middlewares/auth.middleware';
import { initializeFirebase } from './services/firebase.service';
import logger from './utils/logger';

const app = express();

// Initialize Firebase with error handling
try {
    initializeFirebase();
} catch (error: any) {
    logger.error(`Firebase initialization error: ${error.message}`);
}

// Middlewares
app.use(pinoHttp());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/admin', authenticate(['ADMIN']), adminRoutes);
app.use('/employee', authenticate(['EMPLOYEE']), employeeRoutes);

// Error handler
app.use(errorHandler as express.ErrorRequestHandler);

export default app;