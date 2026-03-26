import * as path from 'node:path'
import { spawn } from 'node:child_process'
import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { AppEnv } from '../types'
import { getVerbosity, logger } from './logger'
import { createLineStream } from './lineStream'
import { readProcMemory, getNodeMemSummary } from './resources'

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
/** Filters progress noise from a stderr line */
const isNoiseLine = (line: string): boolean => !line

const MEM_LOG_INTERVAL_MS = 30_000

const runCorporaCreatorPromise = (locale: string, releaseDirPath: string) =>
  new Promise<void>((resolve, reject) => {
    const verbosity = getVerbosity()
    const isLive = verbosity === 'verbose' || verbosity === 'debug'

    // Force V8 garbage collection before spawning CC to reclaim stale heap
    // from earlier pipeline steps (e.g. clip download arrays). Requires
    // --expose-gc on the Node CLI; silently skipped if unavailable.
    if (global.gc) {
      const before = process.memoryUsage()
      global.gc()
      const after = process.memoryUsage()
      const freed = ((before.heapUsed - after.heapUsed) / 1024 / 1024).toFixed(0)
      logger.info('CC', `[${locale}] GC before spawn: freed ${freed}MB heap (${getNodeMemSummary()})`)
    }

    // Build CC args -- pass verbosity flag so CC emits its own log messages.
    // CC uses Python logging: -v = INFO, -vv = DEBUG.
    const ccArgs = [
      '-d', releaseDirPath,
      '-f', path.join(releaseDirPath, locale, 'clips.tsv'),
    ]
    if (verbosity === 'debug') ccArgs.push('-vv')
    else if (verbosity === 'verbose') ccArgs.push('-v')

    const cc = spawn('create-corpora', ccArgs, {
      env: {
        ...process.env,
        // CC v1.5.0+ (polars) has no tqdm dependency, but keep the flag
        // so older CC installs still suppress progress bars.
        ...(verbosity !== 'debug' ? { TQDM_DISABLE: '1' } : {}),
      },
    })

    // -- periodic memory watchdog (debug level) --
    // Logs Node + CC RSS every 30s so we can trace memory growth leading up
    // to an OOM kill. These lines flush to stdout immediately, so even if the
    // pod is killed, the most recent entries (up to 30s before death) survive
    // in the log aggregator.
    const memTimer = isLive
      ? setInterval(() => {
          const ccMem = cc.pid ? readProcMemory(cc.pid) : 'no-pid'
          logger.debug(
            'CC',
            `[${locale}] MEM node(${getNodeMemSummary()}) cc(${ccMem})`,
          )
        }, MEM_LOG_INTERVAL_MS)
      : null

    // -- stdout handling --
    // CC logs to stdout (Python logging.basicConfig stream=sys.stdout).
    // Capture in verbose and debug modes so CC's info/debug messages are visible.
    const stdoutLS = isLive
      ? createLineStream(line =>
          logger.info('CC', `[${locale}] ${line}`),
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
          if (!isNoiseLine(line)) {
            logger.debug('CC', `[${locale}] stderr: ${line}`)
          }
        })
      : null

    if (isLive) {
      cc.stderr.on('data', (data: Buffer) => stderrLS!.feed(data))

      cc.on('close', (code, signal) => {
        if (memTimer) clearInterval(memTimer)
        stdoutLS?.flush()
        stderrLS!.flush()
        // Final memory snapshot after CC exits
        logger.debug('CC', `[${locale}] EXIT node(${getNodeMemSummary()})`)
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
        if (memTimer) clearInterval(memTimer)
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

    cc.on('error', reason => {
      if (memTimer) clearInterval(memTimer)
      reject(reason)
    })
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
