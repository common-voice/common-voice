import * as http from 'http';
import API from './lib/api';
import Clip from './lib/clip';
import Logger from './lib/logger';
import Static from './lib/static';

const DEFAULT_PORT = 9000;
const SLOW_REQUEST_LIMIT = 2000;
const CONFIG_PATH = '../../config.json';
const CLIENT_PATH = './web';

const config = require(CONFIG_PATH);

export default class Server {
  api: API;
  clip: Clip;
  logger: Logger;
  staticServer: Static;

  constructor() {
    this.staticServer = new Static(CLIENT_PATH);
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
  private handleRequest(request: http.IncomingMessage,
                        response: http.ServerResponse) {
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

    this.staticServer.handleRequest(request, response);
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
      let elapsedSeconds = Math.round( (Date.now() - start) / 1000 );
      console.log('APPLICATION LOADED', elapsedSeconds);
    });

    // Begin handling requests before clip list is loaded.
    let port = config.port || DEFAULT_PORT;
    let server = http.createServer(this.handleRequest.bind(this));
    server.listen(port);
    console.log(`listening at http://localhost:${port}`);
  }
}

process.on('uncaughtException', function(err) {
  console.error('uncaught exception', err);
});

// If this file is run, boot up a new server instance.
if (require.main === module) {
  let server = new Server();
  server.run();
}
