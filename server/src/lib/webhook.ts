import * as http from 'http';
import Bunyan from 'bunyan';

const path = require('path');
const SimpleGit = require('simple-git');

const PROJECT_PATH = path.resolve(__dirname, '../../../');

export default class WebHook {
  git: any;
  log: Bunyan;

  constructor(log: Bunyan) {
    this.log = log;
    this.git = new SimpleGit(PROJECT_PATH);
  }

  private concat(request: http.IncomingMessage, callback: Function): void {
    let buffer: any[] = [];
    request.on('data', (chunk: Buffer) => {
      buffer.push(chunk);
    });
    request.on('end', () => {
      callback(buffer);
    });
  }

  isHookRequest(request: http.IncomingMessage): boolean {
    return request.url.includes('/webhook');
  }

  handleWebhookRequest(request: http.IncomingMessage,
    response: http.ServerResponse) {

    // Only post requests allowed.
    if (request.method !== 'POST') {
      response.writeHead(400);
      response.end('BAD REQUEST');
      return;
    }

    this.concat(request, (buffer: Buffer) => {
      // Parse icoming data to see which branch was updated.
      let info: any;
      try {
        info = JSON.parse(buffer.toString());
      } catch(e) {
        response.writeHead(400);
        response.end('BAD REQUEST');
        return;
      }

      // Thank you github, you can go home now.
      response.writeHead(200);
      response.end('OK');

      // Update local repository if commit was to master branch.
      if (info.ref === 'refs/heads/master') {
        this.log.info('detected changes on master, updating local tree');
        this.git.pull('origin', 'master', (err: Error, update: any) => {
          if (err) {
            this.log.error('could not pull', err);
          }
          this.log.info('local tree updated', update && update.summary);
        });
      }
    });
  }
}
