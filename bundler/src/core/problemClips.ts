import * as fs from 'node:fs'
import * as path from 'node:path'

import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { constVoid, pipe } from 'fp-ts/lib/function'

import { AppEnv, ProblemClipReason } from '../types'
import {
  CLIP_DURATION_WARN_MS,
  MAX_AUDIO_DURATION_MS,
  MIN_AUDIO_DURATION_MS,
  RELEASE_LOG_KEY_TTL_SEC,
  redisKeys,
} from '../config/config'
import { redisClient } from '../infrastructure/redis'
import { logger } from '../infrastructure/logger'

// ---------------------------------------------------------------------------
// runFilterProblemClips
// ---------------------------------------------------------------------------

/**
 * Full-release step that reads `clip_durations.tsv`, classifies each clip,
 * accumulates problem clips into `env.problemClips`, rewrites `clips.tsv` to
 * remove EXCLUDED clips, and returns the corrected total duration (raw minus
 * the sum of TOO_LONG clip durations).
 *
 * No-op for delta and statistics releases (returns rawDurationInMs unchanged).
 */
export const runFilterProblemClips = (
  rawDurationInMs: number,
): RTE.ReaderTaskEither<AppEnv, Error, number> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ type, locale, releaseDirPath, problemClips }) => {
      if (type !== 'full') {
        return TE.right(rawDurationInMs)
      }

      return TE.tryCatch(async () => {
        const localeDir = path.join(releaseDirPath, locale)
        const durationsPath = path.join(localeDir, 'clip_durations.tsv')
        const clipsPath = path.join(localeDir, 'clips.tsv')

        // If clip_durations.tsv doesn't exist yet, skip classification.
        if (!fs.existsSync(durationsPath)) {
          logger.warn(
            'PROBLEM-CLIPS',
            `[${locale}] clip_durations.tsv not found, skipping duration filter`,
          )
          return rawDurationInMs
        }

        // Parse clip_durations.tsv — format: two tab-separated columns with header
        // clip	duration[ms]
        // common_voice_en_1234.mp3	6120
        const lines = fs.readFileSync(durationsPath, 'utf-8').split('\n')
        const durationMap = new Map<string, number>()
        for (const line of lines.slice(1)) {
          if (!line.trim()) continue
          const [clip, durationStr] = line.split('\t')
          if (clip && durationStr !== undefined) {
            durationMap.set(clip, Number(durationStr))
          }
        }

        const now = new Date().toISOString()
        let excludedDurationMs = 0
        const excludedClips = new Set<string>()

        for (const [clip, durationMs] of durationMap) {
          if (durationMs === 0) {
            problemClips.push({
              path: clip,
              locale,
              reason: ProblemClipReason.DURATION_ZERO,
              status: 'EXCLUDED',
              timestamp: now,
            })
            excludedClips.add(clip)
          } else if (durationMs > MAX_AUDIO_DURATION_MS) {
            problemClips.push({
              path: clip,
              locale,
              reason: ProblemClipReason.TOO_LONG,
              status: 'EXCLUDED',
              timestamp: now,
            })
            excludedClips.add(clip)
            excludedDurationMs += durationMs
          } else if (durationMs > CLIP_DURATION_WARN_MS) {
            problemClips.push({
              path: clip,
              locale,
              reason: ProblemClipReason.LONG,
              status: 'WARN',
              timestamp: now,
            })
          } else if (durationMs < MIN_AUDIO_DURATION_MS) {
            problemClips.push({
              path: clip,
              locale,
              reason: ProblemClipReason.TOO_SHORT,
              status: 'WARN',
              timestamp: now,
            })
          }
        }

        // Rewrite clips.tsv removing only EXCLUDED clips.
        // The `path` column in clips.tsv is the second column (index 1).
        if (excludedClips.size > 0 && fs.existsSync(clipsPath)) {
          const clipsLines = fs.readFileSync(clipsPath, 'utf-8').split('\n')
          const [header, ...dataLines] = clipsLines
          const filtered = dataLines.filter(line => {
            if (!line.trim()) return false
            const clipFile = line.split('\t')[1]
            return !excludedClips.has(clipFile)
          })
          fs.writeFileSync(
            clipsPath,
            [header, ...filtered].join('\n') + '\n',
            'utf-8',
          )
          logger.info(
            'PROBLEM-CLIPS',
            `[${locale}] Removed ${excludedClips.size} excluded clip(s) from clips.tsv`,
          )
        }

        const correctedDuration = rawDurationInMs - excludedDurationMs
        logger.info(
          'PROBLEM-CLIPS',
          `[${locale}] Duration corrected: ${rawDurationInMs} ms → ${correctedDuration} ms` +
            ` (−${excludedDurationMs} ms from ${excludedClips.size} excluded clip(s))`,
        )

        return correctedDuration
      }, reason => Error(String(reason)))
    }),
  )

// ---------------------------------------------------------------------------
// runPushProblemClips
// ---------------------------------------------------------------------------

/**
 * Full-release step that serialises `env.problemClips` and appends each row to
 * the Redis list `problem-clips-rows:<releaseName>`.
 *
 * The list is a shared accumulator across all pods for this release.
 * `releaseLogger.flushReleaseLogs` reads the list and uploads a TSV snapshot
 * to GCS every 10 locales and at the end of the release.
 *
 * No-op for delta and statistics releases, or when there are no problem clips.
 */
export const runPushProblemClips = (): RTE.ReaderTaskEither<
  AppEnv,
  Error,
  void
> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ type, locale, releaseName, problemClips }) => {
      if (type !== 'full' || problemClips.length === 0) {
        return TE.right(constVoid())
      }

      return TE.tryCatch(async () => {
        const key = redisKeys.problemClips(releaseName)
        const rows = problemClips.map(
          ({ path: p, locale: l, reason, status, timestamp }) =>
            `${p}\t${l}\t${reason}\t${status}\t${timestamp}`,
        )
        await redisClient.rpush(key, ...rows)
        await redisClient.expire(key, RELEASE_LOG_KEY_TTL_SEC)
        logger.info(
          'PROBLEM-CLIPS',
          `[${locale}] Pushed ${rows.length} problem-clip row(s) to Redis`,
        )
      }, err => Error(String(err)))
    }),
  )
