import * as http from 'http';
import * as bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';
import { CommonVoiceConfig } from '../config-helper';
import Model from './model';
import Clip from './clip';
import Corpus from './corpus';
import Prometheus from './prometheus';
import WebHook from './webhook';
import respond from './responder';

export default class API {
  config: CommonVoiceConfig;
  model: Model;
  clip: Clip;
  corpus: Corpus;
  metrics: Prometheus;
  webhook: WebHook;

  constructor(config: CommonVoiceConfig, model: Model) {
    this.config = config;
    this.model = model;
    this.clip = new Clip(this.config, this.model);
    this.corpus = new Corpus();
    this.metrics = new Prometheus(this.config);
    this.webhook = new WebHook();
  }

  getRouter() {
    const router = Router();

    router.use((request, response, next) => {
      this.metrics.countRequest(request);
      next();
    });

    router.get('/metrics', (request, response) => {
      this.metrics.countPrometheusRequest(request);

      const { registry } = this.metrics;
      response
        .type(registry.contentType)
        .status(200)
        .end(registry.metrics());
    });

    router.use('/upload', () => {});

    router.use((request, response, next) => {
      this.metrics.countApiRequest(request);
      next();
    });

    router.post('/user', bodyParser.json(), this.handleUserSync.bind(this));

    router.get('/sentence/:count', async (request, response) => {
      await this.returnRandomSentence(response, request.params.count);
    });

    return router;
  }

  /**
   * Loads cache. API will still be responsive to requests while loading cache.
   */
  async loadCache(): Promise<void> {
    await this.corpus.loadCache();
    this.corpus.displayMetrics();
  }

  async handleUserSync(request: Request, response: Response) {
    try {
      const uid = request.headers.uid as string;
      const body = await request.body;
      await this.model.syncUser(uid, body);
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
    // Handle all clip related requests first.
    if (this.clip.isClipRequest(request)) {
      this.metrics.countClipRequest(request);
      this.clip.handleRequest(request, response);
      return;
    }

    if (this.webhook.isHookRequest(request)) {
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
