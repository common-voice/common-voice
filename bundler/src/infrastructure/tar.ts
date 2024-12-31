import { spawn } from 'node:child_process'

import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { log } from 'fp-ts/lib/Console'

const runExtractTarPromise = (filepath: string, outDir: string) =>
  new Promise<void>((resolve, reject) => {
    const cc = spawn('tar', ['-C', outDir, '-xf', filepath], {
      shell: true,
    })

    cc.on('close', () => resolve())
    cc.on('error', reason => reject(reason))
  })

export const extractTar = (filepath: string, outDir: string) => {
  return pipe(
    TE.Do,
    TE.tap(() => TE.fromIO(log(`Extracting ${filepath} ...`))),
    TE.chain(() =>
      TE.tryCatch(
        () => runExtractTarPromise(filepath, outDir),
        reason => Error(String(reason)),
      ),
    ),
    TE.tap(() => TE.fromIO(log(`Finished extracting ${filepath}`))),
  )
}
