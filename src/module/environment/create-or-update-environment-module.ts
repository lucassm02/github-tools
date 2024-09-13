import { createOrUpdateRepositoryEnvironmentService } from '@/service';

type Params = {
  repos: { repo: string; owner: string }[];
  config: Record<string, unknown>;
};

export async function createOrUpdateEnvironment(params: Params) {
  for await (const item of params.repos) {
    await createOrUpdateRepositoryEnvironmentService({
      owner: item.owner,
      repo: item.repo,
      config: params.config
    });
  }
}
