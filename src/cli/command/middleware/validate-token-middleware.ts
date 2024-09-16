import type { ArgumentsCamelCase, Argv } from 'yargs';

import { getTokenModule } from '@/module/token';

type Args = Record<string, unknown>;

export async function validateTokenMiddleware(
  _args: ArgumentsCamelCase<Args>,
  yargs: Argv
) {
  const EXITE_CODE = 1;
  const ERROR_MESSAGE = `Token not defined, please run: 'ghtools login' before proceeding`;
  const error = new Error(ERROR_MESSAGE);

  const token = await getTokenModule();

  if (token) return;

  console.error(`${ERROR_MESSAGE}.\n`);
  yargs.showHelp();

  yargs.exit(EXITE_CODE, error);
}
