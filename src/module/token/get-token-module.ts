import path from 'path';

import { CONSTANT } from '@/config';

import { decryptTokenModule } from './decrypt-token-module';

export async function getTokenModule() {
  try {
    const ghtoolsFolder = path.resolve(CONSTANT.USER.HOME, '.ghtools');
    const credentialsFile = path.join(ghtoolsFolder, 'credentials.json');
    const content = await Bun.file(credentialsFile).text();

    if (!content) {
      return null;
    }

    const { token } = JSON.parse(content);

    return decryptTokenModule(token);
  } catch (_error) {
    return null;
  }
}
