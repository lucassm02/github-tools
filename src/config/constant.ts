import { generateUniquePassword } from '@/util/generate-unique-password';

export default {
  ENCRYPTION_PASSWORD: generateUniquePassword(),
  USER: {
    HOME: process.env.HOME ?? '/root',
    SHELL: process.env.SHELL ?? null,
    GHTOOLS_EDITOR: process.env.GHTOOLS_EDITOR ?? null
  }
};
