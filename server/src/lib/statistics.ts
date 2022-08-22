import { NextFunction, Request, Response } from 'express';
const PromiseRouter = require('express-promise-router');
import Model from './model';
import { getDownloaderCount } from './model/statistics';

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

    // router.get('/clips/', this.getSpeakerStats);
    router.get('/downloads', this.downloadCount);

    return router;
  }

  downloadCount = async ({ params }: Request, response: Response) => {
    const { type: clipType } = params;
    console.log('await getDownloaderCount()', await getDownloaderCount());

    return response.json(await getDownloaderCount());
  };

  // getSpeakerStats = async ({ params }: Request, response: Response) => {
  //   const { type: clipType } = params;

  //   if (clipType) {
  //     return getSpeakerCount;
  //   }
  // };
}
