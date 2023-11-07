import fs from 'node:fs'
import path from 'node:path'

import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import {
  streamUploadToBucket,
} from '../infrastructure/storage'
import { getDatasetBundlerBucketName, getReleaseName } from '../config/config'

const uploadDatasetToPath = streamUploadToBucket(getDatasetBundlerBucketName())

const uploadDataset = (datasetFilepath: string): TE.TaskEither<Error, string> =>
  pipe(
    TE.Do,
    TE.let('readStream', () => fs.createReadStream(datasetFilepath)),
    TE.let('filename', () => path.basename(datasetFilepath)),
    TE.let('uploadPath', ({ filename }) => `${getReleaseName()}/${filename}`),
    TE.chainFirst(({ readStream, uploadPath }) =>
      uploadDatasetToPath(uploadPath)(readStream),
    ),
    TE.map(({ uploadPath }) => uploadPath),
  )

export const runUpload = (
  datasetFilepath: string,
): TE.TaskEither<Error, string> => pipe(uploadDataset(datasetFilepath))
