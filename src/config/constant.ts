import { generateUniquePassword } from '@/util/generate-unique-password';

export default {
  GITHUB_TOKEN: process.env.GITHUB_TOKEN ?? null,
  ENCRYPTION_PASSWORD: generateUniquePassword(),
  USER: {
    HOME: process.env.HOME ?? '/root',
    SHELL: process.env.SHELL ?? null,
    GTOOLS_EDITOR: process.env.GTOOLS_EDITOR ?? null
  }
};
