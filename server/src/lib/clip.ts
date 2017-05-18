import * as http from 'http';
import Files from './files';

const glob = require('glob');
const ms = require('mediaserver');
const path = require('path');
const ff = require('ff');
const fs = require('fs');
const crypto = require('crypto');
const Promise = require('bluebird');
const mkdirp = require('mkdirp');

const UPLOAD_PATH = path.resolve(__dirname, '../..', 'upload');
const CONFIG_PATH = path.resolve(__dirname, '../../..', 'config.json');
const ACCEPTED_EXT = [ 'ogg', 'webm', 'm4a' ];
const DEFAULT_SALT = '8hd3e8sddFSdfj';
const config = require(CONFIG_PATH);
const salt = config.salt || DEFAULT_SALT;

/**
 * Clip - Responsibly for saving and serving clips.
 */
export default class Clip {
  private files: Files;

  constructor() {
    this.files = new Files();
  }

  private hash(str: string): string {
    return crypto.createHmac('sha256', salt).update(str).digest('hex');
  }

  /**
   * Is this request directed at voice clips?
   */
  isClipRequest(request: http.IncomingMessage) {
    return request.url.includes('/upload/');
  }

  /**
   * Is this request directed at a random voice clip?
   */
  isRandomClipRequest(request: http.IncomingMessage) {
    return request.url.includes('/upload/random');
  }


  /**
   * Distinguish between uploading and listening requests.
   */
  handleRequest(request: http.IncomingMessage,
                response: http.ServerResponse): void {
    if (request.method === 'POST') {
      this.save(request).then(timestamp => {
        response.writeHead(200);
        response.end('' + timestamp);
      }).catch(e => {
        response.writeHead(500);
        console.error('saving clip error', e, e.stack);
        response.end('Error');
      });
    } else if (this.isRandomClipRequest(request)) {
      this.serveRandomClip(request, response);
    } else {
      this.serve(request, response);
    }
  }

  /**
   * Save the request body as an audio file.
   */
  save(request: http.IncomingMessage): Promise<string> {
    let info = request.headers;
    let uid = info.uid;
    let sentence = decodeURI(info.sentence);

    return new Promise((resolve: Function, reject: Function) => {
      let extension = '.ogg';  // Firefox gives us opus in ogg
      if (info['content-type'].startsWith('audio/webm')) {
        extension = '.webm';   // Chrome gives us opus in webm
      } else if (info['content-type'].startsWith('audio/mp4a')) {
        extension = '.m4a'; // iOS gives us mp4a
      }

      // if the folder does not exist, we create it
      let folder = path.join(UPLOAD_PATH, uid);
      let filePrefix = this.hash(sentence);
      let file = path.join(folder, filePrefix + extension);

      let f = ff(() => {
        fs.exists(folder, f.slotPlain());
      }, exists => {
        if (!exists) {
          mkdirp(folder, f());
        }
      }, () => {
        let writeStream = fs.createWriteStream(file);
        request.pipe(writeStream);
        request.on('end', f());
        fs.writeFile(path.join(folder, filePrefix + '.txt'), sentence, f());
      }, () => {
        console.log('file written', file);
        resolve(filePrefix);
      }).onError(reject);
    });
  }

  /**
   * Fetch random clip file and associated sentence.
   */
  serveRandomClip(request: http.IncomingMessage,
                  response: http.ServerResponse) {
    this.files.getRandomClip().then((clip: string[2]) => {

      // Yup, this is a hack. We trick ourselves into thinking
      // that the url points to some randomly selected clip path.
      request.url = clip[0].split('/').slice(-2).join('/');
      response.setHeader('sentence', encodeURIComponent(clip[1]));
      this.serve(request, response);
    });
  }

  /*
   * Fetch an audio file.
   */
  serve(request: http.IncomingMessage, response: http.ServerResponse) {
    let ids = request.url.split('/');
    let clipId = ids.pop();
    let folder = ids.pop();
    let prefix = path.join(UPLOAD_PATH, folder, clipId);

    glob(prefix + '.*', (err: any, files: String[]) => {
      if (err) {
        console.error('could not glob for clip', err);
        response.writeHead(404);
        response.end('Unknown File');
        return;
      }

      // Try to find the right file, since we don't know the extension.
      let file = null;
      for (let i = 0; i < files.length; i++) {
        let ext = files[i].split('.').pop();
        if (ACCEPTED_EXT.indexOf(ext) !== -1) {
          file = files[i];
          break;
        }
      }

      if (!file) {
        console.error('could not find clip', files);
        response.writeHead(404);
        response.end('Unknown File');
        return;
      }

      console.log('serving file', file);
      ms.pipe(request, response, file);
    });
  }
}
