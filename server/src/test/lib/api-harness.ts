import { Response, default as fetch } from 'node-fetch';
import { CommonVoiceConfig, getConfig } from '../../config-helper';

/**
 * Server testing harness.
 */
export default class ApiHarness {
  private static READY_TIMEOUT: number = 1000;
  private static SERVER_POLL_INTERVAL: number = 500;

  // Copied from `web/src/lib/api.ts.
  private static DEFAULT_BASE: string = './api/';
  private static USER_URL: string = '/api/user/';
  private static SOUNDCLIP_URL: string = '/upload/';
  private static CLIP_VOTE_URL: string = '/upload/vote/';
  private static DEMOGRAPHIC_URL: string = '/upload/demographic/';

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

  async syncUser(uid: string, email?: string): Promise<void> {
    const response = await fetch(this.getDomain() + ApiHarness.USER_URL, {
      method: 'POST',
      headers: {
        uid: uid,
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    console.log('got respones');
  }

  /**
   * Return promise that resolves when server is ready.
   */
  ready(): Promise<void> {
    return new Promise((res: Function, rej: Function) => {
      // We will poll the server until it is ready.
      let handle = setInterval(
        async function() {
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
        }.bind(this),
        ApiHarness.SERVER_POLL_INTERVAL
      );

      setTimeout(() => {
        if (handle) {
          clearInterval(handle);
          rej('server timeout');
        }
      }, ApiHarness.READY_TIMEOUT);
    });
  }
}
