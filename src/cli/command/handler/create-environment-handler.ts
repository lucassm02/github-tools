import type { ArgumentsCamelCase, Argv } from 'yargs';

import { CONFIG_TEMPLATE } from '@/config';
import { createOrUpdateEnvironment } from '@/module/environment';
import { confirm } from '@inquirer/prompts';

import {
  fetchRepositoriesByScope,
  loadFileByPath,
  openEditorWithTemplateFile,
  selectRepositories
} from './util';

type Args = Record<string, unknown>;

export async function createEnvironmentHandler(
  _args: ArgumentsCamelCase<Args>,
  _yargs: Argv
) {
  const SUCCESS_MESSAGE = 'Environment created successfully!';

  const loadFile = await confirm({
    message: 'Do you want to provide a JSON file with the configurations?',
    default: false
  });

  const config = loadFile
    ? await loadFileByPath()
    : await openEditorWithTemplateFile(CONFIG_TEMPLATE.ENVIRONMENT);

  const repos = await fetchRepositoriesByScope();

  const applyToAllRepositories = await confirm({
    message: 'Do you want to create this environment in all repositories?',
    default: false
  });

  if (applyToAllRepositories) {
    await createOrUpdateEnvironment({
      config,
      repos
    });

    console.info(SUCCESS_MESSAGE);
    return;
  }

  const selectedRepositories = await selectRepositories(repos);

  await createOrUpdateEnvironment({
    config,
    repos: selectedRepositories
  });

  console.info(SUCCESS_MESSAGE);
}
