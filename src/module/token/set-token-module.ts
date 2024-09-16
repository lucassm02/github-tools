import path from 'path';
import { mkdirSync } from 'fs';

import { CONSTANT } from '@/config';

import { encryptTokenModule } from './encrypt-token-module';

export async function setTokenModule(token: string) {
  const encryptedToken = encryptTokenModule(token);

  const fileContent = { token: encryptedToken };

  const ghtoolsFolder = path.resolve(CONSTANT.USER.HOME, '.ghtools');
  mkdirSync(ghtoolsFolder, { recursive: true });
  const credentialsFile = path.join(ghtoolsFolder, 'credentials.json');
  await Bun.write(credentialsFile, JSON.stringify(fileContent, null, 4));
}
