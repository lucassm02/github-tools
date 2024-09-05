import { cli } from './cli';
import { buildCommands } from './command';

export default async function main() {
  cli.help();

  buildCommands(cli);

  cli.argv;
}
