import path from 'path';
import { mkdirSync } from 'fs';

import { CONSTANT } from '@/config';

import { encryptTokenModule } from './encrypt-token-module';

export async function setTokenModule(token: string) {
  const encryptedToken = encryptTokenModule(token);

  const fileContent = { token: encryptedToken };

  const gtoolsFolder = path.resolve(CONSTANT.USER.HOME, '.gtools');
  mkdirSync(gtoolsFolder, { recursive: true });
  const credentialsFile = path.join(gtoolsFolder, 'credentials.json');
  await Bun.write(credentialsFile, JSON.stringify(fileContent, null, 4));
}
