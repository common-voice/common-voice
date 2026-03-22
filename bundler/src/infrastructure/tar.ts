import { spawn } from 'node:child_process'
import { Readable } from 'node:stream'

import { taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

import { getVerbosity, logger } from './logger'

const runExtractTarPromise = (filepath: string, outDir: string) =>
  new Promise<void>((resolve, reject) => {
    const verbosity = getVerbosity()
    const cc = spawn('tar', ['-C', outDir, '-xf', filepath])

    const stderrChunks: string[] = []
    cc.stderr.on('data', (data: Buffer) => {
      const chunk = String(data)
      stderrChunks.push(chunk)
      // In verbose/debug mode, stream stderr live for visibility
      if (verbosity === 'verbose' || verbosity === 'debug') {
        for (const line of chunk.split('\n')) {
          if (line.trim()) logger.debug('TAR', line.trim())
        }
      }
    })

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
  includePatterns: string[],
) =>
  new Promise<void>((resolve, reject) => {
    const args = [
      '-xzf', '-',
      '-C', outDir,
      `--strip-components=${stripComponents}`,
    ]
    if (includePatterns.length > 0) {
      args.push('--wildcards')
      args.push(...includePatterns)
    }
    const proc = spawn('tar', args)

    const verbosity = getVerbosity()
    const stderrChunks: string[] = []
    proc.stderr.on('data', (data: Buffer) => {
      const chunk = String(data)
      stderrChunks.push(chunk)
      if (verbosity === 'verbose' || verbosity === 'debug') {
        for (const line of chunk.split('\n')) {
          if (line.trim()) logger.debug('TAR', line.trim())
        }
      }
    })

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
      const stderr = stderrChunks.join('')
      // GNU tar exits 2 when --wildcards patterns match nothing (e.g. delta
      // tar has an empty clips/ dir). This is not a real error -- it just
      // means there were no files to extract.
      // "Not found in archive" -- specific named members (tar -x file.tar foo)
      // "Pattern not matched" -- wildcard patterns matching nothing (our case)
      const isEmptyWildcardMatch =
        includePatterns.length > 0 &&
        code === 2 &&
        (stderr.includes('Not found in archive') || stderr.includes('Pattern not matched'))
      if (code !== 0 && !isEmptyWildcardMatch) {
        reject(
          new Error(
            `tar (stream) exited with code ${code}: ${stderr}`,
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

/**
 * Streams a .tar.gz from a Readable directly through `tar -xzf -`.
 *
 * @param includePatterns - optional glob patterns passed to `tar --wildcards`
 *   to restrict extraction (e.g. `['*\/clips\/*']` to skip TSV/text files).
 *   Patterns match BEFORE --strip-components is applied.
 */
export const streamExtractTar = (
  inputStream: Readable,
  outDir: string,
  stripComponents = 1,
  includePatterns: string[] = [],
) =>
  TE.tryCatch(
    () =>
      runStreamExtractTarPromise(
        inputStream,
        outDir,
        stripComponents,
        includePatterns,
      ),
    reason => Error(String(reason)),
  )
