(function() {
  'use strict';

  const path = require('path');
  const fs = require('fs');

  const SENTENCE_FILE = path.resolve(__dirname, 'temporary-sentences.txt');

  let sentencesCache = null;

  let api = {

    /**
     * Is this request directed at the api?
     */
    isApiRequest: function(request) {
      return request.url.includes('/api/');
    },

    /**
     * Give api response.
     */
    handleRequest: function(request, response) {
      if (request.url.includes('/sentence')) {
        api.returnRandomSentence(response);
      } else {
        console.error('unrecongized api url', request.url);
      }
    },

    getSentences: function() {
      if (sentencesCache) {
        return Promise.resolve(sentencesCache);
      }

      return new Promise((resolve, reject) => {
        let contents = fs.readFileSync(SENTENCE_FILE, {
          encoding: 'utf8'
        });

        sentencesCache = contents.split('\n');
        if (sentencesCache.length < 10) {
          reject('not enough sentences');
          return;
        }

        resolve(sentencesCache);
      });
    },

    /**
     * Load setence file (if necessary), pick random sentence.
     */
    returnRandomSentence: function(response) {
      api.getSentences().then(sentences => {
        let random = sentences[Math.floor(Math.random()*sentences.length)];
        console.log('choosen sentence:', random);
        response.writeHead(200);
        response.end(random);
      }).catch(err => {
        console.error('Could not load sentences', err);
        response.writeHead(500);
        response.end('No sentences right now');
      });
    },
  };

  module.exports = api;
})();
