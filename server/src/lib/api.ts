import * as http from 'http';
import WebHook from './webhook';

const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');
const Random = require('random-js');

const SENTENCE_FOLDER = '../../data/';

export default class API {
  sentencesCache: String[];
  webhook: WebHook;
  randomEngine: any

  constructor() {
    this.webhook = new WebHook();
    this.getSentences();
    this.randomEngine = Random.engines.mt19937();
    this.randomEngine.autoSeed();
  }

  private getSentenceFolder() {
    return path.join(__dirname, SENTENCE_FOLDER);
  }

  private getRandomSentences(count: number): Promise<string[]> {
    return this.getSentences().then(sentences => {
      let randoms = [];
      for (var i = 0; i < count; i++) {
        let distribution = Random.integer(0, sentences.length - 1);
        let randomIndex = distribution(this.randomEngine);
        randoms.push(sentences[randomIndex]);
      }
      return randoms;
    });
  }

  private getFilesInFolder(folderpath) {
    return new Promise((res, rej) => {
      fs.readdir(folderpath, (err, files) => {
        if (err) {
          rej(err);
          return;
        }

        res(files);
      });
    });
  }

  private getFileContents(filepath) {
    return new Promise((res, rej) => {
      fs.readFile(filepath, {
        contents: 'utf8'
      }, (err, data) => {
        if (err) {
          rej(err);
          return;
        }

        res(data.toString());
      });
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

    return this.getFilesInFolder(this.getSentenceFolder())
      .then(files => {
        return Promise.all(files.map(filename => {

          // Only parse the top-level text files, not any sub folders.
          if (filename.split('.').pop() !== 'txt') {
            return null;
          }

          let filepath = path.join(this.getSentenceFolder(), filename);
          return this.getFileContents(filepath);
        }));
      })


      // Chop the array of content strings into an array of sentences.
      .then((values) => {
        let sentences = [];
        let sentenceArrays = values.map(fileContents => {
          if (!fileContents) {
            return [];
          }

          return fileContents.split('\n');
        });

        sentences = sentences.concat.apply(sentences, sentenceArrays);
        console.log('sentences loaded', sentences.length);
        this.sentencesCache = sentences;
      })
      .catch(err => {
        console.error('could not retrieve sentences', err);
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
