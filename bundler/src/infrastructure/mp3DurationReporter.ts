import { spawn } from 'node:child_process'
import { getReleaseBasePath } from '../config/config'
import path from 'node:path'
import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { log } from 'fp-ts/lib/Console'

export const Mp3DurationFiles = ['clip_durations.tsv'] as const

export type Mp3DurationFile = (typeof Mp3DurationFiles)[number]

/**
 * Runs the mp3-duration-reporter command to calculate the duration of MP3 files for the specified locale.
 * It creates the `clip_durations.tsv` file, which contains all the clips with their coresponding duration
 * in ms.
 *
 * @param locale - The locale for which to calculate the duration.
 * @returns A Promise that resolves when the duration calculation is complete.
 */
const runMp3DurationReporterPromise = (locale: string) =>
  new Promise<number>((resolve, reject) => {
    const cc = spawn(
      'mp3-duration-reporter',
      [path.join(getReleaseBasePath(), locale, 'clips')],
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

export const runMp3DurationReporter = (locale: string) => {
  return pipe(
    TE.Do,
    TE.tap(() => TE.fromIO(log('Starting mp3-duration-reporter'))),
    TE.chain(() =>
      TE.tryCatch(
        () => runMp3DurationReporterPromise(locale),
        reason => Error(String(reason)),
      ),
    ),
  )
}
