import { cli } from './cli';
import { builder } from './command';

export default async function main() {
  cli.help();
  cli.showHelpOnFail(true);

  builder(cli);

  cli.parseSync();
}
