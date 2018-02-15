import * as bodyParser from 'body-parser';
import { NextFunction, Request, Response, Router } from 'express';
const PromiseRouter = require('express-promise-router');
import { CommonVoiceConfig } from '../config-helper';
import Model from './model';
import Clip from './clip';
import Corpus from './corpus';
import Prometheus from './prometheus';
import { AWS } from './aws';
import { ClientParameterError, ServerError } from './utility';

export default class API {
  config: CommonVoiceConfig;
  model: Model;
  clip: Clip;
  corpus: Corpus;
  metrics: Prometheus;

  constructor(config: CommonVoiceConfig, model: Model) {
    this.config = config;
    this.model = model;
    this.clip = new Clip(this.config, this.model);
    this.corpus = new Corpus();
    this.metrics = new Prometheus(this.config);
  }

  getRouter(): Router {
    const router = PromiseRouter();

    router.use(bodyParser.json());

    router.use((request: Request, response: Response, next: NextFunction) => {
      this.metrics.countRequest(request);
      next();
    });

    router.get('/metrics', (request: Request, response: Response) => {
      this.metrics.countPrometheusRequest(request);

      const { registry } = this.metrics;
      response
        .type(registry.contentType)
        .status(200)
        .end(registry.metrics());
    });

    router.use((request: Request, response: Response, next: NextFunction) => {
      this.metrics.countApiRequest(request);
      next();
    });

    router.put('/user_clients/:id', this.saveUserClient);
    router.put('/users/:id', this.saveUser);

    router.get('/sentences', this.getRandomSentences);

    router.use(
      '/clips',
      (request: Request, response: Response, next: NextFunction) => {
        this.metrics.countClipRequest(request);
        next();
      },
      this.clip.getRouter()
    );

    router.use('*', (request: Request, response: Response) => {
      response.sendStatus(404);
    });

    return router;
  }

  saveUserClient = async (request: Request, response: Response) => {
    const uid = request.params.id as string;
    const demographic = request.body;

    if (!uid || !demographic) {
      throw new ClientParameterError();
    }

    // Where is the clip demographic going to be located?
    const demographicFile = uid + '/demographic.json';

    await this.model.db.updateUser(uid, demographic);

    await AWS.getS3()
      .putObject({
        Bucket: this.config.BUCKET_NAME,
        Key: demographicFile,
        Body: JSON.stringify(demographic),
      })
      .promise();

    console.log('clip demographic written to s3', demographicFile);
    response.json(uid);
  };

  /**
   * Loads cache. API will still be responsive to requests while loading cache.
   */
  async loadCache(): Promise<void> {
    await this.corpus.loadCache();
    await this.corpus.displayMetrics();
  }

  saveUser = async (request: Request, response: Response) => {
    await this.model.syncUser(request.params.id, request.body);
    response.json('user synced');
  };

  /**
   * Load sentence file (if necessary), pick random sentence.
   */
  getRandomSentences = async (request: Request, response: Response) => {
    const count = parseInt(request.query.count, 10) || 1;
    let randoms = this.corpus.getMultipleRandom(count);

    // Make sure we were able to feature the right amount of random sentences.
    if (!randoms || randoms.length < count) {
      throw new ServerError('No sentences right now');
    }
    response.json(randoms);
  };
}
