import { octokit } from '@/service';
import type { RequestError } from '@/types/github';

type Rule = {
  owner: string;
  repo: string;
  branch: string;
  required_status_checks: RequiredStatusChecks;
  enforce_admins: boolean;
  required_pull_request_reviews: RequiredPullRequestReviews;
  restrictions: any;
  allow_force_pushes: boolean;
  allow_deletions: boolean;
};

type RequiredStatusChecks = {
  strict: boolean;
  contexts: string[];
};

type RequiredPullRequestReviews = {
  dismissal_restrictions: DismissalRestrictions;
  require_code_owner_reviews: boolean;
  required_approving_review_count: number;
};

type DismissalRestrictions = {};

type CreateParams = {
  repo: string;
  owner: string;
  rules: Rule;
};

type createBranchProtectionParams = {
  repos: { repo: string; owner: string }[];
  rule: Record<string, unknown>;
};

async function create(params: CreateParams) {
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

export async function createBranchProtection(
  params: createBranchProtectionParams
) {
  for await (const item of params.repos) {
    await create({
      owner: item.owner,
      repo: item.repo,
      rules: { ...(<any>params.rule) }
    });
  }
}
