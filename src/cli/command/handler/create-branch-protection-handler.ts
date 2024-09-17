import type { ArgumentsCamelCase, Argv } from 'yargs';

import { CONFIG_TEMPLATE } from '@/config';
import { createBranchProtectionModule } from '@/module/repository';
import { confirm } from '@inquirer/prompts';

import {
  fetchRepositoriesByScope,
  loadFileByPath,
  openEditorWithTemplateFile,
  selectRepositories
} from './util';

type Args = Record<string, unknown>;

export async function createBranchProtectionHandler(
  _args: ArgumentsCamelCase<Args>,
  _yargs: Argv
) {
  const SUCCESS_MESSAGE = 'Branch protection created successfully!';

  const loadFile = await confirm({
    message: 'Do you want to provide a JSON file with the configurations?',
    default: false
  });

  const config = loadFile
    ? await loadFileByPath()
    : await openEditorWithTemplateFile(CONFIG_TEMPLATE.BRANCH_PROTECTION_RULE);

  const repos = await fetchRepositoriesByScope();

  const applyToAllRepositories = await confirm({
    message: 'Do you want to create this protection in all repositories?',
    default: false
  });

  if (applyToAllRepositories) {
    await createBranchProtectionModule({ rule: config, repos });
    console.info(SUCCESS_MESSAGE);

    return;
  }

  const selectedRepositories = await selectRepositories(repos);

  await createBranchProtectionModule({
    rule: config,
    repos: selectedRepositories
  });

  console.info(SUCCESS_MESSAGE);
}
