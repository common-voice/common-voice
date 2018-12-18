import * as bodyParser from 'body-parser';
import { MD5 } from 'crypto-js';
import { NextFunction, Request, Response, Router } from 'express';
import * as sendRequest from 'request-promise-native';
import { UserClient as UserClientType } from 'common/user-clients';
import { getConfig } from '../config-helper';
import getGoals from './model/goals';
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

    router.use(
      async (request: Request, response: Response, next: NextFunction) => {
        this.metrics.countRequest(request);

        const client_id = request.headers.client_id as string;
        if (client_id) {
          if (await UserClient.hasSSO(client_id)) {
            response.sendStatus(401);
            return;
          } else {
            await this.model.db.saveUserClient(client_id);
          }
          request.client_id = client_id;
        } else if (request.user) {
          request.client_id = await UserClient.findClientId(
            request.user.emails[0].value
          );
        }

        next();
      }
    );

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

    router.get('/user_clients', this.getUserClients);
    router.post('/user_clients/:client_id/claim', this.claimUserClient);
    router.get('/user_client', this.getAccount);
    router.patch('/user_client', this.saveAccount);
    router.post(
      '/user_client/avatar/:type',
      bodyParser.raw({ type: 'image/*' }),
      this.saveAvatar
    );

    router.get('/user_client/goals', this.getGoals);
    router.get('/user_client/:locale/goals', this.getGoals);

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

    router.get('/contribution_activity', this.getContributionActivity);
    router.get('/:locale/contribution_activity', this.getContributionActivity);

    router.get('/requested_languages', this.getRequestedLanguages);
    router.post('/requested_languages', this.createLanguageRequest);

    router.get('/language_stats', this.getLanguageStats);

    router.post('/newsletter/:email', this.subscribeToNewsletter);

    router.use('*', (request: Request, response: Response) => {
      response.sendStatus(404);
    });

    return router;
  }

  getRandomSentences = async (request: Request, response: Response) => {
    const { client_id, params } = request;
    const sentences = await this.model.findEligibleSentences(
      client_id,
      params.locale,
      parseInt(request.query.count, 10) || 1
    );

    response.json(sentences);
  };

  getRequestedLanguages = async (request: Request, response: Response) => {
    response.json(await this.model.db.getRequestedLanguages());
  };

  createLanguageRequest = async (request: Request, response: Response) => {
    await this.model.db.createLanguageRequest(
      request.body.language,
      request.client_id
    );
    response.json({});
  };

  createSkippedSentence = async (request: Request, response: Response) => {
    const {
      client_id,
      params: { id },
    } = request;
    await this.model.db.createSkippedSentence(id, client_id);
    response.json({});
  };

  getLanguageStats = async (request: Request, response: Response) => {
    response.json(await this.model.getLanguageStats());
  };

  getUserClients = async ({ client_id, user }: Request, response: Response) => {
    if (!user) {
      response.json([]);
      return;
    }

    const email = user.emails[0].value;
    const userClients: UserClientType[] = [
      { email },
      ...(await UserClient.findAllWithLocales({
        email,
        client_id,
      })),
    ];
    response.json(userClients);
  };

  saveAccount = async ({ body, user }: Request, response: Response) => {
    if (!user) {
      throw new ClientParameterError();
    }
    response.json(await UserClient.saveAccount(user.emails[0].value, body));
  };

  getAccount = async ({ user }: Request, response: Response) => {
    response.json(
      user ? await UserClient.findAccount(user.emails[0].value) : null
    );
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
        console.log(avatarURL.length);
        if (avatarURL.length > 8000) {
          error = 'too_large';
        }
        break;

      default:
        response.sendStatus(404);
        return;
    }

    if (!error) {
      await UserClient.updateAvatarURL(user.emails[0].value, avatarURL);
    }

    response.json(error ? { error } : {});
  };

  getContributionActivity = async (
    { client_id, params: { locale }, query }: Request,
    response: Response
  ) => {
    response.json(
      await (query.from == 'you'
        ? this.model.db.getContributionStats(locale, client_id)
        : this.model.getContributionStats(locale))
    );
  };

  getGoals = async (
    { client_id, params: { locale } }: Request,
    response: Response
  ) => {
    response.json(await getGoals(client_id, locale));
  };

  claimUserClient = async (
    { client_id, params }: Request,
    response: Response
  ) => {
    if (!(await UserClient.hasSSO(params.client_id)) && client_id) {
      await UserClient.claimContributions(client_id, [params.client_id]);
    }
    response.json({});
  };
}
