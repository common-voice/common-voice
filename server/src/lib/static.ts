import * as http from 'http';
import Responder from './responder';

const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
  '.html': Responder.CONTENT_TYPES.HTML,
  '.js'  : Responder.CONTENT_TYPES.JS,
  '.css' : Responder.CONTENT_TYPES.CSS,
  '.json': Responder.CONTENT_TYPES.JSON,
  '.png' : Responder.CONTENT_TYPES.PNG,
  '.jpg' : Responder.CONTENT_TYPES.JPG,
  '.gif' : Responder.CONTENT_TYPES.GIF,
  '.svg' : Responder.CONTENT_TYPES.SVG,
  '.wav' : Responder.CONTENT_TYPES.WAV,
  '.mp4' : Responder.CONTENT_TYPES.MP4,
  '.woff': Responder.CONTENT_TYPES.WOFF,
  '.ttf' : Responder.CONTENT_TYPES.TTF,
  '.eot' : Responder.CONTENT_TYPES.EOT,
  '.otf' : Responder.CONTENT_TYPES.OTF,
};

export default class Static {
  private webroot: string;
  private indexFile: string;
  private fileCache: any;
  private notFounds: any;

  constructor(webroot: string) {
    this.webroot = webroot;
    this.fileCache = {};
    this.notFounds = {};

    // Pre-emptively fetch the index page.
    fs.readFile(this.webroot + '/index.html', (error, content) => {
      if (error) {
        console.error('could not find index file', error);
        process.exit(1);
      }

      this.indexFile = content;
      console.log('index file loaded');
    });
  }

  private sendIndexFile(response) {
    new Responder(response).setContentType(Responder.CONTENT_TYPES.HTML)
                           .setContent(this.indexFile)
                           .send();
  }

  handleRequest(request: http.IncomingMessage,
                response: http.ServerResponse) {

    let url = request.url;
    if (url === '/') {
      this.sendIndexFile(response);
      return;
    }

    let filePath = this.webroot + url;
    let extname = path.extname(filePath).toLowerCase();
    let contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // Try to get the file contents from memory.
    if (this.fileCache[filePath]) {
      new Responder(response).setContentType(contentType)
                             .setContent(this.fileCache[filePath])
                             .send();
      return;
    }

    // For requests that have 404'ed in the past, serve the index page
    if (this.notFounds[filePath]) {
      this.sendIndexFile(response);
    }

    // Serve the file from the file system.
    let startTime = Date.now();
    fs.readFile(filePath, (error, content) => {

      // For 404 pages, we send the index page, and let the app display 404.
      if(error && error.code == 'ENOENT'){
        this.notFounds[filePath] = true;
        new Responder(response).setContentType(Responder.CONTENT_TYPES.HTML)
                               .setContent(this.indexFile)
                               .send();
        return;
      }

      if (error) {
        console.error('error loading static file', filePath, error);
        new Responder(response).setStatusCode(500)
                               .setContent('Unable to load page.')
                               .send();
        return;
      }

      // Log any slow requests.
      let elapsed = Date.now() - startTime;
      if (elapsed > 2000) {
        console.log('slow static', elapsed, filePath);
      }

      this.fileCache[filePath] = content;
      new Responder(response).setContentType(contentType)
                             .setContent(content)
                             .send();
    });
  }
}
