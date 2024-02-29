import crypto from 'node:crypto'
import fs from 'node:fs'
import { spawn } from 'node:child_process'

import { io as IO, taskEither as TE, array as Arr } from 'fp-ts'
import { flow, pipe } from 'fp-ts/lib/function'
import path from 'node:path'

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
    console.log(`Creating ${dirPath}`)
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
    const cc = spawn('wc', ['-l', ...filepaths], {
      shell: true,
    })

    const buffers: Buffer[] = []

    cc.stdout.on('data', data => buffers.push(data))
    cc.stderr.on('data', data => console.log(`${data}`))

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

export const calculateChecksum = (
  filepath: string,
): TE.TaskEither<Error, string> => {
  return TE.tryCatch(
    () =>
      new Promise(resolve => {
        const data = fs.createReadStream(filepath)
        const hash = crypto.createHash('sha256')

        data
          .on('data', (data: Buffer) => hash.update(data))
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

export const rmFilepath =
  (filepath: string): IO.IO<void> =>
  () =>
    fs.rmSync(filepath)
