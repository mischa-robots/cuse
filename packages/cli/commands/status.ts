import type { CommandModule, BaseOptions } from "./types";
import { getAllRunningComputers } from "../utils/docker";
import { configExists, getAllComputers } from "../utils/project";

export const statusCommand: CommandModule<BaseOptions> = {
	command: "status",
	describe: "Display the status of running cuse computers",
	async handler() {
		if (!configExists()) {
			console.error("No cuse configuration found in this directory.");
			console.info("Run 'cuse init' to initialize a new configuration.");
			process.exit(1);
		}

		const dockerComputers = await getAllRunningComputers();
		const configComputers = getAllComputers();

		// Only show running computers that are in the config
		const runningComputers = dockerComputers
			.filter((dc) =>
				configComputers.some((cc) => cc.identifier === dc.identifier)
			)
			.map((dc) => {
				const configComputer = configComputers.find(
					(cc) => cc.identifier === dc.identifier
				);
				return {
					...dc,
					template: configComputer?.template,
				};
			});

		if (!runningComputers.length) {
			console.info("No computers are currently running.");
			console.info(
				"Use 'cuse start' to start computers from your configuration."
			);
			return;
		}

		console.info("\nRunning Computers:");
		console.table(
			runningComputers.map(
				({ identifier, os, containerId, api, novnc, template }) => ({
					identifier,
					os,
					containerId,
					template: template || "N/A",
					api: api || "N/A",
					novnc: novnc || "N/A",
				})
			),
			["identifier", "os", "containerId", "template", "api", "novnc"]
		);
	},
};
