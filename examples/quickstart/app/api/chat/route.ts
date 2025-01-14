import { streamText, type CoreTool } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { Computer } from '@cuse/core';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log(messages);

  const system = `<SYSTEM_CAPABILITY>
  * You are utilising an Ubuntu virtual machine using x86_64 architecture with internet access.
  * You can feel free to install Ubuntu applications with your bash tool. Use curl instead of wget.
  * To open firefox, please just click on the firefox icon.  Note, firefox-esr is what is installed on your system.
  * Using bash tool you can start GUI applications, but you need to set export DISPLAY=:1 and use a subshell. For example "(DISPLAY=:1 xterm &)". GUI apps run with bash tool will appear within your desktop environment, but they may take some time to appear. Take a screenshot to confirm it did.
  * When using your bash tool with commands that are expected to output very large quantities of text, redirect into a tmp file and use str_replace_editor or \`grep -n -B <lines before> -A <lines after> <query> <filename>\` to confirm output.
  * When viewing a page it can be helpful to zoom out so that you can see everything on the page.  Either that, or make sure you scroll down to see everything before deciding something isn't available.
  * When using your computer function calls, they take a while to run and send back to you.  Where possible/feasible, try to chain multiple of these calls all into one function calls request.
  * The current date is ${new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}.
  </SYSTEM_CAPABILITY>
  <INSTRUCTIONS>
  * Complete the task in 5 steps or less.
  * Before you start, write a plan of the steps you will take to complete the task. Fulfill your plan step by step and ask the user for confirmation after each step.
  * If you are unsure of what to do, ask the user for clarification.
  * If something does not work as expected, propose a solution to the user and continue after they confirm.
  * To open an application, double click on the application icon.
  * If you do not see the result of your action (e.g. mouse move, click, etc), try again once and defer to the user if it still does not work.
  </INSTRUCTIONS>
  <IMPORTANT>
  * When using Firefox, if a startup wizard appears, IGNORE IT.  Do not even click "skip this step".  Instead, click on the address bar where it says "Search or enter address", and enter the appropriate search term or URL there.
  * If the item you are looking at is a pdf, if after taking a single screenshot of the pdf it seems that you want to read the entire document instead of trying to continue to read the pdf from your screenshots + navigation, determine the URL, use curl to download the pdf, install and use pdftotext to convert it to a text file, and then read that text file directly with your StrReplaceEditTool.
  </IMPORTANT>`;

  const computer = new Computer({});

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-latest'),
    messages: [
      {
        role: 'system',
        content: system,
      },
      ...messages,
    ],
    tools: {
      computer: anthropic.tools.computer_20241022({
        displayWidthPx: 1024,
        displayHeightPx: 768,
        execute: async ({ action, coordinate, text }) => {
          switch (action) {
            case "screenshot":
              const screenshot = await computer.system.computerTakeScreenshot();
              return {
                type: "image",
                image: screenshot.data!,
              };
            case "key":
              if (!text) {
                return "No key provided";
              }
              await computer.system.computerPressKey({ body: { key: text } });
              return "Pressed keys";
            case "type":
              if (!text) {
                return "No text provided";
              }
              await computer.system.computerTypeText({ body: { text } });
              return "Typed text";
            case "mouse_move":
              if (coordinate) {
                await computer.system.computerMoveCursor({ body: { x: coordinate[0], y: coordinate[1] } });
                return "Moved mouse";
              }
              return "Invalid coordinate";
            case "left_click":
              await computer.system.computerLeftClick();
              return "Left clicked";
            case "right_click":
              await computer.system.computerRightClick();
              return "Right clicked";
            case "middle_click":
              await computer.system.computerMiddleClick();
              return "Middle clicked";
            case "double_click":
              await computer.system.computerDoubleClick();
              return "Double clicked";
            case "cursor_position":
              const position = await computer.system.computerGetCursorPosition();
              return `Cursor position: X=${position.data!.x}, Y=${position.data!.y}`;
            default:
              return "Invalid action";
          }
        },
        experimental_toToolResultContent(result) {
          return typeof result === "string"
            ? [{ type: "text", text: result }]
            : [{ type: "image", data: result.image, mimeType: "image/png" }];
        },
      }),
      bash: anthropic.tools.bash_20241022({
        execute: async ({ command, restart }) => {
          if (restart) {
            await computer.system.bashRestartSystem();
          }
          return await computer.system.bashExecuteCommand({ body: { command } });
        },
      }),
      str_replace_editor: anthropic.tools.textEditor_20241022({
        execute: async ({
          command,
          path,
          file_text,
          insert_line,
          new_str,
          old_str,
          view_range,
        }) => {
          switch (command) {
            case "view":
              return await computer.system.editorViewFile({ body: { path, view_range: view_range as [number, number] } });
            case "create":
              await computer.system.editorCreateFile({ body: { path, file_text: file_text as string } });
              return "Created file";
            case "insert":
              if (!file_text) {
                return "No file text provided";
              }
              await computer.system.editorInsertText({ 
                body: { 
                  path, 
                  text: file_text, 
                  ...(insert_line !== undefined && { insert_line })
                } 
              });
              return "Inserted text";
            case "str_replace":
              if (!old_str || !new_str) {
                return "No old or new string provided";
              }
              await computer.system.editorReplaceString({ body: { path, old_str, new_str } });
              return "Replaced text";
            case "undo_edit":
              await computer.system.editorUndoLastEdit({ body: { path } });
              return "Undid edit";
            default:
              return "Invalid command";
          }
        },
      }),
    } as Record<string, CoreTool>,
    maxSteps: 30,
  });

  return result.toDataStreamResponse();
}
