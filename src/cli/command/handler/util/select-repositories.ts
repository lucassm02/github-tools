import { checkbox } from '@inquirer/prompts';

type Repository = { id: string; repo: string; owner: string };

export async function selectRepositories(repos: Repository[]) {
  const choices = repos.map((item) => ({
    name: item.repo,
    value: item.id
  }));

  const selectedIds = await checkbox({
    message: 'Select in which repositories you want to create the environment',
    choices,
    loop: false,
    pageSize: 20
  });

  return repos.filter((item) => selectedIds.includes(item.id));
}
