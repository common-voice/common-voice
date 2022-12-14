import { NextFunction, Request, Response } from 'express';
import PromiseRouter from 'express-promise-router';
import Model from './model';
import { getStatistics } from './model/statistics';
import { TableNames } from 'common';
import {
  accountStatSchema,
  clipStatSchema,
  downloadStatSchema,
  sentenceStatSchema,
  speakerStatSchema,
} from './validation/statistics';
import validate from './validation';

/**
 * Clip - Responsibly for saving and serving clips.
 */
export default class Statistics {
  model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  getRouter() {
    const router = PromiseRouter();

    router.get('/clips', validate({ query: clipStatSchema }), this.clipCount);
    router.get(
      '/downloads',
      validate({ query: downloadStatSchema }),
      this.downloadCount
    );
    router.get(
      '/speakers',
      validate({ query: speakerStatSchema }),
      this.uniqueSpeakers
    );
    router.get(
      '/accounts',
      validate({ query: accountStatSchema }),
      this.accountCount
    );
    router.get(
      '/sentences',
      validate({ query: sentenceStatSchema }),
      this.sentenceCount
    );

    return router;
  }

  downloadCount = async (request: Request, response: Response) => {
    return response.json(await getStatistics(TableNames.DOWNLOADS));
  };

  uniqueSpeakers = async (request: Request, response: Response) => {
    return response.json(
      await getStatistics(TableNames.CLIPS, {
        groupByColumn: 'client_id',
        isDistinct: true,
      })
    );
  };

  clipCount = async (request: Request, response: Response) => {
    const { filter } = request.query as never;

    if (filter) {
      return response.json(await getStatistics(TableNames.CLIPS, { filter }));
    }

    return response.json(await getStatistics(TableNames.CLIPS));
  };

  accountCount = async (request: Request, response: Response) => {
    const filter = 'hasEmail';
    return response.json(await getStatistics(TableNames.USERS, { filter }));
  };

  sentenceCount = async (request: Request, response: Response) => {
    const { filter } = request.query as never;

    if (filter && typeof filter === 'string') {
      return response.json(
        await getStatistics(TableNames.SENTENCES, { isDuplicate: true })
      );
    }
    return response.json(await getStatistics(TableNames.SENTENCES));
  };
}
