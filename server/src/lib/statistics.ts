import { NextFunction, Request, Response } from 'express';
import PromiseRouter from 'express-promise-router';
import Model from './model';
import { getStatistics, Filter } from './model/statistics';
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
    router.get('/contributors', this.contributorCount);
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
      console.log('filtera', filter);
      return response.json(await getStatistics(TableNames.CLIPS, { filter }));
    }
    return response.json(await getStatistics(TableNames.CLIPS));
  };

  contributorCount = async (request: Request, response: Response) => {
    return response.json(await getStatistics(TableNames.USERS));
  };

  sentenceCount = async (request: Request, response: Response) => {
    return response.json(await getStatistics(TableNames.SENTENCES));
  };
}
