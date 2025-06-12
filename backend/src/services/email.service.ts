import sgMail from '@sendgrid/mail';
import logger from '../utils/logger';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
    const msg = {
        to,
        from: process.env.FROM_EMAIL!,
        subject,
        html,
    };

    try {
        await sgMail.send(msg);
        logger.info(`Email sent to ${to}`);
    } catch (error) {
        logger.error('Failed to send email:', error);
        throw error;
    }
}