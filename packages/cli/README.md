# Cuse CLI

The CLI simplifies the management of cuse computers.

## Usage

```bash
cuse [command] [options]
```

## Commands

- `init` Initialize cuse in an existing project
- `new` Create a new cuse computer
- `start` Start computers in the current project
- `stop` Shutdown the current cuse environment
- `list` List all cuse computers (running and stopped)
- `status` Display the status of running cuse computers
- `rm` Remove a specific cuse computer
- `destroy` Remove all project computers
- `help` Display help for cuse commands
- `version` Show the installed cuse CLI version

---

## `cuse init`

Initializes cuse in an existing project directory. Creates a new configuration file (cuse.config.yml) and sets up the necessary proxy service.

### Usage

```bash
cuse init [options]
```

### Options

- `-f, --force` Force the initialization process, overwriting existing configuration
- `-y, --yes` Skip confirmation prompts

The initialization process will:

1. Create a new cuse.config.yml file
2. Set up a proxy service for computer access
3. Configure access endpoints for API, noVNC, and VNC services

## `cuse new [computer-name]`

Creates a new cuse computer instance with the specified name or an auto-generated one.

### Usage

```bash
cuse new [computer-name] [options]
```

### Options

- `--template <template-name>` Specify a computer template
- `--platform <platform-name>` Specify the platform (currently supports: linux)
- `--config <config-file>` Specify a configuration file (defaults to cuse.config.yml)

The command will:

1. Validate and sanitize the computer name
2. Set up the computer with the chosen operating system
3. Start the computer services (API, noVNC, VNC)
4. Add the computer to the project configuration

## `cuse start [identifier]`

Starts all computers in the current project or a specific computer by identifier.

### Usage

```bash
cuse start [identifier] [options]
```

### Options

- `--detached` Run the computers in the background
- `--force` Force a restart if already running

## `cuse list`

Lists all cuse computers, including both running and stopped instances.

### Usage

```bash
cuse list
```

The command displays:

- Computer identifier
- Operating system
- Template (if any)
- Current status (running/stopped)
- Container ID
- API endpoint
- noVNC endpoint

## `cuse status`

Shows the status of currently running cuse computers.

### Usage

```bash
cuse status
```

Displays information about running computers including:

- Identifier
- Operating system
- Container ID
- Template
- API endpoint
- noVNC endpoint

## `cuse rm <identifier>`

Removes a specific cuse computer.

### Usage

```bash
cuse rm <identifier> [options]
```

### Options

- `-f, --force` Skip confirmation prompt

## `cuse destroy`

Removes all project computers and stops the proxy service.

### Usage

```bash
cuse destroy [options]
```

### Options

- `-f, --force` Force removal without confirmation
- `-y, --yes` Skip confirmation prompts

## `cuse help`

Displays help information for cuse commands.

### Usage

```bash
cuse help [command]
```

## `cuse version`

Displays the installed cuse CLI version.

### Usage

```bash
cuse version
```

## Endpoints

When computers are running, they can be accessed through the following endpoints:

- API: http://localhost:4242/<computer-name>
- noVNC: http://localhost:4242/<computer-name>/novnc/
- VNC: http://localhost:4242/<computer-name>/vnc/
