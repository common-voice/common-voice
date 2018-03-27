import * as bodyParser from 'body-parser';
import { NextFunction, Request, Response, Router } from 'express';
const PromiseRouter = require('express-promise-router');
import { getConfig } from '../config-helper';
import Model from './model';
import Clip from './clip';
import Prometheus from './prometheus';
import { AWS } from './aws';
import { ClientParameterError, ServerError } from './utility';

export default class API {
  model: Model;
  clip: Clip;
  metrics: Prometheus;

  constructor(model: Model) {
    this.model = model;
    this.clip = new Clip(this.model);
    this.metrics = new Prometheus();
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

    router.get('/requested_languages', this.getRequestedLanguages);
    router.post('/requested_languages', this.createLanguageRequest);

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
        Bucket: getConfig().BUCKET_NAME,
        Key: demographicFile,
        Body: JSON.stringify(demographic),
      })
      .promise();

    console.log('clip demographic written to s3', demographicFile);
    response.json(uid);
  };

  saveUser = async (request: Request, response: Response) => {
    await this.model.syncUser(request.params.id, request.body);
    response.json('user synced');
  };

  getRandomSentences = async (request: Request, response: Response) => {
    const sentences = await this.model.findEligibleSentences(
      request.headers.uid as string,
      parseInt(request.query.count, 10) || 1
    );

    if (sentences.length === 0) {
      throw new ServerError('No sentences right now');
    }
    response.json(sentences);
  };

  getRequestedLanguages = async (request: Request, response: Response) => {
    response.json(await this.model.db.getRequestedLanguages());
  };

  createLanguageRequest = async (request: Request, response: Response) => {
    await this.model.db.createLanguageRequest(request.body.language, request
      .headers.uid as string);
    response.json({});
  };
}
