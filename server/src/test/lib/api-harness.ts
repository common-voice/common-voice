import { CommonVoiceConfig, getConfig } from '../../config-helper';

/**
 * Server testing harness.
 */
export default class ApiHarness {
  private static READY_TIMEOUT: number = 1000;
  private static SERVER_POLL_INTERVAL: number = 500;

  config: CommonVoiceConfig;

  constructor(config: CommonVoiceConfig) {
    this.config = config ? config : getConfig();
  }

  private getDomain(): string {
    return `http://localhost:${this.config.SERVER_PORT}`;
  }

  async fetchIndex(): Promise<Response> {
    return fetch(this.getDomain());
  }
  /**
   * Return promise that resolves when server is ready.
   */
  ready(): Promise<void> {
    return new Promise((res: Function, rej: Function) => {
      // We will poll the server until it is ready.
      let handle = setInterval(async () => {
        try {
          const response: Response = await this.fetchIndex();
          if (response && response.status === 200) {
            clearInterval(handle);
            handle = null;
            res();
          }
        } catch (err) {
          console.error('got error polling index', err);
        }
      }, ApiHarness.SERVER_POLL_INTERVAL);

      setTimeout(() => {
        if (handle) {
          clearInterval(handle);
          rej('server timeout');
        }
      }, ApiHarness.READY_TIMEOUT);
    });
  }
}
