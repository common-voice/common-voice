import { NextFunction, Request, Response } from 'express';
import PromiseRouter from 'express-promise-router';
import Model from './model';
import { getStatistics } from './model/statistics';
import { TableNames } from 'common';
import { clipStatScehma, sentenceStatScehma } from './validation/statistics';
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

    router.get('/downloads', this.downloadCount);
    router.get('/clips', validate({ query: clipStatScehma }), this.clipCount);
    router.get('/speakers', this.uniqueSpeakers);
    router.get('/accounts', this.accountCount);
    router.get(
      '/sentences',
      validate({ query: sentenceStatScehma }),
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
