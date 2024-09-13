import type { RequestError, Rule } from '@/types/github';

import { octokit } from './octokit';

type Params = {
  repo: string;
  owner: string;
  rules: Rule;
};

export async function createOrUpdateBranchProtectionService(params: Params) {
  try {
    const entries = Object.entries(params.rules).map(([key, value]) => {
      return [key, value ?? null];
    });
    const rules = Object.fromEntries(entries);

    await octokit.repos.updateBranchProtection({
      owner: params.owner,
      repo: params.repo,
      ...rules
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
