import * as http from 'http';
import * as path from 'path';

import respond from './responder';

const SimpleGit = require('simple-git');

const PROJECT_PATH = path.resolve(__dirname, '../../../');

export default class WebHook {
  git: any;

  constructor() {
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

  handleWebhookRequest(
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) {
    // Only post requests allowed.
    if (request.method !== 'POST') {
      respond(response, 'BAD REQUEST', 400);
      return;
    }

    this.concat(request, (buffer: Buffer) => {
      // Parse icoming data to see which branch was updated.
      let info: any;
      try {
        info = JSON.parse(buffer.toString());
      } catch (e) {
        respond(response, 'BAD REQUEST', 400);
        return;
      }

      // Thank you github, you can go home now.
      respond(response, 'OK');

      // Update local repository if commit was to master branch.
      if (info.ref === 'refs/heads/master') {
        console.log('detected changes on master, updating local tree');
        this.git.pull('origin', 'master', (err: Error, update: any) => {
          if (err) {
            console.error('could not pull', err);
          }
          console.log('local tree updated', update && update.summary);
        });
      }
    });
  }
}
