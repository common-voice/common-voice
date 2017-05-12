import * as http from 'http';
import * as path from 'path';
import API from './lib/api';
import Clip from './lib/clip';

const DEFAULT_PORT = 9000;
const CONFIG_PATH = path.resolve(__dirname, '../..', 'config.json');
const CLIENT_PATH = './client';

const nodeStatic = require('node-static');
const config = require(CONFIG_PATH);

// TODO: turn on caching for PROD.
let fileServer = new nodeStatic.Server(CLIENT_PATH, { cache: false });
let api = new API();
let clip = new Clip();

/**
 * handleRequest
 *   Route requests to appropriate controller based on
 *   if the request deals with voice clips or web content.
 */
function handleRequest(request: http.IncomingMessage,
                       response: http.ServerResponse) {

  // Handle all clip related requests first.
  if (clip.isClipRequest(request)) {
    clip.handleRequest(request, response);
    return;
  }

  if (api.isApiRequest(request)) {
    api.handleRequest(request, response);
    return;
  }

  // If we get here, feed request to static parser.
  request.addListener('end', () => {
    fileServer.serve(request, response);
  }).resume();
}

// Now run the app.
let port = config.port || DEFAULT_PORT;
let server = http.createServer(handleRequest);
server.listen(port);
console.log(`listening at http://localhost:${port}`);
