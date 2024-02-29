import { spawn } from 'node:child_process'

import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { log } from 'fp-ts/lib/Console'

import { getTmpDir } from '../config/config'

const runExtractTarPromise = (outDir: string, filepath: string) =>
  new Promise<void>((resolve, reject) => {
    const cc = spawn('tar', ['-C', outDir, '-xf', filepath], {
      shell: true,
    })

    cc.on('close', () => resolve())
    cc.on('error', reason => reject(reason))
  })

export const extractTar = (filepath: string) => {
  return pipe(
    TE.Do,
    TE.let('outDir', getTmpDir),
    TE.tap(() => TE.fromIO(log(`Extracting ${filepath} ...`))),
    TE.chain(({ outDir }) =>
      TE.tryCatch(
        () => runExtractTarPromise(outDir, filepath),
        reason => Error(String(reason)),
      ),
    ),
    TE.tap(() => TE.fromIO(log(`Finished extracting ${filepath}`))),
  )
}
