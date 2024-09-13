import ora from 'ora';

import { input, select } from '@inquirer/prompts';
import { getRepositories } from '@/service';

export async function fetchRepositoriesByScope() {
  const spinner = ora({
    text: 'Fetching repositories...',
    spinner: 'dots',
    color: 'cyan'
  });

  async function fetch() {
    const scope = await select({
      message: 'Select a GitHub scope',
      choices: [
        {
          name: 'org',
          value: 'ORG',
          description: 'Filter repositories based on the provided organization'
        },
        {
          name: 'user',
          value: 'USER',
          description: 'Filter repositories based on the provided user'
        },
        {
          name: 'all',
          value: 'ALL',
          description: `Fetch all repositories within the token's access level`
        }
      ]
    });

    if (scope === 'ORG') {
      const org = await input({ message: 'Enter org name:' });
      spinner.start();
      return getRepositories({
        org
      });
    }

    if (scope === 'USER') {
      const username = await input({ message: 'Enter user name:' });
      spinner.start();
      return getRepositories({
        username
      });
    }

    spinner.start();
    return getRepositories({});
  }

  const repositories = await fetch();

  console.log(repositories);

  spinner.succeed('Fetch completed!');

  return repositories;
}
