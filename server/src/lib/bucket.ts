import { S3 } from 'aws-sdk';
import { getConfig } from '../config-helper';
import Model from './model';
import { Clip, TakeoutRequest } from 'common';
import { PassThrough } from 'stream';
import { ClientClip } from './takeout';

const s3Zip = require('s3-zip');

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
  public getPublicUrl(key: string, bucketType?: string) {
    const {
      ENVIRONMENT,
      DATASET_BUCKET_NAME,
      CLIP_BUCKET_NAME,
      S3_CONFIG,
      S3_LOCAL_DEVELOPMENT_ENDPOINT,
    } = getConfig();

    let url = this.s3.getSignedUrl('getObject', {
      Bucket: bucketType === 'dataset' ? DATASET_BUCKET_NAME : CLIP_BUCKET_NAME,
      Key: key,
      Expires: 60 * 60 * 12,
    });

    if (ENVIRONMENT === 'local') {
      // allow us to access s3proxy files correctly in development
      url = url.replace(
        S3_CONFIG.endpoint.toString(),
        S3_LOCAL_DEVELOPMENT_ENDPOINT
      );
    }

    return url;
  }

  /**
   * Construct the public URL for a resource that needs no token
   */
  public getUnsignedUrl(bucket: string, key: string) {
    const {
      ENVIRONMENT,
      S3_LOCAL_DEVELOPMENT_ENDPOINT,
      CLIP_BUCKET_NAME,
      AWS_REGION,
    } = getConfig();

    if (ENVIRONMENT === 'local') {
      return `${S3_LOCAL_DEVELOPMENT_ENDPOINT}/${CLIP_BUCKET_NAME}/${key}`;
    }

    return `https://${bucket}.s3.dualstack.${AWS_REGION}.amazonaws.com/${key}`;
  }

  /**
   * Delete function for S3 used for removing old avatars
   */
  public async deleteAvatar(client_id: string, url: string) {
    let urlParts = url.split('/');
    if (urlParts.length) {
      const fileName = urlParts[urlParts.length - 1];

      await this.s3
        .deleteObject({
          Bucket: getConfig().CLIP_BUCKET_NAME,
          Key: `${client_id}/${fileName}`,
        })
        .promise();
    }
  }

  /**
   * Check if given file exists
   */
  async fileExists(path: string): Promise<any> {
    return await this.s3
      .headObject({
        Bucket: getConfig().CLIP_BUCKET_NAME,
        Key: path,
      })
      .promise();
  }

  /**
   * Grab metadata to play clip on the front end.
   */
  async getRandomClips(
    client_id: string,
    locale: string,
    count: number
  ): Promise<Clip[]> {
    // Get more clip IDs than are required in case some are broken links or clips
    const clips = await this.model.findEligibleClips(
      client_id,
      locale,
      Math.ceil(count * 1.5)
    );
    const clipPromises: Clip[] = [];

    // Use for instead of .map so that it can break once enough clips are assembled
    for (let i = 0; i < clips.length; i++) {
      const { id, path, sentence, original_sentence_id, taxonomy } = clips[i];

      try {
        const metadata = await this.s3
          .headObject({
            Bucket: getConfig().CLIP_BUCKET_NAME,
            Key: path,
          })
          .promise();

        // if the clip is smaller than 256 bytes it is most likely blank and should be skipped
        if (metadata.ContentLength >= 256) {
          clipPromises.push({
            id: id.toString(),
            glob: path.replace('.mp3', ''),
            sentence: { id: original_sentence_id, text: sentence, taxonomy },
            audioSrc: this.getPublicUrl(path),
          });
        } else {
          console.log(`clip_id ${id} at ${path} is smaller than 256 bytes`);
          await this.model.db.markInvalid(id.toString());
        }

        // this will break either when 10 clips have been retrieved or when 15 have been tried
        // as long as at least 1 clip is returned, the next time the cache refills it will try
        // for another 15
        if (clipPromises.length == count) break;
      } catch (e) {
        console.log(e.message);
        console.log(`aws error retrieving clip_id ${id}`);
        await this.model.db.markInvalid(id.toString());
      }
    }

    return Promise.all(clipPromises);
  }

  takeoutKey(takeout: TakeoutRequest, chunkIndex: number): string {
    return `${takeout.client_id}/takeouts/${takeout.id}/takeout_${takeout.id}_pt_${chunkIndex}.zip`;
  }

  metadataKey(takeout: TakeoutRequest): string {
    return `${takeout.client_id}/takeouts/${takeout.id}/takeout_${takeout.id}_metadata.txt`;
  }

  async zipTakeoutFilesToS3(
    takeout: TakeoutRequest,
    chunkIndex: number,
    paths: string[]
  ): Promise<S3.HeadObjectOutput> {
    const destination = this.takeoutKey(takeout, chunkIndex);

    console.log('start takeout zipping', destination);

    const bucket = getConfig().CLIP_BUCKET_NAME;
    const passThrough = new PassThrough();

    const s3pipe = s3Zip
      .archive(
        { s3: this.s3, bucket },
        '',
        paths,
        paths.map(
          path =>
            `takeout_${takeout.id}_pt_${chunkIndex}/${
              path.split('/').length > 1 ? path.split('/')[1] : path
            }`
        )
      )
      .pipe(passThrough);

    await this.s3
      .upload({
        Bucket: bucket,
        Body: passThrough,
        Key: destination,
        // TODO: enable this, currently bugs out s3proxy
        // Tagging: 'Type=takeout'
      })
      .promise();

    return await this.s3
      .headObject({
        Bucket: bucket,
        Key: destination,
      })
      .promise();
  }

  async uploadClipMetadata(
    takeout: TakeoutRequest,
    clipData: ClientClip[]
  ): Promise<S3.HeadObjectOutput> {
    const fields = ['original_sentence_id', 'sentence', 'locale'];
    const metadataKey = this.metadataKey(takeout);
    let sentenceData = clipData
      .map((clip: any) => fields.map(field => clip[field]).join('\t'))
      .join('\n');
    sentenceData = `${fields.join('\t')}\n${sentenceData}`;
    const bucket = getConfig().CLIP_BUCKET_NAME;

    await this.s3
      .putObject({ Bucket: bucket, Key: metadataKey, Body: sentenceData })
      .promise();

    return await this.s3
      .headObject({
        Bucket: bucket,
        Key: metadataKey,
      })
      .promise();
  }

  getAvatarClipsUrl(path: string) {
    return this.getPublicUrl(path);
  }

  async getClipUrl(id: string): Promise<string> {
    const clip = await this.model.db.findClip(id);
    return clip ? this.getPublicUrl(clip.path) : null;
  }

  /**
   * Delete function for S3 used for removing old avatars
   */
  public async deletePath(path: string) {
    await this.s3
      .deleteObject({
        Bucket: getConfig().CLIP_BUCKET_NAME,
        Key: path,
      })
      .promise();
  }
}
