import { spawn } from 'node:child_process'
import path from 'node:path'

import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { log } from 'fp-ts/lib/Console'

import { AppEnv } from '../types'

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
const runMp3DurationReporterPromise = (locale: string, releaseDirPath: string) =>
  new Promise<number>((resolve, reject) => {
    const cc = spawn(
      'mp3-duration-reporter',
      [path.join(releaseDirPath, locale, 'clips')],
      {
        shell: true,
      },
    )

    let totalDurationInMs = 0

    cc.stdout.on('data', data => (totalDurationInMs = Number(data)))
    cc.stderr.on('data', data => console.log(`${data}`))

    cc.on('close', () => resolve(totalDurationInMs))
    cc.on('error', reason => reject(reason))
  })

export const mp3DurationReporterPipeline = (locale: string, releaseDirPath: string) => {
  return pipe(
    TE.Do,
    TE.tap(() => TE.fromIO(log('Starting mp3-duration-reporter'))),
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
    RTE.chainTaskEitherK(({ locale, releaseDirPath }) => mp3DurationReporterPipeline(locale, releaseDirPath)),
  )
