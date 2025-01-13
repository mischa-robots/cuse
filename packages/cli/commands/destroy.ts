import inquirer from "inquirer";
import type { Arguments, CommandModule } from "./types";
import { cleanAllComputers } from "../utils/docker";
import { configExists, getAllComputers } from "../utils/project";
import { stopProxy } from "../utils/proxy";

interface DestroyOptions {
	force?: boolean;
	yes?: boolean;
	[key: string]: unknown;
}

export const destroyCommand: CommandModule<DestroyOptions> = {
	command: "destroy",
	describe: "Remove all project computers",
	builder: (yargs) => {
		return yargs
			.option("force", {
				alias: "f",
				type: "boolean",
				description: "Force removal without confirmation",
			})
			.option("yes", {
				alias: "y",
				type: "boolean",
				description: "Skip confirmation prompts",
			});
	},
	async handler(argv: Arguments<DestroyOptions>) {
		if (!configExists()) {
			console.error("No cuse configuration found in this directory.");
			console.info("Run 'cuse init' to initialize a new configuration.");
			process.exit(1);
		}

		const computers = getAllComputers();
		if (computers.length === 0) {
			console.info("No computers found in configuration.");
			console.info("Use 'cuse new' to create a new computer.");
			return;
		}

		// Skip confirmation if force or yes flag is set
		if (!argv.force && !argv.yes) {
			const { confirm } = await inquirer.prompt([
				{
					type: "confirm",
					name: "confirm",
					message: "Are you sure you want to remove all computers?",
					default: false,
				},
			]);

			if (!confirm) {
				console.info("Operation cancelled.");
				return;
			}
		}

		console.info("Removing all computers...");
		await cleanAllComputers();

		// Stop the proxy
		await stopProxy();

		console.info("All computers removed.");
	},
};
