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
import {
  streamUploadToBucket,
  deleteFileFromBucket,
} from '../infrastructure/storage/storage'
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
const { Readable } = require('stream')

enum ERRORS {
  MISSING_PARAM = 'MISSING_PARAM',
  CLIP_NOT_FOUND = 'CLIP_NOT_FOUND',
  SENTENCE_NOT_FOUND = 'SENTENCE_NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  AUDIO_CORRUPT = 'AUDIO_CORRUPT',
}

/**
 * Clip - Responsibly for saving and serving clips.
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

    // Rate limiting for clip voting: ~600 votes/hour
    // Voting is fast (listen ~3sec + 3sec wait + click)
    // Fast voter: ~10 votes/minute = 600/hour
    // Allows rapid validation sessions while preventing bots
    router.post(
      '/:clipId/votes',
      rateLimiter('clips/vote', {
        points: 100, // 100 votes
        duration: 600, // per 10 minutes (600/hour max)
        blockDuration: 300, // Block for 5 minutes
      }),
      this.saveClipVote
    )

    // Rate limiting for clip recording: Account for retries (bad NW) and batch submissions
    // Flow: 25 sentences loaded => record 5 => submit (5 clips × 2 retries = 10 uploads max)
    // Recording: 1-15 sec/clip (avg 5sec) + UI time => 10sec/clip
    // Batch of 5 clips: ~50 seconds minimum
    // 5 batches (25 clips): ~4-5 minutes minimum
    // Allow 100 uploads per 10 minutes to accommodate:
    // - 5 clips × 2 retries × 5 batches = 50 actual uploads
    // - 2x headroom for legitimate usage patterns
    router.post(
      '*',
      rateLimiter('clips/record', {
        points: 100, // 100 uploads (accounts for 2 retries × 5 clips × 5 batches + 2x headroom)
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
    const client_id = request.session.user.client_id // Guaranteed by middleware
    const sentenceId =
      (headers['sentence-id'] as string) || (headers.sentence_id as string) // TODO: Remove the second case in August 2025
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

    // Where is our audio clip going to be located?
    const folder = client_id + '/'
    const filePrefix = sentenceId
    const clipFileName = folder + filePrefix + '.mp3'
    const metadata = `${clipFileName} (${size} bytes, ${format}) from ${source}`

    // LazySetCache deduplication: Track successful uploads per user for 6 hours
    // Uses per-user SET to efficiently store uploaded sentence IDs
    // Each addition automatically extends the expiry time
    const userUploadsKey = `clip-uploads:${client_id}`

    try {
      // Check if this sentence was already uploaded by this user
      const uploadedSentences = await LazySetCache.getMembers(userUploadsKey)

      if (uploadedSentences.includes(sentenceId)) {
        // Already uploaded - return 409 (handled gracefully on frontend)
        if (process.env.NODE_ENV !== 'production') {
          console.log(
            `[saveClip] Duplicate upload (cached): ${client_id}/${sentenceId}`
          )
        }
        response.status(409).send(ERRORS.ALREADY_EXISTS)
        return
      }
    } catch (cacheError) {
      // Cache unavailable - fail open (allow upload to proceed)
      console.warn(
        '[saveClip] LazySetCache unavailable for deduplication:',
        cacheError
      )
    }

    if (await this.model.db.clipExists(client_id, sentenceId)) {
      // Clip already exists in database but not in Redis LazySetCache
      // This catches cases where:
      // 1. Redis LazySetCache expired (>6h since last upload)
      // 2. Redis is down/unavailable
      // 3. User gets same sentence and clip exists in DB
      // NOTE: This check happens BEFORE upload/transcode, preventing wasted resources

      // Track for monitoring but don't spam Sentry (handled gracefully on frontend)
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `[saveClip] Duplicate detected (DB exists, Redis LazySetCache miss): ${client_id}/${sentenceId}`
        )
      }

      this.clipSaveError(
        headers,
        response,
        409,
        `${clipFileName} already exists`,
        ERRORS.ALREADY_EXISTS,
        'clip'
      )
      return
    } else {
      let audioInput = request

      // Handle AAC/MP4 formats from iOS devices
      // MP4 containers need special handling due to moov atom positioning
      const isAAC = format && (format.includes('aac') || format.includes('mp4'))

      if (getConfig().FLAG_BUFFER_STREAM_ENABLED && isAAC) {
        // aac data comes wrapped in an mpeg container, which is incompatible with
        // ffmpeg's piped stream functions because the moov bit comes at the end of
        // the stream, at which point ffmpeg can no longer seek back to the beginning
        // createBufferedInputStream will create a local file and pipe data in as
        // a file, which doesn't lose the seek mechanism
        if (process.env.NODE_ENV !== 'production') {
          console.log(
            `[saveClip] Using buffered input for AAC/MP4 format: ${format}`
          )
        }

        const converter = new Converter()
        const audioStream = Readable.from(request)

        audioInput = converter.createBufferedInputStream()
        audioStream.pipe(audioInput)
      } else if (isAAC) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(
            `[saveClip] AAC/MP4 detected but FLAG_BUFFER_STREAM_ENABLED is disabled: ${format}`
          )
        }
      }

      let transcodeJob: Mp3TranscodeJob | null = null
      let durationInMs = 0

      const abortHandler = () => {
        transcodeJob?.abort()
        request.removeListener('aborted', abortHandler)
      }

      request.on('aborted', abortHandler)

      try {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[saveClip] Starting transcode for ${metadata}`)
        }
        transcodeJob = await createMp3TranscodeJob(audioInput)

        // We need to buffer to memory during transcode, validate, then upload
        if (process.env.NODE_ENV !== 'production') {
          console.log(
            `[saveClip] Starting transcode with buffering: ${clipFileName}`
          )
        }

        // Buffer the transcoded output to memory
        const chunks: Buffer[] = []
        transcodeJob.outputStream.on('data', chunk => {
          chunks.push(chunk as Buffer)
        })

        // Start duration probe immediately (consume stream in parallel)
        const durationPromise = transcodeJob.durationSeconds.catch(
          (err): null => {
            console.error(
              '[saveClip] Failed to determine clip duration with ffprobe:',
              err
            )
            return null
          }
        )

        // Wait for transcode AND duration probe to complete
        // This validates the audio is not corrupt before uploading
        const [, durationInSec] = await Promise.all([
          transcodeJob.transcodeCompleted,
          durationPromise,
        ])

        if (process.env.NODE_ENV !== 'production') {
          console.log(
            `[saveClip] Transcode validated (duration: ${durationInSec}s), starting upload: ${clipFileName}`
          )
        }

        // Now we can upload the buffered data (we have successful transcode validation)
        const bufferedData = Buffer.concat(chunks)
        const uploadStream = Readable.from([bufferedData])

        const uploadTask = pipe(
          streamUploadToBucket(getConfig().CLIP_BUCKET_NAME),
          (
            fn: (
              path: string
            ) => (stream: NodeJS.ReadableStream) => TE.TaskEither<Error, void>
          ) => fn(clipFileName)(uploadStream)
        )

        const uploadResult = await pipe(
          uploadTask,
          TE.fold(
            (err: Error) => {
              console.error('[saveClip] Upload to storage failed:', err)
              return T.of(Promise.reject(err))
            },
            () => {
              // KEEP: User specifically requested this log remain in production
              console.log(`Successfully uploaded ${clipFileName}`)
              return T.of(Promise.resolve())
            }
          )
        )().then(p => p)

        await uploadResult // Throw if upload failed

        if (process.env.NODE_ENV !== 'production') {
          console.log(
            `[saveClip] Upload completed successfully: ${clipFileName}`
          )
        }

        // Calculate duration for DB
        durationInMs =
          durationInSec != null && Number.isFinite(durationInSec)
            ? Math.round(durationInSec * 1000)
            : 0

        // Validate duration (frontend has 15 second limit + 2s headroom)
        if (durationInMs > MAX_RECORDING_MS_WITH_HEADROOM) {
          console.error(
            `[saveClip] Recording too long: ${durationInMs}ms (max ${MAX_RECORDING_MS_WITH_HEADROOM}ms)`
          )

          // Clean up the uploaded file
          await pipe(
            deleteFileFromBucket(getConfig().CLIP_BUCKET_NAME)(clipFileName),
            TE.fold(
              (deleteErr: Error) => {
                console.error(
                  `[saveClip] Failed to delete too-long recording ${clipFileName}:`,
                  deleteErr
                )
                return T.of(undefined)
              },
              () => T.of(undefined) // Deleted successfully
            )
          )()

          const error = new Error('RECORDING_TOO_LONG') as Error & {
            duration?: number
          }
          error.duration = durationInMs
          throw error
        }

        transcodeJob = null

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
            6 * TimeUnits.HOUR // 6 hours per user's request
          )
        } catch (cacheError) {
          // Non-critical - Cache unavailable
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
                earnBonus('three_day_streak', [
                  client_id,
                  client_id,
                  challenge,
                ]),
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
        transcodeJob?.abort(err instanceof Error ? err : undefined)
        console.error('[saveClip] Clip save failed:', err)

        if (!response.headersSent) {
          const error = err as Error & {
            isCorruption?: boolean
            duration?: number
          }
          const message =
            err instanceof Error ? err.message : String(err ?? 'Unknown error')

          // Check error type using flags (set in try block above)
          if (message === 'RECORDING_TOO_LONG') {
            this.clipSaveError(
              headers,
              response,
              422,
              `Recording too long: ${error.duration}ms (max ${MAX_RECORDING_MS}ms)`,
              'RECORDING_TOO_LONG',
              'clip'
            )
          } else if (message === ERRORS.AUDIO_CORRUPT || error.isCorruption) {
            // Audio corruption - client data issue (422 Unprocessable Entity)
            this.clipSaveError(
              headers,
              response,
              422,
              'Audio data is corrupted or invalid',
              ERRORS.AUDIO_CORRUPT,
              'clip'
            )
          } else {
            // Server error (500 Internal Server Error)
            const fingerprint = message
              .replace(/0x[0-9a-f]+/gi, '<addr>')
              .replace(
                /in stream (\d+):\s*\d+\s*>=\s*\d+/g,
                'in stream $1: <var>'
              )
              .trim()

            this.clipSaveError(
              headers,
              response,
              500,
              'FFmpeg processing failed',
              fingerprint,
              'clip'
            )
          }
        }
      } finally {
        request.removeListener('aborted', abortHandler)
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
