import { NextFunction, Request, Response } from 'express'
const PromiseRouter = require('express-promise-router')
import { getConfig } from '../config-helper'
import Model from './model'
import getLeaderboard from './model/leaderboard'
import { earnBonus, hasEarnedBonus } from './model/achievements'
import rateLimiter from './middleware/rate-limiter-middleware'
// Basket import removed: currently bulk-mail facility is not supported
// import * as Basket from './basket'
import * as Sentry from '@sentry/node'
import Bucket from './bucket'
import Awards from './model/awards'
import { checkGoalsAfterContribution } from './model/goals'
import { LazySetCache } from './redis-cache'
import { TimeUnits } from 'common'
import {
  ChallengeToken,
  challengeTokens,
  MAX_RECORDING_MS,
  MAX_RECORDING_MS_WITH_HEADROOM,
} from 'common'
import validate from './validation'
import { clipsSchema } from './validation/clips'
import { streamUploadToBucket } from '../infrastructure/storage/storage'
import { pipe } from 'fp-ts/lib/function'
import { option as O, taskEither as TE, task as T } from 'fp-ts'
import { Clip as ClientClip } from 'common'
import {
  createMp3TranscodeJob,
  type Mp3TranscodeJob,
} from './ffmpeg-transcoder'
import {
  FindVariantsBySentenceIdsResult,
  findVariantsBySentenceIdsInDb,
} from '../application/repository/variant-repository'
import { StatusCodes } from 'http-status-codes'

const { Converter } = require('ffmpeg-stream')

enum ERRORS {
  MISSING_PARAM = 'MISSING_PARAM',
  CLIP_NOT_FOUND = 'CLIP_NOT_FOUND',
  SENTENCE_NOT_FOUND = 'SENTENCE_NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  AUDIO_CORRUPT = 'AUDIO_CORRUPT',
  RECORDING_TOO_LONG = 'RECORDING_TOO_LONG',
  AUDIO_PAYLOAD_TOO_LARGE = 'AUDIO_PAYLOAD_TOO_LARGE',
}

/**
 * Clip - Responsible for saving and serving clips.
 */
export default class Clip {
  private bucket: Bucket
  private model: Model

  constructor(model: Model) {
    this.model = model
    this.bucket = new Bucket(this.model)
  }

  getRouter() {
    const router = PromiseRouter({ mergeParams: true })

    router.use(
      (
        { session, params }: Request,
        response: Response,
        next: NextFunction
      ) => {
        const { locale } = params
        const { user } = session

        if (user?.client_id && locale) {
          this.model.db
            .saveActivity(user.client_id, locale)
            .catch((error: any) => console.error('activity save error', error))
        }

        next()
      }
    )

    // Voting is fast (listen + click)
    // Fast voter: ~10 votes/minute = 600/hour
    // But if audio is bad, they may vote faster to get a new clip
    // => Rate limiting for clip voting: ~900 votes/hour
    router.post(
      '/:clipId/votes',
      rateLimiter('clips/vote', {
        points: 150, // 150 votes
        duration: 600, // per 10 minutes (900/hour max)
        blockDuration: 300, // Block for 5 minutes
      }),
      this.saveClipVote
    )

    // Rate limiting for clip recording: Account for retries (bad NW)/headroom and batch submissions
    // Usual scripter sends 1 per second, so we must set it below that.
    // Flow: 25 sentences loaded => record 5 => submit 5
    // Recording: 1-15 sec/clip (avg 5sec) + UI time => 10sec/clip
    // Batch of 5 clips: ~50 seconds
    // 5 batches (25 clips): ~4+ minutes
    // => Allow 70 uploads per 10 minutes (7 uploads/minute, 420 uploads/hour < 600))
    router.post(
      '*',
      rateLimiter('clips/record', {
        points: 70, // 70 uploads
        duration: 600, // per 10 minutes
        blockDuration: 300, // Block for 5 minutes
      }),
      this.saveClip
    )

    router.get('/daily_count', this.serveDailyCount)
    router.get('/stats', this.serveClipsStats)
    router.get('/leaderboard', this.serveClipLeaderboard)
    router.get('/votes/leaderboard', this.serveVoteLeaderboard)
    router.get('/voices', this.serveVoicesStats)
    router.get('/votes/daily_count', this.serveDailyVotesCount)
    router.get('/:clip_id', this.serveClip)
    router.get('*', validate({ query: clipsSchema }), this.serveRandomClips)

    return router
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
    const compiledError = msg
      ? `save_${type}_error: ${fingerprint}: ${msg}`
      : `save_${type}_error: ${fingerprint}`
    response.status(status).send(compiledError)

    Sentry.withScope(scope => {
      // group errors together based on their request and response
      scope.setFingerprint([`save_${type}_error`, fingerprint])
      Sentry.captureEvent({ request: { headers }, message: compiledError })
    })
  }

  serveClip = async ({ params }: Request, response: Response) => {
    const url = await this.bucket.getClipUrl(params.clip_id)
    if (url) {
      response.redirect(await this.bucket.getClipUrl(params.clip_id))
    } else {
      response.json({})
    }
  }

  saveClipVote = async (
    { session: { user }, body, params, headers }: Request,
    response: Response
  ) => {
    const client_id = user.client_id // Guaranteed by middleware
    const id = params.clipId as string
    const { isValid, challenge } = body

    if (!id) {
      this.clipSaveError(
        headers,
        response,
        400,
        'missing parameter: clip_id',
        ERRORS.MISSING_PARAM,
        'vote'
      )
      return
    }

    const clip = await this.model.db.findClip(id)
    if (!clip) {
      this.clipSaveError(
        headers,
        response,
        422,
        `clip not found`,
        ERRORS.CLIP_NOT_FOUND,
        'vote'
      )
      return
    }

    const glob = clip.path.replace('.mp3', '')

    await this.model.db.saveVote(id, client_id, isValid)
    await Awards.checkProgress(client_id, { id: clip.locale_id })
    await checkGoalsAfterContribution(client_id, { id: clip.locale_id })
    // move it to the last line and leave a trace here in case of serious performance issues
    // response.json(ret);

    // Basket.sync(client_id).catch(e => console.error(e)) // Commented out: currently bulk-mail facility is not supported
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
      : { glob }
    response.json(ret)
  }

  /**
   * Save the request body as an audio file.
   * Ensure errors from this function include the term save_clip_error
   * to be easily parsed from other errors
   */
  saveClip = async (request: Request, response: Response) => {
    const { headers } = request
    const client_id = request.session.user.client_id
    const sentenceId =
      (headers['sentence-id'] as string) || (headers.sentence_id as string)
    const source = headers.source || 'unidentified'
    const format = headers['content-type']
    const size = headers['content-length']

    if (!sentenceId) {
      this.clipSaveError(
        headers,
        response,
        400,
        'missing parameter: sentence_id',
        ERRORS.MISSING_PARAM,
        'clip'
      )
      return
    }

    const sentence = await this.model.db.findSentence(sentenceId)
    if (!sentence) {
      this.clipSaveError(
        headers,
        response,
        422,
        `sentence not found`,
        ERRORS.SENTENCE_NOT_FOUND,
        'clip'
      )
      return
    }

    const folder = client_id + '/'
    const filePrefix = sentenceId
    const clipFileName = folder + filePrefix + '.mp3'
    const metadata = `${clipFileName} (${size} bytes, ${format}) from ${source}`

    const userUploadsKey = `clip-uploads:${client_id}`

    try {
      const isDuplicateUpload = await LazySetCache.isMember(
        userUploadsKey,
        sentenceId
      )

      if (isDuplicateUpload) {
        console.log(`[saveClip] Duplicate upload (cached): ${clipFileName}`)
        return response.json({ filePrefix: sentenceId })
      }
    } catch (cacheError) {
      console.warn(
        '[saveClip] LazySetCache unavailable for deduplication:',
        cacheError
      )
    }

    if (await this.model.db.clipExists(client_id, sentenceId)) {
      console.log(`[saveClip] Duplicate detected from DB: ${clipFileName}`)
      return response.json({ filePrefix: sentenceId })
    }

    let audioInput: NodeJS.ReadableStream = request

    // Handle AAC/MP4 formats from iOS devices
    // MP4 containers need special handling due to moov atom positioning
    const normalized = format.toLowerCase().trim() || ''
    const isAAC =
      !normalized || // with new FE code we should not get this case anymore, but keep for safety
      normalized.startsWith('audio/mp4') ||
      normalized.startsWith('audio/x-m4a') ||
      normalized.startsWith('audio/m4a') ||
      normalized === 'audio/aac' ||
      normalized.startsWith('audio/aac;') ||
      normalized.includes('mp4a') ||
      normalized === 'application/octet-stream' // re-added (some Apple devices send this generic type)

    if (getConfig().FLAG_BUFFER_STREAM_ENABLED && isAAC) {
      // AAC data comes wrapped in an MPEG container, which is incompatible with
      // ffmpeg's piped stream functions because the moov atom comes at the end of
      // the stream. At that point, ffmpeg can no longer seek back to the beginning.
      // createBufferedInputStream creates a local file and pipes data in as
      // a file, which doesn't lose the seek mechanism.
      console.log(
        `[saveClip] AAC/MP4 detected - Using buffered input: ${format} for ${clipFileName}`
      )

      const { Converter } = require('ffmpeg-stream')
      const { Readable } = require('stream')
      const converter = new Converter()
      const audioStream = Readable.from(request)

      audioInput = converter.createBufferedInputStream()
      audioStream.pipe(audioInput)
    } else if (isAAC) {
      console.log(
        `[saveClip] AAC/MP4 detected - FLAG_BUFFER_STREAM_ENABLED=false: ${format} for ${clipFileName}`
      )
    }

    let transcodeJob: Mp3TranscodeJob | null = null

    try {
      if (!getConfig().PROD) {
        console.log(`[saveClip] Starting transcode for ${metadata}`)
      }

      // Create transcode job
      transcodeJob = await createMp3TranscodeJob(audioInput)

      // Attach error handlers to promises
      const transcodePromise = transcodeJob.transcodeCompleted
      const durationPromise = transcodeJob.durationSeconds.catch(() => null)

      // Stream upload
      const uploadTask = pipe(
        streamUploadToBucket(getConfig().CLIP_BUCKET_NAME),
        (
          fn: (
            path: string
          ) => (stream: NodeJS.ReadableStream) => TE.TaskEither<Error, void>
        ) => fn(clipFileName)(transcodeJob.outputStream)
      )

      const uploadPromise = pipe(
        uploadTask,
        TE.fold(
          (err: Error) => T.of(Promise.reject(err)),
          () => T.of(Promise.resolve())
        )
      )()

      // Wait for all three operations
      const [uploadResult, , durationInSec] = await Promise.all([
        uploadPromise.then(p => p),
        transcodePromise,
        durationPromise,
      ])

      await uploadResult

      const durationInMs =
        durationInSec != null && Number.isFinite(durationInSec)
          ? Math.round(durationInSec * 1000)
          : 0

      // Validate duration if available
      if (
        durationInSec != null &&
        durationInMs > MAX_RECORDING_MS_WITH_HEADROOM
      ) {
        console.error(
          `[saveClip] Recording too long: ${durationInMs}ms (max ${MAX_RECORDING_MS_WITH_HEADROOM}ms)`
        )
        const error = new Error(ERRORS.RECORDING_TOO_LONG) as Error & {
          duration?: number
        }
        error.duration = durationInMs
        throw error
      }

      if (!getConfig().PROD) {
        console.log(
          `[saveClip] Upload successful: ${clipFileName} (duration: ${durationInSec}s)`
        )
      }

      transcodeJob = null

      // Save to DB
      await this.model.saveClip({
        client_id: client_id,
        localeId: sentence.locale_id,
        original_sentence_id: sentenceId,
        path: clipFileName,
        sentence: sentence.text,
        duration: durationInMs,
      })

      // Store success in LazySetCache (6 hour TTL) for deduplication
      // Per-user SET stores all uploaded sentence IDs
      // Auto-extends expiry on each addition (rolling 6h window)
      try {
        await LazySetCache.addSingleWithExpiry(
          userUploadsKey,
          sentenceId,
          6 * TimeUnits.HOUR
        )
      } catch (cacheError) {
        console.warn(
          '[saveClip] LazySetCache unavailable for success caching:',
          cacheError
        )
      }

      // FAST RESPONSE: Send immediately after DB insert (reduces timeout window)
      // Background processing of awards/bonuses prevents VPN/firewall drops
      if (!response.headersSent) {
        response.json({ filePrefix })
      }

      // Process awards and bonuses in background (don't block response)
      const challenge = headers.challenge as ChallengeToken
      Promise.all([
        Awards.checkProgress(client_id, { id: sentence.locale_id }),
        checkGoalsAfterContribution(client_id, { id: sentence.locale_id }),
        // Bonus queries only if challenge token present
        challengeTokens.includes(challenge)
          ? Promise.all([
              earnBonus('first_contribution', [challenge, client_id]),
              hasEarnedBonus(
                'invite_contribute_same_session',
                client_id,
                challenge
              ),
              earnBonus('three_day_streak', [client_id, client_id, challenge]),
              this.model.db.hasChallengeEnded(challenge),
            ])
          : Promise.resolve([false, false, false, true]),
      ]).catch(err => {
        console.error(
          '[saveClip] Background award/bonus processing failed:',
          err
        )
        Sentry.captureException(err, {
          tags: { context: 'background-bonus-processing' },
          extra: { client_id, sentenceId, challenge },
        })
      })
      // Basket.sync(client_id).catch(e => console.error(e)) // Commented out: currently bulk-mail facility is not supported
    } catch (err) {
      // Clean up on error
      if (transcodeJob) {
        transcodeJob.abort(err instanceof Error ? err : undefined)
      }

      console.error('[saveClip] Clip save failed:', err)

      if (!response.headersSent) {
        const error = err as Error & {
          isCorruption?: boolean
          duration?: number
          isSystemKill?: boolean
        }
        const message =
          err instanceof Error ? err.message : String(err ?? 'Unknown error')

        let reason = 'UNKNOWN'
        let details = {}
        let isServerError = false

        // Categorize errors
        if (
          message.includes('SIGKILL') ||
          message.includes('SIGTERM') ||
          message.includes('killed') ||
          error.isSystemKill
        ) {
          reason = 'SERVER_OOM_KILL'
          isServerError = true
          details = {
            error: 'Server ran out of memory during processing',
            suggestion: 'Please try again in a moment',
          }
        } else if (message === ERRORS.RECORDING_TOO_LONG) {
          reason = 'TOO_LONG'
          details = {
            duration_ms: error.duration,
            max_ms: MAX_RECORDING_MS_WITH_HEADROOM,
          }
        } else if (
          error.isCorruption ||
          message.includes('Invalid data found') ||
          message.includes('could not find codec parameters') ||
          message.includes('moov atom not found')
        ) {
          reason = 'CORRUPT_DATA'
          details = { error: 'Audio file is corrupt or unsupported' }
        } else {
          reason = 'PROCESSING_FAILED'
          isServerError = true
          details = { error: message }
        }

        // Log to Sentry
        Sentry.withScope(scope => {
          if (isServerError) {
            scope.setFingerprint(['save_clip_error', 'SERVER_ERROR', reason])
          } else {
            scope.setFingerprint(['save_clip_error', 'AUDIO_CORRUPT', reason])
          }
          scope.setExtra('error_details', details)
          scope.setExtra('metadata', metadata)
          scope.setExtra('client_id', client_id)
          Sentry.captureMessage(
            `save_clip_error: ${
              isServerError ? 'SERVER_ERROR' : 'AUDIO_CORRUPT'
            }: ${reason}`
          )
        })

        // Return appropriate status
        if (isServerError) {
          this.clipSaveError(
            headers,
            response,
            500,
            'Server processing error',
            'SERVER_ERROR',
            'clip'
          )
        } else {
          this.clipSaveError(
            headers,
            response,
            422,
            `Audio processing failed: ${reason}`,
            ERRORS.AUDIO_CORRUPT,
            'clip'
          )
        }
      }
    }
  }

  serveRandomClips = async (request: Request, response: Response) => {
    const client_id = request.session.user.client_id // Guaranteed by middleware
    const { locale } = request.params
    const ignoreClientVariant =
      Boolean(request.query.ignoreClientVariant) || false
    const count = Number(request.query.count) || 1
    const clips = await this.bucket
      .getRandomClips(client_id, locale, count, ignoreClientVariant)
      .then(this.appendMetadata)

    response.json(clips)
  }

  private appendMetadata = async (clips: ClientClip[]) => {
    if (clips.length === 0) return []
    const sentenceIds = clips.map(c => c.sentence.id)

    const sentenceVariants = await pipe(
      sentenceIds,
      findVariantsBySentenceIdsInDb,
      TE.getOrElse(err => {
        console.log(err)
        return T.of({} as FindVariantsBySentenceIdsResult)
      })
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
    response.json(await this.model.db.getDailyClipsCount(request.params.locale))
  }

  serveDailyVotesCount = async (request: Request, response: Response) => {
    response.json(await this.model.db.getDailyVotesCount(request.params.locale))
  }

  serveClipsStats = async ({ params }: Request, response: Response) => {
    response.json(await this.model.getClipsStats(params.locale))
  }

  serveVoicesStats = async ({ params }: Request, response: Response) => {
    response.json(await this.model.getVoicesStats(params.locale))
  }

  serveClipLeaderboard = async (request: Request, response: Response) => {
    const { client_id } = request?.session?.user || {}
    if (!client_id) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }
    const { locale } = request.params
    const cursor = this.getCursorFromQuery(request)

    try {
      const leaderboard = await getLeaderboard({
        dashboard: 'stats',
        type: 'clip',
        client_id,
        cursor,
        locale: locale,
      })
      response.json(leaderboard)
    } catch (error) {
      // Handle case where data is being refreshed by another pod
      if (
        error instanceof Error &&
        error.name === 'DataRefreshInProgressError'
      ) {
        return response.status(StatusCodes.SERVICE_UNAVAILABLE).json({
          error: 'REFRESH_IN_PROGRESS',
          message: error.message,
        })
      }
      // Re-throw other errors to be handled by Express error handler
      throw error
    }
  }

  serveVoteLeaderboard = async (request: Request, response: Response) => {
    const { client_id } = request?.session?.user || {}

    if (!client_id) {
      return response.sendStatus(StatusCodes.BAD_REQUEST)
    }

    const { locale } = request.params

    const cursor = this.getCursorFromQuery(request)

    try {
      const leaderboard = await getLeaderboard({
        dashboard: 'stats',
        type: 'vote',
        client_id,
        cursor,
        locale: locale,
      })
      response.json(leaderboard)
    } catch (error) {
      // Handle case where data is being refreshed by another pod
      if (
        error instanceof Error &&
        error.name === 'DataRefreshInProgressError'
      ) {
        return response.status(StatusCodes.SERVICE_UNAVAILABLE).json({
          error: 'REFRESH_IN_PROGRESS',
          message: error.message,
        })
      }
      // Re-throw other errors to be handled by Express error handler
      throw error
    }
  }

  private getCursorFromQuery(request: Request) {
    const { cursor } = request.query

    if (!cursor || typeof cursor !== 'string') {
      return null
    }

    return JSON.parse(cursor)
  }
}
