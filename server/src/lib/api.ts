import * as http from 'http';

const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');

const SENTENCE_FILE = path.resolve(__dirname, '../../data',
                                   'temporary-sentences.txt');

export default class API {
  sentencesCache: String[];

  constructor() {}

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
    if (request.url.includes('/sentence')) {
      this.returnRandomSentence(response);
    } else {
      console.error('unrecongized api url', request.url);
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

      this.sentencesCache = contents.split('\n');
      if (this.sentencesCache.length < 10) {
        reject('not enough sentences');
        return;
      }

      resolve(this.sentencesCache);
    });
  }

  /**
   * Load setence file (if necessary), pick random sentence.
   */
  returnRandomSentence(response: http.ServerResponse) {
    this.getSentences().then((sentences: String[]) => {
      let random = sentences[Math.floor(Math.random()*sentences.length)];
      response.writeHead(200);
      response.end(random);
    }).catch((err: any) => {
      console.error('Could not load sentences', err);
      response.writeHead(500);
      response.end('No sentences right now');
    });
  }
}
