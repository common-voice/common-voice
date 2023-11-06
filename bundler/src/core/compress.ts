import crypto from 'node:crypto'
import fs from 'node:fs'
import tar from 'tar'
import { io as IO, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import path from 'node:path'
import { prepareDir } from '../infrastructure/filesystem'
import {
  getReleaseBasePath,
  getReleaseName,
  getReleaseTarballsDirPath,
} from '../config/config'

const generateTarFilename = (locale: string) =>
  `${getReleaseName()}-${locale}.tar.gz`

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
  (locale: string): IO.IO<string[]> =>
  () => {
    const dir = path.join(getReleaseBasePath(), locale)
    const paths = fs.readdirSync(dir, {
      encoding: 'utf-8',
      recursive: false,
    })
    // we don't want to include the generated clips.tsv
    return paths
      .filter((path: string) => !path.endsWith('clips.tsv'))
      .map((pathS: string) => path.join(getReleaseName(), locale, pathS))
  }

export const runCompress = (locale: string): TE.TaskEither<Error, void> => {
  console.log('Start compress step')
  return pipe(
    TE.Do,
    TE.let('tarballDirPath', () => getReleaseTarballsDirPath()),
    TE.let('tarOutFilename', () => generateTarFilename(locale)),
    TE.bind('paths', () => TE.fromIO(getPathsToAddToTarball(locale))),
    TE.chainFirst(({ tarballDirPath }) =>
      TE.fromIO(prepareDir(tarballDirPath)),
    ),
    TE.chain(({ tarballDirPath, tarOutFilename, paths }) =>
      compress(paths)(path.join(tarballDirPath, tarOutFilename)),
    ),
  )
}
