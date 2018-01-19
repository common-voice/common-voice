import * as http from 'http';

import { CommonVoiceConfig } from '../config-helper';
import Model from './model';
import Clip from './clip';
import Prometheus from './prometheus';
import WebHook from './webhook';
import respond from './responder';

export default class API {
  config: CommonVoiceConfig;
  model: Model;
  clip: Clip;
  metrics: Prometheus;
  webhook: WebHook;

  constructor(config: CommonVoiceConfig, model: Model) {
    this.config = config;
    this.model = model;
    this.clip = new Clip(this.config, this.model);
    this.metrics = new Prometheus(this.config);
    this.webhook = new WebHook();
  }

  /**
   * Get the body of the request.
   */
  private getRequestBody(request: http.IncomingMessage): Promise<string> {
    request.setEncoding('utf8');
    return new Promise((res, rej) => {
      let body = '';
      request.on('error', rej);
      request.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });
      request.on('end', () => {
        res(body);
      });
    });
  }

  set isMigrated(value: boolean) {
    this.clip.isMigrated = value;
  }

  /**
   * Is this request directed at the api?
   */
  isApiRequest(request: http.IncomingMessage) {
    return (
      request.url.includes('/api/') ||
      this.clip.isClipRequest(request) ||
      this.metrics.isPrometheusRequest(request)
    );
  }

  async handleUserSync(
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) {
    try {
      const uid = request.headers.uid as string;
      const body = await this.getRequestBody(request);
      await this.model.syncUser(uid, JSON.parse(body));
      respond(response, 'user synced');
    } catch (err) {
      console.error('could not sync user', err);
      respond(response, 'could not sync user', 500);
    }
  }

  /**
   * Give api response.
   */
  async handleRequest(
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) {
    this.metrics.countRequest(request);

    // Handle all clip related requests first.
    if (this.clip.isClipRequest(request)) {
      this.metrics.countClipRequest(request);
      await this.clip.handleRequest(request, response);
      return;
    }

    // Check for Prometheus metrics request.
    if (this.metrics.isPrometheusRequest(request)) {
      this.metrics.countPrometheusRequest(request);
      this.metrics.handleRequest(request, response);
      return;
    }

    // If we get here, we are at an API request.
    this.metrics.countApiRequest(request);

    if (request.url.includes('/user')) {
      await this.handleUserSync(request, response);
    } else if (request.url.includes('/sentence')) {
      let parts = request.url.split('/');
      let index = parts.indexOf('sentence');
      let count = parts[index + 1] && parseInt(parts[index + 1], 10);
      await this.returnRandomSentence(response, count);
      // Webhooks from github.
    } else if (this.webhook.isHookRequest(request)) {
      this.webhook.handleWebhookRequest(request, response);

      // Unrecognized requests get here.
    } else {
      console.error('unrecongized api url', request.url);
      respond(response, "I'm not sure what you want.", 404);
    }
  }

  /**
   * Load sentence file (if necessary), pick random sentence.
   */
  async returnRandomSentence(response: http.ServerResponse, count: number = 1) {
    respond(response, (await this.model.getRandomSentences(count)).join('\n'));
  }
}
