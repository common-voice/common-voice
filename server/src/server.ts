import * as http from 'http';
import API from './lib/api';
import Clip from './lib/clip';
import Logger from './lib/logger';

const DEFAULT_PORT = 9000;
const SLOW_REQUEST_LIMIT = 2000;
const CONFIG_PATH = '../../config.json';
const CLIENT_PATH = '../../web';

const nodeStatic = require('node-static');
const config = require(CONFIG_PATH);
const path = require('path');

export default class Server {
  api: API;
  clip: Clip;
  logger: Logger;
  staticServer: any;

  constructor() {
    this.staticServer = new nodeStatic.Server(
      path.join(__dirname, CLIENT_PATH),
      {
        cache: false,
        headers: {
          'Content-Security-Policy':
            "default-src 'none'; style-src 'self'; img-src 'self' www.google-analytics.com; media-src blob: https://*.amazonaws.com; script-src 'self' https://www.google-analytics.com/analytics.js; font-src 'self'; connect-src 'self'",
        },
      }
    );
    this.api = new API();
    this.clip = new Clip();

    // JSON format all console operations.
    this.logger = new Logger();
    this.logger.overrideConsole();
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

    // Handle all clip related requests first.
    if (this.clip.isClipRequest(request)) {
      this.clip.handleRequest(request, response);
      return;
    }

    if (this.api.isApiRequest(request)) {
      this.api.handleRequest(request, response);
      return;
    }

    // If we get here, feed request to static parser.
    request
      .addListener('end', () => {
        this.staticServer.serve(request, response, (err: any) => {
          if (err && err.status === 404) {
            console.error('page not found', request.url);

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
            console.log('slow static request', elapsed, request.url);
          }
        });
      })
      .resume();
  }

  /**
   * Start up everything.
   */
  run(): void {
    // Log the start.
    console.log('STARTING APPLICATION');

    // Initialize our clip list.
    let start = Date.now();
    this.clip.init().then(() => {
      let elapsedSeconds = Math.round((Date.now() - start) / 1000);
      console.log('APPLICATION LOADED', elapsedSeconds);
    });

    // Begin handling requests before clip list is loaded.
    let port = config.port || DEFAULT_PORT;
    let server = http.createServer(this.handleRequest.bind(this));
    server.listen(port);
    console.log(`listening at http://localhost:${port}`);
  }
}

process.on('uncaughtException', function(err: any) {
  console.error('uncaught exception', err);
});

// If this file is run, boot up a new server instance.
if (require.main === module) {
  let server = new Server();
  server.run();
}
