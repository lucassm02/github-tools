import type { ArgumentsCamelCase, Argv } from 'yargs';

import { CONFIG_TEMPLATE } from '@/config';
import { createOrUpdateEnvironmentVariable as handler } from '@/module/environment';
import { confirm, input } from '@inquirer/prompts';

import {
  fetchRepositoriesByScope,
  loadFileByPath,
  openEditorWithTemplateFile,
  selectRepositories
} from './util';

type Args = Record<string, unknown>;

export async function createOrUpdateEnvironmentVariableHandler(
  _args: ArgumentsCamelCase<Args>,
  _yargs: Argv
) {
  const SUCCESS_MESSAGE = 'Environment variables created successfully!';

  const environmentName = await input({ message: 'Enter environment name:' });

  const loadFile = await confirm({
    message: 'Do you want to provide a JSON file with the configurations?'
  });

  const variables = loadFile
    ? await loadFileByPath()
    : await openEditorWithTemplateFile(CONFIG_TEMPLATE.ENVIRONMENT_VARIABLE);

  const repos = await fetchRepositoriesByScope();

  const applyToAllRepositories = await confirm({
    message:
      'Do you want to create this environment variable in all repositories?'
  });

  if (applyToAllRepositories) {
    await handler({
      environment: environmentName,
      variables,
      repos
    });

    console.info(SUCCESS_MESSAGE);

    return;
  }

  const selectedRepositories = await selectRepositories(repos);

  await handler({
    environment: environmentName,
    variables,
    repos: selectedRepositories
  });

  console.info(SUCCESS_MESSAGE);
}
