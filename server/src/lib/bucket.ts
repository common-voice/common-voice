import * as path from 'path';
import * as Random from 'random-js';
import { S3 } from 'aws-sdk';

import Model from './model';
import { map } from '../promisify';
import { getFileExt } from './utility';
import './aws';

const KEYS_PER_REQUEST = 1000; // Max is 1000.
const LOAD_DELAY = 200;
const TEXT_EXT = '.txt';
const CONFIG_PATH = path.resolve(__dirname, '../../..', 'config.json');
const config = require(CONFIG_PATH);
const BUCKET_NAME = config.BUCKET_NAME || 'common-voice-corpus';

/**
 * Bucket
 *   The bucket class is responsible for loading clip
 *   metadata into the Model from s3.
 */
export default class Bucket {
  private model: Model;
  private s3: S3;
  private votes: number;
  private validated: number;
  private randomEngine: Random.MT19937;

  constructor(model: Model) {
    this.model = model;
    this.s3 = new S3();
    this.votes = 0;
    this.validated = 0;

    this.randomEngine = Random.engines.mt19937();
    this.randomEngine.autoSeed();
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
    return new Promise(
      (res: (sentence: string) => void, rej: (error: any) => void) => {
        let glob = this.getGlob(key);
        let params = { Bucket: BUCKET_NAME, Key: key };
        this.s3.getObject(params, (err: any, s3Data: any) => {
          if (err) {
            console.error('Could not read from s3', key, err);
            rej(err);
            return;
          }

          let sentence = s3Data.Body.toString();
          res(sentence);
        });
      }
    );
  }

  /**
   * Fetch a public url for the resource.
   */
  private getPublicUrl(key: string) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: BUCKET_NAME,
      Key: key,
    });
  }

  /**
   * Load a single set of file keys based on KEYS_PER_REQUEST.
   */
  private loadNext(
    res: Function,
    rej: Function,
    continuationToken?: string
  ): void {
    let awsRequest = this.s3.listObjectsV2({
      Bucket: BUCKET_NAME,
      MaxKeys: KEYS_PER_REQUEST,
      ContinuationToken: continuationToken,
    });

    let startRequest = Date.now();
    awsRequest.on('success', (response: any) => {
      let next = response['data']['NextContinuationToken'];
      let contents = response['data']['Contents'];

      // Pass file path to the Model for metadata processing.
      let startParsing = Date.now();
      for (let i = 0; i < contents.length; i++) {
        let key = contents[i].Key;
        this.model.processFilePath(key);
      }

      let secondsToLoad = ((startParsing - startRequest) / 1000).toFixed(3);
      let secondsToParse = ((Date.now() - startParsing) / 1000).toFixed(2);
      console.log(`load time ${secondsToLoad}s, parse time ${secondsToParse}`);

      // If there is no continuation token, we are done.
      if (!next) {
        this.model.setLoaded();
        this.model.printMetrics();
        res();
        return;
      }

      // Load the next batch.
      setTimeout(() => {
        this.loadNext(res, rej, next);
      }, LOAD_DELAY);
    });

    awsRequest.on('error', (err: any) => {
      if (err.code === 'AccessDenied' || err.code === 'CredentialsError') {
        console.error('s3 aws creds not configured properly');
        rej(err);
        return;
      }

      console.error('Error while fetching clip list:', err.code);

      // Retry loading current batch.
      setTimeout(() => {
        console.log('retrying loading from s3');
        this.loadNext(res, rej, continuationToken);
      }, LOAD_DELAY);
    });

    awsRequest.send();
  }

  /**
   * Load sound file metadata into memory.
   */
  loadCache(): Promise<void> {
    return new Promise((res: Function, rej: Function) => {
      this.loadNext(res, rej);
    });
  }

  /**
   * Grab metadata to play clip on the front end.
   */
  async getRandomClipJson(uid: string): Promise<string> {
    const clip = this.model.getEllibleClip(uid);
    if (!clip) {
      return Promise.reject('No globs from me');
    }

    // On the client, the clipid is called 'glob'
    let glob = clip.clipid;

    let clipJson = {
      glob: glob,
      text: clip.sentenceText,
      sound: this.getPublicUrl(clip.clipPath),
    };

    if (clipJson.text) {
      return Promise.resolve(JSON.stringify(clipJson));
    }

    if (!clipJson.text) {
      clipJson.text = await this.fetchSentenceFromS3(glob);
      this.model.addSentenceContent(uid, clip.sentenceid, clipJson.text);
    }

    return JSON.stringify(clipJson);
  }
}
