import { createOrUpdateRepositorEnvironmentVariableService } from '@/service';

import { createOrUpdateEnvironment } from './create-or-update-environment-module';

type createOrUpdateEnvironmentVariableParams = {
  repos: { repo: string; owner: string }[];
  environment: string;
  variables: Record<string, string>;
};

export async function createOrUpdateEnvironmentVariable(
  params: createOrUpdateEnvironmentVariableParams
) {
  await createOrUpdateEnvironment({
    config: { environment_name: params.environment },
    repos: params.repos
  });

  for await (const item of params.repos) {
    await createOrUpdateRepositorEnvironmentVariableService({
      owner: item.owner,
      repo: item.repo,
      environment: params.environment,
      variables: params.variables
    });
  }
}
