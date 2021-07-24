import * as crypto from 'crypto';
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
import { ClientParameterError, ServerError } from './utility';
import Awards from './model/awards';
import { checkGoalsAfterContribution } from './model/goals';
import { ChallengeToken, challengeTokens } from 'common';

const Transcoder = require('stream-transcoder');
const { Converter } = require('ffmpeg-stream');
const { Readable } = require('stream');

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
    const url = await this.bucket.getClipUrl(params.clip_id);
    if (url) {
      response.redirect(await this.bucket.getClipUrl(params.clip_id));
    } else {
      response.json({});
    }
  };

  saveClipVote = async (
    { client_id, body, params }: Request,
    response: Response
  ) => {
    const id = params.clipId as string;
    const { isValid, challenge } = body;

    if (!id || !client_id) {
      response.statusMessage = 'save_clip_vote_missing_parameter';
      response
        .status(400)
        .send(`Missing parameter: ${id ? 'client_id' : 'clip_id'}.`);
      throw new ClientParameterError();
    }

    const clip = await this.model.db.findClip(id);
    if (!clip) {
      response.statusMessage = 'save_clip_vote_missing_clip';
      response.status(422).send(`Clip not found: ${id}.`);
      throw new ServerError();
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
    const { client_id, headers } = request;
    const sentenceId = headers.sentence_id as string;
    const source = headers.source || 'unidentified';
    const format = headers['content-type'];
    const size = headers['content-length'];

    if (!sentenceId || !client_id) {
      response.statusMessage = 'save_clip_missing_parameter';
      response
        .status(400)
        .send(
          `Missing parameter: ${sentenceId ? 'client_id' : 'sentence_id'}.`
        );
      console.log(`sent headers: ${JSON.stringify(headers)}`);
      throw new ClientParameterError();
    }

    const sentence = await this.model.db.findSentence(sentenceId);
    if (!sentence) {
      response.statusMessage = 'save_clip_missing_sentence';
      response.status(422).send(`Sentence not found: ${sentenceId}.`);
      throw new ServerError();
    }

    // Where is our audio clip going to be located?
    const folder = client_id + '/';
    const filePrefix = sentenceId;
    const clipFileName = folder + filePrefix + '.mp3';

    try {
      // If the folder does not exist, we create it.
      await this.s3
        .putObject({ Bucket: getConfig().CLIP_BUCKET_NAME, Key: folder })
        .promise();

      let audioInput = request;

      if (getConfig().FLAG_BUFFER_STREAM_ENABLED && format.includes('aac')) {
        // aac data comes wrapped in an mpeg container, which is incompatible with
        // ffmpeg's piped stream functions because the moov bit comes at the end of
        // the stream, at which point ffmpeg can no longer seek back to the beginning
        // createBufferedInputStream will create a local file and pipe data in as
        // a file, which doesn't lose the seek mechanism

        const converter = new Converter();
        const audioStream = Readable.from(request);

        audioInput = converter.createBufferedInputStream();
        audioStream.pipe(audioInput);
      }

      const audioOutput = new Transcoder(audioInput)
        .audioCodec('mp3')
        .format('mp3')
        .channels(1)
        .sampleRate(32000)
        .stream();

      await this.s3
        .upload({
          Bucket: getConfig().CLIP_BUCKET_NAME,
          Key: clipFileName,
          Body: audioOutput,
        })
        .promise();

      console.log(
        `clip written to s3 ${clipFileName} (${size} bytes, ${format}) from ${source}`
      );

      await this.model.saveClip({
        client_id: client_id,
        localeId: sentence.locale_id,
        original_sentence_id: sentenceId,
        path: clipFileName,
        sentence: sentence.text,
      });
      await Awards.checkProgress(client_id, { id: sentence.locale_id });

      await checkGoalsAfterContribution(client_id, { id: sentence.locale_id });

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
