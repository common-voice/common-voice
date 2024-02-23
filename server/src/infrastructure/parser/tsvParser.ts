import { parse } from 'csv-parse'
import { Readable } from 'stream'
import { taskEither as TE } from 'fp-ts'

export type ReadTsvIntoMemory = <T>(readable: Readable) => TE.TaskEither<Error, T[]>

export const readTsvIntoMemory: ReadTsvIntoMemory = <T>(readable: Readable): TE.TaskEither<Error, T[]> => {
  return TE.tryCatch(
    () =>
      new Promise((res, rej) => {
        const records: T[] = []
        const tsvParser = parse({ delimiter: '\t', columns: true, quote: false })

        tsvParser.on('data', chunk => {
          records.push(chunk)
        })

        tsvParser.on('end', () => {
          res(records)
        })

        tsvParser.on('error', err => {
          rej(err)
        })

        readable.pipe(tsvParser)
      }),
    (err: Error) => err
  )
}
