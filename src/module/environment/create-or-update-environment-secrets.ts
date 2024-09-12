import { octokit } from '@/service';
import type { RequestError } from '@/types/github';

type CreateOrUpdateToRepositoryParams = {
  repo: string;
  owner: string;
  environment: string;
  secrets: Record<string, string>;
};

type createOrUpdateEnvironmentSecretsParams = {
  repos: { repo: string; owner: string }[];
  environment: string;
  secrets: Record<string, string>;
};

async function CreateOrUpdateToRepository(
  params: CreateOrUpdateToRepositoryParams
) {
  try {
    const { data: publicKey } = await octokit.actions.getEnvironmentPublicKey({
      owner: params.owner,
      repo: params.repo,
      environment_name: params.environment
    });

    for await (const [key, value] of Object.entries(params.secrets)) {
      await octokit.actions.createOrUpdateEnvironmentSecret({
        owner: params.owner,
        repo: params.repo,
        key_id: publicKey.key_id,
        environment_name: params.environment,
        secret_name: key,
        encrypted_value: Buffer.from(value).toString('base64')
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

export async function createOrUpdateEnvironmentSecrets(
  params: createOrUpdateEnvironmentSecretsParams
) {
  for await (const item of params.repos) {
    await CreateOrUpdateToRepository({
      owner: item.owner,
      repo: item.repo,
      environment: params.environment,
      secrets: params.secrets
    });
  }
}
