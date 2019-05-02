import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
require('source-map-support').install();
const contributableLocales = require('locales/contributable.json');
import { importLocales } from './lib/model/db/import-locales';
import Model from './lib/model';
import {
  getFullClipLeaderboard,
  getFullVoteLeaderboard,
} from './lib/model/leaderboard';
import API from './lib/api';
import Logger from './lib/logger';
import { getElapsedSeconds, ClientError, APIError } from './lib/utility';
import { importSentences } from './lib/model/db/import-sentences';
import { getConfig } from './config-helper';
import authRouter from './auth-router';
import fetchLegalDocument from './fetch-legal-document';

const consul = require('consul')({ promisify: true });

const FULL_CLIENT_PATH = path.join(__dirname, '..', '..', 'web');

const CSP_HEADER = [
  `default-src 'none'`,
  `style-src 'self' https://fonts.googleapis.com https://optimize.google.com 'unsafe-inline'`,
  `img-src 'self' www.google-analytics.com www.gstatic.com https://optimize.google.com https://www.gstatic.com https://gravatar.com data:`,
  `media-src data: blob: https://*.amazonaws.com https://*.amazon.com`,
  // Note: we allow unsafe-eval locally for certain webpack functionality.
  `script-src 'self' 'unsafe-eval' 'sha256-yybRmIqa26xg7KGtrMnt72G0dH8BpYXt7P52opMh3pY=' 'sha256-jfhv8tvvalNCnKthfpd8uT4imR5CXYkGdysNzQ5599Q=' https://www.google-analytics.com https://pontoon.mozilla.org https://optimize.google.com https://sentry.io`,
  `font-src 'self' https://fonts.gstatic.com`,
  `connect-src 'self' https://pontoon.mozilla.org/graphql https://*.amazonaws.com https://*.amazon.com https://www.gstatic.com https://www.google-analytics.com https://sentry.io https://basket.mozilla.org https://basket-dev.allizom.org`,
  `frame-src https://optimize.google.com`,
].join(';');

export default class Server {
  app: express.Application;
  server: http.Server;
  model: Model;
  api: API;
  logger: Logger;
  isLeader: boolean;

  constructor(options?: { bundleCrossLocaleMessages: boolean }) {
    options = { bundleCrossLocaleMessages: true, ...options };
    this.model = new Model();
    this.api = new API(this.model);
    this.logger = new Logger();
    this.isLeader = null;

    // Make console.log output json.
    if (getConfig().PROD) {
      this.logger.overrideConsole();
    }

    const app = (this.app = express());

    app.use((request, response, next) => {
      // redirect to omit trailing slashes
      if (request.path.substr(-1) == '/' && request.path.length > 1) {
        const query = request.url.slice(request.path.length);
        response.redirect(301, request.path.slice(0, -1) + query);
      } else {
        next();
      }
    });

    app.use(authRouter);
    app.use('/api/v1', this.api.getRouter());

    const staticOptions = {
      setHeaders: (response: express.Response) => {
        // Only use CSP locally. In production, Apache handles CSP headers.
        // See path: nubis/puppet/web.pp
        !getConfig().PROD &&
          response.set('Content-Security-Policy', CSP_HEADER);
      },
    };

    app.use(express.static(FULL_CLIENT_PATH, staticOptions));

    app.use(
      '/contribute.json',
      express.static(path.join(__dirname, '..', 'contribute.json'))
    );

    app.use(
      '/apple-app-site-association',
      express.static(
        path.join(FULL_CLIENT_PATH, 'apple-app-site-association.json')
      )
    );

    if (options.bundleCrossLocaleMessages) {
      this.setupCrossLocaleRoute();
    }

    this.setupPrivacyAndTermsRoutes();

    app.use(
      /(.*)/,
      express.static(FULL_CLIENT_PATH + '/index.html', staticOptions)
    );

    app.use(
      (
        error: Error,
        request: Request,
        response: Response,
        next: NextFunction
      ) => {
        console.log(error.message, error.stack);
        const isAPIError = error instanceof APIError;
        if (!isAPIError) {
          console.error(request.url, error.message, error.stack);
        }
        response
          .status(error instanceof ClientError ? 400 : 500)
          .json({ message: isAPIError ? error.message : '' });
      }
    );
  }

  private setupCrossLocaleRoute() {
    const localesPath = path.join(FULL_CLIENT_PATH, 'locales');
    const crossLocaleMessages = fs
      .readdirSync(localesPath)
      .reduce((obj: any, locale: string) => {
        const filePath = path.join(localesPath, locale, 'cross-locale.ftl');
        if (fs.existsSync(filePath)) {
          obj[locale] = fs.readFileSync(filePath, 'utf-8');
        }
        return obj;
      }, {});

    this.app.get('/cross-locale-messages.json', (request, response) => {
      response.json(crossLocaleMessages);
    });
  }

  private setupPrivacyAndTermsRoutes() {
    this.app.get(
      '/privacy/:locale.html',
      async ({ params: { locale } }, response) => {
        response.send(await fetchLegalDocument('Privacy_Notice', locale));
      }
    );
    this.app.get(
      '/terms/:locale.html',
      async ({ params: { locale } }, response) => {
        response.send(await fetchLegalDocument('Terms', locale));
      }
    );
  }

  /**
   * Log application level messages in a common format.
   */
  private print(...args: any[]) {
    args.unshift('APPLICATION --');
    console.log.apply(console, args);
  }

  /**
   * Perform any scheduled maintenance on the data model.
   */
  async performMaintenance(doImport: boolean): Promise<void> {
    const start = Date.now();
    this.print('performing Maintenance');

    try {
      await this.model.performMaintenance();
      await importLocales();
      if (doImport) {
        await importSentences(await this.model.db.mysql.createPool());
      }
      await this.model.db.fillCacheColumns();
      this.print('Maintenance complete');
    } catch (err) {
      this.print('Maintenance error', err);
    } finally {
      this.print(`${getElapsedSeconds(start)}s to perform maintenance`);
    }
  }

  /**
   * Kill the http server if it's running.
   */
  kill(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
    this.model.cleanUp();
  }

  /**
   * Boot up the http server.
   */
  listen(): void {
    // Begin handling requests before clip list is loaded.
    let port = getConfig().SERVER_PORT;
    this.server = this.app.listen(port, () =>
      this.print(`listening at http://localhost:${port}`)
    );
  }

  /**
   * Make sure we have a connection to the database.
   */
  async ensureDatabase(): Promise<void> {
    try {
      await this.model.ensureDatabaseSetup();
    } catch (err) {
      console.error('could not connect to db', err);
    }
  }

  /**
   * Start up everything.
   */
  async run(options?: { doImport: boolean }): Promise<void> {
    options = { doImport: true, ...options };
    this.print('starting');

    await this.ensureDatabase();

    this.listen();
    const { ENVIRONMENT, RELEASE_VERSION } = getConfig();

    if (!ENVIRONMENT || ENVIRONMENT === 'default') {
      await this.performMaintenance(options.doImport);
      // await this.warmUpCaches();
      return;
    }

    const lock = consul.lock({ key: 'maintenance-lock' });

    lock.on('acquire', async () => {
      const key = ENVIRONMENT + RELEASE_VERSION;

      try {
        const result = await consul.kv.get(key);
        const hasPerformedMaintenance = result && JSON.parse(result.Value);

        if (hasPerformedMaintenance) {
          this.print('maintenance already performed');
        } else {
          await this.performMaintenance(options.doImport);
          await consul.kv.set(key, JSON.stringify(true));
        }
      } catch (e) {
        this.print('error during maintenance', e);
      }

      await lock.release();
    });

    lock.acquire();

    // await this.warmUpCaches();
  }

  async warmUpCaches() {
    this.print('warming up caches');
    const start = Date.now();
    for (const locale of [null].concat(contributableLocales)) {
      await this.model.getClipsStats(locale);
      await this.model.getVoicesStats(locale);
      await this.model.getContributionStats(locale);
      await getFullVoteLeaderboard(locale);
      await getFullClipLeaderboard(locale);
    }
    this.print(`took ${getElapsedSeconds(start)}s to warm up caches`);
  }

  /**
   * Reset the database to initial factory settings.
   */
  async resetDatabase(): Promise<void> {
    await this.model.db.drop();
    await this.model.ensureDatabaseSetup();
  }

  async emptyDatabase() {
    await this.model.db.empty();
  }
}

// Handle any top-level exceptions uncaught in the app.
process.on('uncaughtException', function(err: any) {
  if (err.code === 'EADDRINUSE') {
    // For now, do nothing when we are unable to start the http server.
    console.error('ERROR: server already running');
  } else {
    // We will crash the app when getting unknown top-level exceptions.
    console.error('uncaught exception', err);
    process.exit(1);
  }
});

process.on('unhandledRejection', r =>
  console.error('unhandled promise rejection', r)
);

// If this file is run directly, boot up a new server instance.
if (require.main === module) {
  let server = new Server();
  server
    .run({ doImport: getConfig().IMPORT_SENTENCES })
    .catch(e => console.error(e));
}
