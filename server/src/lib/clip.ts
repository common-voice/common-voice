import * as crypto from 'crypto';
import { PassThrough } from 'stream';
import { S3 } from 'aws-sdk';
import { Request, Response } from 'express';
const PromiseRouter = require('express-promise-router');
import { getConfig } from '../config-helper';
import { AWS } from './aws';
import Model from './model';
import Bucket from './bucket';
import { ClientParameterError } from './utility';

const Transcoder = require('stream-transcoder');

const SALT = '8hd3e8sddFSdfj';

export const hash = (str: string) =>
  crypto
    .createHmac('sha256', SALT)
    .update(str)
    .digest('hex');

/**
 * Clip - Responsibly for saving and serving clips.
 */
export default class Clip {
  private s3: S3;
  private bucket: Bucket;
  private model: Model;

  constructor(model: Model) {
    this.s3 = AWS.getS3();
    this.model = model;
    this.bucket = new Bucket(this.model, this.s3);
  }

  getRouter() {
    const router = PromiseRouter({ mergeParams: true });

    router.post('/:clipId/votes', this.saveClipVote);
    router.post('*', this.saveClip);

    router.get('/validated_hours', this.serveValidatedHoursCount);
    router.get('/daily_count', this.serveDailyCount);
    router.get('/votes/daily_count', this.serveDailyVotesCount);
    router.get('*', this.serveRandomClips);

    return router;
  }

  saveSentence = async (sentence: string) => {
    await this.model.db.insertSentence(hash(sentence), sentence);
  };

  saveClipVote = async (request: Request, response: Response) => {
    const id = request.params.clipId as string;
    const uid = request.headers.uid as string;
    const { isValid } = request.body;

    const clip = await this.model.db.findClip(id);
    if (!clip || !uid) {
      throw new ClientParameterError();
    }

    await this.model.db.saveVote(id, uid, isValid);

    const glob = clip.path.replace('.mp3', '');
    const voteFile = glob + '-by-' + uid + '.vote';

    await this.s3
      .putObject({
        Bucket: getConfig().BUCKET_NAME,
        Key: voteFile,
        Body: isValid.toString(),
      })
      .promise();

    console.log('clip vote written to s3', voteFile);

    response.json(glob);
  };

  /**
   * Save the request body as an audio file.
   */
  saveClip = async (request: Request, response: Response) => {
    const { headers, params } = request;
    const uid = headers.uid as string;
    const sentence = decodeURIComponent(headers.sentence as string);

    if (!uid || !sentence) {
      throw new ClientParameterError();
    }

    // Where is our audio clip going to be located?
    const folder = uid + '/';
    const filePrefix = hash(sentence);
    const clipFileName = folder + filePrefix + '.mp3';
    const sentenceFileName = folder + filePrefix + '.txt';

    // if the folder does not exist, we create it
    await this.s3
      .putObject({ Bucket: getConfig().BUCKET_NAME, Key: folder })
      .promise();

    // If upload was base64, make sure we decode it first.
    let transcoder;
    if ((headers['content-type'] as string).includes('base64')) {
      // If we were given base64, we'll need to concat it all first
      // So we can decode it in the next step.
      const chunks: Buffer[] = [];
      await new Promise(resolve => {
        request.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });
        request.on('end', resolve);
      });

      const passThrough = new PassThrough();
      passThrough.end(Buffer.from(Buffer.concat(chunks).toString(), 'base64'));
      transcoder = new Transcoder(passThrough);
    } else {
      // For non-base64 uploads, we can just stream data.
      transcoder = new Transcoder(request);
    }

    await Promise.all([
      this.s3
        .upload({
          Bucket: getConfig().BUCKET_NAME,
          Key: clipFileName,
          Body: transcoder
            .audioCodec('mp3')
            .format('mp3')
            .stream(),
        })
        .promise(),
      this.s3
        .putObject({
          Bucket: getConfig().BUCKET_NAME,
          Key: sentenceFileName,
          Body: sentence,
        })
        .promise(),
    ]);

    console.log('file written to s3', clipFileName);

    await this.model.saveClip({
      client_id: uid,
      locale: params.locale,
      original_sentence_id: filePrefix,
      path: clipFileName,
      sentence,
      sentenceId: headers.sentence_id,
    });

    response.json(filePrefix);
  };

  serveRandomClips = async (
    { headers, params, query }: Request,
    response: Response
  ): Promise<void> => {
    const uid = headers.uid as string;
    if (!uid) {
      throw new ClientParameterError();
    }

    const clips = await this.bucket.getRandomClips(
      uid,
      params.locale,
      parseInt(query.count, 10) || 1
    );
    response.json(clips);
  };

  serveValidatedHoursCount = async (request: Request, response: Response) => {
    response.json(await this.model.getValidatedHours());
  };

  private serveDailyCount = async (request: Request, response: Response) => {
    response.json(await this.model.db.getDailyClipsCount());
  };

  private serveDailyVotesCount = async (
    request: Request,
    response: Response
  ) => {
    response.json(await this.model.db.getDailyVotesCount());
  };
}
