/**
 * Utility to generate TOTP secret for Google Authenticator setup
 * Run this once to generate a secret, then add it to your .env.local
 */

import { authenticator } from 'otplib';

export function generateSecret(): string {
  return authenticator.generateSecret();
}

export function generateQRCodeUrl(secret: string, accountName: string = 'Modernity Test Admin'): string {
  const serviceName = 'Modernity Test';
  return authenticator.keyuri(accountName, serviceName, secret);
}

/**
 * To set up Google Authenticator:
 * 
 * 1. Generate a secret:
 *    const secret = generateSecret();
 *    console.log('Your TOTP_SECRET:', secret);
 * 
 * 2. Add to .env.local:
 *    TOTP_SECRET=your_generated_secret_here
 * 
 * 3. Generate QR code URL:
 *    const qrUrl = generateQRCodeUrl(secret);
 *    console.log('QR Code URL:', qrUrl);
 * 
 * 4. Scan the QR code with Google Authenticator app
 * 
 * Or use an online QR code generator with the URL
 */

