import { map } from '../promisify';
import { getFileExt } from './utility';

const MemoryStream = require('memorystream');
const path = require('path');
const Promise = require('bluebird');
const AWS = require('./aws');

const BATCH_SIZE = 5;
const REFRESH_INTERVAL = 10000; // how often we refresh our S3 list
const MP3_EXT = '.mp3';
const CONVERTABLE_EXTS = ['.ogg', '.m4a'];
const CONFIG_PATH = path.resolve(__dirname, '../../..', 'config.json');
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
  private continuationToken: string;

  constructor() {
    this.s3 = new AWS.S3();
    this.files = {};
    this.paths = [];
    this.continuationToken = undefined;
    this.init().then(() => {
      setInterval(this.init.bind(this), REFRESH_INTERVAL);
    });
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
  private getSentence(glob: string, key: string) {
    let params = {Bucket: BUCKET_NAME, Key: key};
    this.s3.getObject(params, (err: any, s3Data: any) => {
      if (err) {
        console.error('Could not read from s3', key, err);
        delete this.files[glob];
        return;
      }

      let sentence = s3Data.Body.toString();
      this.files[glob].sentence = sentence;
    });
  }

  /**
   * Load a list of files from S3.
   */
  private init(): Promise<any> {
    return new Promise((res: Function, rej: Function) => {
      let searchParam = {Bucket: BUCKET_NAME, MaxKeys: 50, ContinuationToken: this.continuationToken};
      let awsRequest = this.s3.listObjectsV2(searchParam);

      awsRequest.on('success', (response) => {
        this.continuationToken = response['data']['NextContinuationToken'];
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
            this.getSentence(glob, key);
          }
        }
      });

      awsRequest.on('complete', (response) => {
        if (response.error) {
          console.error('Error while fetching clip list', response.error);
          res();
          return;
        }

        this.paths = Object.keys(this.files);
        if (this.paths.length === 0) {
          // No files found, so we are done
          console.log('warning, no sound files found');
          res();
          return;
        }

       res();
      });

      awsRequest.send();
    });
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
