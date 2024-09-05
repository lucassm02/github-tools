import { octokit } from '@/service';

type CreateOrUpdateToRepositoryParams = {
  repo: string;
  owner: string;
  environment: string;
};

type createOrUpdateEnvironmentParams = {
  repos: { repo: string; owner: string }[];
  environment: string;
};

async function CreateOrUpdateToRepository(
  params: CreateOrUpdateToRepositoryParams
) {
  try {
    await octokit.repos.createOrUpdateEnvironment({
      environment_name: params.environment,
      owner: params.owner,
      repo: params.repo
    });

    console.log('deu bom!');
  } catch (error) {
    console.error(`Failed to add secret to ${params.repo}:`, error);
  }
}

export async function createOrUpdateEnvironment(
  params: createOrUpdateEnvironmentParams
) {
  for await (const item of params.repos) {
    await CreateOrUpdateToRepository({
      owner: item.owner,
      repo: item.repo,
      environment: params.environment
    });
  }
}
