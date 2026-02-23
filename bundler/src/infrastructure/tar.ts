import { spawn } from 'node:child_process'

import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

const runExtractTarPromise = (filepath: string, outDir: string) =>
  new Promise<void>((resolve, reject) => {
    const cc = spawn('tar', ['-C', outDir, '-xf', filepath])

    const stderrChunks: string[] = []
    cc.stderr.on('data', data => stderrChunks.push(String(data)))

    cc.on('close', code => {
      if (code !== 0) {
        reject(new Error(`tar exited with code ${code}: ${stderrChunks.join('')}`))
      } else {
        resolve()
      }
    })
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
