import type { Argv } from 'yargs';

import {
  createBranchProtectionHandler,
  createEnvironmentHandler,
  createOrUpdateEnvironmentSecretHandler,
  createOrUpdateEnvironmentVariableHandler
} from './handler';

export function makeCommands(cli: Argv) {
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
            handler: (args) => {
              createOrUpdateEnvironmentSecretHandler(args, yargs);
            },
            builder: {}
          });

          yargs.command({
            command: 'variable',
            describe: 'Create a new variable for provided environment',
            handler: (args) => {
              createOrUpdateEnvironmentVariableHandler(args, yargs);
            },
            builder: {}
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

      yargs.command({
        command: 'branch protection',
        aliases: 'bp',
        describe: 'Create a branch protection',
        handler: (args) => {
          createBranchProtectionHandler(args, yargs);
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
