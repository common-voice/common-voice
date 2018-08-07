import { S3 } from 'aws-sdk';
import { getConfig } from '../config-helper';
import Model from './model';
import { ServerError } from './utility';

/**
 * Bucket
 *   The bucket class is responsible for loading clip
 *   metadata into the Model from s3.
 */
export default class Bucket {
  private model: Model;
  private s3: S3;

  constructor(model: Model, s3: S3) {
    this.model = model;
    this.s3 = s3;
  }

  /**
   * Fetch a public url for the resource.
   */
  private getPublicUrl(key: string) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: getConfig().BUCKET_NAME,
      Key: key,
      Expires: 24 * 60 * 30,
    });
  }

  /**
   * Grab metadata to play clip on the front end.
   */
  async getRandomClips(
    uid: string,
    locale: string,
    count: number
  ): Promise<{ id: number; glob: string; text: string; sound: string }[]> {
    const clips = await this.model.findEligibleClips(uid, locale, count);
    try {
      return await Promise.all(
        clips.map(async ({ id, path, sentence }) => {
          // We get a 400 from the signed URL without this request
          await this.s3
            .headObject({
              Bucket: getConfig().BUCKET_NAME,
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
    } catch (e) {
      console.log('aws error', e, e.stack);
      return [];
    }
  }
}
