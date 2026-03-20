import * as fs from 'node:fs'
import * as path from 'node:path'
import { createInterface } from 'node:readline'

import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { constVoid, pipe } from 'fp-ts/lib/function'

import { AppEnv, ProblemClipReason } from '../types'
import {
  CLIP_DURATION_WARN_MS,
  MAX_AUDIO_DURATION_MS,
  MIN_AUDIO_DURATION_MS,
  RELEASE_LOG_KEY_TTL_SEC,
  redisKeys,
} from '../config'
import { redisClient } from '../infrastructure/redis'
import { logger } from '../infrastructure/logger'

// ---------------------------------------------------------------------------
// runFilterProblemClips
// ---------------------------------------------------------------------------

/**
 * Full-release step that reads `clip_durations.tsv`, classifies each clip,
 * accumulates problem clips into `env.problemClips`, then for EXCLUDED clips:
 *   1. Rewrites `clips.tsv` to remove them (so they never reach validated/
 *      invalidated/other.tsv or CorporaCreator splits).
 *   2. Deletes the physical mp3 files from `clips/` so they are absent from
 *      the compressed tarball.
 *   3. Rewrites `clip_durations.tsv` to remove their entries so the file
 *      delivered to dataset users reflects only the clean subset.
 * Returns the corrected total duration (raw minus the sum of TOO_LONG durations).
 *
 * No-op for statistics releases only. Runs for full, variants, and delta releases.
 */
export const runFilterProblemClips = (
  rawDurationInMs: number,
): RTE.ReaderTaskEither<AppEnv, Error, number> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ type, locale, releaseDirPath, problemClips }) => {
      // 'statistics' releases produce no tarball -- skip entirely.
      if (type === 'statistics') {
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

        // Parse clip_durations.tsv -- format: two tab-separated columns with header
        // clip	duration[ms]
        // common_voice_en_1234.mp3	6120
        const durationMap = new Map<string, number>()
        {
          const rl = createInterface({
            input: fs.createReadStream(durationsPath, { encoding: 'utf-8' }),
            crlfDelay: Infinity,
          })
          let isHeader = true
          for await (const line of rl) {
            if (isHeader) { isHeader = false; continue }
            if (!line.trim()) continue
            const tab = line.indexOf('\t')
            if (tab < 0) continue
            const clip = line.slice(0, tab)
            const durationStr = line.slice(tab + 1)
            if (clip) {
              durationMap.set(clip, Number(durationStr))
            }
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
              value: 0,
            })
            excludedClips.add(clip)
          } else if (durationMs > MAX_AUDIO_DURATION_MS) {
            problemClips.push({
              path: clip,
              locale,
              reason: ProblemClipReason.TOO_LONG,
              status: 'EXCLUDED',
              timestamp: now,
              value: durationMs,
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
              value: durationMs,
            })
          } else if (durationMs < MIN_AUDIO_DURATION_MS) {
            problemClips.push({
              path: clip,
              locale,
              reason: ProblemClipReason.TOO_SHORT,
              status: 'WARN',
              timestamp: now,
              value: durationMs,
            })
          }
        }

        // Rewrite clips.tsv removing only EXCLUDED clips (streaming).
        // The `path` column in clips.tsv is the second column (index 1).
        if (excludedClips.size > 0 && fs.existsSync(clipsPath)) {
          const tmpPath = clipsPath + '.tmp'
          const rl = createInterface({
            input: fs.createReadStream(clipsPath, { encoding: 'utf-8' }),
            crlfDelay: Infinity,
          })
          const ws = fs.createWriteStream(tmpPath, { encoding: 'utf-8' })
          let writeError: Error | null = null
          ws.on('error', err => { writeError = err })

          let isHeader = true
          for await (const line of rl) {
            if (writeError) break
            if (isHeader) {
              ws.write(line + '\n')
              isHeader = false
              continue
            }
            if (!line.trim()) continue
            const clipFile = line.split('\t')[1]
            if (!excludedClips.has(clipFile)) {
              ws.write(line + '\n')
            }
          }

          await new Promise<void>((resolve, reject) => {
            if (writeError) return reject(writeError)
            ws.on('finish', resolve)
            ws.on('error', reject)
            ws.end()
          })
          await fs.promises.rename(tmpPath, clipsPath)

          logger.info(
            'PROBLEM-CLIPS',
            `[${locale}] Removed ${excludedClips.size} excluded clip(s) from clips.tsv`,
          )
        }

        // Delete excluded mp3 files from disk and rewrite clip_durations.tsv.
        // Both are required so the tarball contains no ghost mp3 files and
        // clip_durations.tsv delivered to users reflects only the clean subset.
        if (excludedClips.size > 0) {
          const clipsDirPath = path.join(localeDir, 'clips')
          let deletedMp3Count = 0
          for (const clip of excludedClips) {
            try {
              await fs.promises.unlink(path.join(clipsDirPath, clip))
              deletedMp3Count++
            } catch {
              // Already absent -- non-fatal.
            }
          }
          if (deletedMp3Count > 0) {
            logger.info(
              'PROBLEM-CLIPS',
              `[${locale}] Deleted ${deletedMp3Count} excluded mp3 file(s) from clips/`,
            )
          }

          // Rewrite clip_durations.tsv in-place: durationMap is already in
          // memory so no second read pass is needed.
          const tmpDurationsPath = durationsPath + '.tmp'
          {
            const dw = fs.createWriteStream(tmpDurationsPath, { encoding: 'utf-8' })
            let dwError: Error | null = null
            dw.on('error', err => { dwError = err })
            dw.write('clip\tduration[ms]\n')
            for (const [clip, durationMs] of durationMap) {
              if (!excludedClips.has(clip)) {
                dw.write(`${clip}\t${durationMs}\n`)
              }
            }
            await new Promise<void>((resolve, reject) => {
              if (dwError) return reject(dwError)
              dw.on('finish', resolve)
              dw.on('error', reject)
              dw.end()
            })
          }
          await fs.promises.rename(tmpDurationsPath, durationsPath)
          logger.info(
            'PROBLEM-CLIPS',
            `[${locale}] Rewrote clip_durations.tsv: removed ${excludedClips.size} excluded entry/entries`,
          )
        }

        const correctedDuration = rawDurationInMs - excludedDurationMs
        if (excludedClips.size === 0) {
          logger.info(
            'PROBLEM-CLIPS',
            `[${locale}] Total locale duration: ${rawDurationInMs} ms (no clips excluded)`,
          )
        } else {
          logger.info(
            'PROBLEM-CLIPS',
            `[${locale}] Total locale duration: ${rawDurationInMs} ms -> ${correctedDuration} ms` +
              ` (excluded ${excludedClips.size} clip(s), -${excludedDurationMs} ms)`,
          )
        }

        return correctedDuration
      }, reason => Error(String(reason)))
    }),
  )

// ---------------------------------------------------------------------------
// runPushProblemClips
// ---------------------------------------------------------------------------

export const PROBLEM_CLIPS_HEADER = 'path\tlocale\treason\tstatus\ttimestamp\tvalue'

/**
 * Full-release step that serialises `env.problemClips` and:
 *   1. Writes a per-locale TSV file to `<releaseDirPath>/logs/`.
 *   2. Appends each row to the Redis list for cross-pod aggregation.
 *
 * The Redis list is read by `releaseLogger.flushReleaseLogs` which uploads a
 * combined TSV snapshot to GCS every N locales and at the end of the release.
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
    RTE.chainTaskEitherK(({ type, locale, releaseName, releaseDirPath, problemClips }) => {
      if ((type !== 'full' && type !== 'variants') || problemClips.length === 0) {
        return TE.right(constVoid())
      }

      return TE.tryCatch(async () => {
        const rows = problemClips.map(
          ({ path: p, locale: l, reason, status, timestamp, value }) =>
            `${p}\t${l}\t${reason}\t${status}\t${timestamp}\t${value ?? ''}`,
        )

        // 1. Write per-locale TSV to local filesystem.
        const logsDir = path.join(releaseDirPath, 'logs')
        await fs.promises.mkdir(logsDir, { recursive: true })
        const tsvContent = [PROBLEM_CLIPS_HEADER, ...rows].join('\n') + '\n'
        const localPath = path.join(logsDir, `problem-clips-${locale}.tsv`)
        await fs.promises.writeFile(localPath, tsvContent, 'utf-8')
        logger.info(
          'PROBLEM-CLIPS',
          `[${locale}] Wrote ${rows.length} problem-clip row(s) to ${localPath}`,
        )

        // 2. Push to Redis for cross-pod aggregation.
        const key = redisKeys.problemClips(releaseName)
        await redisClient.rpush(key, ...rows)
        await redisClient.expire(key, RELEASE_LOG_KEY_TTL_SEC)
        logger.info(
          'PROBLEM-CLIPS',
          `[${locale}] Pushed ${rows.length} problem-clip row(s) to Redis`,
        )
      }, err => Error(String(err)))
    }),
  )
