import { Octokit } from '@octokit/rest';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createTokenAuth } from '@octokit/auth-token';

export async function octokitFactory() {
  return new Octokit({
    auth: 'asa',
    authStrategy: createTokenAuth
  });
}
