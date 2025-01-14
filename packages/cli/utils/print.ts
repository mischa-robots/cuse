import type { ComputerInfo } from './docker';

export function printComputerTable(computers: ComputerInfo[]): void {
  if (!computers.length) {
    console.info('No computers found.');
    return;
  }

  console.table(
    computers.map((c) => ({
      identifier: c.identifier,
      os: c.os,
      containerId: c.containerId,
      api: c.api,
    }))
  );
}
