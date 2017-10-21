import * as http from 'http';
import * as path from 'path';

import API from './lib/api';
import Logger from './lib/logger';
import { isLeaderServer, getElapsedSeconds } from './lib/utility';
import { Server as NodeStaticServer } from 'node-static';

const DEFAULT_PORT = 9000;
const SLOW_REQUEST_LIMIT = 2000;
const CONFIG_PATH = '../../config.json';
const CLIENT_PATH = '../../web';

const CSP_HEADER = `default-src 'none'; style-src 'self' 'nonce-123456789' 'nonce-987654321' https://fonts.googleapis.com; img-src 'self' www.google-analytics.com; media-src data: blob: https://*.amazonaws.com; script-src 'self' https://www.google-analytics.com/analytics.js; font-src 'self' https://fonts.gstatic.com; connect-src 'self'`;

const config = require(CONFIG_PATH);

export default class Server {
  server: http.Server;
  api: API;
  logger: Logger;
  staticServer: any;
  isLeader: boolean;

  constructor() {
    this.staticServer = this.getServer();
    this.api = new API();
    this.logger = new Logger();
    this.isLeader = null;

    // Make console.log output json.
    if (config.PROD) {
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
      this.isLeader = await isLeaderServer(config.ENVIRONMENT || 'default');
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

    try {
      await this.api.loadCache();
    } catch (err) {
      console.error('error loading clips', err.message);
    } finally {
      this.print(`${getElapsedSeconds(start)}s to load`);
    }
  }

  private async performMaintenance(): Promise<void> {
    const start = Date.now();
    this.print('performing Maintenance');
    try {
      await this.api.performMaintenance();
      this.print('Maintenance complete');
    } catch (err) {
      console.error('DB Maintenance error', err.code);
    } finally {
      this.print(`${getElapsedSeconds(start)}s to perform maintenance`);
    }
  }

  /**
   * Boot up the http server.
   */
  listen(): void {
    // Begin handling requests before clip list is loaded.
    let port = config.port || DEFAULT_PORT;
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
}

process.on('uncaughtException', function(err: any) {
  console.error('uncaught exception', err);
});

// If this file is run directly, boot up a new server instance.
if (require.main === module) {
  let server = new Server();
  server.run();
}
