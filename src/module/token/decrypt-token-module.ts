import { createDecipheriv, scryptSync } from 'crypto';
import { hostname } from 'os';

import { CONSTANT } from '@/config';

export function decryptTokenModule(encryptedToken: string): string {
  const [ivHex, encrypted] = encryptedToken.split('_');
  const iv = Buffer.from(ivHex, 'hex');
  const key = scryptSync(CONSTANT.ENCRYPTION_PASSWORD, hostname(), 32);
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
