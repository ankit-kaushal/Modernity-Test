/**
 * Script to generate a TOTP secret for Google Authenticator
 * Run: node scripts/generate-totp-secret.js
 */

const { authenticator } = require('otplib');

// Generate a new secret
const secret = authenticator.generateSecret();

// Generate QR code URL
const qrUrl = authenticator.keyuri('Admin', 'Modernity Test', secret);

console.log('\n=== TOTP Secret Generated ===\n');
console.log('Add this to your .env.local file:');
console.log(`TOTP_SECRET=${secret}\n`);
console.log('QR Code URL (scan with Google Authenticator):');
console.log(qrUrl);
console.log('\nOr use this URL in any QR code generator:');
console.log(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}\n`);
console.log('After adding TOTP_SECRET to .env.local, restart your dev server.\n');

