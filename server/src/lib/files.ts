import { map } from '../promisify';
import { getFileExt } from './utility';

const MemoryStream = require('memorystream');
const Queue = require('better-queue');
const path = require('path');
const Promise = require('bluebird');
const AWS = require('./aws');

const KEYS_PER_REQUEST = 20; // Default is 1000.
const BATCH_SIZE = 5;
const MP3_EXT = '.mp3';
const CONVERTABLE_EXTS = ['.ogg', '.m4a'];
const CONFIG_PATH = path.resolve(__dirname, '../../..',
                                 'config.json');
const config = require(CONFIG_PATH);
const BUCKET_NAME = config.BUCKET_NAME || 'common-voice-corpus';

export default class Files {
  private s3: any;
  private files: {
    // fileGlob: [
    //   sentence: 'the text of the sentenct'
    // ]
  };
  private paths: string[];

  constructor() {
    this.s3 = new AWS.S3();
    this.files = {};
    this.paths = [];
    this.init();
  }

  /**
   * Returns the file path with extension stripped.
   */
  private getGlob(path: string): string {
    return path.substr(0, path.indexOf('.'));
  }

  /**
   * Read a sentence in from s3.
   */
  private getSentence(key: string): Promise<string> {
    return new Promise((res, rej) => {
      let glob = this.getGlob(key);
      let params = {Bucket: BUCKET_NAME, Key: key};
      this.s3.getObject(params, (err: any, s3Data: any) => {
        if (err) {
          console.error('Could not read from s3', key, err);
          delete this.files[glob];
          rej(err);
          return;
        }

        let sentence = s3Data.Body.toString();
        this.files[glob].sentence = sentence;
        res(sentence);
      });
    });
  }

  /**
   * Load sound file metadata into memory.
   */
  private loadCache(continuationToken?: string) {
    let awsRequest = this.s3.listObjectsV2({
      Bucket: BUCKET_NAME,
      MaxKeys: KEYS_PER_REQUEST,
      ContinuationToken: continuationToken
    });

    let sentenceLoadingQueue = new Queue((key, cb) => {
      this.getSentence(key)
        .then(sentence => {
          cb();
        })
        .catch(err => {
          console.error('error fetching sentence', err);
          cb();
        });
    }, { concurrent: BATCH_SIZE });

    awsRequest.on('success', (response) => {
      let next = response['data']['NextContinuationToken'];
      let contents = response['data']['Contents'];
      for (let i = 0; i < contents.length; i++) {
        let key = contents[i].Key;
        let glob = this.getGlob(key);
        let ext = getFileExt(key);

        // Ignore non-text files
        if (ext !== '.txt') {
          continue;
        }

        // Track gobs and sentence of the voice clips.
        if (!this.files[glob]) {
          this.files[glob] = {
            sentence: null
          }
          sentenceLoadingQueue.push(key);
        }

        // TODO: consider also loading demographics+votes here.
      }

      this.paths = Object.keys(this.files);
      if (this.paths.length === 0) {
        console.log('warning, no sound files found');
      }

      if (next) {
        setTimeout(() => {
          console.log('loaded so far', this.paths.length);
          this.loadCache(next);
        }, 2000);
      } else {
        console.log('found sentences', this.paths.length);
      }
    });

    awsRequest.on('error', (response) => {
      console.error('Error while fetching clip list', response);
    });

    awsRequest.send();
  }

  /**
   * Load a list of files from S3.
   */
  private init(): void {
    this.loadCache();
  }

  /**
   * Grab a random sentence and associated sound file path.
   */
  getRandomClip(uid: string): Promise<string[2]> {
    // Make sure we have at least 1 file to choose from.
    if (this.paths.length === 0) {
      return Promise.reject('No files.');
    }

    let items = this.paths.filter(glob => !glob.includes(uid));
    // Make sure we have at least 1 file to choose from that's not from us.
    if (items.length === 0) {
      return Promise.reject('No files not from us.');
    }

    // Make a reasonable effort to find a valid sentence
    for(let attempt = 0; attempt < items.length; attempt++) {
      let glob = items[Math.floor(Math.random()*items.length)];
      let key = glob + MP3_EXT;
      let info = this.files[glob];

      if (info && info.sentence && /\S/.test(info.sentence) && key) {
        return Promise.resolve([key, info.sentence]);
      }
    }

    return Promise.reject('No valid sentences.');
  }
}
