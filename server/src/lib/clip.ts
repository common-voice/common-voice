import { NextFunction, Request, Response } from 'express';
const PromiseRouter = require('express-promise-router');
import { getConfig } from '../config-helper';
import Model from './model';
import getLeaderboard from './model/leaderboard';
import { earnBonus, hasEarnedBonus } from './model/achievements';
import * as Basket from './basket';
import * as Sentry from '@sentry/node';
import Bucket from './bucket';
import Awards from './model/awards';
import { checkGoalsAfterContribution } from './model/goals';
import { ChallengeToken, challengeTokens } from 'common';
import validate from './validation';
import { clipsSchema } from './validation/clips';
import { streamUploadToBucket } from '../infrastructure/storage/storage';
import { pipe } from 'fp-ts/lib/function';
import { option as O, taskEither as TE, task as T, identity as Id } from 'fp-ts';
import { Clip as ClientClip } from 'common';
import { FindVariantsBySentenceIdsResult, findVariantsBySentenceIdsInDb } from '../application/repository/variant-repository';

const { promisify } = require('util');
const Transcoder = require('stream-transcoder');
const { Converter } = require('ffmpeg-stream');
const { Readable, PassThrough } = require('stream');
const mp3Duration = require('mp3-duration');
const calcMp3Duration = promisify(mp3Duration);

enum ERRORS {
  MISSING_PARAM = 'MISSING_PARAM',
  CLIP_NOT_FOUND = 'CLIP_NOT_FOUND',
  SENTENCE_NOT_FOUND = 'SENTENCE_NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
}

/**
 * Clip - Responsibly for saving and serving clips.
 */
export default class Clip {
  private bucket: Bucket;
  private model: Model;

  constructor(model: Model) {
    this.model = model;
    this.bucket = new Bucket(this.model);
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

    router.get('/daily_count', this.serveDailyCount);
    router.get('/stats', this.serveClipsStats);
    router.get('/leaderboard', this.serveClipLeaderboard);
    router.get('/votes/leaderboard', this.serveVoteLeaderboard);
    router.get('/voices', this.serveVoicesStats);
    router.get('/votes/daily_count', this.serveDailyVotesCount);
    router.get('/:clip_id', this.serveClip);
    router.get('*', validate({ query: clipsSchema }), this.serveRandomClips);

    return router;
  }

  /*
   * Helper function to send error message to client, and save to Sentry
   * defaults to save_clip_error
   */
  clipSaveError(
    headers: any,
    response: Response,
    status: number,
    msg: string,
    fingerprint: string,
    type: 'vote' | 'clip'
  ) {
    const compiledError = `save_${type}_error: ${fingerprint}: ${msg}`;
    response.status(status).send(compiledError);

    Sentry.withScope(scope => {
      // group errors together based on their request and response
      scope.setFingerprint([`save_${type}_error`, fingerprint]);
      Sentry.captureEvent({ request: { headers }, message: compiledError });
    });
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
    { client_id, body, params, headers }: Request,
    response: Response
  ) => {
    const id = params.clipId as string;
    const { isValid, challenge } = body;

    if (!id || !client_id) {
      this.clipSaveError(
        headers,
        response,
        400,
        `missing parameter: ${id ? 'client_id' : 'clip_id'}`,
        ERRORS.MISSING_PARAM,
        'vote'
      );
      return;
    }

    const clip = await this.model.db.findClip(id);
    if (!clip) {
      this.clipSaveError(
        headers,
        response,
        422,
        `clip not found`,
        ERRORS.CLIP_NOT_FOUND,
        'vote'
      );
      return;
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
   * Ensure errors from this function include the term save_clip_error
   * to be easily parsed from other errors
   */
  saveClip = async (request: Request, response: Response) => {
    const { client_id, headers } = request;
    const sentenceId = headers.sentence_id as string;
    const source = headers.source || 'unidentified';
    const format = headers['content-type'];
    const size = headers['content-length'];

    if (!sentenceId || !client_id) {
      this.clipSaveError(
        headers,
        response,
        400,
        `missing parameter: ${sentenceId ? 'client_id' : 'sentence_id'}`,
        ERRORS.MISSING_PARAM,
        'clip'
      );
      return;
    }

    const sentence = await this.model.db.findSentence(sentenceId);
    if (!sentence) {
      this.clipSaveError(
        headers,
        response,
        422,
        `sentence not found`,
        ERRORS.SENTENCE_NOT_FOUND,
        'clip'
      );
      return;
    }

    // Where is our audio clip going to be located?
    const folder = client_id + '/';
    const filePrefix = sentenceId;
    const clipFileName = folder + filePrefix + '.mp3';
    const metadata = `${clipFileName} (${size} bytes, ${format}) from ${source}`;

    if (await this.model.db.clipExists(client_id, sentenceId)) {
      this.clipSaveError(
        headers,
        response,
        204,
        `${clipFileName} already exists`,
        ERRORS.ALREADY_EXISTS,
        'clip'
      );
      return;
    } else {
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

      const pass = new PassThrough();

      let chunks: any = [];

      pass.on('error', (error: string) => {
        this.clipSaveError(
          headers,
          response,
          500,
          `${error}`,
          `ffmpeg ${error}`,
          'clip'
        );
        return;
      })
      pass.on('data', function(chunk: any) {
        chunks.push(chunk);
      });
      pass.on('finish', async () => {
        const buffer = Buffer.concat(chunks);
        const durationInSec = await calcMp3Duration(buffer);

        console.log(`clip written to s3 ${metadata}`);

        await this.model.saveClip({
          client_id: client_id,
          localeId: sentence.locale_id,
          original_sentence_id: sentenceId,
          path: clipFileName,
          sentence: sentence.text,
          duration: durationInSec * 1000,
        });
        await Awards.checkProgress(client_id, { id: sentence.locale_id });

        await checkGoalsAfterContribution(client_id, {
          id: sentence.locale_id,
        });

        Basket.sync(client_id).catch(e => console.error(e));

        const challenge = headers.challenge as ChallengeToken;
        const ret = challengeTokens.includes(challenge)
          ? {
            filePrefix: filePrefix,
            showFirstContributionToast: await earnBonus(
              'first_contribution',
              [challenge, client_id]
            ),
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
            challengeEnded: await this.model.db.hasChallengeEnded(
              challenge
            ),
          }
          : { filePrefix };
        response.json(ret);
      })

      const audioOutput = new Transcoder(audioInput)
        .audioCodec('mp3')
        .format('mp3')
        .channels(1)
        .sampleRate(32000)
        .stream()
        .pipe(pass);

      await pipe(
        streamUploadToBucket,
        Id.ap(getConfig().CLIP_BUCKET_NAME),
        Id.ap(clipFileName),
        Id.ap(audioOutput),
        TE.getOrElse((err: Error) => T.of(console.log(err)))
      )()
    }
  };

  serveRandomClips = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    const { client_id, params } = request;

    const count = Number(request.query.count) || 1;
    const clips = await this.bucket.getRandomClips(
      client_id,
      params.locale,
      count
    ).then(this.appendMetadata);

    response.json(clips);
  };

  private appendMetadata = async (clips: ClientClip[]) => {
    const sentenceIds = clips.map(c => c.sentence.id);

    const sentenceVariants = await pipe(
      sentenceIds,
      findVariantsBySentenceIdsInDb,
      TE.getOrElse(() => T.of({} as FindVariantsBySentenceIdsResult))
    )()

    for (const clip of clips) {
      const sentenceId = clip.sentence.id
      const variant = sentenceVariants[sentenceId] || O.none
      clip.sentence.variant = pipe(
        variant,
        O.getOrElse(() => null)
      )
    }

    return clips
  }

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

  serveClipLeaderboard = async (request: Request, response: Response) => {
    const { client_id, params } = request;
    const cursor = this.getCursorFromQuery(request);
    const leaderboard = await getLeaderboard({
      dashboard: 'stats',
      type: 'clip',
      client_id,
      cursor,
      locale: params.locale,
    });
    response.json(leaderboard);
  };

  serveVoteLeaderboard = async (request: Request, response: Response) => {
    const { client_id, params } = request;
    const cursor = this.getCursorFromQuery(request);
    const leaderboard = await getLeaderboard({
      dashboard: 'stats',
      type: 'vote',
      client_id,
      cursor,
      locale: params.locale,
    });
    response.json(leaderboard);
  };

  private getCursorFromQuery(request: Request) {
    const { cursor } = request.query;

    if (!cursor || typeof cursor !== 'string') {
      return null;
    }

    return JSON.parse(cursor);
  }
}
