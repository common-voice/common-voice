(function() {
  'use strict';

  const path = require('path');
  const http = require('http');
  const nodeStatic = require('node-static');
  const clip = require('./lib/clip');

  const DEFAULT_PORT = 9000;
  const CONFIG_PATH = path.resolve(__dirname, '..', 'config.json');
  const CLIENT_PATH = './client';

  // TODO: turn on caching for PROD.
  const fileServer = new nodeStatic.Server(CLIENT_PATH, { cache: false });
  const config = require(CONFIG_PATH);

  /* handleRequest
   *   Route requests to appropriate controller based on
   *   if the request deals with voice clips or web content.
   */
  function handleRequest(request, response) {
    // Handle all clip related requests first.
    if (clip.isClipRequest(request)) {
      clip.handleRequest(request, response);
      return;
    }

    // If we get here, feed request to static parser.
    request.addListener('end', () => {
      fileServer.serve(request, response);
    }).resume();
  }

  // Now running the app.
  let port = config.port || DEFAULT_PORT;
  let server = http.createServer(handleRequest);
  server.listen(port);
  console.log(`listening at http://localhost:${port}`);
})();
