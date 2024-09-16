import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const cli = yargs(hideBin(process.argv));

cli.scriptName('ghtools');
cli.demandCommand();

export { cli };
