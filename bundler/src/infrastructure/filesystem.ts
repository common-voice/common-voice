import * as crypto from 'node:crypto'
import * as fs from 'node:fs'
import { spawn } from 'node:child_process'

import { io as IO, taskEither as TE, array as Arr } from 'fp-ts'
import { flow, pipe } from 'fp-ts/lib/function'
import * as path from 'node:path'
import { logger } from './logger'

const trimSpaces = (str: string) => str.trim()
const splitOnSpace = (str: string) => str.split(' ')
const isNotEmptyString = (str: string) => str !== ''

export type LineCounts = Record<string, number>

/**
 * Creates a directory at the specified path if it does not already exist.
 *
 * @param dirPath - The path of the directory to create.
 * @returns A function that creates the directory.
 */
export const prepareDir =
  (dirPath: string): IO.IO<void> =>
  () => {
    logger.debug('FS', `Creating ${dirPath}`)
    fs.mkdirSync(dirPath, { recursive: true })
  }

/**
 * Counts the number of lines in the given filepaths.
 *
 * @remarks
 * The `wc -l` command prints a `total` value when you give it more than
 * one filepath. Since we're not interested in the `total` value, it's omitted
 * from the final result.
 *
 * @param filepaths - An array of filepaths to count lines from.
 * @returns A promise that resolves to a record of file names and their corresponding line counts.
 */
const countLinesPromise = (filepaths: string[]) =>
  new Promise<LineCounts>((resolve, reject) => {
    // Filter to only existing files to avoid wc errors
    const existingFilepaths = filepaths.filter(fp => {
      try {
        fs.accessSync(fp)
        return true
      } catch {
        return false
      }
    })

    if (existingFilepaths.length === 0) {
      resolve({})
      return
    }

    const cc = spawn('wc', ['-l', ...existingFilepaths])

    const buffers: Buffer[] = []

    cc.stdout.on('data', data => buffers.push(data))
    cc.stderr.on('data', data => logger.warn('WC', String(data).trimEnd()))

    cc.on('close', () => {
      const result = pipe(
        Buffer.concat(buffers).toString('utf-8').split('\n'),
        Arr.filter(isNotEmptyString),
        Arr.map(flow(trimSpaces, splitOnSpace)),
        Arr.reduce({}, (acc: LineCounts, [count, filepath]) => {
          return filepath === 'total'
            ? acc
            : { ...acc, ...{ [path.basename(filepath)]: Number(count) } }
        }),
      )

      resolve(result)
    })
    cc.on('error', reason => reject(reason))
  })

export type ConcatFilesOptions = {
  skipFirstLine: boolean
}

const concatFilesPromise = (
  inFilepath: string,
  outFilepath: string,
  options: { skipFirstLine: boolean } = { skipFirstLine: false },
) =>
  new Promise<void>((resolve, reject) => {
    const args = ['-n', options.skipFirstLine ? '+2' : '+1', inFilepath]
    const cc = spawn('tail', args)

    const writeStream = fs.createWriteStream(outFilepath, { flags: 'a' })

    cc.stdout.pipe(writeStream)
    cc.stderr.on('data', data => logger.warn('TAIL', String(data).trimEnd()))

    writeStream.on('finish', () => resolve())
    cc.on('error', reason => reject(reason))
  })

export const calculateChecksum = (
  filepath: string,
): TE.TaskEither<Error, string> => {
  return TE.tryCatch(
    () =>
      new Promise(resolve => {
        const data = fs.createReadStream(filepath)
        const hash = crypto.createHash('sha256')

        data
          .on('data', chunk => hash.update(chunk))
          .on('close', () => resolve(hash.digest('hex')))
      }),
    reason => Error(String(reason)),
  )
}

export const getFileSize =
  (filepath: string): IO.IO<number> =>
  () => {
    const filestats = fs.statSync(filepath)
    return filestats.size
  }

export const countLines = (filepaths: string[]) =>
  TE.tryCatch(
    () => countLinesPromise(filepaths),
    reason => Error(String(reason)),
  )

export const concatFiles = (
  inFilepath: string,
  outFilepath: string,
  options?: ConcatFilesOptions,
) =>
  TE.tryCatch(
    () => concatFilesPromise(inFilepath, outFilepath, options),
    reason => Error(String(reason)),
  )

export const rmFilepath =
  (filepath: string): IO.IO<void> =>
  () =>
    fs.rmSync(filepath)
