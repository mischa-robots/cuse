import type {
	ArgumentsCamelCase,
	CommandModule as YargsCommandModule,
} from "yargs";

export interface BaseOptions {
	[key: string]: unknown;
}

export type Arguments<T> = ArgumentsCamelCase<T>;

export type CommandModule<T extends BaseOptions = BaseOptions> =
	YargsCommandModule<BaseOptions, T>;
