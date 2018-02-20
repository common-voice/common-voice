import * as http from 'http';
import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
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
import { CommonVoiceConfig, getConfig } from './config-helper';

const CLIENT_PATH = '../../web';

const CSP_HEADER = `default-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' www.google-analytics.com; media-src data: blob: https://*.amazonaws.com https://*.amazon.com; script-src 'self' 'sha256-WpzorOw/T4TS/msLlrO6krn6LdCwAldXSATNewBTrNE=' https://www.google-analytics.com/analytics.js; font-src 'self' https://fonts.gstatic.com; connect-src 'self'`;

export default class Server {
  config: CommonVoiceConfig;
  app: express.Application;
  server: http.Server;
  model: Model;
  api: API;
  logger: Logger;
  isLeader: boolean;
  heartbeat: any;

  constructor(config?: CommonVoiceConfig) {
    this.config = config ? config : getConfig();
    this.model = new Model(this.config);
    this.api = new API(this.config, this.model);
    this.logger = new Logger(this.config);
    this.isLeader = null;

    // Make console.log output json.
    if (this.config.PROD) {
      this.logger.overrideConsole();
    }

    const app = (this.app = express());

    app.use('/api/v1', this.api.getRouter());

    const staticOptions = {
      setHeaders: (response: express.Response) => {
        this.config.PROD && response.set('Content-Security-Policy', CSP_HEADER);
      },
    };
    app.use(express.static(__dirname + CLIENT_PATH, staticOptions));
    app.use(
      '*',
      express.static(__dirname + CLIENT_PATH + '/index.html', staticOptions)
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
      this.isLeader = await isLeaderServer(
        this.config.ENVIRONMENT,
        this.config.RELEASE_VERSION
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
  async performMaintenance(): Promise<void> {
    const start = Date.now();
    this.print('performing Maintenance');

    try {
      await this.model.performMaintenance();
      await importSentences(await this.model.db.mysql.createPool());
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
    clearInterval(this.heartbeat);
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
    let port = this.config.SERVER_PORT;
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

  startHeartbeat(): void {
    clearInterval(this.heartbeat);
    this.heartbeat = setInterval(() => {
      this.model.printMetrics();
    }, 30 * 60 * 1000); // 30 minutes
  }

  /**
   * Start up everything.
   */
  async run(): Promise<void> {
    this.print('starting');

    await this.ensureDatabase();

    this.listen();

    const isLeader = await this.checkLeader();

    if (isLeader) {
      await this.performMaintenance();
    }

    this.startHeartbeat();
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
  server.run();
}
