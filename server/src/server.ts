import * as http from 'http';
import API from './lib/api';
import Clip from './lib/clip';

const DEFAULT_PORT = 9000;
const CONFIG_PATH = '../../config.json';
const CLIENT_PATH = './web';

const nodeStatic = require('node-static');
const config = require(CONFIG_PATH);

import Bunyan from 'bunyan';
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'voice'});

export default class Server {
  api: API;
  clip: Clip;
  staticServer: any;
  log: Bunyan;

  constructor() {
    // TODO: turn on caching for PROD.
    this.staticServer = new nodeStatic.Server(CLIENT_PATH, { cache: false });
    this.log = log;
    this.api = new API(this.log);
    this.clip = new Clip(this.log);
  }

  /**
   * handleRequest
   *   Route requests to appropriate controller based on
   *   if the request deals with voice clips or web content.
   */
  private handleRequest(request: http.IncomingMessage,
                        response: http.ServerResponse) {

    // Handle all clip related requests first.  if (this.clip.isClipRequest(request)) {
    if (this.clip.isClipRequest(request)) {
      this.clip.handleRequest(request, response);
      return;
    }

    if (this.api.isApiRequest(request)) {
      this.api.handleRequest(request, response);
      return;
    }

    // If we get here, feed request to static parser.
    request.addListener('end', () => {
      this.staticServer.serve(request, response, (err: any) => {
        if (err && err.status === 404) {
          // If file was not front, use main page and
          // let the front end handle url routing.
          this.staticServer.serveFile('index.html', 200, {}, request, response);
        }
      })
    }).resume();
  }

  /**
   * Start up everything.
   */
  run(): void {
    // Now run the app.
    let port = config.port || DEFAULT_PORT;
    let server = http.createServer(this.handleRequest.bind(this));
    server.listen(port);
    this.log.info(`listening at http://localhost:${port}`);
  }
}

process.on('uncaughtException', function(err) {
  log.error('uncaught exception', err);
});

// If this file is run, boot up a new server instance.
if (require.main === module) {
  let server = new Server();
  server.run();
}
