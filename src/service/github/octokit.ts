import { Octokit } from '@octokit/rest';
import { ENVIRONMENT } from '@/config';

export const octokit = new Octokit({
  auth: ENVIRONMENT.GITHUB_TOKEN
});
