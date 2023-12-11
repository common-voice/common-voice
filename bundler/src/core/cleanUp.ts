import fs from 'node:fs/promises'
import path from 'node:path'

import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

import { AppEnv } from '../types'
import { getTmpDir } from '../config/config'
import { generateTarFilename } from './compress'

export const cleanUp = (
  locale: string,
  releaseDirPath: string,
  tarFilepath: string,
  prevReleaseName: string,
) => {
  return TE.tryCatch(
    async () => {
      await fs.rm(path.join(releaseDirPath, locale), { recursive: true })
      await fs.rm(tarFilepath, { recursive: true })
      await fs.rm(path.join(getTmpDir(), `${locale}_clips.tsv`))
      await fs.rm(path.join(getTmpDir(), prevReleaseName), { recursive: true})
      await fs.rm(path.join(getTmpDir(), generateTarFilename(locale, prevReleaseName)))
    },
    (err: unknown) => Error(String(err)),
  )
}

export const runCleanUp = (
  tarFilepath: string,
  prevReleaseName: string
): RTE.ReaderTaskEither<AppEnv, Error, void> => {
  return pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ locale, releaseDirPath }) =>
      cleanUp(locale, releaseDirPath, tarFilepath, prevReleaseName),
    ),
  )
}
