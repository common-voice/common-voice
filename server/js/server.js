"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var path = require("path");
var nodeStatic = require("node-static");
var DEFAULT_PORT = 9000;
var CONFIG_PATH = path.resolve(__dirname, '../..', 'config.json');
var CLIENT_PATH = './client';
var clip = require('./lib/clip');
var api = require('./lib/api');
var config = require(CONFIG_PATH);
// TODO: turn on caching for PROD.
var fileServer = new nodeStatic.Server(CLIENT_PATH, { cache: false });
/**
 * handleRequest
 *   Route requests to appropriate controller based on
 *   if the request deals with voice clips or web content.
 */
function handleRequest(request, response) {
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
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}
// Now run the app.
var port = config.port || DEFAULT_PORT;
var server = http.createServer(handleRequest);
server.listen(port);
console.log("listening at http://localhost:" + port);
