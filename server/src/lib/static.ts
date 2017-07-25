import * as http from 'http';

const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
};

export default class Static {
  private webroot: string;
  private indexFile: string;
  private fileCache: any;

  constructor(webroot: string) {
    this.webroot = webroot;
    this.fileCache = {};

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

  private send(response: http.ServerResponse, type: string, content: string) {
    response.writeHead(200, { 'Content-Type': type });
    response.end(content, 'utf-8');
  }

  handleRequest(request: http.IncomingMessage,
                response: http.ServerResponse) {
    if (request.url === '/') {
      this.send(response, 'text/html', this.indexFile);
    }

    let filePath = this.webroot + request.url;
    let extname = path.extname(filePath).toLowerCase();
    let contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // Try to get the file contents from memory.
    if (this.fileCache[filePath]) {
      this.send(response, contentType, this.fileCache[filePath]);
      return;
    }

    // Serve the file from the file system.
    let startTime = Date.now();
    fs.readFile(filePath, (error, content) => {
      // For 404 pages, we send the index page, and let the app display 404.
      if(error && error.code == 'ENOENT'){
        this.send(response, 'text/html', this.indexFile);
        return
      }

      if (error) {
        console.error('error loading static file', error);
        response.writeHead(500);
        response.end('Unable to load page.');
        return;
      }

      // Log any slow requests.
      let elapsed = Date.now() - startTime;
      if (elapsed > 2000) {
        console.log('slow static', elapsed, filePath);
      }

      this.fileCache[filePath] = content;
      this.send(response, contentType, content);
    });
  }
}
