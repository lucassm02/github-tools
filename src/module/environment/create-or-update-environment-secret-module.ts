import { createOrUpdateRepositoryEnvironmentSecretsService } from '@/service';

type Params = {
  repos: { repo: string; owner: string }[];
  environment: string;
  secrets: Record<string, string>;
};

export async function createOrUpdateEnvironmentSecrets(params: Params) {
  for await (const item of params.repos) {
    await createOrUpdateRepositoryEnvironmentSecretsService({
      owner: item.owner,
      repo: item.repo,
      environment: params.environment,
      secrets: params.secrets
    });
  }
}
