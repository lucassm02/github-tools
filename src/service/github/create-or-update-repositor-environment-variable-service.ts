import type { RequestError } from '@/types/github';

import { octokit } from './octokit';

type Params = {
  repo: string;
  owner: string;
  environment: string;
  variables: Record<string, string>;
};

export async function createOrUpdateRepositorEnvironmentVariableService(
  params: Params
) {
  try {
    for await (const [key, value] of Object.entries(params.variables)) {
      await octokit.actions.createEnvironmentVariable({
        owner: params.owner,
        repo: params.repo,
        environment_name: params.environment,
        name: key,
        value
      });
    }
  } catch (error) {
    if (typeof error === 'object') {
      const { response } = <RequestError>error;

      console.error(
        `${response.data.message} - ${response.data.documentation_url}`
      );
    }
  }
}
