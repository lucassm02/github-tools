/* eslint-disable prefer-spread */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */

import { octokit } from './octokit';

type Params = { username?: string; org?: string };
type Repository = { id: string; repo: string; owner: string };

export async function getRepositories(params: Params): Promise<Repository[]> {
  const getHandler = () => {
    if (params.username) {
      return (page: number) => {
        return octokit.repos.listForUser({
          page,
          username: params.username!,
          sort: 'full_name'
        });
      };
    }

    if (params.org) {
      return (page: number) => {
        return octokit.repos.listForOrg({
          org: params.org!,
          page,
          sort: 'full_name'
        });
      };
    }

    return (page: number) => {
      return octokit.repos.listForAuthenticatedUser({
        page,
        sort: 'full_name'
      });
    };
  };

  const handler = getHandler();
  const repos: unknown[] = [];

  let page = 1;

  while (true) {
    const { data } = await handler(page);

    if (data.length === 0) {
      break;
    }

    const repositories = data.map((item) => ({
      id: item.id,
      repo: item.name,
      owner: item.owner.login
    }));

    repos.push.apply(repos, repositories);

    page++;
  }

  return <Repository[]>repos;
}
