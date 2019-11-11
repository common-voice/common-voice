import * as crypto from 'crypto';
import { PassThrough } from 'stream';
import { S3 } from 'aws-sdk';
import { NextFunction, Request, Response } from 'express';
const PromiseRouter = require('express-promise-router');
import { getConfig } from '../config-helper';
import { AWS } from './aws';
import Model from './model';
import getLeaderboard from './model/leaderboard';
import Achievements from './model/achievements';
import * as Basket from './basket';
import Bucket from './bucket';
import { ClientParameterError } from './utility';
import Awards from './model/awards';
import { checkGoalsAfterContribution } from './model/goals';
import { ChallengeToken } from 'common/challenge';

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

    router.use(
      (
        { client_id, params }: Request,
        response: Response,
        next: NextFunction
      ) => {
        const { locale } = params;

        if (client_id && locale) {
          this.model.db
            .saveActivity(client_id, locale)
            .catch((error: any) => console.error('activity save error', error));
        }

        next();
      }
    );

    router.post('/:clipId/votes', this.saveClipVote);
    router.post('*', this.saveClip);

    router.get('/validated_hours', this.serveValidatedHoursCount);
    router.get('/daily_count', this.serveDailyCount);
    router.get('/stats', this.serveClipsStats);
    router.get('/leaderboard', this.serveClipLeaderboard);
    router.get('/votes/leaderboard', this.serveVoteLeaderboard);
    router.get('/voices', this.serveVoicesStats);
    router.get('/votes/daily_count', this.serveDailyVotesCount);
    router.get('/:clip_id', this.serveClip);
    router.get('*', this.serveRandomClips);

    return router;
  }

  serveClip = async ({ params }: Request, response: Response) => {
    response.redirect(await this.bucket.getClipUrl(params.clip_id));
  };

  saveClipVote = async (
    { client_id, body, params }: Request,
    response: Response
  ) => {
    const id = params.clipId as string;
    const { isValid, challenge } = body;

    const clip = await this.model.db.findClip(id);
    if (!clip || !client_id) {
      throw new ClientParameterError();
    }

    await this.model.db.saveVote(id, client_id, isValid);
    await Awards.checkProgress(client_id, { id: clip.locale_id });

    const glob = clip.path.replace('.mp3', '');
    const voteFile = glob + '-by-' + client_id + '.vote';

    await this.s3
      .putObject({
        Bucket: getConfig().BUCKET_NAME,
        Key: voteFile,
        Body: isValid.toString(),
      })
      .promise();

    console.log('clip vote written to s3', voteFile);

    const ret = {
      glob: glob,
      firstContribute: await Achievements.earnBonus('first_contribution', [
        challenge,
        client_id,
      ]),
      hasAchieved: await Achievements.hasEarnedBonus(
        'invite_contribute_same_session',
        client_id,
        challenge
      ),
      firstStreak: await checkGoalsAfterContribution(
        client_id,
        { id: clip.locale_id },
        challenge
      ),
    };
    // move it to the last line and leave a trace here in case of serious performance issues
    // response.json(ret);

    Basket.sync(client_id).catch(e => console.error(e));
    response.json(ret);
  };

  /**
   * Save the request body as an audio file.
   */
  saveClip = async (request: Request, response: Response) => {
    const { client_id, headers, params } = request;
    const sentence = decodeURIComponent(headers.sentence as string);

    if (!client_id || !sentence) {
      throw new ClientParameterError();
    }

    // Where is our audio clip going to be located?
    const folder = client_id + '/';
    const filePrefix = hash(sentence);
    const clipFileName = folder + filePrefix + '.mp3';
    const sentenceFileName = folder + filePrefix + '.txt';

    // if the folder does not exist, we create it
    try {
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
        passThrough.end(
          Buffer.from(Buffer.concat(chunks).toString(), 'base64')
        );
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
        client_id: client_id,
        locale: params.locale,
        original_sentence_id: filePrefix,
        path: clipFileName,
        sentence,
        sentenceId: headers.sentence_id,
      });
      await Awards.checkProgress(client_id, { name: params.locale });

      const challenge = headers.challenge as ChallengeToken;
      const firstStreak = await checkGoalsAfterContribution(
        client_id,
        { name: params.locale },
        challenge
      );
      Basket.sync(client_id).catch(e => console.error(e));

      const ret = {
        filePrefix: filePrefix,
        firstContribute: await Achievements.earnBonus('first_contribution', [
          challenge,
          client_id,
        ]),
        hasAchieved: await Achievements.hasEarnedBonus(
          'invite_contribute_same_session',
          client_id,
          challenge
        ),
        firstStreak: firstStreak,
      };
      response.json(ret);
    } catch (error) {
      console.error(error);
      response.statusCode = error.statusCode || 500;
      response.statusMessage = 'save_clip_error';
      response.json(error);
    }
  };

  serveRandomClips = async (
    { client_id, params, query }: Request,
    response: Response
  ): Promise<void> => {
    const clips = await this.bucket.getRandomClips(
      client_id,
      params.locale,
      parseInt(query.count, 10) || 1
    );
    response.json(clips);
  };

  serveValidatedHoursCount = async (request: Request, response: Response) => {
    response.json(await this.model.getValidatedHours());
  };

  serveDailyCount = async (request: Request, response: Response) => {
    response.json(
      await this.model.db.getDailyClipsCount(request.params.locale)
    );
  };

  serveDailyVotesCount = async (request: Request, response: Response) => {
    response.json(
      await this.model.db.getDailyVotesCount(request.params.locale)
    );
  };

  serveClipsStats = async ({ params }: Request, response: Response) => {
    response.json(await this.model.getClipsStats(params.locale));
  };

  serveVoicesStats = async ({ params }: Request, response: Response) => {
    response.json(await this.model.getVoicesStats(params.locale));
  };

  serveClipLeaderboard = async (
    { client_id, params, query }: Request,
    response: Response
  ) => {
    response.json(
      await getLeaderboard({
        dashboard: 'stats',
        type: 'clip',
        client_id,
        cursor: query.cursor ? JSON.parse(query.cursor) : null,
        locale: params.locale,
      })
    );
  };

  serveVoteLeaderboard = async (
    { client_id, params, query }: Request,
    response: Response
  ) => {
    response.json(
      await getLeaderboard({
        dashboard: 'stats',
        type: 'vote',
        client_id,
        cursor: query.cursor ? JSON.parse(query.cursor) : null,
        locale: params.locale,
      })
    );
  };
}
