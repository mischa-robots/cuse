import { SystemConfig } from './types';
import * as client from './generated';
import {
  EditorInterface,
  ViewFileParams,
  CreateFileParams,
  ReplaceStringParams,
  InsertTextParams,
} from './types';
import { handleResponse } from './utils';

/**
 * Editor control implementation
 * Provides functionality for file manipulation operations
 */
export class Editor implements EditorInterface {
  constructor(private config: SystemConfig) {}

  /**
   * View contents of a file
   * @param params Parameters containing file path and optional line range
   * @returns Promise with file contents
   * @throws Error if file viewing fails
   */
  async viewFile(params: ViewFileParams): Promise<string> {
    const response = await handleResponse(
      client.editorViewFile({
        body: {
          path: params.path,
          ...(params.viewRange ? { view_range: params.viewRange } : {}),
        },
      })
    );

    if (!response) {
      throw new Error('Failed to view file');
    }

    return response;
  }

  /**
   * Create a new file
   * @param params Parameters containing file path and optional content
   * @throws Error if file creation fails
   */
  async createFile(params: CreateFileParams): Promise<void> {
    await handleResponse(
      client.editorCreateFile({
        body: {
          path: params.path,
          ...(params.content ? { file_text: params.content } : {}),
        },
      })
    );
  }

  /**
   * Replace string occurrences in a file
   * @param params Parameters containing file path and strings to replace
   * @throws Error if string replacement fails
   */
  async replaceString(params: ReplaceStringParams): Promise<void> {
    await handleResponse(
      client.editorReplaceString({
        body: {
          path: params.path,
          old_str: params.oldStr,
          new_str: params.newStr,
        },
      })
    );
  }

  /**
   * Insert text at a specific line
   * @param params Parameters containing file path, line number and text
   * @throws Error if text insertion fails
   */
  async insertText(params: InsertTextParams): Promise<void> {
    await handleResponse(
      client.editorInsertText({
        body: {
          path: params.path,
          text: params.text,
          insert_line: params.line,
        },
      })
    );
  }

  /**
   * Undo last edit
   * @throws Error if undo fails
   */
  async undoLastEdit(): Promise<void> {
    await handleResponse(client.editorUndoLastEdit());
  }
}
