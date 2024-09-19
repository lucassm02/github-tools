import { userInfo } from 'os';

import { generateUniquePassword } from '@/util/generate-unique-password';

const { homedir, shell } = userInfo();

export default {
  ENCRYPTION_PASSWORD: generateUniquePassword(),
  USER: {
    HOME: homedir,
    SHELL: shell,
    GHTOOLS_EDITOR: process.env.GHTOOLS_EDITOR ?? null
  }
};
