import { spawn } from 'node:child_process'
import { Readable } from 'node:stream'

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

// -- Stream extraction --------------------------------------------------------

/**
 * Pipes a Readable (e.g. a GCS download stream) directly through
 * `tar -xzf -` so the .tar.gz never lands on disk.
 *
 * --strip-components removes the leading release-name directory from each
 * entry so clips land in the correct working directory regardless of which
 * release the tarball was built from.
 */
const runStreamExtractTarPromise = (
  inputStream: Readable,
  outDir: string,
  stripComponents: number,
) =>
  new Promise<void>((resolve, reject) => {
    const proc = spawn('tar', [
      '-xzf', '-',
      '-C', outDir,
      `--strip-components=${stripComponents}`,
    ])

    const stderrChunks: string[] = []
    proc.stderr.on('data', (data: Buffer) => stderrChunks.push(String(data)))

    let settled = false
    const fail = (err: Error) => {
      if (settled) return
      settled = true
      inputStream.destroy()
      proc.kill()
      reject(err)
    }

    proc.on('close', code => {
      if (settled) return
      settled = true
      if (code !== 0) {
        reject(
          new Error(
            `tar (stream) exited with code ${code}: ${stderrChunks.join('')}`,
          ),
        )
      } else {
        resolve()
      }
    })
    proc.on('error', fail)

    // Pipe the download stream into tar's stdin.
    inputStream.pipe(proc.stdin)
    inputStream.on('error', (err: Error) => {
      proc.stdin.destroy()
      fail(new Error(`Download stream error: ${err.message}`))
    })
    // Suppress EPIPE if tar exits before the download finishes.
    proc.stdin.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code !== 'EPIPE') fail(err as Error)
    })
  })

export const streamExtractTar = (
  inputStream: Readable,
  outDir: string,
  stripComponents = 1,
) =>
  TE.tryCatch(
    () => runStreamExtractTarPromise(inputStream, outDir, stripComponents),
    reason => Error(String(reason)),
  )
