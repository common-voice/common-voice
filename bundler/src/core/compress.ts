import fs from 'node:fs'
import tar from 'tar'
import { io as IO, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import path from 'node:path'
import { prepareDir } from '../infrastructure/filesystem'
import * as RTE from 'fp-ts/readerTaskEither'
import { AppEnv } from '../types'

const generateTarFilename = (locale: string, releaseName: string) =>
  `${releaseName}-${locale}.tar.gz`

const createTarballWriteStream = (outFilepath: string) => {
  return fs.createWriteStream(outFilepath)
}

const tarPromise = (outFilepath: string, pathsToCompress: string[]) =>
  new Promise<void>((resolve, reject) => {
    tar
      .c({ gzip: true }, pathsToCompress)
      .pipe(createTarballWriteStream(outFilepath))
      .on('finish', () => {
        resolve()
      })
      .on('error', () => reject())
  })

const compress =
  (pathsToCompress: string[]) =>
  (outFilepath: string): TE.TaskEither<Error, void> =>
    TE.tryCatch(
      () => tarPromise(outFilepath, pathsToCompress),
      reason => Error(String(reason)),
    )

const getPathsToAddToTarball =
  (
    locale: string,
    releaseName: string,
    releaseBasePath: string,
  ): IO.IO<string[]> =>
  () => {
    const dir = path.join(releaseBasePath, locale)
    const paths = fs.readdirSync(dir, {
      encoding: 'utf-8',
      recursive: false,
    })
    // we don't want to include the generated clips.tsv
    return paths
      .filter((path: string) => !path.endsWith('clips.tsv'))
      .map((pathS: string) => path.join(releaseName, locale, pathS))
  }

const compressPipeline = (
  locale: string,
  releaseName: string,
  releaseBasePath: string,
  releaseTarballDir: string,
): TE.TaskEither<Error, string> => {
  console.log('Start compress step')
  return pipe(
    TE.Do,
    TE.let('tarballFilename', () => generateTarFilename(locale, releaseName)),
    TE.let('tarballFilepath', ({ tarballFilename }) =>
      path.join(releaseTarballDir, tarballFilename),
    ),
    TE.let(
      'paths',
      getPathsToAddToTarball(locale, releaseName, releaseBasePath),
    ),
    TE.chainFirst(() => TE.fromIO(prepareDir(releaseTarballDir))),
    TE.chainFirst(({ tarballFilepath, paths }) =>
      compress(paths)(tarballFilepath),
    ),
    TE.map(({ tarballFilepath }) => tarballFilepath),
  )
}

export const runCompress = (): RTE.ReaderTaskEither<AppEnv, Error, string> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(
      ({ locale, releaseName, releaseDirPath, releaseTarballsDirPath }) =>
        compressPipeline(
          locale,
          releaseName,
          releaseDirPath,
          releaseTarballsDirPath,
        ),
    ),
  )
