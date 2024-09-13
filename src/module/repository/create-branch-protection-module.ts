import { createOrUpdateBranchProtectionService } from '@/service';
import type { Rule } from '@/types/github';

type Params = {
  repos: { repo: string; owner: string }[];
  rule: Record<string, unknown>;
};

export async function createBranchProtectionModule(params: Params) {
  for await (const item of params.repos) {
    await createOrUpdateBranchProtectionService({
      owner: item.owner,
      repo: item.repo,
      rules: { ...(<Rule>params.rule) }
    });
  }
}
