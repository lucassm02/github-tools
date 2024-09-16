import { getTokenModule } from '@/module/token';
import { Octokit } from '@octokit/rest';

export async function octokitFactory() {
  const token = await getTokenModule();

  return new Octokit({
    auth: token
  });
}
