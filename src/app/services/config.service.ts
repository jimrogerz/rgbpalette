import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

type AppEnv = typeof environment;

@Injectable({ providedIn: 'root' })
export class ConfigService {
  /**
   * Returns environment config of application
   */
  getEnvironment(): AppEnv {
    return environment;
  }

  /**
   * Indicates whether the apps is running in production mode
   *
   * @return {*}  {boolean}
   */
  isProd(): boolean {
    return environment.production;
  }

  /**
   * Returns app's version
   */
  getVersion(): string {
    return environment.appVersion;
  }
}
