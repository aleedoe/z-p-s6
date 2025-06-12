// src/services/firebase.service.ts
import admin from 'firebase-admin';
import path from 'path';
import { prisma } from '../utils/prisma';
import logger from '../utils/logger';

let firebaseApp: admin.app.App;

export function initializeFirebase() {
    if (admin.apps.length > 0) {
        firebaseApp = admin.apps[0]!;
        return;
    }

    try {
        const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH!;
        const fullPath = path.resolve(serviceAccountPath);
        const serviceAccount = require(fullPath);

        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        logger.info('Firebase initialized successfully');
    } catch (error: any) {
        logger.error('Failed to initialize Firebase:', error.message);
        throw new Error(`Firebase initialization failed: ${error.message}`);
    }
}

export async function sendPushNotification(
    userId: string,
    notification: { title: string; body: string },
    data?: Record<string, string>
) {
    if (!firebaseApp) {
        throw new Error('Firebase not initialized');
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        const fcmToken = (user as any).fcmToken;

        if (!fcmToken) {
            logger.warn(`No FCM token found for user ${userId}`);
            return;
        }

        const message = {
            token: fcmToken,
            notification: {
                title: notification.title,
                body: notification.body,
            },
            data,
        };

        await admin.messaging().send(message);
        logger.info(`Push notification sent to user ${userId}`);

        // Store notification in database
        await prisma.notification.create({
            data: {
                userId,
                title: notification.title,
                message: notification.body,
            },
        });
    } catch (error: any) {
        logger.error('Failed to send push notification:', error.message);
        throw error;
    }
}
