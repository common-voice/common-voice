import { spawn } from 'node:child_process'
import path from 'node:path'
import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { log } from 'fp-ts/lib/Console'
import { AppEnv } from '../types'

export const CORPORA_CREATOR_SPLIT_FILES = [
  'dev.tsv',
  'test.tsv',
  'train.tsv',
] as const

export const CORPORA_CREATOR_CLIP_SPLIT_FILES = [
  'validated.tsv',
  'invalidated.tsv',
  'other.tsv',
] as const

export const CORPORA_CREATOR_FILES = [
  ...CORPORA_CREATOR_SPLIT_FILES,
  ...CORPORA_CREATOR_CLIP_SPLIT_FILES,
] as const

export const isCorporaCreatorFile = (
  filename: string,
): filename is CorporaCreaterFile =>
  CORPORA_CREATOR_FILES.includes(filename as CorporaCreaterFile)

export type CorporaCreaterFile = (typeof CORPORA_CREATOR_FILES)[number]

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
const runCorporaCreatorPromise = (locale: string, releaseDirPath: string) =>
  new Promise<void>((resolve, reject) => {
    const cc = spawn('create-corpora', [
      '-d',
      releaseDirPath,
      '-f',
      path.join(releaseDirPath, locale, 'clips.tsv'),
    ])

    cc.stdout.pipe(process.stdout)
    cc.stderr.pipe(process.stderr)

    cc.on('close', () => resolve())
    cc.on('error', reason => reject(reason))
  })

export const corporaCreatorPipeline = (
  locale: string,
  releaseDirPath: string,
) => {
  return pipe(
    TE.Do,
    TE.tap(() =>
      TE.fromIO(log('Starting create-corpora for locale ' + locale)),
    ),
    TE.chain(() =>
      TE.tryCatch(
        () => runCorporaCreatorPromise(locale, releaseDirPath),
        reason => Error(String(reason)),
      ),
    ),
    TE.tap(() =>
      TE.fromIO(log('Finished create-corpora for locale ' + locale)),
    ),
  )
}

export const runCorporaCreator = (): RTE.ReaderTaskEither<
  AppEnv,
  Error,
  void
> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ locale, releaseDirPath }) =>
      corporaCreatorPipeline(locale, releaseDirPath),
    ),
  )
