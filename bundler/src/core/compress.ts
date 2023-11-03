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

const createTarballWriteStream = (locale: string) => {
  const filename = `${getReleaseName()}-${locale}.tar.gz`
  return fs.createWriteStream(path.join(getReleaseTarballsDirPath(), filename))
}

const tarPromise = (locale: string, pathsToCompress: string[]) =>
  new Promise<void>((resolve, reject) => {
    tar
      .c({ gzip: true,}, pathsToCompress)
      .pipe(createTarballWriteStream(locale))
      .on('finish', () => {
        resolve()
      })
      .on('error', () => reject())
  })

const compress =
  (locale: string) =>
  (pathsToCompress: string[]): TE.TaskEither<Error, void> =>
    TE.tryCatch(
      () => tarPromise(locale, pathsToCompress),
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
    return paths.filter((path: string) => !path.endsWith('clips.tsv')).map((pathS: string) => path.join(getReleaseName(), locale, pathS))
  }

export const runCompress = (locale: string): TE.TaskEither<Error, void> => {
  console.log('Start compress step')
  return pipe(
    TE.Do,
    TE.bind('paths', () => TE.fromIO(getPathsToAddToTarball(locale))),
    TE.bind('tarballPath', () => TE.fromIO(getReleaseTarballsDirPath)),
    TE.chainFirst(({ tarballPath }) => TE.fromIO(prepareDir(tarballPath))),
    TE.chain(({ paths }) => compress(locale)(paths)),
  )
}
