import fs from 'node:fs'
import path from 'node:path'

import { pipe } from 'fp-ts/lib/function'
import {readerTaskEither as RTE, taskEither as TE } from 'fp-ts'

import { getDatasetBundlerBucketName } from '../config/config'
import { streamUploadToBucket } from '../infrastructure/storage'
import { AppEnv } from '../types'

const uploadDatasetToPath = streamUploadToBucket(getDatasetBundlerBucketName())

const uploadDataset = (
  datasetFilepath: string,
  releaseName: string,
): TE.TaskEither<Error, string> =>
  pipe(
    TE.Do,
    TE.let('readStream', () => fs.createReadStream(datasetFilepath)),
    TE.let('filename', () => path.basename(datasetFilepath)),
    TE.let('uploadPath', ({ filename }) => `${releaseName}/${filename}`),
    TE.chainFirst(({ readStream, uploadPath }) =>
      uploadDatasetToPath(uploadPath)(readStream),
    ),
    TE.map(({ uploadPath }) => uploadPath),
  )

export const runUpload = (
  datasetTarballFilepath: string,
): RTE.ReaderTaskEither<AppEnv, Error, string> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainTaskEitherK(({ releaseName }) =>
      uploadDataset(datasetTarballFilepath, releaseName),
    ),
  )
