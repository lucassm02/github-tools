import { unlink } from 'node:fs/promises';
import type { ArgumentsCamelCase, Argv } from 'yargs';

import { getRepositories } from '@/module/repository';
import { createOrUpdateEnvironment as handler } from '@/module/environment';
import { checkbox, confirm, input, select } from '@inquirer/prompts';
import ora from 'ora';
import path from 'path';

type Args = Record<string, unknown>;

export async function createEnvironmentHandler(
  _args: ArgumentsCamelCase<Args>,
  _yargs: Argv
) {
  let config = {};

  const loadFile = await confirm({
    message: 'Do you want to provide a JSON file with the configurations?'
  });

  if (loadFile) {
    const filePath = await input({
      message: 'Enter the path to the JSON file with the environment settings:'
    });

    const resolvedPath = path.resolve(filePath);

    config = await Bun.file(resolvedPath).json();
  } else {
    const tempFolder = path.resolve('temp');
    const templateFolder = path.resolve('template');
    const templateName = 'environment.json';

    const templateFilePath = path.join(templateFolder, templateName);
    const tempFilePath = path.join(tempFolder, `${crypto.randomUUID()}.json`);

    const buffer = await Bun.file(templateFilePath).arrayBuffer();

    await Bun.write(tempFilePath, buffer);

    const [defaultShell] = (await Bun.file('/etc/shells').text())
      .split('\n')
      .slice(1);

    const witchProcess = Bun.spawn({
      cmd: ['which', 'code', 'nano', 'vim', 'vi', 'emacs', 'ed'],
      stdout: 'pipe',
      stderr: 'pipe'
    });

    const [defaultEditor] = (await new Response(witchProcess.stdout).text())
      .split('\n')
      .filter((i) => i.includes('/'));

    const shell = process.env.SHELL || defaultShell;
    const editor = process.env.GTOOLS_EDITOR || defaultEditor;

    const editorProcess = Bun.spawn({
      cmd: [shell, '-c', `${editor} "${tempFilePath}"`],
      stdout: Bun.stdout,
      stderr: Bun.stderr,
      stdin: Bun.stdin
    });

    await editorProcess.exited;

    config = await Bun.file(tempFilePath).json();

    setTimeout(async () => {
      await unlink(tempFilePath);
    }, 2_000);
  }

  const scope = await select({
    message: 'Select a GitHub scope',
    choices: [
      {
        name: 'org',
        value: 'ORG',
        description: 'Filter repositories based on the provided organization'
      },
      {
        name: 'user',
        value: 'USER',
        description: 'Filter repositories based on the provided user'
      },
      {
        name: 'all',
        value: 'ALL',
        description: `Fetch all repositories within the token's access level`
      }
    ]
  });

  const org = scope === 'ORG' && (await input({ message: 'Enter org name:' }));

  const username =
    scope === 'USER' && (await input({ message: 'Enter user name:' }));

  const spinner = ora({
    text: 'Fetching repositories...',
    spinner: 'dots',
    color: 'cyan'
  }).start();

  const rawRepositoriesPayload = await getRepositories({
    ...(org && { org }),
    ...(username && { username })
  });

  const repos = rawRepositoriesPayload.map((item) => ({
    id: item.id,
    repo: item.name,
    owner: <string>item.owner.login
  }));

  spinner.succeed('Fetch completed!');

  const applyToAllRepositories = await confirm({
    message: 'Do you want to create this environment in all repositories?'
  });

  if (applyToAllRepositories) {
    await handler({
      config,
      repos
    });

    return;
  }

  const choices = repos.map((item) => ({
    name: item.repo,
    value: item.id
  }));

  const selectedIds = await checkbox({
    message: 'Select in which repositories you want to create the environment',
    choices: choices,
    loop: false,
    pageSize: 20
  });

  const selectedRepositories = repos.filter((item) =>
    selectedIds.includes(item.id)
  );

  await handler({
    config,
    repos: selectedRepositories
  });

  console.info('Environment created successfully!');
}
