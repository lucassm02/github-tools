import { createOrUpdateRepositoryEnvironmentSecretsService } from '@/service';

import { createOrUpdateEnvironment } from './create-or-update-environment-module';

type Params = {
  repos: { repo: string; owner: string }[];
  environment: string;
  secrets: Record<string, string>;
};

export async function createOrUpdateEnvironmentSecrets(params: Params) {
  await createOrUpdateEnvironment({
    config: { environment_name: params.environment },
    repos: params.repos
  });

  for await (const item of params.repos) {
    await createOrUpdateRepositoryEnvironmentSecretsService({
      owner: item.owner,
      repo: item.repo,
      environment: params.environment,
      secrets: params.secrets
    });
  }
}
