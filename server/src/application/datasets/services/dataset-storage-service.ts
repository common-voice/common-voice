import { taskEither as TE, task as T } from 'fp-ts'
import { getConfig } from '../../../config-helper'
import {
  doesFileExistInBucket,
  downloadFileFromBucket,
} from '../../../infrastructure/storage/storage'
import { DatasetSplits } from '../../../core/datasets/types/dataset'
import { pipe } from 'fp-ts/lib/function'
import { log } from 'fp-ts/lib/Console'
import { local } from 'fp-ts/lib/Reader'

const BUCKET_NAME = getConfig().DATASET_BUCKET_NAME
const downloadFromDatasetsBucket = downloadFileFromBucket(BUCKET_NAME)
const doesFileExistInDatasetsBucket = doesFileExistInBucket(BUCKET_NAME)

const getDatasetStatisticsPath = (releaseDir: string) =>
  `stats/${releaseDir}.json`

export const doesFileExistInDatasetBucket = (filepath: string) =>
  pipe(
    filepath,
    doesFileExistInDatasetsBucket,
    TE.getOrElse(() => T.of(false))
  )

const mapDataset = (locale: string, filepath: string, releaseDir: string) =>
  pipe(
    TE.Do,
    TE.bind('datasetStatsBuffer', () => downloadFromDatasetsBucket(filepath)),
    TE.let('datasetStats', ({ datasetStatsBuffer }) =>
      JSON.parse(datasetStatsBuffer.toString('utf-8'))
    ),
    TE.map(({ datasetStats }) => {
      const { locales } = datasetStats
      const localeSplit = locales[locale].splits
      
      return {
        [releaseDir]: {
          gender: localeSplit.gender,
          age: localeSplit.age,
        },
      }
    })
  )

export const fetchDatasetSplits =
  (locale: string) =>
  (releaseDir: string): TE.TaskEither<Error, Record<string, DatasetSplits>> => {
    return pipe(
      TE.Do,
      TE.let('filepath', () => getDatasetStatisticsPath(releaseDir)),
      TE.bind('doesDatasetStatsFileExist', ({ filepath }) =>
        TE.fromTask(doesFileExistInDatasetBucket(filepath))
      ),
      TE.chain(({ filepath, doesDatasetStatsFileExist }) =>
        doesDatasetStatsFileExist
          ? mapDataset(locale, filepath, releaseDir)
          : TE.right({})
      )
    )
  }
