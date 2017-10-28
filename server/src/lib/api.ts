import * as http from 'http';
import * as path from 'path';

import { CommonVoiceConfig } from '../config-helper';
import Model from './model';
import Clip from './clip';
import Corpus from './corpus';
import Prometheus from './prometheus';
import WebHook from './webhook';
import respond from './responder';

import { S3 } from 'aws-sdk';

export default class API {
  config: CommonVoiceConfig;
  model: Model;
  clip: Clip;
  corpus: Corpus;
  metrics: Prometheus;
  webhook: WebHook;

  constructor(config: CommonVoiceConfig, model: Model, s3: S3) {
    this.config = config;
    this.model = model;
    this.clip = new Clip(this.config, this.model, s3);
    this.corpus = new Corpus();
    this.metrics = new Prometheus();
    this.webhook = new WebHook();
  }

  /**
   * Loads cache. API will still be responsive to requests while loading cache.
   */
  async loadCache(): Promise<void> {
    await Promise.all([this.clip.loadCache(), this.corpus.loadCache()]);
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

  /**
   * Give api response.
   */
  handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
    this.metrics.countRequest(request);

    // Handle all clip related requests first.
    if (this.clip.isClipRequest(request)) {
      this.metrics.countClipRequest(request);
      this.clip.handleRequest(request, response);
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

    // Most often this will be a sentence request.
    if (request.url.includes('/sentence')) {
      let parts = request.url.split('/');
      let index = parts.indexOf('sentence');
      let count = parts[index + 1] && parseInt(parts[index + 1], 10);
      this.returnRandomSentence(response, count);
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
  async returnRandomSentence(response: http.ServerResponse, count: number) {
    count = count || 1;
    let randoms = this.corpus.getMultipleRandom(count);

    // Make sure we were able to feature the right amount of random sentences.
    if (!randoms || randoms.length < count) {
      respond(response, 'No sentences right now', 500);
      return;
    }
    respond(response, randoms.join('\n'));
  }
}
