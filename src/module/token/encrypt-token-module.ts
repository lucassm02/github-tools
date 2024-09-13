import { createCipheriv, randomBytes, scryptSync } from 'crypto';
import { hostname } from 'os';

import { CONSTANT } from '@/config';

export function encryptTokenModule(token: string): string {
  const iv = randomBytes(16);
  const key = scryptSync(CONSTANT.ENCRYPTION_PASSWORD, hostname(), 32);
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}_${encrypted}`;
}
