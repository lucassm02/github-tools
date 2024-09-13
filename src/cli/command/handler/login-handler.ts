import type { ArgumentsCamelCase, Argv } from 'yargs';

import { CONSTANT } from '@/config';
import { setTokenModule } from '@/module/token';
import { confirm, password } from '@inquirer/prompts';

type Args = { token?: string };

export async function loginHandler(
  args: ArgumentsCamelCase<Args>,
  _yargs: Argv
) {
  const SUCCESS_MESSAGE = 'Login successful!';
  try {
    if (args.token) {
      await setTokenModule(args.token);
      return;
    }

    if (CONSTANT.GITHUB_TOKEN && args.token === null) {
      const reuseToken = await confirm({
        message:
          'We identified the GITHUB_TOKEN on your system, do you want to log in with the existing token?'
      });

      if (reuseToken) {
        await setTokenModule(CONSTANT.GITHUB_TOKEN);
        return;
      }
    }

    const token = await password({
      message: 'Enter your GitHub access token:',
      mask: '*'
    });

    await setTokenModule(token);
    console.info(SUCCESS_MESSAGE);
  } catch (error) {
    console.error(error);
  }
}
