import { execa } from 'execa';
import type { Arguments } from 'yargs';
import type { CommandModule } from './types';
import { configExists, readConfig } from '../utils/project';
import { getAllRunningComputers } from '../utils/docker';
import { stopProxy } from '../utils/proxy';

interface StopOptions {
  [key: string]: unknown;
}

export const stopCommand: CommandModule<StopOptions> = {
  command: 'stop',
  describe:
    'Stop all running computers and the proxy server for the current project',
  async handler(argv: Arguments<StopOptions>) {
    if (!configExists()) {
      console.error('No cuse configuration found in this directory.');
      console.info("Run 'cuse init' to initialize a new configuration.");
      process.exit(1);
    }

    const config = readConfig();
    const projectName = config.project.name;

    // Get all running computers for this project using the project label
    const { stdout } = await execa('docker', [
      'ps',
      '-q', // Only container IDs
      '--filter',
      `label=com.docker.compose.project=cuse-${projectName}`,
    ]);

    const containerIds = stdout.trim().split('\n').filter(Boolean);

    if (containerIds.length === 0) {
      console.info('No running computers found for this project.');
    } else {
      console.info(
        `Stopping ${containerIds.length} container(s) for project "${projectName}"...`
      );
      for (const containerId of containerIds) {
        try {
          await execa('docker', ['stop', containerId]);
          console.info(`Stopped container ${containerId.slice(0, 12)}`);
        } catch (error) {
          console.warn(
            `Failed to stop container ${containerId.slice(0, 12)}: ${error}`
          );
        }
      }
    }

    console.info('Stopping proxy server...');
    await stopProxy();
    console.info('All project services stopped.');
  },
};
