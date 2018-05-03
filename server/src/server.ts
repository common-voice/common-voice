import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as commonmark from 'commonmark';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import * as request from 'request-promise-native';
import Model from './lib/model';
import API from './lib/api';
import Logger from './lib/logger';
import {
  isLeaderServer,
  getElapsedSeconds,
  ClientError,
  APIError,
} from './lib/utility';
import { importSentences } from './lib/model/db/import-sentences';
import { getConfig } from './config-helper';
import authRouter from './auth-router';
import { router as adminRouter } from './admin';

const FULL_CLIENT_PATH = path.join(__dirname, '../web');

const CSP_HEADER = [
  `default-src 'none'`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `img-src 'self' www.google-analytics.com`,
  `media-src data: blob: https://*.amazonaws.com https://*.amazon.com`,
  // Note: we allow unsafe-eval locally for certain webpack functionality.
  `script-src 'self' 'unsafe-eval' 'sha256-it/hVbE0ffRQjkt+hTb6/JM7wKrTSMEK4CHF4s42Zu8=' https://www.google-analytics.com/analytics.js https://pontoon.mozilla.org/pontoon.js`,
  `font-src 'self' https://fonts.gstatic.com`,
  `connect-src 'self' https://pontoon.mozilla.org/graphql`,
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
    app.use(adminRouter);

    const staticOptions = {
      setHeaders: (response: express.Response) => {
        // Only use CSP locally. In production, Apache handles CSP headers.
        // See path: nubis/puppet/web.pp
        !getConfig().PROD &&
          response.set('Content-Security-Policy', CSP_HEADER);
      },
    };

    app.use(express.static(FULL_CLIENT_PATH, staticOptions));

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
        console.log(error);
        const isAPIError = error instanceof APIError;
        if (!isAPIError) {
          console.error(request.url, error);
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

  // cache it for a day
  documentCache: { [name: string]: { [locale: string]: string } } = {};
  private async fetchDocument(name: string, locale: string) {
    if (!this.documentCache[name]) this.documentCache[name] = {};

    let textHTML = this.documentCache[name][locale];

    if (!textHTML) {
      const [status, text] = await request({
        uri: `https://raw.githubusercontent.com/mozilla/legal-docs/master/Common_Voice_${name}/${locale}.md`,
        resolveWithFullResponse: true,
      })
        .then((response: any) => [response.statusCode, response.body])
        .catch(response => [response.statusCode, null]);
      if (status >= 400 && status < 500) {
        textHTML = (await Promise.all(
          ['en', 'es-CL', 'fr', 'pt-BR', 'zh-TW'].map(locale =>
            this.fetchDocument(name, locale)
          )
        )).join('<br>');
      } else if (status < 300) {
        textHTML = new commonmark.HtmlRenderer().render(
          new commonmark.Parser().parse(
            // There's a parseable datetime string in the legal documents, which we don't need to show
            (text as string).replace(/{:\sdatetime=".*" }/, '')
          )
        );
      }
    }

    this.documentCache[name][locale] = textHTML;

    return textHTML;
  }

  private setupPrivacyAndTermsRoutes() {
    this.app.get(
      '/privacy/:locale.html',
      async ({ params: { locale } }, response) => {
        response.send(await this.fetchDocument('Privacy_Notice', locale));
      }
    );
    this.app.get(
      '/terms/:locale.html',
      async ({ params: { locale } }, response) => {
        response.send(await this.fetchDocument('Terms', locale));
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
   * Check if we are the chosen leader server (for performance maintenance).
   */
  private async checkLeader(): Promise<boolean> {
    if (this.isLeader !== null) {
      return this.isLeader;
    }

    try {
      const config = getConfig();
      this.isLeader = await isLeaderServer(
        config.ENVIRONMENT,
        config.RELEASE_VERSION
      );
      this.print('leader', this.isLeader);
    } catch (err) {
      console.error('error checking for leader', err.message);
      this.isLeader = false;
    }

    return this.isLeader;
  }

  /**
   * Perform any scheduled maintenance on the data model.
   */
  async performMaintenance(doImport: boolean): Promise<void> {
    const start = Date.now();
    this.print('performing Maintenance');

    try {
      await this.model.performMaintenance();
      await this.model.db.migrateUserClientBuckets();
      if (doImport) {
        await importSentences(await this.model.db.mysql.createPool());
      }
      this.print('Maintenance complete');
    } catch (err) {
      console.error('DB Maintenance error', err);
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

    const isLeader = await this.checkLeader();

    if (isLeader) {
      await this.performMaintenance(options.doImport);
    }
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

// If this file is run directly, boot up a new server instance.
if (require.main === module) {
  let server = new Server();
  server.run().catch(e => console.error(e));
}
