import { Computer } from './Computer';

export interface AppConfig {
  name: string;
  platform: string;
  autoStart: boolean;
}

export abstract class App {
  public config: AppConfig;
  public computer!: Computer;

  constructor(config: AppConfig) {
    this.config = config;
  }

  async _init(computer: Computer, ...args: any[]): Promise<void> {
    this.register(computer);
    await this.init(...args);
  }

  private register(computer: Computer): void {
    this.computer = computer;
  }

  abstract init(...args: any[]): Promise<void>;
  abstract install(): Promise<void>;
  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
}
