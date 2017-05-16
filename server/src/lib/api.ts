import * as http from 'http';
import WebHook from './webhook';

const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');

const SENTENCE_FILE = path.resolve(__dirname, '../../data',
                                   'temporary-sentences-2.txt');

export default class API {
  sentencesCache: String[];
  webhook: WebHook;

  constructor() {
    this.webhook = new WebHook();
  }

  /**
   * Is this request directed at the api?
   */
  isApiRequest(request: http.IncomingMessage) {
    return request.url.includes('/api/');
  }

  /**
   * Give api response.
   */
  handleRequest(request: http.IncomingMessage,
                response: http.ServerResponse) {

    // Most often this will be a sentence request.
    if (request.url.includes('/sentence')) {
      this.returnRandomSentence(response);

    // Webhooks from github.
    } else if (this.webhook.isHookRequest(request)) {
      this.webhook.handleWebhookRequest(request, response);

    // Unrecognized requests get here.
    } else {
      console.error('unrecongized api url', request.url);
      response.writeHead(404);
      response.end('I\'m not sure what you want.');
    }
  }

  getSentences() {
    if (this.sentencesCache) {
      return Promise.resolve(this.sentencesCache);
    }

    return new Promise((resolve: Function, reject: Function) => {
      let contents = fs.readFileSync(SENTENCE_FILE, {
        encoding: 'utf8'
      });

      let sentences = contents.split('\n');
      // TODO: Spaces are used to mark paragraphs, ignore them for now.
      sentences = sentences.filter(s => s.length);
      this.sentencesCache = sentences;
      if (this.sentencesCache.length < 10) {
        reject('not enough sentences');
        return;
      }

      resolve(this.sentencesCache);
    });
  }

  /**
   * Load sentence file (if necessary), pick random sentence.
   */
  returnRandomSentence(response: http.ServerResponse) {
    this.getSentences().then((sentences: String[]) => {
      let random = sentences[Math.floor(Math.random() * sentences.length)];
      response.writeHead(200);
      response.end(random);
    }).catch((err: any) => {
      console.error('Could not load sentences', err);
      response.writeHead(500);
      response.end('No sentences right now');
    });
  }
}
