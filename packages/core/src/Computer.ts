import { App } from './App';
import * as Client from './Client';

export class Computer<T extends Record<string, App> = {}> {
  public apps: T;
  public system = Client;

  constructor(apps: T) {
    this.apps = apps;
    this.boot();
  }

  private boot() {
    Object.values(this.apps).forEach((app) => app.init(this));
    Object.values(this.apps).forEach((app) => app.install());
    Object.values(this.apps).forEach(
      (app) => app.config.autoStart && app.start()
    );
  }

  public shutdown() {
    Object.values(this.apps).forEach((app) => app.stop());
  }
}
