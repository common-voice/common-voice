import { spawn } from 'node:child_process'
import { getReleaseBasePath } from '../config/config'
import path from 'node:path'
import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { log } from 'fp-ts/lib/Console'

export const CorporaCreaterFiles = [
  'validated.tsv',
  'invalidated.tsv',
  'dev.tsv',
  'test.tsv',
  'train.tsv',
  'other.tsv',
] as const

export type CorporaCreaterFile = (typeof CorporaCreaterFiles)[number]

/**
 * Runs the create-corpora command to generate corpora for the specified locale.
 * It creates the following files:
 * - validated.tsv
 * - invalidated.tsv
 * - dev.tsv
 * - test.tsv
 * - train.tsv
 * - other.tsv
 *
 * @param locale - The locale for which to generate corpora.
 * @returns A promise representing the result of running the create-corpora command.
 */
const runCorporaCreatorPromise = (locale: string) =>
  new Promise<void>((resolve, reject) => {
    const cc = spawn('create-corpora', [
      '-d',
      path.join(getReleaseBasePath()),
      '-f',
      path.join(getReleaseBasePath(), locale, 'clips.tsv'),
    ])

    cc.stdout.on('data', data => console.log(`${data}`))
    cc.stderr.on('data', data => console.log(`${data}`))

    cc.on('close', () => resolve())
    cc.on('error', reason => reject(reason))
  })

export const runCorporaCreator = (locale: string) => {
  return pipe(
    TE.Do,
    TE.tap(() => TE.fromIO(log('Starting create-corpora for locale ' + locale))),
    TE.chain(() =>
      TE.tryCatch(
        () => runCorporaCreatorPromise(locale),
        reason => Error(String(reason)),
      ),
    ),
    TE.tap(() => TE.fromIO(log('Finished create-corpora for locale ' + locale))),
  )
}
