import * as fs from 'node:fs'
import * as path from 'node:path'
import { pipeline } from 'node:stream/promises'

import * as tar from 'tar'

import { io as IO, readerTaskEither as RTE, taskEither as TE } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'

import { prepareDir } from '../infrastructure/filesystem'
import { CORPORA_CREATOR_SPLIT_FILES } from '../infrastructure/corporaCreator'
import { AppEnv } from '../types'
import { logger } from '../infrastructure/logger'

export const sanitizeLicenseName = (license: string): string => {
  // Replace spaces and special characters with underscores for safe filenames
  return license.replace(/[\s/\\:*?"<>|]/g, '_')
}

export const generateTarFilename = (
  locale: string,
  releaseName: string,
  license?: string,
): string => {
  if (license) {
    const sanitizedLicense = sanitizeLicenseName(license)
    return `${releaseName}-${locale}-${sanitizedLicense}.tar.gz`
  }
  return `${releaseName}-${locale}.tar.gz`
}

const createTarballWriteStream = (outFilepath: string) => {
  return fs.createWriteStream(outFilepath)
}

const tarPromise = async (
  outFilepath: string,
  pathsToCompress: string[],
  cwd: string,
  prefix: string,
) => {
  // Archives are ~94% MP3 (already compressed, ~1% shrink from gzip)
  // and ~6% TSV metadata (compressible). Higher gzip levels burn CPU
  // re-scanning incompressible MP3 bytes for negligible gain:
  //   Level 1: ~15 min for en (1.1M clips), archive ~96.4% of raw
  //   Level 6: ~53 min for en,              archive ~95.8% of raw
  // That's 3.5x slower for 0.6% smaller output. Level 1 everywhere.
  const readStream = tar.c(
    { gzip: { level: 1 }, cwd, prefix },
    pathsToCompress,
  )

  await pipeline(readStream, createTarballWriteStream(outFilepath))
}

const compress =
  (pathsToCompress: string[], cwd: string, prefix: string) =>
  (outFilepath: string): TE.TaskEither<Error, void> =>
    TE.tryCatch(
      () => tarPromise(outFilepath, pathsToCompress, cwd, prefix),
      reason => Error(String(reason)),
    )

export const pathsFilter =
  (releaseType: string) =>
  (filepath: string): boolean => {
    const filename = path.basename(filepath)
    // we never include the generated clips.tsv file
    const clipsTsv = ['clips.tsv']
    const excludeList =
      releaseType === 'full' || releaseType === 'variants'
        ? clipsTsv
        : [...clipsTsv, ...CORPORA_CREATOR_SPLIT_FILES]

    return !excludeList.includes(filename)
  }

const getPathsToAddToTarball =
  (
    locale: string,
    releaseDirPath: string,
    releaseType: string,
  ): IO.IO<string[]> =>
  () => {
    const dir = path.join(releaseDirPath, locale)
    let paths: string[] = []
    try {
      paths = fs.readdirSync(dir, {
        encoding: 'utf-8',
        recursive: false,
      })
    } catch (err) {
      logger.warn('COMPRESS', `Directory for tarball does not exist or is empty: ${dir}`)
      return []
    }
    // Paths are relative to releaseDirPath (used as tar cwd).
    // The tar prefix option prepends releaseName, so the archive entry
    // becomes: releaseName/locale/file --flat regardless of whether the
    // working directory includes a license subdirectory like CC1/.
    const filterFilesForRelease = pathsFilter(releaseType)
    return paths
      .filter(filterFilesForRelease)
      .map((pathS: string) => path.join(locale, pathS))
  }

export const compressPipeline = (
  locale: string,
  releaseName: string,
  releaseDirPath: string,
  releaseTarballDir: string,
  releaseType: string,
  license?: string,
): TE.TaskEither<Error, string> => {
  logger.info('COMPRESS', `[${locale}] Start compress`)
  return pipe(
    TE.Do,
    TE.let('tarballFilename', () =>
      generateTarFilename(locale, releaseName, license),
    ),
    TE.let('tarballFilepath', ({ tarballFilename }) =>
      path.join(releaseTarballDir, tarballFilename),
    ),
    TE.let(
      'paths',
      getPathsToAddToTarball(locale, releaseDirPath, releaseType),
    ),
    TE.chainFirst(() => TE.fromIO(prepareDir(releaseTarballDir))),
    TE.chainFirst(({ tarballFilepath, paths }) => {
      if (!paths || paths.length === 0) {
        return TE.left(
          new Error(
            `No files found to compress for locale ${locale}, skipping tarball creation.`,
          ),
        )
      }
      return compress(paths, releaseDirPath, releaseName)(tarballFilepath)
    }),
    TE.map(({ tarballFilepath }) => tarballFilepath),
  )
}

export const runCompress = (): RTE.ReaderTaskEither<AppEnv, Error, string> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(
      ({
        locale,
        releaseName,
        releaseDirPath,
        releaseTarballsDirPath,
        type,
        license,
      }) =>
        compressPipeline(
          locale,
          releaseName,
          releaseDirPath,
          releaseTarballsDirPath,
          type,
          license,
        ),
    ),
  )
