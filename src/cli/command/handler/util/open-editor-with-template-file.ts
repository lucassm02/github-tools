import { mkdirSync, unlinkSync } from 'fs';
import path from 'path';

import { CONSTANT } from '@/config';

export async function openEditorWithTemplateFile(
  content: Record<string, unknown>
) {
  const ghtoolsFolder = path.resolve(<string>CONSTANT.USER.HOME, '.ghtools');
  const tempFolder = path.join(ghtoolsFolder, 'temp');
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

  const shell = CONSTANT.USER.SHELL || defaultShell;
  const editor = CONSTANT.USER.GHTOOLS_EDITOR || defaultEditor;

  const editorProcess = Bun.spawn({
    cmd: [shell, '-c', `${editor} "${tempFilePath}"`],
    stdout: Bun.stdout,
    stderr: Bun.stderr,
    stdin: Bun.stdin
  });

  await editorProcess.exited;

  const config = await Bun.file(tempFilePath).json();

  setTimeout(() => unlinkSync(tempFilePath), 2_000);

  return config;
}
