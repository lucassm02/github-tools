import type { RequestError } from '@/types/github';

import { octokit } from './octokit';

type Params = {
  repo: string;
  owner: string;
  config: Record<string, unknown>;
};

export async function createOrUpdateRepositoryEnvironmentService(
  params: Params
) {
  try {
    await octokit.repos.createOrUpdateEnvironment({
      environment_name: <string>params.config.environment_name,
      owner: params.owner,
      repo: params.repo,
      ...params.config
    });
  } catch (error) {
    if (typeof error === 'object') {
      const { response } = <RequestError>error;

      console.error(
        `${response.data.message} - ${response.data.documentation_url}`
      );
    }
  }
}
