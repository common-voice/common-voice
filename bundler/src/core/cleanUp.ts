import * as fs from 'node:fs/promises'
import * as path from 'node:path'

import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { constVoid, pipe } from 'fp-ts/lib/function'

import { AppEnv } from '../types'
import { getEnvironment, getTmpDir } from '../config'
import { generateTarFilename } from './compress'

export const cleanUp = (
  locale: string,
  releaseDirPath: string,
  tarFilepath: string,
  prevReleaseName?: string,
  deltaReleaseName?: string,
  license?: string,
) => {
  return TE.tryCatch(
    async () => {
      const tmpDir = getTmpDir()
      // Locale working directory (clips, TSVs, datasheets)
      await fs.rm(path.join(releaseDirPath, locale), { recursive: true, force: true })
      // Output tarball (may not exist on error path)
      if (tarFilepath) {
        await fs.rm(tarFilepath, { recursive: true, force: true })
      }
      // Tmp clips metadata TSV from DB query
      await fs.rm(path.join(tmpDir, `${locale}_clips.tsv`), { force: true })

      // Previous release: extracted directory + partially downloaded tarball
      if (prevReleaseName) {
        await fs.rm(path.join(tmpDir, prevReleaseName), {
          recursive: true,
          force: true,
        })
        const prevTar = generateTarFilename(locale, prevReleaseName, license)
        await fs.rm(path.join(tmpDir, prevTar), { force: true })
      }

      // Delta release: extracted directory + partially downloaded tarball
      if (deltaReleaseName) {
        await fs.rm(path.join(tmpDir, deltaReleaseName, locale), {
          recursive: true,
          force: true,
        })
        const deltaTar = generateTarFilename(locale, deltaReleaseName, license)
        await fs.rm(path.join(tmpDir, deltaTar), { force: true })
      }
    },
    (err: unknown) => Error(String(err)),
  )
}

export const runCleanUp = (
  tarFilepath: string,
): RTE.ReaderTaskEither<AppEnv, Error, void> => {
  const isLocal = getEnvironment() === 'local'
  return isLocal
    ? RTE.right(constVoid())
    : pipe(
        RTE.ask<AppEnv>(),
        RTE.chainTaskEitherK(
          ({ locale, releaseDirPath, previousReleaseName, deltaReleaseName, license }) =>
            cleanUp(locale, releaseDirPath, tarFilepath, previousReleaseName, deltaReleaseName, license),
        ),
      )
}
