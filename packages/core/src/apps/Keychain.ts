import { App } from '../App';

export interface FillAction {
  type: 'password' | 'email' | 'username';
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

export class Keychain extends App {
  public services: string[] = [];

  constructor() {
    super({
      name: 'keychain',
      platform: 'linux',
      autoStart: true,
    });
  }

  async start() {}

  async stop() {}

  async init() {
    const keys = await this.computer.system.bash.execute({
      command: 'pass ls',
    });

    if (!keys.output) {
      throw new Error('Failed to fetch keys from pass');
    }

    this.services = keys.output
      .split('\n')
      .filter((line) => line.includes('└──'))
      .map((line) => line.replace('└── ', '').trim())
      .filter(Boolean);
  }

  async install() {
    const gpgPublicKey = process.env.GPG_PUBLIC_KEY;
    const gpgPrivateKey = process.env.GPG_PRIVATE_KEY;
    const gpgKeyId = process.env.GPG_KEY_ID;

    if (!gpgPublicKey || !gpgKeyId || !gpgPrivateKey) {
      throw new Error(
        'Missing required environment variables: GPG_PUBLIC_KEY, GPG_PRIVATE_KEY and GPG_KEY_ID'
      );
    }

    await this.computer.system.bash.execute({
      command: 'sudo apt-get install -y pass gpg',
    });

    await this.computer.system.bash.execute({
      command: 'mkdir -p ~/.gnupg && chmod 700 ~/.gnupg',
    });

    await this.computer.system.bash.execute({
      command: `echo "${gpgPublicKey}" > /tmp/pubkey.asc && echo "${gpgPrivateKey}" > /tmp/privkey.asc && chmod 600 /tmp/*.asc`,
    });

    await this.computer.system.bash.execute({
      command:
        'gpg --batch --import /tmp/pubkey.asc && gpg --batch --import /tmp/privkey.asc',
    });

    await this.computer.system.bash.execute({
      command: `echo "${gpgKeyId}:6:" | gpg --import-ownertrust`,
    });

    await this.computer.system.bash.execute({
      command: `pass init "${gpgKeyId}"`,
    });

    await this.computer.system.bash.execute({
      command: 'rm -f /tmp/*.asc',
    });
  }

  async authenticate(serviceId: string, actions: FillAction[]) {
    const value = await this.getKey(serviceId);
    if (!value) {
      throw new Error(`No credentials found for ${serviceId}`);
    }
    for (const action of actions) {
      const credential = value[action.type]!;
      await this.computer.system.mouse.move(action.coordinates);
      await this.computer.system.mouse.leftClick();
      await this.computer.system.keyboard.type({ text: credential });
    }
  }

  async setKey(key: string, value: KeychainItem) {
    const valueStr = JSON.stringify(value);
    await this.computer.system.bash.execute({
      command: `echo '${valueStr}' | pass insert -m -f "${key}"`,
    });
  }

  async getKey(key: string): Promise<KeychainItem | null> {
    const result = await this.computer.system.bash.execute({
      command: `pass "${key}"`,
    });
    if (!result.output) {
      return null;
    }
    return JSON.parse(result.output.trim()) as KeychainItem;
  }
}
