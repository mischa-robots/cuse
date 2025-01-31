# cuse

An open-source framework for building AI agents that can interact with computers

## Features

- **Computer Control**: Display, mouse, and keyboard interaction
- **Authentication**: Authenticate with credentials
- **File Operations**: View, create, and edit files
- **Shell Access**: Execute commands and manage processes
- **App Framework**: Build custom applications
- **Linux Support**: Run via Docker containers

## Demo

Task: Log in to Gmail, check your inbox, and add new leads to the spreadsheet.

https://github.com/user-attachments/assets/6689d937-6d4c-4331-af8f-008486ad7f00

## Quickstart

Install dependencies:

```bash
npm install @cusedev/core
```

Initialize and create a computer:

```bash
npx @cusedev/cli init
```

Create a `Computer` instance

```typescript
import { Computer } from '@cusedev/core';

const computer = new Computer();
```

Interact with the computer:

```typescript
// Take a screenshot
const screenshot = await computer.system.display.getScreenshot();

// Type some text
await computer.system.keyboard.type({ text: 'Hello, World!' });

// Execute a command
const output = await computer.system.bash.execute({ command: 'ls -la' });
```

## Documentation

Visit our [documentation](https://docs.cuse.dev) to learn more about:

- Getting started with the example project
- Adding cuse to your existing project
- Core concepts and API reference
- CLI commands and usage

## Roadmap

- Support for other platforms
- Deployment
- Stateful Machines
- Reusable Workflows

## Contributing

Contributions are welcome! Please check out our [GitHub repository](https://github.com/cuse-dev/cuse).

## License

MIT License — see [LICENSE](LICENSE) file

## Get in Touch

- Visit our [website](https://cuse.dev)
- Join our [Discord community](https://discord.gg/56svtW9M)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=cuse-dev/cuse&type=Date&theme=dark)](https://star-history.com/#cuse-dev/cuse&Date)
