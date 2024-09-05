import type { Argv } from 'yargs';

import { createEnvironmentHandler } from './create/environment/handler';

export function buildCommands(cli: Argv) {
  cli.command({
    command: 'create',
    describe: 'Create a new entity',
    handler: (_args) => {
      cli.showHelp();
    },
    builder: (yargs) => {
      yargs.command({
        command: 'environment',
        describe: 'Create a new environment',
        handler: (args) => {
          createEnvironmentHandler(args, yargs);
        },
        builder: (yargs) => {
          yargs.option('name', {
            alias: 'n',
            describe: 'Set environment name',
            type: 'string',
            demandOption: false
          });

          yargs.command({
            command: 'secret',
            describe: 'Create a new secret for provided environment',
            handler: (_args) => {},
            builder: { name: {} }
          });

          yargs.command({
            command: 'variable',
            describe: 'Create a new variable for provided environment',
            handler: (_args) => {},
            builder: { name: {} }
          });

          return yargs;
        }
      });

      yargs.command({
        command: 'ruleset',
        describe: 'Create a new ruleset',
        handler: (_args) => {
          yargs.showHelp();
        },
        builder: {
          scope: {
            type: 'string',
            choices: ['global', 'repository'],
            requiresArg: true,
            describe: 'Select the ruleset scope'
          },
          type: {
            type: 'string',
            choices: ['branch', 'tag'],
            requiresArg: true,
            describe: 'Select the ruleset type'
          }
        }
      });

      return yargs;
    }
  });
}
