import { spawn } from 'node:child_process'

import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

const runExtractTarPromise = (filepath: string, outDir: string) =>
  new Promise<void>((resolve, reject) => {
    const cc = spawn('tar', ['-C', outDir, '-xf', filepath])

    cc.on('close', () => resolve())
    cc.on('error', reason => reject(reason))
  })

export const extractTar = (filepath: string, outDir: string) => {
  return pipe(
    TE.Do,
    TE.chainFirst(() =>
      TE.tryCatch(
        () => runExtractTarPromise(filepath, outDir),
        reason => Error(String(reason)),
      ),
    ),
  )
}
