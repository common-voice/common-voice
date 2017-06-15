import * as http from 'http';
import Files from './files';
import { getFileExt } from './utility';

const ms = require('mediaserver');
const path = require('path');
const ff = require('ff');
const fs = require('fs');
const crypto = require('crypto');
const Promise = require('bluebird');
const mkdirp = require('mkdirp');
const findRemoveSync = require('find-remove');

const UPLOAD_PATH = path.resolve(__dirname, '../..', 'upload');
const CONFIG_PATH = path.resolve(__dirname, '../../..', 'config.json');
const ACCEPTED_EXT = [ '.mp3', '.ogg', '.webm', '.m4a' ];
const DEFAULT_SALT = '8hd3e8sddFSdfj';
const config = require(CONFIG_PATH);
const salt = config.salt || DEFAULT_SALT;
const BUCKET_NAME = config.BUCKET_NAME || 'common-voice-corpus';

var AWS = require('aws-sdk');

if(process.env.HTTP_PROXY) {
  var proxy = require('proxy-agent');

  AWS.config.update({
    httpOptions: { agent: proxy(process.env.HTTP_PROXY) }
  });
}

/**
 * Clip - Responsibly for saving and serving clips.
 */
export default class Clip {
  private s3: any;
  private files: Files;

  constructor() {
    this.s3 = new AWS.S3();
    this.files = new Files();
    setInterval(findRemoveSync.bind(this, UPLOAD_PATH, {age: {seconds: 300}, extensions: '.mp3'}), 300);
  }

  private hash(str: string): string {
    return crypto.createHmac('sha256', salt).update(str).digest('hex');
  }

  private streamAudio(request: http.IncomingMessage,
                      response: http.ServerResponse,
                      key: string): void {
    // Save the data locally, stream to client, remove local data (Performance?)
    let tmpFilePath = path.join(UPLOAD_PATH, key);
    let tmpFileDirectory = path.dirname(tmpFilePath);
    let f = ff(() => {
      mkdirp(tmpFileDirectory, f.wait());
    }, () => {
      let retrieveParam = {Bucket: BUCKET_NAME, Key: key};
      let awsResult = this.s3.getObject(retrieveParam);
      f.pass(awsResult);
    }, (awsResult) => {
      let tmpFile = fs.createWriteStream(tmpFilePath);
      tmpFile = awsResult.createReadStream().pipe(tmpFile);
      tmpFile.on('finish', f.wait());
    }, () => {
      ms.pipe(request, response, tmpFilePath);
    });
  }

  /**
   * Turn a server url into a S3 file path.
   */
  private getS3FilePath(url: string): string {
    let parts = url.split('/');
    let fileName = parts.pop();
    let folder = parts.pop();
    return folder + '/' + fileName;
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
    let sentence = decodeURI(info.sentence as string);

    return new Promise((resolve: Function, reject: Function) => {

      // First we need to figure out the file extension.
      let extension;
      let contentType = info['content-type'] as string;

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
      let folder = uid + '/';
      let filePrefix = this.hash(sentence);
      let file = folder + filePrefix + extension;
      let txtFile = folder + filePrefix + '.txt';

      let f = ff(() => {
        // if the folder does not exist, we create it
        let params = {Bucket: BUCKET_NAME, Key: folder};
        this.s3.putObject(params, f.wait());

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
          let params = {Bucket: BUCKET_NAME, Key: file, Body: blob};
          this.s3.upload(params, f());
        } else {
          // For now base64 uploads, we can just stream data.
          let params = {Bucket: BUCKET_NAME, Key: file, Body: request};
          this.s3.upload(params, f());
        }

        // Don't forget about the sentence text!
        let params = {Bucket: BUCKET_NAME, Key: txtFile, Body: sentence};
        this.s3.putObject(params, f());
      }, () => {
        // Converts audio to mp3 if required
        this.files.init().then(f());
      }, () => {

        // File saving is now complete.
        console.log('file written to s3', file);
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

      // Get full key to the file.
      let key = clip[0];
      let sentence = clip[1]

      // Send sentence string to client in the header.
      // Note: header is already URL encoded in the file.
      response.setHeader('sentence', sentence);


      // Stream audio to client
      this.streamAudio(request, response, key);
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
    let prefix = this.getS3FilePath(request.url);

    let searchParam = {Bucket: BUCKET_NAME, Prefix: prefix};
    this.s3.listObjectsV2(searchParam, (err: any, data: any) => {
      if (err) {
        console.error('Did not find specified clip', err);
        response.writeHead(404);
        response.end('Unknown File');
        return;
      }

      // Try to find the right key, since we don't know the extension.
      let key = null;
      for (let i = 0; i < data.Contents.length; i++) {
        let ext = getFileExt(data.Contents[i].Key);
        if (ACCEPTED_EXT.indexOf(ext) !== -1) {
          key = data.Contents[i].Key;
          break;
        }
      }

      if (!key) {
        console.error('could not find clip', data.Contents);
        response.writeHead(404);
        response.end('Unknown File');
        return;
      }

      // Stream audio to client
      this.streamAudio(request, response, key);
    });
  }
}
