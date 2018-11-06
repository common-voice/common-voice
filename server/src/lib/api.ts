import * as bodyParser from 'body-parser';
import { MD5 } from 'crypto-js';
import { NextFunction, Request, Response, Router } from 'express';
import * as sendRequest from 'request-promise-native';
import { UserClient as UserClientType } from '../../../common/user-clients';
import { getConfig } from '../config-helper';
import UserClient from './model/user-client';
import Model from './model';
import Clip from './clip';
import Prometheus from './prometheus';
import { AWS } from './aws';
import { ClientParameterError } from './utility';

const PromiseRouter = require('express-promise-router');

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
    router.get('/user_clients', this.getUserClients);
    router.get('/user_client', this.getAccount);
    router.patch('/user_client', this.saveAccount);
    router.post(
      '/user_client/avatar/:type',
      bodyParser.raw({ type: 'image/*' }),
      this.saveAvatar
    );
    router.put('/users/:id', this.saveUser);

    router.get('/:locale/sentences', this.getRandomSentences);
    router.post('/skipped_sentences/:id', this.createSkippedSentence);

    router.use(
      '/:locale?/clips',
      (request: Request, response: Response, next: NextFunction) => {
        this.metrics.countClipRequest(request);
        next();
      },
      this.clip.getRouter()
    );

    router.get('/requested_languages', this.getRequestedLanguages);
    router.post('/requested_languages', this.createLanguageRequest);

    router.get('/language_stats', this.getLanguageStats);

    router.post('/newsletter/:email', this.subscribeToNewsletter);

    router.use('*', (request: Request, response: Response) => {
      response.sendStatus(404);
    });

    return router;
  }

  saveUserClient = async ({ body, params }: Request, response: Response) => {
    const uid = params.id as string;
    const demographic = body;

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
    await this.model.syncUser(
      request.params.id,
      request.body,
      request.header('Referer')
    );
    response.json('user synced');
  };

  getRandomSentences = async (request: Request, response: Response) => {
    const { headers, params } = request;
    const sentences = await this.model.findEligibleSentences(
      headers.uid as string,
      params.locale,
      parseInt(request.query.count, 10) || 1
    );

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

  createSkippedSentence = async (request: Request, response: Response) => {
    const { headers: { uid }, params: { id } } = request;
    await this.model.db.createSkippedSentence(id, uid as string);
    response.json({});
  };

  getLanguageStats = async (request: Request, response: Response) => {
    response.json(await this.model.getLanguageStats());
  };

  getUserClients = async ({ headers, user }: Request, response: Response) => {
    if (!user) {
      response.json([]);
      return;
    }

    const email = user.emails[0].value;
    const userClients: UserClientType[] = [
      { email },
      ...(await UserClient.findAllWithLocales({
        email,
        client_id: headers.uid as string,
      })),
    ];
    response.json(userClients);
  };

  saveAccount = async ({ body, user }: Request, response: Response) => {
    if (!user) {
      throw new ClientParameterError();
    }
    response.json(
      await UserClient.saveAccount(user.id, {
        ...body,
        email: user.emails[0].value,
      })
    );
  };

  getAccount = async ({ user }: Request, response: Response) => {
    response.json(user ? await UserClient.findAccount(user.id) : null);
  };

  subscribeToNewsletter = async (request: Request, response: Response) => {
    const { BASKET_API_KEY, PROD } = getConfig();
    if (!BASKET_API_KEY) {
      response.json({});
      return;
    }

    const { email } = request.params;
    const basketResponse = await sendRequest({
      uri: 'https://basket.mozilla.org/news/subscribe/',
      method: 'POST',
      form: {
        'api-key': BASKET_API_KEY,
        newsletters: 'common-voice',
        format: 'H',
        lang: 'en',
        email,
        source_url: request.header('Referer'),
        sync: 'Y',
      },
    });
    await UserClient.updateBasketToken(email, JSON.parse(basketResponse).token);
    response.json({});
  };

  saveAvatar = async (
    { body, headers, params, user }: Request,
    response: Response
  ) => {
    let avatarURL;
    let error;
    switch (params.type) {
      case 'default':
        avatarURL = null;
        break;

      case 'gravatar':
        try {
          avatarURL =
            'https://gravatar.com/avatar/' +
            MD5(user.emails[0].value).toString() +
            '.png?s=24';
          await sendRequest(avatarURL + '&d=404');
        } catch (e) {
          if (e.name != 'StatusCodeError') {
            throw e;
          }
          error = 'not_found';
        }
        break;

      case 'file':
        avatarURL =
          'data:' +
          headers['content-type'] +
          ';base64,' +
          body.toString('base64');
        if (avatarURL.length > 2500) {
          error = 'too_large';
        }
        break;

      default:
        response.sendStatus(404);
        return;
    }

    if (!error) {
      await UserClient.updateAvatarURL(user.id, avatarURL);
    }

    response.json(error ? { error } : {});
  };
}
