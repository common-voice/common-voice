import fs from 'node:fs'
import path from 'node:path'

import tar from 'tar'

import { io as IO, taskEither as TE } from 'fp-ts'
import * as RTE from 'fp-ts/readerTaskEither'
import { pipe } from 'fp-ts/lib/function'

import { prepareDir } from '../infrastructure/filesystem'
import { CORPORA_CREATOR_SPLIT_FILES } from '../infrastructure/corporaCreator'
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

const pathsFilter =
  (releaseType: string) =>
  (filepath: string): boolean => {
    const filename = path.basename(filepath)
    // we never include the generated clips.tsv file
    const clipsTsv = ['clips.tsv']
    const excludeList =
      releaseType === 'full'
        ? clipsTsv
        : [...clipsTsv, ...CORPORA_CREATOR_SPLIT_FILES]

    return !excludeList.includes(filename)
  }

const getPathsToAddToTarball =
  (
    locale: string,
    releaseName: string,
    releaseBasePath: string,
    releaseType: string,
  ): IO.IO<string[]> =>
  () => {
    const dir = path.join(releaseBasePath, locale)
    const paths = fs.readdirSync(dir, {
      encoding: 'utf-8',
      recursive: false,
    })

    const filterFilesForRelease = pathsFilter(releaseType)

    return paths
      .filter(filterFilesForRelease)
      .map((pathS: string) => path.join(releaseName, locale, pathS))
  }

const compressPipeline = (
  locale: string,
  releaseName: string,
  releaseBasePath: string,
  releaseTarballDir: string,
  releaseType: string,
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
      getPathsToAddToTarball(locale, releaseName, releaseBasePath, releaseType),
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
      ({ locale, releaseName, releaseDirPath, releaseTarballsDirPath, type }) =>
        compressPipeline(
          locale,
          releaseName,
          releaseDirPath,
          releaseTarballsDirPath,
          type,
        ),
    ),
  )
