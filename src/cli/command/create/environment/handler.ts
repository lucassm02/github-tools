import type { ArgumentsCamelCase, Argv } from 'yargs';

import { createOrUpdateEnvironment } from '@/module/environment/create-or-update-environment';
import { getRepositories } from '@/module/repository';
import { checkbox, confirm, input, select } from '@inquirer/prompts';
import ora from 'ora';

type Args = Record<string, unknown>;

export async function createEnvironmentHandler(
  _args: ArgumentsCamelCase<Args>,
  _yargs: Argv
) {
  const environmentName = await input({ message: 'Enter environment name:' });

  const scope = await select({
    message: 'Select a GitHub scope',
    choices: [
      {
        name: 'Org',
        value: 'ORG',
        description: 'Filter repositories based on the provided organization'
      },
      {
        name: 'User',
        value: 'USER',
        description: 'Filter repositories based on the provided user'
      },
      {
        name: 'All',
        value: 'ALL',
        description: `Fetch all repositories within the token's access level`
      }
    ]
  });

  const org = scope === 'ORG' && (await input({ message: 'Enter org name:' }));

  const username =
    scope === 'USER' && (await input({ message: 'Enter user name:' }));

  const spinner = ora({
    text: 'Fetching repositories...',
    spinner: 'dots',
    color: 'cyan'
  }).start();

  const rawRepositoriesPayload = await getRepositories({
    ...(org && { org }),
    ...(username && { username })
  });

  const repos = rawRepositoriesPayload.map((item) => ({
    id: item.id,
    repo: item.name,
    owner: <string>item.owner.login
  }));

  spinner.succeed('Fetch completed!');

  const applyToAllRepositories = await confirm({
    message: 'Do you want to create this environment in all repositories?'
  });

  if (applyToAllRepositories) {
    await createOrUpdateEnvironment({
      environment: environmentName,
      repos
    });

    return;
  }

  const choices = repos.map((item) => ({
    name: item.repo,
    value: item.id
  }));

  const selectedIds = await checkbox({
    message: 'Select in which repositories you want to create the environment',
    choices: choices,
    loop: false,
    pageSize: 20
  });

  const selectedRepositories = repos.filter((item) =>
    selectedIds.includes(item.id)
  );

  await createOrUpdateEnvironment({
    environment: environmentName,
    repos: selectedRepositories
  });
}
