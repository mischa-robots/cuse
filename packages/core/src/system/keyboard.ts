import * as client from './generated';
import {
  KeyboardInterface,
  SystemConfig,
  PressKeyParams,
  TypeParams,
} from './types';
import { handleResponse } from './utils';

/**
 * Keyboard control implementation
 * Provides functionality for keyboard input operations
 */
export class Keyboard implements KeyboardInterface {
  constructor(private config: SystemConfig) {}

  /**
   * Simulate pressing a single key on the keyboard
   * @param params Parameters containing the key to press
   * @throws Error if key press operation fails
   */
  async pressKey(params: PressKeyParams): Promise<void> {
    await handleResponse(
      client.computerPressKey({
        body: { key: params.key, display_num: this.config.displayNum },
      })
    );
  }

  /**
   * Simulate typing a sequence of text
   * @param params Parameters containing the text to type
   * @throws Error if typing operation fails
   */
  async type(params: TypeParams): Promise<void> {
    await handleResponse(
      client.computerTypeText({
        body: { text: params.text, display_num: this.config.displayNum },
      })
    );
  }
}
