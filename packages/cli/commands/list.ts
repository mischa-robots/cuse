import type { CommandModule, BaseOptions } from "./types";
import { getAllRunningComputers } from "../utils/docker";
import { configExists, getAllComputers } from "../utils/project";

export const listCommand: CommandModule<BaseOptions> = {
	command: "list",
	describe: "List all cuse computers (running and stopped)",
	async handler() {
		if (!configExists()) {
			console.error("No cuse configuration found in this directory.");
			console.info("Run 'cuse init' to initialize a new configuration.");
			process.exit(1);
		}

		const dockerComputers = await getAllRunningComputers();
		const configComputers = getAllComputers();

		if (configComputers.length === 0) {
			console.info("No computers found in configuration.");
			console.info("Use 'cuse new' to create a new computer.");
			return;
		}

		// Show all computers from config with their current status
		const computers = configComputers.map((cc) => {
			const dockerComputer = dockerComputers.find(
				(dc) => dc.identifier === cc.identifier
			);
			return {
				identifier: cc.identifier,
				os: cc.os,
				template: cc.template || "N/A",
				status: dockerComputer ? "running" : "stopped",
				containerId: dockerComputer?.containerId || "N/A",
				api: dockerComputer?.api || "N/A",
				novnc: dockerComputer?.novnc || "N/A",
			};
		});

		console.info("\nAll Computers:");
		console.table(computers, [
			"identifier",
			"os",
			"template",
			"status",
			"containerId",
			"api",
			"novnc",
		]);
	},
};
