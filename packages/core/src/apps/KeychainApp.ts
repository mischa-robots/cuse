import { z } from 'zod';
import { App, AppConfig } from '../App';

export interface Element {
  type: 'password' | 'email' | 'username' | 'token' | 'phone';
  coordinates: {
    x: number;
    y: number;
  };
}

interface KeychainItem {
  username?: string;
  password?: string;
  token?: string;
  email?: string;
  phone?: string;
}

const KeychainItemSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  token: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

// Example tool implementation
// const services = this.services.map((service) => service);
// const servicesEnum = z.enum(services as [string, ...string[]]);

// return {
//   authTool: {
//     description:
//       'Request the user to fill in a login form. You can use this tool to authenticate to any of the services in the keychain. Proactively support the user at every step of the way.',
//     parameters: z.object({
//       serviceId: servicesEnum,
//       elements: z
//         .array(
//           z.object({
//             type: z
//               .enum(['password', 'email', 'username', 'button', 'token'])
//               .describe('The type of the element to fill in'),
//             coordinates: z.object({
//               x: z.number().describe('The x coordinate of the element'),
//               y: z.number().describe('The y coordinate of the element'),
//             }),
//           })
//         )
//         .describe('The elements to fill in'),
//     }),
//     execute: async ({
//       serviceId,
//       elements,
//     }: {
//       serviceId: string;
//       elements: Element[];
//     }) => {
//       await this.login(serviceId, elements as Element[]);

//       return 'Form filled in successfully. You can now proceed to the next step.';
//     },
//   },
// };

export class KeychainApp extends App {
  public services: string[] = [];

  constructor(config: AppConfig) {
    super(config);
  }

  async init() {
    // fetch all available keys from pass
    const keys = await this.computer.system.bash.execute({
      command: 'pass ls',
    });

    if (!keys.output) {
      throw new Error('Failed to fetch keys from pass');
    }

    // Parse the tree output to get service names
    this.services = keys.output
      .split('\n')
      .filter((line) => line.includes('└──'))
      .map((line) => line.replace('└── ', '').trim())
      .filter(Boolean);
  }

  async install() {
    // Check for required environment variables
    const gpgPublicKey = process.env.CUSE_GPG_PUBLIC_KEY;
    const gpgPrivateKey = process.env.CUSE_GPG_PRIVATE_KEY;
    const gpgKeyId = process.env.CUSE_GPG_KEY_ID;

    if (!gpgPublicKey || !gpgKeyId || !gpgPrivateKey) {
      throw new Error(
        'Missing required environment variables: CUSE_GPG_PUBLIC_KEY, CUSE_GPG_PRIVATE_KEY and CUSE_GPG_KEY_ID'
      );
    }

    // Install pass if not already installed
    await this.computer.system.bash
      .execute({
        command: 'sudo apt-get install -y pass gpg',
      })
      .catch((error) => {
        console.error('Failed to install pass:', error);
        throw error;
      });

    // Create a temporary file for the keys
    await this.computer.system.bash.execute({
      command: 'mkdir -p ~/.gnupg && chmod 700 ~/.gnupg',
    });

    // Write the public and private keys to temporary files
    await this.computer.system.bash.execute({
      command: `echo "${gpgPublicKey}" > /tmp/pubkey.asc && echo "${gpgPrivateKey}" > /tmp/privkey.asc && chmod 600 /tmp/*.asc`,
    });

    // Import both keys
    await this.computer.system.bash
      .execute({
        command:
          'gpg --batch --import /tmp/pubkey.asc && gpg --batch --import /tmp/privkey.asc',
      })
      .catch((error) => {
        console.error('Failed to import GPG keys:', error);
        throw error;
      });

    // Set ultimate trust for the key using trust db
    await this.computer.system.bash
      .execute({
        command: `echo "${gpgKeyId}:6:" | gpg --import-ownertrust`,
      })
      .catch((error) => {
        console.error('Failed to trust GPG key:', error);
        throw error;
      });

    // Initialize pass with the imported key
    await this.computer.system.bash
      .execute({
        command: `pass init "${gpgKeyId}"`,
      })
      .catch((error) => {
        console.error('Failed to init pass:', error);
        throw error;
      });

    // Clean up
    await this.computer.system.bash.execute({
      command: 'rm -f /tmp/*.asc',
    });

    console.log('Keychain installed successfully');
  }

  async start() {
    console.log('Keychain started');
  }

  async stop() {
    console.log('Keychain stopped');
  }

  async login(serviceId: string, elements: Element[]) {
    const value = await this.getKey(serviceId);

    if (!value) {
      throw new Error(`No credentials found for ${serviceId}`);
    }

    elements.forEach((element) => {
      const credential = value[element.type]!;
      this.fillElement(element, credential);
    });
  }

  async fillElement(element: Element, value: string) {
    await this.computer.system.mouse.move(element.coordinates);
    await this.computer.system.mouse.leftClick();
    await this.computer.system.keyboard.type({ text: value });
  }

  // requestCredentials(serviceId: string) {
  //   // TODO: Implement this
  // }

  async setKey(key: string, value: KeychainItem) {
    try {
      // Create a pretty-printed JSON string for better readability in pass
      const valueStr = JSON.stringify(value);

      console.log('Setting key:', key, valueStr);
      console.log(
        'Command:',
        `echo '${valueStr}' | pass insert -m -f "${key}"`
      );

      // Use pass insert with -m flag for multiline data, and force overwrite with -f
      await this.computer.system.bash.execute({
        command: `echo '${valueStr}' | pass insert -m -f "${key}"`,
      });
    } catch (error) {
      console.error(`Failed to set key ${key}:`, error);
      throw new Error(`Failed to store credentials for ${key}`);
    }
  }

  async getKey(key: string): Promise<KeychainItem | null> {
    try {
      // Retrieve the encrypted value using pass
      const result = await this.computer.system.bash.execute({
        command: `pass "${key}"`, // 'show' is optional in pass commands
      });

      if (!result.output) {
        return null;
      }

      // Parse the JSON string back to KeychainItem
      const value = JSON.parse(result.output.trim()) as KeychainItem;

      return value;
    } catch (error) {
      console.error(`Failed to get key ${key}:`, error);
      return null;
    }
  }
}
