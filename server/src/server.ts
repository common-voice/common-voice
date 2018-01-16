import * as http from 'http';
import * as path from 'path';

import Model from './lib/model';
import API from './lib/api';
import Logger from './lib/logger';
import { isLeaderServer, getElapsedSeconds } from './lib/utility';
import { Server as NodeStaticServer } from 'node-static';
import { CommonVoiceConfig, getConfig } from './config-helper';
import { migrate } from './lib/model/db/migrate-data/migrate';

const SLOW_REQUEST_LIMIT = 2000;
const CLIENT_PATH = '../web';

const CSP_HEADER = `default-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' www.google-analytics.com; media-src data: blob: https://*.amazonaws.com https://*.amazon.com; script-src 'self' 'sha256-WpzorOw/T4TS/msLlrO6krn6LdCwAldXSATNewBTrNE=' https://www.google-analytics.com/analytics.js; font-src 'self' https://fonts.gstatic.com; connect-src 'self'`;

export default class Server {
  config: CommonVoiceConfig;
  server: http.Server;
  model: Model;
  api: API;
  logger: Logger;
  staticServer: any;
  isLeader: boolean;
  hasPerformedMaintenance = false;

  constructor(config?: CommonVoiceConfig) {
    this.config = config ? config : getConfig();
    this.staticServer = this.getServer();
    this.model = new Model(this.config);
    this.api = new API(this.config, this.model);
    this.logger = new Logger(this.config);
    this.isLeader = null;

    // Make console.log output json.
    if (this.config.PROD) {
      this.logger.overrideConsole();
    }
    this.isMigrated = false;
  }

  private set isMigrated(value: boolean) {
    this.api.isMigrated = value;
  }

  /**
   * Create our http server object.
   */
  private getServer() {
    return new NodeStaticServer(path.join(__dirname, CLIENT_PATH), {
      cache: false,
      headers: this.config.PROD
        ? {
            'Content-Security-Policy': CSP_HEADER,
          }
        : {},
    });
  }

  /**
   * Log application level messages in a common format.
   */
  private print(...args: any[]) {
    args.unshift('APPLICATION --');
    console.log.apply(console, args);
  }

  /**
   * handleRequest
   *   Route requests to appropriate controller based on
   *   if the request deals with voice clips or web content.
   */
  private async handleRequest(
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) {
    let startTime = Date.now();

    if (this.api.isApiRequest(request)) {
      if (this.isLeader && !this.hasPerformedMaintenance) {
        response.writeHead(307, { Location: request.url });
        response.end();
        return;
      }
      this.api.handleRequest(request, response);
      return;
    }

    // If we get here, feed request to static parser.
    request
      .addListener('end', () => {
        this.staticServer.serve(request, response, (err: any) => {
          if (err && err.status === 404) {
            this.print('non-static resource request', request.url);

            // If file was not front, use main page and
            // let the front end handle url routing.
            this.staticServer.serveFile(
              'index.html',
              200,
              {},
              request,
              response
            );
            return;
          }

          // Log slow static requests
          let elapsed = Date.now() - startTime;
          if (elapsed > SLOW_REQUEST_LIMIT) {
            this.print('slow static request', elapsed, request.url);
          }
        });
      })
      .resume();
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

  private async loadCache(): Promise<void> {
    // Don't load cache for leader, as we need plenty of memory for the migration
    if (this.isLeader && !this.hasPerformedMaintenance) return;

    const start = Date.now();
    this.print('loading clip cache');

    try {
      await this.api.loadCache();
    } catch (err) {
      console.error('error loading clips', err.message);
    } finally {
      this.print(`${getElapsedSeconds(start)}s to load`);
    }
  }

  /**
   * Perform any scheduled maintenance on the data model.
   */
  async performMaintenance(): Promise<void> {
    const start = Date.now();
    this.print('performing Maintenance');

    try {
      await this.model.performMaintenance();
      this.print('Maintenance complete');
    } catch (err) {
      console.error('DB Maintenance error', err);
    } finally {
      this.print(`${getElapsedSeconds(start)}s to perform maintenance`);
    }

    if (this.config.ENABLE_MIGRATIONS) {
      await migrate(this.model.db.mysql.conn);
      this.isMigrated = true;
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
    let port = this.config.SERVER_PORT;
    this.server = http.createServer(this.handleRequest.bind(this));
    this.server.listen(port);
    this.print(`listening at http://localhost:${port}`);
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
    setInterval(() => {
      this.model.printMetrics();
    }, 60000);
  }

  /**
   * Start up everything.
   */
  async run(): Promise<void> {
    // Log the start.
    this.print('starting with config ' + JSON.stringify(this.config));

    // Set up db connection.
    await this.ensureDatabase();

    // Boot up our http server.
    this.listen();

    // Figure out if this server is the leader.
    const isLeader = await this.checkLeader();

    // Attemp to load cache (sentences and audio metadata).
    // Note: we don't wait for this to finish before continuing.
    this.loadCache().catch(error => console.error(error));

    // Leader servers will perform database maintenance.
    if (isLeader) {
      await this.performMaintenance();
      this.hasPerformedMaintenance = true;
      await this.loadCache();
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
