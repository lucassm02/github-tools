import { cli } from './cli';
import { makeCommands } from './command';

export default async function main() {
  cli.help();

  makeCommands(cli);

  // eslint-disable-next-line no-unused-expressions
  cli.argv;
}
