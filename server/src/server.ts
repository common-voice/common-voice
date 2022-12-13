import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as express from 'express';
import * as compression from 'compression';
import { NextFunction, Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { StatusCodes } from 'http-status-codes';
import 'source-map-support/register';
import { importLocales } from './lib/model/db/import-locales';
import { importTargetSegments } from './lib/model/db/import-target-segments';
import { scrubUserActivity } from './lib/model/db/scrub-user-activity';
import Model from './lib/model';
import API from './lib/api';
import { redis, useRedis, redlock } from './lib/redis';
import { APIError, ClientError, getElapsedSeconds } from './lib/utility';
import { importSentences } from './lib/model/db/import-sentences';
import { getConfig } from './config-helper';
import authRouter from './auth-router';
import fetchLegalDocument from './fetch-legal-document';
import { createTaskQueues, TaskQueues } from './lib/takeout';
import getCSPHeaderValue from './csp-header-value';
import { ValidationError } from 'express-json-validator-middleware';

const MAINTENANCE_VERSION_KEY = 'maintenance-version';
const FULL_CLIENT_PATH = path.join(__dirname, '..', '..', 'web');
const MAINTENANCE_PATH = path.join(__dirname, '..', '..', 'maintenance');
const { RELEASE_VERSION, ENVIRONMENT, SENTRY_DSN_SERVER, PROD } = getConfig();
const CSP_HEADER_VALUE = getCSPHeaderValue();
const SECONDS_IN_A_YEAR = 365 * 24 * 60 * 60;

export default class Server {
  app: express.Application;
  server: http.Server;
  model: Model;
  api: API;
  taskQueues: TaskQueues;
  isLeader: boolean;

  get version() {
    const { ENVIRONMENT, RELEASE_VERSION } = getConfig();
    return ENVIRONMENT + RELEASE_VERSION;
  }

  constructor(options?: { bundleCrossLocaleMessages: boolean }) {
    options = { bundleCrossLocaleMessages: true, ...options };
    this.model = new Model();
    this.api = new API(this.model);

    useRedis.then(ready => {
      if (ready) {
        this.taskQueues = createTaskQueues(this.api.takeout);
        this.api.takeout.setQueue(this.taskQueues.dataTakeout);
      }
    });

    this.isLeader = null;

    const app = (this.app = express());

    Sentry.init({
      // no SENTRY_DSN_SERVER is set in development
      dsn: SENTRY_DSN_SERVER,
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
      ],
      environment: PROD ? 'prod' : 'stage',
      release: RELEASE_VERSION,
    });

    const staticOptions = {
      setHeaders: (response: express.Response) => {
        // Basic Information
        response.set('X-Release-Version', RELEASE_VERSION);
        response.set('X-Environment', ENVIRONMENT);

        // security-centric headers
        response.removeHeader('x-powered-by');
        response.set('X-Production', PROD ? 'On' : 'Off');
        response.set('Content-Security-Policy', CSP_HEADER_VALUE);
        response.set('X-Content-Type-Options', 'nosniff');
        response.set('X-XSS-Protection', '1; mode=block');
        response.set('X-Frame-Options', 'DENY');
        response.set(
          'Strict-Transport-Security',
          'max-age=' + SECONDS_IN_A_YEAR
        );
      },
    };
    app.use(express.json());

    // Enable Sentry request handler
    app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());

    app.use(compression());
    if (PROD) {
      app.use(this.ensureSSL);
    }

    if (getConfig().MAINTENANCE_MODE + '' === 'true') {
      this.print('Application starting in maintenance mode');

      app.use(express.static(MAINTENANCE_PATH, staticOptions));

      app.use(/(.*)/, (_request, response) => {
        response.sendFile('index.html', { root: MAINTENANCE_PATH });
      });
    } else {
      app.use((request, response, next) => {
        // redirect to omit trailing slashes
        if (request.path.substr(-1) == '/' && request.path.length > 1) {
          const query = request.url.slice(request.path.length);
          const host = request.get('host');
          response.redirect(
            StatusCodes.MOVED_PERMANENTLY,
            `https://${host}${request.path.slice(0, -1)}${query}`
          );
        } else {
          next();
        }
      });

      app.use(authRouter);

      app.use('/api/v1', this.api.getRouter());

      app.use(express.static(FULL_CLIENT_PATH, staticOptions));

      if (options.bundleCrossLocaleMessages) {
        this.setupCrossLocaleRoute();
      }

      this.setupPrivacyAndTermsRoutes();

      app.use(
        /(.*)/,
        express.static(FULL_CLIENT_PATH + '/index.html', staticOptions)
      );

      // Enable Sentry error handling
      app.use(Sentry.Handlers.errorHandler());
      app.use(
        (
          error: any,
          request: Request,
          response: Response,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _next: NextFunction // this unused parameter must be included for error handling middleware
        ) => {
          console.error(error);

          const isValidationError = error instanceof ValidationError;
          if (isValidationError) {
            return response.status(StatusCodes.BAD_REQUEST).json({
              errors: error.validationErrors,
            });
          }

          const isAPIError = error instanceof APIError;
          return response
            .status(error?.status || StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
              message: isAPIError ? error.message : 'Something went wrong',
            });
        }
      );
    }
  }

  private ensureSSL(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // Set by HTTPS load-balancers like ELBs
    if (req.headers['x-forwarded-proto'] === 'http') {
      // Send to https please, always and forever
      res.redirect(
        StatusCodes.PERMANENT_REDIRECT,
        'https://' + req.headers.host + req.url
      );
    } else {
      return next();
    }
  }

  private setupCrossLocaleRoute() {
    const localesPath = path.join(FULL_CLIENT_PATH, 'locales');
    const crossLocaleMessages = fs
      .readdirSync(localesPath)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      '/voicewall/privacy/:locale.html',
      async ({ params: { locale } }, response) => {
        response.send(await fetchLegalDocument('privacy_notice', locale));
      }
    );
    this.app.get(
      '/voicewall/terms/:locale.html',
      async ({ params: { locale } }, response) => {
        response.send(await fetchLegalDocument('terms', locale));
      }
    );
    this.app.get(
      '/challenge-terms/:locale.html',
      async (_request, response) => {
        response.send(await fetchLegalDocument('challenge_terms', 'en'));
      }
    );
  }

  /**
   * Log application level messages in a common format.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private print(...args: any[]) {
    args.unshift('APPLICATION --');
    // eslint-disable-next-line prefer-spread
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
      await scrubUserActivity();
      await importLocales();

      if (doImport) {
        await importSentences(await this.model.db.mysql.createPool());
      }

      await importTargetSegments();
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
    const port = getConfig().SERVER_PORT;
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

  async hasMigrated(): Promise<boolean> {
    this.print('checking migration status');
    const result = await redis.get(MAINTENANCE_VERSION_KEY);
    const hasMigrated = result == this.version;
    if (hasMigrated) {
      this.print('maintenance already performed');
    }
    return hasMigrated;
  }

  /**
   * Start up everything.
   */
  async run(options?: { doImport: boolean }): Promise<void> {
    options = { doImport: true, ...options };
    this.print('starting');

    await this.ensureDatabase();

    this.listen();
    const { ENVIRONMENT } = getConfig();

    if (!ENVIRONMENT || ENVIRONMENT === 'local') {
      await this.performMaintenance(options.doImport);
      return;
    }

    if (await this.hasMigrated()) {
      return;
    }

    this.print('acquiring lock');
    const lock = await redlock.lock(
      'common-voice-maintenance-lock',
      1000 * 60 * 60 * 6 /* keep lock for 6 hours */
    );

    console.log('lock acquired: ', lock?.resource?.toString());

    // we need to check again after the lock was acquired, as another instance
    // might've already migrated in the meantime
    if (await this.hasMigrated()) {
      await lock.unlock();
      return;
    }

    try {
      await this.performMaintenance(options.doImport);
      await redis.set(MAINTENANCE_VERSION_KEY, this.version);
    } catch (e) {
      this.print('error during maintenance', e);
    }

    await lock.unlock();
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
