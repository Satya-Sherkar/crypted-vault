import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// Use a secure key from environment variables or generate a fallback (WARN: Fallback is reset on restart)
// In production, ENCRYPTION_KEY must be set and consistent.
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_key_must_be_32_bytes_long!';
const ALGORITHM = 'aes-256-cbc';

// Ensure key is 32 bytes
const key = Buffer.from(ENCRYPTION_KEY).subarray(0, 32);

export function encryptBuffer(buffer: Buffer): { encryptedData: Buffer; iv: Buffer } {
    const iv = randomBytes(16);
    const cipher = createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return { encryptedData: encrypted, iv };
}

export function decryptBuffer(encryptedData: Buffer, iv: Buffer): Buffer {
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted;
}
