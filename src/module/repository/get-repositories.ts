import { octokit } from '@/service';
import type { RestEndpointMethodTypes } from '@octokit/rest';

type RepoTypes = 'listForOrg' | 'listForUser' | 'listForAuthenticatedUser';

type Repositories<T extends RepoTypes> =
  RestEndpointMethodTypes['repos'][T]['response']['data'];

type ParamsForUser = { username: string };
type ParamsForOrg = { org: string };

type Params = { username?: string; org?: string };

export async function getRepositories(
  params: ParamsForUser
): Promise<Repositories<'listForUser'>>;
export async function getRepositories(
  params: ParamsForOrg
): Promise<Repositories<'listForOrg'>>;
export async function getRepositories(
  params: Params
): Promise<Repositories<'listForAuthenticatedUser'>>;
export async function getRepositories(params: Params): Promise<unknown[]> {
  const getHandler = () => {
    if (params.username) {
      return (page: number) => {
        return octokit.repos.listForUser({
          page,
          username: params.username!
        });
      };
    }

    if (params.org) {
      return (page: number) => {
        return octokit.repos.listForOrg({
          org: params.org!,
          page
        });
      };
    }

    return (page: number) => {
      return octokit.repos.listForAuthenticatedUser({ page });
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

    repos.push.apply(repos, data);

    page++;
  }

  return repos;
}
