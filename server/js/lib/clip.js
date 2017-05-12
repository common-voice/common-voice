"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glob = require('glob');
var ms = require('mediaserver');
var path = require('path');
var ff = require('ff');
var fs = require('fs');
var crypto = require('crypto');
var Promise = require('bluebird');
var mkdirp = require('mkdirp');
var UPLOAD_PATH = path.resolve(__dirname, '../..', 'upload');
var CONFIG_PATH = path.resolve(__dirname, '../../..', 'config.json');
var ACCEPTED_EXT = ['ogg', 'webm', 'm4a'];
var DEFAULT_SALT = '8hd3e8sddFSdfj';
var config = require(CONFIG_PATH);
var salt = config.salt || DEFAULT_SALT;
/**
 * Clip - Responsibly for saving and serving clips.
 */
var Clip = (function () {
    function Clip() {
    }
    Clip.prototype.hash = function (str) {
        return crypto.createHmac('sha256', salt).update(str).digest('hex');
    };
    /**
     * Is this request directed at voice clips?
     */
    Clip.prototype.isClipRequest = function (request) {
        return request.url.includes('/upload/');
    };
    /**
     * Distinguish between uploading and listening requests.
     */
    Clip.prototype.handleRequest = function (request, response) {
        if (request.method === 'POST') {
            this.save(request).then(function (timestamp) {
                response.writeHead(200);
                response.end('' + timestamp);
            }).catch(function (e) {
                response.writeHead(500);
                console.error('saving clip error', e, e.stack);
                response.end('Error');
            });
        }
        else {
            this.serve(request, response);
        }
    };
    /**
     * Save the request body as an audio file.
     */
    Clip.prototype.save = function (request) {
        var _this = this;
        var info = request.headers;
        var uid = info.uid;
        var sentence = decodeURI(info.sentence);
        return new Promise(function (resolve, reject) {
            var extension = '.ogg'; // Firefox gives us opus in ogg
            if (info['content-type'].startsWith('audio/webm')) {
                extension = '.webm'; // Chrome gives us opus in webm
            }
            else if (info['content-type'].startsWith('audio/mp4a')) {
                extension = '.m4a'; // iOS gives us mp4a
            }
            // if the folder does not exist, we create it
            var folder = path.join(UPLOAD_PATH, uid);
            var filePrefix = _this.hash(sentence);
            var file = path.join(folder, filePrefix + extension);
            var f = ff(function () {
                fs.exists(folder, f.slotPlain());
            }, function (exists) {
                if (!exists) {
                    mkdirp(folder, f());
                }
            }, function () {
                var writeStream = fs.createWriteStream(file);
                request.pipe(writeStream);
                request.on('end', f());
                fs.writeFile(path.join(folder, filePrefix + '.txt'), sentence, f());
            }, function () {
                console.log('file written', file);
                resolve(filePrefix);
            }).onError(reject);
        });
    };
    /*
     * Fetch an audio file.
     */
    Clip.prototype.serve = function (request, response) {
        var ids = request.url.split('/');
        var clipId = ids.pop();
        var prefix = path.join(UPLOAD_PATH, clipId);
        glob(prefix + '.*', function (err, files) {
            if (err) {
                console.error('could not glob for clip', err);
                return;
            }
            // Try to find the right file, since we don't know the extension.
            var file = null;
            for (var i = 0; i < files.length; i++) {
                var ext = files[i].split('.').pop();
                if (ACCEPTED_EXT.indexOf(ext) !== -1) {
                    file = files[i];
                    break;
                }
            }
            if (!file) {
                console.error('could not find clip', files);
                return;
            }
            ms.pipe(request, response, file);
        });
    };
    return Clip;
}());
exports.default = Clip;
