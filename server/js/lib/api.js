"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');
var SENTENCE_FILE = path.resolve(__dirname, '../../data', 'temporary-sentences-2.txt');
var API = (function () {
    function API() {
    }
    /**
     * Is this request directed at the api?
     */
    API.prototype.isApiRequest = function (request) {
        return request.url.includes('/api/');
    };
    /**
     * Give api response.
     */
    API.prototype.handleRequest = function (request, response) {
        if (request.url.includes('/sentence')) {
            this.returnRandomSentence(response);
        }
        else {
            console.error('unrecongized api url', request.url);
        }
    };
    API.prototype.getSentences = function () {
        var _this = this;
        if (this.sentencesCache) {
            return Promise.resolve(this.sentencesCache);
        }
        return new Promise(function (resolve, reject) {
            var contents = fs.readFileSync(SENTENCE_FILE, {
                encoding: 'utf8'
            });
            var sentences = contents.split('\n');
            // TODO: Spaces are used to mark paragraphs, ignore them for now.
            sentences = sentences.filter(function (s) { return s.length; });
            _this.sentencesCache = sentences;
            if (_this.sentencesCache.length < 10) {
                reject('not enough sentences');
                return;
            }
            resolve(_this.sentencesCache);
        });
    };
    /**
     * Load sentence file (if necessary), pick random sentence.
     */
    API.prototype.returnRandomSentence = function (response) {
        this.getSentences().then(function (sentences) {
            var random = sentences[Math.floor(Math.random() * sentences.length)];
            response.writeHead(200);
            response.end(random);
        }).catch(function (err) {
            console.error('Could not load sentences', err);
            response.writeHead(500);
            response.end('No sentences right now');
        });
    };
    return API;
}());
exports.default = API;
