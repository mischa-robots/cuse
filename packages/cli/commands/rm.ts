import type { Arguments, Argv } from 'yargs';
import inquirer from 'inquirer';
import type { CommandModule, BaseOptions } from './types';
import { removeComputer as removeDockerComputer } from '../utils/docker';
import {
  configExists,
  removeComputer as removeConfigComputer,
  getComputer,
} from '../utils/project';

interface RmOptions extends BaseOptions {
  identifier: string;
  force?: boolean;
}

export const rmCommand: CommandModule<RmOptions> = {
  command: 'rm <identifier>',
  describe: 'Remove a specific cuse computer',
  builder: (yargs: Argv<BaseOptions>) => {
    return yargs
      .positional('identifier', {
        type: 'string',
        description: 'Identifier of the computer to remove',
      })
      .option('force', {
        alias: 'f',
        type: 'boolean',
        description: 'Skip confirmation prompt',
      }) as Argv<RmOptions>;
  },
  async handler(argv: Arguments<RmOptions>) {
    const { identifier, force } = argv;

    if (!configExists()) {
      console.error('No cuse configuration found in this directory.');
      console.info("Run 'cuse init' to initialize a new configuration.");
      process.exit(1);
    }

    const computer = getComputer(identifier);
    if (!computer) {
      console.error(`Computer "${identifier}" not found in configuration.`);
      process.exit(1);
    }

    if (!force) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Are you sure you want to remove computer "${identifier}"?`,
          default: false,
        },
      ]);

      if (!confirm) {
        console.info('Operation cancelled.');
        return;
      }
    }

    console.info(`Removing computer "${identifier}"...`);
    await removeDockerComputer(identifier);
    removeConfigComputer(identifier);
    console.info('Computer removed.');
  },
};
