import * as path from 'node:path'
import { spawn } from 'node:child_process'

import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

import { AppEnv } from '../types'
import { logger } from './logger'

export const Mp3DurationFiles = ['clip_durations.tsv'] as const

export type Mp3DurationFile = (typeof Mp3DurationFiles)[number]

/**
 * Runs the mp3-duration-reporter command to calculate the duration of MP3 files for the specified locale.
 * It creates the `clip_durations.tsv` file, which contains all the clips with their corresponding duration
 * in ms.
 *
 * @param locale - The locale for which to calculate the duration.
 * @returns A Promise that resolves when the duration calculation is complete.
 */
const runMp3DurationReporterPromise = (
  locale: string,
  releaseDirPath: string,
) =>
  new Promise<number>((resolve, reject) => {
    const cc = spawn(
      'mp3-duration-reporter',
      [path.join(releaseDirPath, locale, 'clips')],
      { env: { ...process.env, NO_COLOR: '1' } },
    )

    let totalDurationInMs = 0
    let errorCount = 0
    // stderr arrives in arbitrary chunks that may split across lines or
    // contain multiple lines. Buffer partial lines and count per-line.
    let stderrPartial = ''

    cc.stdout.on('data', data => (totalDurationInMs = Number(data)))
    cc.stderr.on('data', data => {
      stderrPartial += String(data)
      const parts = stderrPartial.split('\n')
      // Last element is either '' (line ended with \n) or a partial line
      stderrPartial = parts.pop()!
      for (const raw of parts) {
        const line = raw.replace(/\x1b\[[0-9;]*m/g, '').trim()
        if (!line) continue
        if (line.includes('ERROR')) {
          errorCount++
        } else {
          logger.debug('MP3-DURATION', line)
        }
      }
    })

    cc.on('close', () => {
      // Flush any remaining partial line
      if (stderrPartial.trim()) {
        const line = stderrPartial.replace(/\x1b\[[0-9;]*m/g, '').trim()
        if (line.includes('ERROR')) errorCount++
      }
      if (errorCount > 0) {
        logger.warn(
          'MP3-DURATION',
          `[${locale}] CORRUPT_AUDIO: ${errorCount} truncated/corrupt MP3 files (excluded as DURATION_ZERO in problem-clips)`,
        )
      }
      resolve(totalDurationInMs)
    })
    cc.on('error', reason => reject(reason))
  })

export const mp3DurationReporterPipeline = (
  locale: string,
  releaseDirPath: string,
) => {
  logger.info('MP3-DURATION', `[${locale}] Starting mp3-duration-reporter`)
  return pipe(
    TE.Do,
    TE.chain(() =>
      TE.tryCatch(
        () => runMp3DurationReporterPromise(locale, releaseDirPath),
        reason => Error(String(reason)),
      ),
    ),
  )
}

export const runMp3DurationReporter = (): RTE.ReaderTaskEither<
  AppEnv,
  Error,
  number
> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ locale, releaseDirPath }) =>
      mp3DurationReporterPipeline(locale, releaseDirPath),
    ),
  )
