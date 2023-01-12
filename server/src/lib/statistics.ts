import { Request, Response } from 'express';
import PromiseRouter from 'express-promise-router';
import Model from './model';
import { getMetadataQueryHandler, getStatistics } from './model/statistics';
import { QueryOptions, TableNames } from 'common';
import {
  accountStatSchema,
  clipStatSchema,
  downloadStatSchema,
  sentenceStatSchema,
  speakerStatSchema,
  yearStatSchema,
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
    router.get('/metadata', validate({ query: yearStatSchema }), this.getMetadata);
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
    const options = request.query as QueryOptions;

    return response.json(await getStatistics(TableNames.DOWNLOADS, options));
  };
  
  uniqueSpeakers = async (request: Request, response: Response) => {
    const options = request.query as QueryOptions;

    return response.json(
      await getStatistics(TableNames.CLIPS, {
        ...options,
        groupByColumn: 'client_id',
        isDistinct: true,
      })
    );
  };

  clipCount = async (request: Request, response: Response) => {
    const options = request.query as QueryOptions;

    return response.json(await getStatistics(TableNames.CLIPS, options));
  };

  accountCount = async (request: Request, response: Response) => {
    const options = request.query as QueryOptions;
    
    return response.json(
      await getStatistics(TableNames.USERS, { ...options, filter: 'hasEmail' })
    );
  };

  sentenceCount = async (request: Request, response: Response) => {
    const options = request.query as QueryOptions;

    return response.json(
      await getStatistics(TableNames.SENTENCES, options)
    );
  };

  getMetadata = async (request: Request, response: Response) => {
    const options = request.query as QueryOptions;

    return response.json(
      await getMetadataQueryHandler(TableNames.CLIPS, options, 'metadata')
    );
  };
}
