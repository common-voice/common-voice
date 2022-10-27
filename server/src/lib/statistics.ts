import { NextFunction, Request, Response } from 'express';
import PromiseRouter from 'express-promise-router';
import Model from './model';
import { getStatistics } from './model/statistics';
import { TableNames } from 'common';
import { clipStatScehma } from './validation/statistics';
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
    router.get('/accounts', this.accounts);
    router.get('/sentences', this.sentenceCount);

    return router;
  }

  downloadCount = async (request: Request, response: Response) => {
    return response.json(await getStatistics(TableNames.DOWNLOADS));
  };

  uniqueSpeakers = async (request: Request, response: Response) => {
    return response.json(
      await getStatistics(TableNames.CLIPS, {
        groupByColumn: 'client_id',
        isDistinict: true,
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

  accounts = async (request: Request, response: Response) => {
    const filter = 'hasEmail';
    return response.json(await getStatistics(TableNames.USERS, { filter }));
  };

  sentenceCount = async (request: Request, response: Response) => {
    return response.json(await getStatistics(TableNames.SENTENCES));
  };
}
