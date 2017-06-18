import * as http from 'http';
import WebHook from './webhook';

const SENTENCE_FILE = '../../data/funny.txt';

const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');

export default class API {
  sentencesCache: String[];
  webhook: WebHook;

  constructor() {
    this.webhook = new WebHook();
  }

  private getRandomSentences(count: number): Promise<string[]> {
    return this.getSentences().then(sentences => {
      let randoms = [];
      for (var i = 0; i < count; i++) {
        randoms.push(sentences[Math.floor(Math.random() * sentences.length)]);
      }
      return randoms;
    });
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
      let parts = request.url.split('/');
      let index = parts.indexOf('sentence');
      let count = parts[index + 1] && parseInt(parts[index + 1], 10);
      this.returnRandomSentence(response, count);
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
      let sentencePath = path.join(__dirname, SENTENCE_FILE);
      let contents = fs.readFileSync(sentencePath, {
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
  returnRandomSentence(response: http.ServerResponse, count: number) {
    count = count || 1;

    this.getSentences().then((sentences: String[]) => {
      return this.getRandomSentences(count);
    }).then(randoms => {
      response.setHeader('Content-Type', 'text/plain');
      response.writeHead(200);
      response.end(randoms.join('\n'));
    }).catch((err: any) => {
      console.error('Could not load sentences', err);
      response.writeHead(500);
      response.end('No sentences right now');
    });
  }
}
