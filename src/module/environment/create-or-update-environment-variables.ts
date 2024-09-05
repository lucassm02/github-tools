import { octokit } from '@/service';

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
    console.error(`Failed to add secret to ${params.repo}:`, error);
  }
}

export async function createOrUpdateEnvironmentVariable(
  params: createOrUpdateEnvironmentVariableParams
) {
  for await (const item of params.repos) {
    await CreateOrUpdateToRepository({
      owner: item.owner,
      repo: item.repo,
      environment: params.environment,
      variables: params.variables
    });
  }
}
