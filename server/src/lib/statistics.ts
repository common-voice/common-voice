import { NextFunction, Request, Response } from 'express';
const PromiseRouter = require('express-promise-router');
import Model from './model';
import { queryStatistics } from './model/statistics';
import { TableNames } from 'common';
import { statisticsSchema } from './validation/statistics';
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

    router.get(
      '/downloads',
      validate({ query: statisticsSchema }),
      this.downloadCount
    );

    router.get('/clips', validate({ query: statisticsSchema }), this.clipCount);

    router.get(
      '/speakers',
      validate({ query: statisticsSchema }),
      this.uniqueSpeakers
    );

    router.get(
      '/durations',
      validate({ query: statisticsSchema }),
      this.clipDurations
    );

    router.get(
      '/contributors',
      validate({ query: statisticsSchema }),
      this.contributorCount
    );

    router.get(
      '/sentences',
      validate({ query: statisticsSchema }),
      this.sentenceCount
    );

    return router;
  }

  downloadCount = async (request: Request, response: Response) => {
    return response.json(await queryStatistics(TableNames.DOWNLOADS));
  };

  uniqueSpeakers = async (request: Request, response: Response) => {
    return response.json(
      await queryStatistics(TableNames.CLIPS, {
        groupByColumn: 'client_id',
        isDistinict: true,
      })
    );
  };

  clipCount = async (request: Request, response: Response) => {
    return response.json(await queryStatistics(TableNames.CLIPS));
  };

  clipDurations = async (request: Request, response: Response) => {
    return response.json(await queryStatistics(TableNames.CLIPS));
  };

  contributorCount = async (request: Request, response: Response) => {
    return response.json(await queryStatistics(TableNames.USERS));
  };

  sentenceCount = async (request: Request, response: Response) => {
    return response.json(await queryStatistics(TableNames.SENTENCES));
  };
}
