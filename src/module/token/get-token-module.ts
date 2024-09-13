import path from 'path';

import { CONSTANT } from '@/config';

import { decryptTokenModule } from './decrypt-token-module';

export async function getTokenModule() {
  try {
    const gtoolsFolder = path.resolve(CONSTANT.USER.HOME, '.gtools');
    const credentialsFile = path.join(gtoolsFolder, 'credentials.json');
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
