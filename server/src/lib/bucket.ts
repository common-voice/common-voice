import * as Random from 'random-js';
import { S3 } from 'aws-sdk';

import { CommonVoiceConfig } from '../config-helper';
import Model from './model';

const TEXT_EXT = '.txt';

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
   * Read a sentence in from s3.
   */
  private fetchSentenceFromS3(glob: string): Promise<string> {
    const key = glob + TEXT_EXT;
    return new Promise(
      (res: (sentence: string) => void, rej: (error: any) => void) => {
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
   * Grab metadata to play clip on the front end.
   */
  async getRandomClipJson(uid: string): Promise<string> {
    const clip = this.model.getEllibleClip(uid);
    if (!clip) {
      throw new Error('Could not find any eligible clips for this user');
    }

    // On the client, the clipid is called 'glob'
    const glob = clip.clipid;

    const clipJson = {
      glob: glob,
      text: clip.sentenceText,
      sound: this.getPublicUrl(clip.clipPath),
    };

    if (!clipJson.text) {
      clipJson.text = await this.fetchSentenceFromS3(glob);
      this.model.addSentenceContent(uid, clip.sentenceid, clipJson.text);
    }

    return JSON.stringify(clipJson);
  }
}
