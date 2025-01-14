import { SystemConfig } from './types';
import * as client from './generated';
import { BashInterface, ExecuteCommandParams } from './types';
import { handleResponse } from './utils';

/**
 * Bash control implementation
 * Provides functionality for executing shell commands
 */
export class Bash implements BashInterface {
  constructor(private config: SystemConfig) {}

  /**
   * Execute a shell command
   * @param params Parameters containing the command to execute
   * @returns Promise with the command output
   * @throws Error if command execution fails
   */
  async execute(params: ExecuteCommandParams): Promise<string> {
    const response = await handleResponse(
      client.bashExecuteCommand({
        body: { command: params.command },
      })
    );

    if (!response) {
      throw new Error('Command execution failed');
    }

    return response;
  }

  /**
   * Restart the system
   * @throws Error if restart fails
   */
  async restart(): Promise<void> {
    await handleResponse(client.bashRestartSystem());
  }
}
