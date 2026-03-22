import * as path from 'node:path'
import { spawn } from 'node:child_process'
import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { AppEnv } from '../types'
import { getVerbosity, logger } from './logger'
import { createLineStream } from './lineStream'

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
/** Filters tqdm/swifter progress noise from a stderr line */
const isNoiseLine = (line: string): boolean =>
  !line || line.startsWith('Pandas Apply:') || line.startsWith('Dask Apply:')

const runCorporaCreatorPromise = (locale: string, releaseDirPath: string) =>
  new Promise<void>((resolve, reject) => {
    const verbosity = getVerbosity()
    const isLive = verbosity === 'verbose' || verbosity === 'debug'

    const cc = spawn('create-corpora', [
      '-d',
      releaseDirPath,
      '-f',
      path.join(releaseDirPath, locale, 'clips.tsv'),
    ], {
      env: {
        ...process.env,
        // In debug mode, keep tqdm enabled for full subprocess output.
        // Otherwise suppress progress bars that leak through multiprocessing
        // worker stdout, bypassing spawn pipe capture.
        ...(verbosity !== 'debug' ? { TQDM_DISABLE: '1' } : {}),
      },
    })

    // -- stdout handling --
    const stdoutLS = verbosity === 'debug'
      ? createLineStream(line =>
          logger.debug('CC', `[${locale}] stdout: ${line}`),
        )
      : null
    if (stdoutLS) {
      cc.stdout.on('data', (data: Buffer) => stdoutLS.feed(data))
    } else {
      // Drain stdout to prevent pipe buffer from filling and blocking the child.
      cc.stdout.resume()
    }

    // -- stderr handling --
    const stderrLS = isLive
      ? createLineStream(line => {
          const clean = line.replace(/\r/g, '')
          if (!isNoiseLine(clean)) {
            logger.debug('CC', `[${locale}] ${clean}`)
          }
        })
      : null

    if (isLive) {
      cc.stderr.on('data', (data: Buffer) => stderrLS!.feed(data))

      cc.on('close', (code, signal) => {
        stdoutLS?.flush()
        stderrLS!.flush()
        if (code !== 0 || signal) {
          logger.error(
            'CC',
            `[${locale}] create-corpora exited with code ${code}${signal ? ` signal ${signal}` : ''}`,
          )
        }
        resolve()
      })
    } else {
      // quiet/normal: buffer stderr, only surface on failure.
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
        if (code !== 0 || signal) {
          const lines = stderrBuf
            .split('\n')
            .flatMap(l => l.split('\r'))
            .map(l => l.trim())
            .filter(l => !isNoiseLine(l))
          if (lines.length > 0) {
            logger.warn('CC', `[${locale}] ${lines[0]}`)
            if (lines.length > 1) {
              logger.warn('CC', `[${locale}] ... (${lines.length - 1} more lines)`)
              logger.warn('CC', `[${locale}] ${lines[lines.length - 1]}`)
            }
          }
          logger.error(
            'CC',
            `[${locale}] create-corpora exited with code ${code}${signal ? ` signal ${signal}` : ''}`,
          )
        }
        resolve()
      })
    }

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
