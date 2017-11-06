import * as http from 'http';
import * as path from 'path';

import Model from './lib/model';
import API from './lib/api';
import Logger from './lib/logger';
import { isLeaderServer, getElapsedSeconds } from './lib/utility';
import { Server as NodeStaticServer } from 'node-static';
import { CommonVoiceConfig, getConfig } from './config-helper';

const SLOW_REQUEST_LIMIT = 2000;
const CLIENT_PATH = '../web';

const CSP_HEADER = `default-src 'none'; style-src 'self' 'nonce-123456789' 'nonce-987654321' https://fonts.googleapis.com; img-src 'self' www.google-analytics.com; media-src data: blob: https://*.amazonaws.com https://*.amazon.com; script-src 'self' https://www.google-analytics.com/analytics.js; font-src 'self' https://fonts.gstatic.com; connect-src 'self'`;

export default class Server {
  config: CommonVoiceConfig;
  server: http.Server;
  model: Model;
  api: API;
  logger: Logger;
  staticServer: any;
  isLeader: boolean;

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
  }

  /**
   * Create our http server object.
   */
  private getServer() {
    return new NodeStaticServer(path.join(__dirname, CLIENT_PATH), {
      cache: false,
      headers: {
        'Content-Security-Policy': CSP_HEADER,
      },
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
  private handleRequest(
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) {
    let startTime = Date.now();

    if (this.api.isApiRequest(request)) {
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
      this.isLeader = await isLeaderServer(this.config.ENVIRONMENT);
      this.print('leader', this.isLeader);
    } catch (err) {
      console.error('error checking for leader', err.message);
      this.isLeader = false;
    }

    return this.isLeader;
  }

  /**
   * Load our memory cache of site data (users, clips sentences).
   */
  private async loadCache(): Promise<void> {
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
   * Start up everything.
   */
  async run(): Promise<void> {
    // Log the start.
    this.print('starting');

    // Boot up our http server.
    this.listen();

    // Attemp to load cache (sentences and audio metadata).
    // Note: we don't wait for this to finish before continuing.
    this.loadCache();

    // Figure out if this server is the leader.
    const isLeader = await this.checkLeader();

    // Leader servers will perform database maintenance.
    if (isLeader) {
      await this.performMaintenance();
    }
  }

  /**
   * Display metrics of the current corpus.
   */
  async countCorpus(): Promise<void> {
    this.api.corpus.displayMetrics();
  }

  /**
   * Reset the database to initial factory settings.
   */
  async resetDatabase(): Promise<void> {
    await this.model.db.drop();
    await this.model.ensureDatabaseSetup();
  }

  /**
   * Grab the latest version number from the database.
   */
  async getDatabaseVersion(): Promise<number> {
    return this.model.db.version.getCurrentVersion();
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
