import * as path from 'node:path'
import { spawn } from 'node:child_process'
import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { AppEnv } from '../types'
import { logger } from './logger'

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

    // Buffer stdout -- CC emits tqdm progress bars and per-split status lines.
    // Log only the final line when the process exits to avoid clutter.
    let lastStdoutLine = ''
    cc.stdout.on('data', (data: Buffer) => {
      const raw = data.toString().trimEnd()
      if (!raw) return
      // tqdm uses \r for in-place updates; keep only the final state per chunk
      const parts = raw.split('\r')
      const last = parts[parts.length - 1].trim()
      if (last) lastStdoutLine = last
    })

    // Buffer stderr -- pandas.apply and other warnings produce many lines.
    // Log only first + last to avoid clutter. Cap at 64 KB to prevent OOM.
    const MAX_STDERR = 64 * 1024
    let stderrBuf = ''
    let stderrTruncated = false
    cc.stderr.on('data', (data: Buffer) => {
      if (stderrTruncated) return
      stderrBuf += data.toString()
      if (stderrBuf.length > MAX_STDERR) {
        stderrBuf = stderrBuf.slice(0, MAX_STDERR)
        stderrTruncated = true
      }
    })

    cc.on('close', (code, signal) => {
      // Log final stdout line (last tqdm state or summary)
      if (lastStdoutLine) {
        logger.info('CC', `[${locale}] ${lastStdoutLine}`)
      }

      const lines = stderrBuf
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)
      if (lines.length > 0) {
        const level = code === 0 && !signal ? 'info' : 'warn'
        logger[level]('CC', `[${locale}] ${lines[0]}`)
        if (lines.length > 1) {
          logger[level]('CC', `[${locale}] ${lines[lines.length - 1]}`)
        }
      }
      if (code !== 0 || signal) {
        logger.error('CC', `[${locale}] create-corpora exited with code ${code}${signal ? ` signal ${signal}` : ''}`)
      }
      // Always resolve -- caller handles missing output files.
      // The error is logged above for diagnostics.
      resolve()
    })
    cc.on('error', reason => reject(reason))
  })

export const corporaCreatorPipeline = (
  locale: string,
  releaseDirPath: string,
) => {
  return pipe(
    TE.Do,
    TE.tap(() =>
      TE.fromIO(() => logger.info('CC', `[${locale}] START create-corpora`)),
    ),
    TE.chain(() =>
      TE.tryCatch(
        () => runCorporaCreatorPromise(locale, releaseDirPath),
        reason => Error(String(reason)),
      ),
    ),
    TE.tap(() =>
      TE.fromIO(() => logger.info('CC', `[${locale}] FINISH create-corpora`)),
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
