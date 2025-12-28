import { NextFunction, Request, Response } from 'express'
const PromiseRouter = require('express-promise-router')
import { getConfig } from '../config-helper'
import Model from './model'
import getLeaderboard from './model/leaderboard'
import { earnBonus, hasEarnedBonus } from './model/achievements'
// Basket import removed: currently bulk-mail facility is not supported
// import * as Basket from './basket'
import * as Sentry from '@sentry/node'
import Bucket from './bucket'
import Awards from './model/awards'
import { checkGoalsAfterContribution } from './model/goals'
import {
  ChallengeToken,
  challengeTokens,
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

    router.post('/:clipId/votes', this.saveClipVote)
    router.post('*', this.saveClip)

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
    const compiledError = `save_${type}_error: ${fingerprint}: ${msg}`
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

    if (await this.model.db.clipExists(client_id, sentenceId)) {
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
        console.log(
          `[saveClip] Using buffered input for AAC/MP4 format: ${format}`
        )

        const converter = new Converter()
        const audioStream = Readable.from(request)

        audioInput = converter.createBufferedInputStream()
        audioStream.pipe(audioInput)
      } else if (isAAC) {
        console.log(
          `[saveClip] AAC/MP4 detected but FLAG_BUFFER_STREAM_ENABLED is disabled: ${format}`
        )
      }

      let transcodeJob: Mp3TranscodeJob | null = null
      let durationInMs = 0

      const abortHandler = () => {
        transcodeJob?.abort()
        request.removeListener('aborted', abortHandler)
      }

      request.on('aborted', abortHandler)

      try {
        console.log(`[saveClip] Starting transcode for ${metadata}`)
        transcodeJob = await createMp3TranscodeJob(audioInput)

        // Start streaming upload in parallel for efficiency
        // The upload reads from outputStream as ffmpeg writes to it
        const uploadTask = pipe(
          streamUploadToBucket(getConfig().CLIP_BUCKET_NAME),
          (
            fn: (
              path: string
            ) => (stream: NodeJS.ReadableStream) => TE.TaskEither<Error, void>
          ) => fn(clipFileName)(transcodeJob.outputStream)
        )

        // Get duration (optional - allow null on failure)
        const durationPromise = transcodeJob.durationSeconds.catch(
          (err): null => {
            console.error(
              '[saveClip] Failed to determine clip duration with ffprobe:',
              err
            )
            return null
          }
        )

        // Wait for ALL operations to complete (even if some fail)
        // Using allSettled prevents race condition where we try to delete
        // before upload completes
        const settledResults = await Promise.allSettled([
          pipe(
            uploadTask,
            TE.fold(
              (err: Error) => {
                console.error('[saveClip] Upload to storage failed:', err)
                return T.of(Promise.reject(err))
              },
              () => T.of(Promise.resolve())
            )
          )().then(p => p),
          transcodeJob.transcodeCompleted, // Will reject if transcode fails
          durationPromise, // Returns null on failure, won't reject
        ])

        // Check if any operation failed
        const uploadResult = settledResults[0]
        const transcodeResult = settledResults[1]
        const durationResult = settledResults[2]

        // If transcode failed, we need to clean up
        if (transcodeResult.status === 'rejected') {
          const transcodeError = transcodeResult.reason
          const errorMessage =
            transcodeError instanceof Error
              ? transcodeError.message
              : String(transcodeError ?? 'Unknown error')

          // Check if this is audio corruption vs server error
          const isCorruption =
            errorMessage.includes('Invalid data') ||
            errorMessage.includes('Invalid argument') ||
            errorMessage.includes('pipe:0') ||
            errorMessage.includes('moov atom not found')

          console.error(
            `[saveClip] Transcode failed (corruption=${isCorruption}):`,
            errorMessage
          )

          // Clean up uploaded file if upload succeeded
          if (uploadResult.status === 'fulfilled') {
            console.log(
              `[saveClip] Upload succeeded but transcode failed - cleaning up: ${clipFileName}`
            )
            await pipe(
              deleteFileFromBucket(getConfig().CLIP_BUCKET_NAME)(clipFileName),
              TE.fold(
                (deleteErr: Error) => {
                  console.error(
                    `[saveClip] Failed to delete corrupted file ${clipFileName}:`,
                    deleteErr
                  )
                  return T.of(undefined)
                },
                () => {
                  console.log(
                    `[saveClip] Successfully deleted corrupted file: ${clipFileName}`
                  )
                  return T.of(undefined)
                }
              )
            )()
          } else {
            console.log('[saveClip] Upload also failed - no cleanup needed')
          }

          // Throw error with proper flag for frontend detection
          const error = new Error(
            isCorruption ? ERRORS.AUDIO_CORRUPT : errorMessage
          ) as Error & { isCorruption?: boolean }
          error.isCorruption = isCorruption
          throw error
        }

        // If upload failed but transcode succeeded (network issue)
        if (uploadResult.status === 'rejected') {
          throw uploadResult.reason
        }

        // Get duration from results
        const durationInSec =
          durationResult.status === 'fulfilled' ? durationResult.value : null

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
              () => {
                console.log(
                  `[saveClip] Successfully deleted too-long recording: ${clipFileName}`
                )
                return T.of(undefined)
              }
            )
          )()

          const error = new Error('RECORDING_TOO_LONG') as Error & {
            duration?: number
          }
          error.duration = durationInMs
          throw error
        }

        transcodeJob = null

        console.log(`[saveClip] Clip saved to storage ${metadata}`)

        await this.model.saveClip({
          client_id: client_id,
          localeId: sentence.locale_id,
          original_sentence_id: sentenceId,
          path: clipFileName,
          sentence: sentence.text,
          duration: durationInMs,
        })
        await Awards.checkProgress(client_id, { id: sentence.locale_id })

        await checkGoalsAfterContribution(client_id, {
          id: sentence.locale_id,
        })

        // Basket.sync(client_id).catch(e => console.error(e)) // Commented out: currently bulk-mail facility is not supported

        const challenge = headers.challenge as ChallengeToken
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
              challengeEnded: await this.model.db.hasChallengeEnded(challenge),
            }
          : { filePrefix }
        if (!response.headersSent) {
          response.json(ret)
        }
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
              `Recording too long: ${error.duration}ms (max 17000ms)`,
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
              `${message}`,
              `[ffmpeg] ${fingerprint}`,
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
