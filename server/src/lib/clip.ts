import * as crypto from 'crypto';
import { PassThrough } from 'stream';
import { S3 } from 'aws-sdk';
import { NextFunction, Request, Response } from 'express';
const PromiseRouter = require('express-promise-router');
import { getConfig } from '../config-helper';
import { AWS } from './aws';
import Model from './model';
import getLeaderboard from './model/leaderboard';
import { earnBonus, hasEarnedBonus } from './model/achievements';
import * as Basket from './basket';
import Bucket from './bucket';
import { ClientParameterError } from './utility';
import Awards from './model/awards';
import { checkGoalsAfterContribution } from './model/goals';
import { ChallengeToken, challengeTokens } from 'common';

const Transcoder = require('stream-transcoder');

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

    const glob = clip.path.replace('.mp3', '');

    await this.model.db.saveVote(id, client_id, isValid);
    await Awards.checkProgress(client_id, { id: clip.locale_id });
    await checkGoalsAfterContribution(client_id, { id: clip.locale_id });
    // move it to the last line and leave a trace here in case of serious performance issues
    // response.json(ret);

    Basket.sync(client_id).catch(e => console.error(e));
    const ret = challengeTokens.includes(challenge)
      ? {
          glob: glob,
          showFirstContributionToast: await earnBonus('first_contribution', [
            challenge,
            client_id,
          ]),
          hasEarnedSessionToast: await hasEarnedBonus(
            'invite_contribute_same_session',
            client_id,
            challenge
          ),
          showFirstStreakToast: await earnBonus('three_day_streak', [
            client_id,
            client_id,
            challenge,
          ]),
          challengeEnded: await this.model.db.hasChallengeEnded(challenge),
        }
      : { glob };
    response.json(ret);
  };

  /**
   * Save the request body as an audio file.
   * TODO: Check for empty or silent clips before uploading.
   */
  saveClip = async (request: Request, response: Response) => {
    const { client_id, headers, params } = request;
    const sentence = decodeURIComponent(headers.sentence as string);
    const sentenceId = headers.sentence_id;

    if (!client_id || !sentence || !sentenceId) {
      console.log(`sent headers: ${JSON.stringify(headers)}`);
      throw new ClientParameterError();
    }

    // Where is our audio clip going to be located?
    const folder = client_id + '/';
    const filePrefix = sentenceId;
    const clipFileName = folder + filePrefix + '.mp3';

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

      await this.s3
        .upload({
          Bucket: getConfig().BUCKET_NAME,
          Key: clipFileName,
          Body: transcoder.audioCodec('mp3').format('mp3').stream(),
        })
        .promise();

      console.log('clip written to s3', clipFileName);

      await this.model.saveClip({
        client_id: client_id,
        locale: params.locale,
        original_sentence_id: sentenceId,
        path: clipFileName,
        sentence,
      });
      await Awards.checkProgress(client_id, { name: params.locale });

      await checkGoalsAfterContribution(client_id, { name: params.locale });

      Basket.sync(client_id).catch(e => console.error(e));

      const challenge = headers.challenge as ChallengeToken;
      const ret = challengeTokens.includes(challenge)
        ? {
            filePrefix: filePrefix,
            showFirstContributionToast: await earnBonus('first_contribution', [
              challenge,
              client_id,
            ]),
            hasEarnedSessionToast: await hasEarnedBonus(
              'invite_contribute_same_session',
              client_id,
              challenge
            ),
            // can't simply reduce the number of the calls to DB through streak_days in checkGoalsAfterContribution()
            // since the the streak_days may start before the time when user set custom_goals, check to win bonus for each contribution
            showFirstStreakToast: await earnBonus('three_day_streak', [
              client_id,
              client_id,
              challenge,
            ]),
            challengeEnded: await this.model.db.hasChallengeEnded(challenge),
          }
        : { filePrefix };
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
