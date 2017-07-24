import { map } from '../promisify';
import { getFileExt } from './utility';

const MemoryStream = require('memorystream');
const path = require('path');
const Promise = require('bluebird');
const Random = require('random-js');
const AWS = require('./aws');

const KEYS_PER_REQUEST = 1000; // Default is 1000.
const BATCH_SIZE = 5;
const DELAY_LOAD = 200; // Delaying request.
const MP3_EXT = '.mp3';
const TEXT_EXT = '.txt';
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
  private randomEngine: any

  constructor() {
    this.s3 = new AWS.S3();
    this.files = {};
    this.paths = [];

    this.randomEngine = Random.engines.mt19937();
    this.randomEngine.autoSeed();
    this.loadCache();
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
  private fetchSentenceFromS3(glob: string): Promise<string> {
    let key = glob + TEXT_EXT;
    return new Promise((res, rej) => {
      let glob = this.getGlob(key);
      let params = {Bucket: BUCKET_NAME, Key: key};
      this.s3.getObject(params, (err: any, s3Data: any) => {
        if (err) {
          console.error('Could not read from s3', key, err);
          rej(err);
          return;
        }

        res(s3Data.Body.toString());
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

    awsRequest.on('success', (response) => {
      let next = response['data']['NextContinuationToken'];
      let contents = response['data']['Contents'];
      for (let i = 0; i < contents.length; i++) {
        let key = contents[i].Key;
        let glob = this.getGlob(key);
        let ext = getFileExt(key);

        // Ignore non-text files
        if (ext !== TEXT_EXT) {
          continue;
        }

        // Track gobs and sentence of the voice clips.
        if (!this.files[glob]) {
          this.files[glob] = {
            key: key,
            sentence: null
          }

          this.paths.push(glob);
        }
      }

      if (next) {
        console.log('loaded so far', this.paths.length);
        // Start the next bactch after a short delay
        setTimeout(() => { this.loadCache(next); }, DELAY_LOAD);
      } else {
        console.log('clips loaded', this.paths.length);
        console.log('LOADED APPLICATION');
      }
    });

    awsRequest.on('error', (response) => {
      console.error('Error while fetching clip list', response);
    });

    awsRequest.send();
  }

  /**
   * Grab a random sentence and associated sound file path.
   */
  getRandomClip(uid: string): Promise<string[2]> {
    // Make sure we have at least 1 file to choose from.
    if (this.paths.length === 0) {
      return Promise.reject('No files.');
    }

    // Fetch a random clip but make sure it's not the current user's.
    let distribution = Random.integer(0, this.paths.length - 1);
    let glob;
    do {
      glob = this.paths[distribution(this.randomEngine)];
    } while (glob.includes(uid));

    // Grab clip metadata.
    let info = this.files[glob];
    let soundfile = glob + MP3_EXT;
    if (!info || !info.key) {
      console.error('unidentified random glob', glob);
      return Promise.reject('glob info not found');
    }

    // If we have a cached sentence, return it immediately.
    if (info.sentence && /\S/.test(info.sentence)) {
      return Promise.resolve([soundfile, info.sentence]);
    }

    // Grab the sentence contence from s3.
    return this.fetchSentenceFromS3(glob).then(sentence => {
      this.files[glob].sentence = sentence;
      return Promise.resolve([soundfile, info.sentence]);
    });
  }
}
