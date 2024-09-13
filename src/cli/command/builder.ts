import type { Argv } from 'yargs';

import { middleware } from '@/util/middleware';

import {
  createBranchProtectionHandler,
  createEnvironmentHandler,
  createOrUpdateEnvironmentSecretHandler,
  createOrUpdateEnvironmentVariableHandler,
  loginHandler
} from './handler';
import { validateTokenMiddleware } from './middleware';

export function builder(cli: Argv) {
  cli.command({
    command: 'login',
    describe: 'Set github token to manage repositories',
    builder: {
      token: {
        alias: 't',
        type: 'string'
      }
    },
    handler: (args) => {
      loginHandler(args, cli);
    }
  });

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
          middleware(
            [args, yargs],
            validateTokenMiddleware,
            createEnvironmentHandler
          );
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
              middleware(
                [args, yargs],
                validateTokenMiddleware,
                createOrUpdateEnvironmentSecretHandler
              );
            },
            builder: {}
          });

          yargs.command({
            command: 'variable',
            describe: 'Create a new variable for provided environment',
            handler: (args) => {
              middleware(
                [args, yargs],
                validateTokenMiddleware,
                createOrUpdateEnvironmentVariableHandler
              );
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
          middleware(
            [args, yargs],
            validateTokenMiddleware,
            createBranchProtectionHandler
          );
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
