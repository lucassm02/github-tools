import path from 'path';

import { input } from '@inquirer/prompts';

export async function loadFileByPath() {
  const filePath = await input({
    message:
      'Enter the path to the JSON file with the branch protection settings:'
  });

  const resolvedPath = path.resolve(filePath);

  return Bun.file(resolvedPath).json();
}
