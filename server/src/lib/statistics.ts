import { NextFunction, Request, Response } from 'express';
const PromiseRouter = require('express-promise-router');
import Model from './model';
import { getTableStatistics } from './model/statistics';
import { TableNames } from 'common';

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
    router.get('/clips/', this.clipCount);
    router.get('/users', this.userCount);
    router.get('/sentences', this.userCount);

    return router;
  }

  downloadCount = async (_response: Request, response: Response) => {
    return response.json(await getTableStatistics(TableNames.DOWNLOADS));
  };

  clipCount = async (_response: Request, response: Response) => {
    return response.json(await getTableStatistics(TableNames.CLIPS));
  };

  userCount = async (_response: Request, response: Response) => {
    return response.json(await getTableStatistics(TableNames.CLIPS));
  };

  sentenceCount = async (_response: Request, response: Response) => {
    return response.json(await getTableStatistics(TableNames.SENTENCES));
  };

  // getSpeakerStats = async ( _Request: Request, response: Response) => {
  //   const { type: clipType } = params;

  //   if (clipType) {
  //     return getSpeakerCount;
  //   }
  // };
}
