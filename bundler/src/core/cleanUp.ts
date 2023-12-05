import fs from 'node:fs/promises'
import path from 'node:path'

import { readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

import { AppEnv } from '../types'

export const cleanUp = (
  locale: string,
  releaseDirPath: string,
  tarFilepath: string,
) => {
  return TE.tryCatch(
    async () => {
      await fs.rm(path.join(releaseDirPath, locale), { recursive: true })
      await fs.rm(tarFilepath, { recursive: true })
    },
    (err: unknown) => Error(String(err)),
  )
}

export const runCleanUp = (
  tarFilepath: string,
): RTE.ReaderTaskEither<AppEnv, Error, void> => {
  return pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ locale, releaseDirPath }) =>
      cleanUp(locale, releaseDirPath, tarFilepath),
    ),
  )
}
