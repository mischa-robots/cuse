import { Computer } from "./Computer";

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

    public init(computer: Computer) {
        this.computer = computer;
    }

    abstract install(): Promise<void>;
    abstract start(): Promise<void>;
    abstract stop(): Promise<void>;
}
