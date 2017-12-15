import * as Random from 'random-js';
import { S3 } from 'aws-sdk';

import { CommonVoiceConfig } from '../config-helper';
import Model from './model';
import { sleep } from './utility';
import { Clip } from './model/clips';

const KEYS_PER_REQUEST = 1000; // Max is 1000.
const LOAD_DELAY = 200;
const TEXT_EXT = '.txt';

interface S3Results {
  filePaths: string[];
  continuationToken: string | null;
}

/**
 * Bucket
 *   The bucket class is responsible for loading clip
 *   metadata into the Model from s3.
 */
export default class Bucket {
  private config: CommonVoiceConfig;
  private model: Model;
  private s3: S3;
  private votes: number;
  private validated: number;
  private randomEngine: Random.MT19937;

  constructor(config: CommonVoiceConfig, model: Model, s3: S3) {
    this.config = config;
    this.model = model;
    this.s3 = s3;
    this.votes = 0;
    this.validated = 0;

    this.randomEngine = Random.engines.mt19937();
    this.randomEngine.autoSeed();
  }

  /**
   * Log bucket level messages in a common format.
   */
  private print(...args: any[]) {
    args.unshift('BUCKET --');
    console.log.apply(console, args);
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
        const glob = this.getGlob(key);
        const params = { Bucket: this.config.BUCKET_NAME, Key: key };
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
      Bucket: this.config.BUCKET_NAME,
      Key: key,
    });
  }

  /**
   * Fetches a partial list of file paths from s3.
   */
  private fetchObjects(continuationToken?: string): Promise<S3Results> {
    return new Promise((res, rej) => {
      let awsRequest = this.s3.listObjectsV2({
        Bucket: this.config.BUCKET_NAME,
        MaxKeys: KEYS_PER_REQUEST,
        ContinuationToken: continuationToken,
      });

      awsRequest.on('success', (response: any) => {
        const results: S3Results = {
          filePaths: [],
          continuationToken: response['data']['NextContinuationToken'],
        };

        // Grab all the file paths from the response object.
        let contents = response['data']['Contents'];
        for (let i = 0; i < contents.length; i++) {
          this.model.processFilePath(contents[i].Key);
          results.filePaths.push(contents[i].Key);
        }

        res(results);
      });

      awsRequest.on('error', (err: any) => {
        if (err.code === 'AccessDenied' || err.code === 'CredentialsError') {
          console.error('s3 aws creds not configured properly');
          rej(err);
          return;
        }

        // For other errors like timeout, we trap the error here, and return
        // the same continuation token we were given so that the caller
        // may try again.
        console.error('Error while fetching clip list:', err.code);
        res({
          filePaths: [],
          continuationToken: continuationToken,
        });
      });

      awsRequest.send();
    });
  }

  /**
   * Load sound file metadata into memory.
   */
  async loadCache(): Promise<void> {
    this.print('loading clip data');

    let chunkCount = 0;
    let startLoading = Date.now();

    // Keep processing s3 objects as long as we get a continuationToken.
    let next: string;
    do {
      ++chunkCount;
      const startRequest = Date.now();
      const results = await this.fetchObjects(next);

      const startParsing = Date.now();

      // Print some loading stats.
      let now = Date.now();
      let secondsToLoad = ((startParsing - startRequest) / 1000).toFixed(2);
      let secondsToParse = ((now - startParsing) / 1000).toFixed(2);
      let timeSoFar = ((now - startLoading) / 1000).toFixed(2);
      this.print(
        `${secondsToLoad}s to load, ${secondsToParse}s to parse, ${timeSoFar}s total, ${chunkCount} chunks`
      );

      next = results.continuationToken;
      if (next) {
        // Take a breather in between chunks to handle incoming requests.
        await sleep(LOAD_DELAY);
      }
    } while (next);

    // Output bucket loading metrics.
    let totalTime = ((Date.now() - startLoading) / 1000).toFixed(2);
    this.print(`${totalTime}s to load ${chunkCount} chunks`);

    // Finalize model processing, and print stats.
    this.model.setLoaded();
  }

  /**
   * Grab metadata to play clip on the front end.
   */
  async getRandomClipJson(uid: string): Promise<string> {
    const clip = await this.model.getEllibleClip(uid);
    if (!clip) {
      throw new Error('Could not find any eligible clips for this user');
    }

    let glob, text, path;
    if (clip instanceof Clip) {
      // On the client, the clipid is called 'glob'
      glob = clip.clipid;
      text = clip.sentenceText;
      path = clip.clipPath;

      if (!text) {
        text = await this.fetchSentenceFromS3(glob);
        this.model.addSentenceContent(uid, clip.sentenceid, text);
      }
    } else {
      text = clip.sentence;
      glob = path = clip.path;
    }

    return JSON.stringify({
      glob,
      text,
      sound: this.getPublicUrl(path),
    });
  }
}
