import * as Random from 'random-js';
import { S3 } from 'aws-sdk';

import { CommonVoiceConfig } from '../config-helper';
import Model from './model';
import { ServerError } from './utility';

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
  async getRandomClips(uid: string, count: number): Promise<any[]> {
    const clips = await this.model.getEllibleClips(uid, count);
    if (clips.length == 0) {
      throw new ServerError('Could not find any eligible clips for this user');
    }

    return Promise.all(
      clips.map(async ({ id, path, sentence }) => {
        // We get a 400 from the signed URL without this request
        await this.s3
          .headObject({
            Bucket: this.config.BUCKET_NAME,
            Key: path,
          })
          .promise();

        return {
          id,
          glob: path.replace('.mp3', ''),
          text: sentence,
          sound: this.getPublicUrl(path),
        };
      })
    );
  }
}
