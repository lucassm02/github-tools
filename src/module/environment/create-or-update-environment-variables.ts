import { octokit } from '@/service';
import type { RequestError } from '@/types/github';
import { createOrUpdateEnvironment } from './create-or-update-environment';

type CreateOrUpdateToRepositoryParams = {
  repo: string;
  owner: string;
  environment: string;
  variables: Record<string, string>;
};

type createOrUpdateEnvironmentVariableParams = {
  repos: { repo: string; owner: string }[];
  environment: string;
  variables: Record<string, string>;
};

async function CreateOrUpdateToRepository(
  params: CreateOrUpdateToRepositoryParams
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

export async function createOrUpdateEnvironmentVariable(
  params: createOrUpdateEnvironmentVariableParams
) {
  await createOrUpdateEnvironment({
    config: { environment_name: params.environment },
    repos: params.repos
  });

  for await (const item of params.repos) {
    await CreateOrUpdateToRepository({
      owner: item.owner,
      repo: item.repo,
      environment: params.environment,
      variables: params.variables
    });
  }
}
