import * as Random from 'random-js';
import { S3 } from 'aws-sdk';

import { CommonVoiceConfig } from '../config-helper';
import Model from './model';

/**
 * Bucket
 *   The bucket class is responsible for loading clip
 *   metadata into the Model from s3.
 */
export default class Bucket {
  private config: CommonVoiceConfig;
  private model: Model;
  private s3: S3;
  private randomEngine: Random.MT19937;

  constructor(config: CommonVoiceConfig, model: Model, s3: S3) {
    this.config = config;
    this.model = model;
    this.s3 = s3;

    this.randomEngine = Random.engines.mt19937();
    this.randomEngine.autoSeed();
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
    const clip = await this.model.getEllibleClip(uid);
    if (!clip) {
      throw new Error('Could not find any eligible clips for this user');
    }

    const { path } = clip;

    // We get a 400 from the signed URL without this request
    await this.s3
      .headObject({
        Bucket: this.config.BUCKET_NAME,
        Key: path,
      })
      .promise();

    return JSON.stringify({
      glob: path.replace('.mp3', ''),
      text: clip.sentence,
      sound: this.getPublicUrl(path),
    });
  }
}
