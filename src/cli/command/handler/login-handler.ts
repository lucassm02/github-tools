import type { ArgumentsCamelCase, Argv } from 'yargs';

import { ENVIRONMENT } from '@/config';
import { confirm, password } from '@inquirer/prompts';

type Args = Record<string, unknown>;

export async function loginHandler(
  args: ArgumentsCamelCase<Args>,
  _yargs: Argv
) {
  let token = null;

  if (args.token) {
    token = <string>args.token;
  }

  ENVIRONMENT.GITHUB_TOKEN = null;

  if (!ENVIRONMENT.GITHUB_TOKEN && token === null) {
    token = await password({
      message: 'Enter your GitHub access token:',
      mask: '*'
    });
    return;
  }

  const reuseToken = await confirm({
    message:
      'We identified the GITHUB_TOKEN on your system, do you want to log in with the existing token?'
  });

  if (reuseToken) {
    token = ENVIRONMENT.GITHUB_TOKEN;
  }

  console.log(token);

  // const loadFile = await confirm({
  //   message: 'Do you want to provide a JSON file with the configurations?'
  // });

  // if (loadFile) {
  //   const filePath = await input({
  //     message:
  //       'Enter the path to the JSON file with the branch protection settings:'
  //   });

  //   const resolvedPath = path.resolve(filePath);

  //   config = await Bun.file(resolvedPath).json();
  // } else {
  //   const gtoolsFolder = path.resolve(ENVIRONMENT.USER.HOME, '.gtools');
  //   const tempFolder = path.join(gtoolsFolder, 'temp');
  //   mkdirSync(tempFolder, { recursive: true });
  //   const filename = crypto.randomUUID().split('-').at(0)?.toLocaleLowerCase();
  //   const tempFilePath = path.join(tempFolder, `${filename}.json`);

  //   await Bun.write(
  //     tempFilePath,
  //     JSON.stringify(CONFIG_TEMPLATE.BRANCH_PROTECTION_RULE, null, 4)
  //   );

  //   const [defaultShell] = (await Bun.file('/etc/shells').text())
  //     .split('\n')
  //     .slice(1);

  //   const witchProcess = Bun.spawn({
  //     cmd: ['which', 'code', 'nano', 'vim', 'vi', 'emacs', 'ed'],
  //     stdout: 'pipe',
  //     stderr: 'pipe'
  //   });

  //   const [defaultEditor] = (await new Response(witchProcess.stdout).text())
  //     .split('\n')
  //     .filter((i) => i.includes('/'));

  //   const shell = ENVIRONMENT.USER.SHELL || defaultShell;
  //   const editor = ENVIRONMENT.USER.GTOOLS_EDITOR || defaultEditor;

  //   const editorProcess = Bun.spawn({
  //     cmd: [shell, '-c', `${editor} "${tempFilePath}"`],
  //     stdout: Bun.stdout,
  //     stderr: Bun.stderr,
  //     stdin: Bun.stdin
  //   });

  //   await editorProcess.exited;

  //   config = await Bun.file(tempFilePath).json();

  //   setTimeout(async () => {
  //     await unlink(tempFilePath);
  //   }, 2_000);
  // }

  // const scope = await select({
  //   message: 'Select a GitHub scope',
  //   choices: [
  //     {
  //       name: 'org',
  //       value: 'ORG',
  //       description: 'Filter repositories based on the provided organization'
  //     },
  //     {
  //       name: 'user',
  //       value: 'USER',
  //       description: 'Filter repositories based on the provided user'
  //     },
  //     {
  //       name: 'all',
  //       value: 'ALL',
  //       description: `Fetch all repositories within the token's access level`
  //     }
  //   ]
  // });

  // const org = scope === 'ORG' && (await input({ message: 'Enter org name:' }));

  // const username =
  //   scope === 'USER' && (await input({ message: 'Enter user name:' }));

  // const spinner = ora({
  //   text: 'Fetching repositories...',
  //   spinner: 'dots',
  //   color: 'cyan'
  // }).start();

  // const rawRepositoriesPayload = await getRepositories({
  //   ...(org && { org }),
  //   ...(username && { username })
  // });

  // const repos = rawRepositoriesPayload.map((item) => ({
  //   id: item.id,
  //   repo: item.name,
  //   owner: <string>item.owner.login
  // }));

  // spinner.succeed('Fetch completed!');

  // const applyToAllRepositories = await confirm({
  //   message: 'Do you want to create this protection in all repositories?'
  // });

  // if (applyToAllRepositories) {
  //   await handler({ rule: config, repos });

  //   return;
  // }

  // const choices = repos.map((item) => ({
  //   name: item.repo,
  //   value: item.id
  // }));

  // const selectedIds = await checkbox({
  //   message: 'Select in which repositories you want to create the protection',
  //   choices,
  //   loop: false,
  //   pageSize: 20
  // });

  // const selectedRepositories = repos.filter((item) =>
  //   selectedIds.includes(item.id)
  // );

  // await handler({
  //   rule: config,
  //   repos: selectedRepositories
  // });
}
