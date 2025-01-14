import * as client from './generated';
import { DisplayInterface, SystemConfig } from './types';
import { handleResponse } from './utils';

/**
 * Display control implementation
 * Provides functionality for screen operations like taking screenshots
 */
export class Display implements DisplayInterface {
  constructor(private config: SystemConfig) {}

  /**
   * Capture a screenshot of the current display state
   * @returns Promise resolving to screenshot data as a Buffer
   * @throws Error if screenshot capture fails or response is empty
   */
  async getScreenshot(): Promise<{ data: Buffer }> {
    const response = await handleResponse(
      client.computerTakeScreenshot({
        body: { display_num: this.config.displayNum },
      })
    );

    if (!response) {
      throw new Error('Screenshot response is empty');
    }

    const arrayBuffer = await response.arrayBuffer();
    return { data: Buffer.from(arrayBuffer) };
  }
}
