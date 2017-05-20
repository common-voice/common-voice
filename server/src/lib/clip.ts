import * as http from 'http';
import Files from './files';
import { getFileExt } from './utility';

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
const ACCEPTED_EXT = [ '.mp3', '.ogg', '.webm', '.m4a' ];
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
   * Turn a server url into a local file path.
   */
  private getLocalFilePath(url: string): string {
    let parts = url.split('/');
    let fileName = parts.pop();
    let folder = parts.pop();
    return path.join(UPLOAD_PATH, folder, fileName);
  }

  /**
   * Load the files module.
   */
  init() {
    return this.files.init();
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

      // First we need to figure out the file extension.
      let extension;
      let contentType = info['content-type'];

      if (contentType.startsWith('audio/ogg')) {
        // Firefox gives us opus in an ogg.
        extension = '.ogg';
      } else if (contentType.startsWith('audio/webm')) {
        // Chrome gives us opus in webm.
        extension = '.webm';
      } else if (contentType.startsWith('audio/m4a')) {
        // iOS gives us mp4a.
        // Note: Firefox cannot play m4a's,
        // but if we save this clipa s mp3 everything just works.
        extension = '.mp3';
      } else {
        // Default to ogg.
        console.error('unrecognized audio type!', contentType);
        extension = '.ogg';
      }

      // Where is our audio clip going to be located?
      let folder = path.join(UPLOAD_PATH, uid);
      let filePrefix = this.hash(sentence);
      let file = path.join(folder, filePrefix + extension);

      let f = ff(() => {
        // if the folder does not exist, we create it
        mkdirp(folder, f.wait());

        // If we were given base64, we'll need to concat it all first
        // So we can decode it in the next step.
        if (contentType.includes('base64')) {
          let chunks = [];
          f.pass(chunks);
          request.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          });
          request.on('end', f.wait());
        }
      }, (chunks) => {

        // If upload was base64, make sure we decode it first.
        if (contentType.includes('base64')) {
          let blob = Buffer.from(Buffer.concat(chunks).toString(), 'base64');
          fs.writeFile(file, blob, f());
        } else {
          // For now base64 uploads, we can just stream data into a file.
          let writeStream = fs.createWriteStream(file);
          request.pipe(writeStream);
          request.on('end', f());
        }

        // Don't forget about the sentence text!
        fs.writeFile(path.join(folder, filePrefix + '.txt'), sentence, f());
      }, () => {

        // File saving is now complete.
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
      if (!clip) {
      }

      // Generate the full local path to the file.
      let path = clip[0];
      let sentence = clip[1]
      let file = this.getLocalFilePath(path);

      // Send sentence string to client in the header.
      // Note: header is already URL encoded in the file.
      response.setHeader('sentence', sentence);

      // Use mediaserver to stream the audio file to the client.
      ms.pipe(request, response, file);
    }).catch(err => {
      console.error('problem getting a random clip: ', err);
      response.writeHead(500);
      response.end('Cannot fetch random clip right now.');
      return;
    });
  }

  /*
   * Fetch an audio file.
   */
  serve(request: http.IncomingMessage, response: http.ServerResponse) {
    let prefix = this.getLocalFilePath(request.url);

    glob(prefix + '.*', (err: any, files: string[]) => {
      if (err) {
        console.error('could not glob for clip', err);
        response.writeHead(404);
        response.end('Unknown File');
        return;
      }

      // Try to find the right file, since we don't know the extension.
      let file = null;
      for (let i = 0; i < files.length; i++) {
        let ext = getFileExt(files[i]);
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

      ms.pipe(request, response, file);
    });
  }
}
