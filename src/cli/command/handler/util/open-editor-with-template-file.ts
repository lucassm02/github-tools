import { mkdirSync, unlinkSync } from 'fs';
import path from 'path';

import { ENVIRONMENT } from '@/config';

export async function openEditorWithTemplateFile(
  content: Record<string, unknown>
) {
  const gtoolsFolder = path.resolve(<string>ENVIRONMENT.USER.HOME, '.gtools');
  const tempFolder = path.join(gtoolsFolder, 'temp');
  mkdirSync(tempFolder, { recursive: true });
  const filename = crypto.randomUUID().split('-').at(0)?.toLocaleLowerCase();
  const tempFilePath = path.join(tempFolder, `${filename}.json`);

  await Bun.write(tempFilePath, JSON.stringify(content, null, 4));

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

  const shell = ENVIRONMENT.USER.SHELL || defaultShell;
  const editor = ENVIRONMENT.USER.GTOOLS_EDITOR || defaultEditor;

  const editorProcess = Bun.spawn({
    cmd: [shell, '-c', `${editor} "${tempFilePath}"`],
    stdout: Bun.stdout,
    stderr: Bun.stderr,
    stdin: Bun.stdin
  });

  await editorProcess.exited;

  const config = await Bun.file(tempFilePath).json();

  setTimeout(() => unlinkSync(tempFilePath), 1_000);

  return config;
}
