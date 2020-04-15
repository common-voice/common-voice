require('newrelic');
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as express from 'express';
import * as Sentry from '@sentry/node';
import { NextFunction, Request, Response } from 'express';
import { importLocales } from './lib/model/db/import-locales';
import Model from './lib/model';
import {
  getFullClipLeaderboard,
  getFullVoteLeaderboard,
} from './lib/model/leaderboard';
import { trackPageView } from './lib/analytics';
import API from './lib/api';
import Logger from './lib/logger';
import { redis, redlock } from './lib/redis';
import { APIError, ClientError, getElapsedSeconds } from './lib/utility';
import { importSentences } from './lib/model/db/import-sentences';
import { getConfig } from './config-helper';
import authRouter, { authMiddleware } from './auth-router';
import fetchLegalDocument from './fetch-legal-document';
import * as proxy from 'http-proxy-middleware';
var HttpStatus = require('http-status-codes');

require('source-map-support').install();
const contributableLocales = require('locales/contributable.json');

const MAINTENANCE_VERSION_KEY = 'maintenance-version';
const FULL_CLIENT_PATH = path.join(__dirname, '..', '..', 'web');
const MAINTENANCE_PATH = path.join(__dirname, '..', '..', 'maintenance');
const RELEASE_VERSION = getConfig().RELEASE_VERSION;
const ENVIRONMENT = getConfig().ENVIRONMENT;
const PROD = getConfig().PROD;
const KIBANA_PREFIX = getConfig().KIBANA_PREFIX;
const SECONDS_IN_A_YEAR = 365 * 24 * 60 * 60;

const CSP_HEADER = [
  `default-src 'none'`,
  `style-src 'self' https://fonts.googleapis.com https://optimize.google.com 'unsafe-inline'`,
  `img-src 'self' www.google-analytics.com www.gstatic.com https://optimize.google.com https://www.gstatic.com https://gravatar.com data:`,
  `media-src data: blob: https://*.amazonaws.com https://*.amazon.com`,
  // Note: we allow unsafe-eval locally for certain webpack functionality.
  `script-src 'self' 'unsafe-eval' 'sha256-yybRmIqa26xg7KGtrMnt72G0dH8BpYXt7P52opMh3pY=' 'sha256-jfhv8tvvalNCnKthfpd8uT4imR5CXYkGdysNzQ5599Q=' https://www.google-analytics.com https://pontoon.mozilla.org https://optimize.google.com https://sentry.prod.mozaws.net https://fullstory.com https://edge.fullstory.com`,
  `font-src 'self' https://fonts.gstatic.com`,
  `connect-src 'self' https://pontoon.mozilla.org/graphql https://*.amazonaws.com https://*.amazon.com https://www.gstatic.com https://www.google-analytics.com https://sentry.prod.mozaws.net https://basket.mozilla.org https://basket-dev.allizom.org https://rs.fullstory.com https://edge.fullstory.com`,
  `frame-src https://optimize.google.com`,
].join(';');

Sentry.init({ dsn: getConfig().SENTRY_DSN });

export default class Server {
  app: express.Application;
  server: http.Server;
  model: Model;
  api: API;
  logger: Logger;
  isLeader: boolean;

  get version() {
    const { ENVIRONMENT, RELEASE_VERSION } = getConfig();
    return ENVIRONMENT + RELEASE_VERSION;
  }

  constructor(options?: { bundleCrossLocaleMessages: boolean }) {
    options = { bundleCrossLocaleMessages: true, ...options };
    this.model = new Model();
    this.api = new API(this.model);
    this.logger = new Logger();
    this.isLeader = null;

    // Make console.log output json.
    if (PROD) {
      this.logger.overrideConsole();
    }

    const app = (this.app = express());

    const staticOptions = {
      setHeaders: (response: express.Response) => {
        // Basic Information
        response.set('X-Release-Version', RELEASE_VERSION);
        response.set('X-Environment', ENVIRONMENT);

        // Production specific security-centric headers
        response.set('X-Production', PROD ? 'On' : 'Off');
        if (PROD) {
          response.set('Content-Security-Policy', CSP_HEADER);
          response.set('X-Content-Type-Options', 'nosniff');
          response.set('X-XSS-Protection', '1; mode=block');
          response.set('X-Frame-Options', 'DENY');
          response.set(
            'Strict-Transport-Security',
            'max-age=' + SECONDS_IN_A_YEAR
          );
        }
      },
    };

    // Enable Sentry request handler
    app.use(Sentry.Handlers.requestHandler());

    if (PROD) {
      app.use(this.ensureSSL);
    }

    if (getConfig().MAINTENANCE_MODE + '' === 'true') {
      this.print('Application starting in maintenance mode');

      app.use(express.static(MAINTENANCE_PATH, staticOptions));

      app.use(/(.*)/, (request, response, next) => {
        response.sendFile('index.html', { root: MAINTENANCE_PATH });
      });
    } else {
      app.use((request, response, next) => {
        // redirect to omit trailing slashes
        if (request.path.substr(-1) == '/' && request.path.length > 1) {
          const query = request.url.slice(request.path.length);
          response.redirect(
            HttpStatus.MOVED_PERMANENTLY,
            request.path.slice(0, -1) + query
          );
        } else {
          next();
        }
      });

      app.use(authRouter);
      app.use(KIBANA_PREFIX, authMiddleware, (request, response, next) => {
        const { KIBANA_URL: target, KIBANA_ADMINS } = getConfig();
        if (!target) {
          response
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: 'KIBANA_URL missing in config' });
          return;
        }

        const { baseUrl, client_id, user } = request;

        if (!user || !client_id) {
          response.redirect('/login?redirect=' + baseUrl);
          return;
        }

        // For now, you either get full access of Kibana or none at all.
        const userEmail = user.emails[0].value;

        if (
          !userEmail ||
          !(
            userEmail.endsWith('@mozilla.com') ||
            JSON.parse(KIBANA_ADMINS).includes(userEmail)
          )
        ) {
          response.status(HttpStatus.FORBIDDEN).json({
            error: `${userEmail} is not authenticated for Kibana access.`,
          });
          return;
        }

        trackPageView(baseUrl, client_id);

        proxy({
          target,
          changeOrigin: true,
          pathRewrite: {
            ['^' + baseUrl]: '',
          },
        })(request, response, next);
      });

      app.use('/api/v1', this.api.getRouter());

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

      // Enable Sentry error handling
      app.use(Sentry.Handlers.errorHandler());

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
            .status(
              error instanceof ClientError
                ? HttpStatus.BAD_REQUEST
                : HttpStatus.INTERNAL_SERVER_ERROR
            )
            .json({ message: isAPIError ? error.message : '' });
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
        HttpStatus.PERMANENT_REDIRECT,
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
    this.app.get(
      '/challenge-terms/:locale.html',
      async ({ params: { locale } }, response) => {
        response.send(await fetchLegalDocument('Challenge_Terms', 'en'));
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

    if (!ENVIRONMENT || ENVIRONMENT === 'default') {
      await this.performMaintenance(options.doImport);
      // await this.warmUpCaches();
      return;
    }

    if (await this.hasMigrated()) {
      return;
    }

    this.print('acquiring lock');
    const lock = await redlock.lock(
      'common-voice-maintenance-lock',
      1000 *
        60 *
        60 *
        30 /* intended 30 minutes -> actually 30 hours, to be adjusted @TODO */
    );
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
