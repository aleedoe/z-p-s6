import crypto from 'crypto';

export function generateQRToken(): string {
    return crypto.randomBytes(32).toString('hex');
}