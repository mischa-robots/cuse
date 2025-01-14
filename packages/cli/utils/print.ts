import type { ComputerInfo } from './docker';

export function printComputerTable(
  computers: ComputerInfo[] | Array<any>
): void {
  if (!computers.length) {
    console.info('No computers found.');
    return;
  }

  console.table(computers);
}
