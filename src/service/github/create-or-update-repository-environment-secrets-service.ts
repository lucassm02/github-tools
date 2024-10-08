import type { RequestError } from '@/types/github';
import { encryptValue } from '@/util/encrypt-value';

import { octokitFactory } from './octokit';

type Params = {
  repo: string;
  owner: string;
  environment: string;
  secrets: Record<string, string>;
};
export async function createOrUpdateRepositoryEnvironmentSecretsService(
  params: Params
) {
  try {
    const octokit = await octokitFactory();

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
        encrypted_value: encryptValue(publicKey.key, value)
      });
    }
  } catch (error) {
    if (typeof error === 'object') {
      const { response } = <RequestError>error;
      console.error(error);
      console.error(
        `${response.data.message} - ${response.data.documentation_url}`
      );
    }
  }
}
