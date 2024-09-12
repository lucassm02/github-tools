import { octokit } from '@/service';
import type { RequestError } from '@/types/github';

type CreateOrUpdateToRepositoryParams = {
  repo: string;
  owner: string;
  config: Record<string, unknown>;
};

type createOrUpdateEnvironmentParams = {
  repos: { repo: string; owner: string }[];
  config: Record<string, unknown>;
};

async function CreateOrUpdateToRepository(
  params: CreateOrUpdateToRepositoryParams
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

export async function createOrUpdateEnvironment(
  params: createOrUpdateEnvironmentParams
) {
  for await (const item of params.repos) {
    await CreateOrUpdateToRepository({
      owner: item.owner,
      repo: item.repo,
      config: params.config
    });
  }
}
