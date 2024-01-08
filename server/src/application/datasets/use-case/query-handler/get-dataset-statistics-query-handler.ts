import { taskEither as TE } from 'fp-ts'
import Model from '../../../../lib/model'
import { DatasetStatistics } from '../../../../core/datasets/types/dataset'
import { pipe } from 'fp-ts/lib/function'
import { fetchDatasetSplits } from '../../services/dataset-storage-service'
import { GetDatasetStatisticsQuery } from './query/get-dataset-statistics-query'
import { createDatasetError } from '../../../helper/error-helper'
import { ApplicationError } from '../../../types/error'

const model = new Model()

const getLanguageDatasetStats = (locale: string) =>
  TE.tryCatch(
    () => model.getLanguageDatasetStats(locale),
    (reason: unknown) => Error(String(reason))
  )

const getDatasetStatisticsFile = (
  locale: string
): TE.TaskEither<ApplicationError, DatasetStatistics[]> =>
  pipe(
    TE.Do,
    TE.bind('languageDataset', () => getLanguageDatasetStats(locale)),
    TE.let('releaseDirs', ({ languageDataset }) =>
      languageDataset
        .map(dataset => dataset.release_dir)
        .filter(releaseDir => !releaseDir.includes('delta'))
    ),
    TE.bind('datasetSplits', ({ releaseDirs }) => {
      return pipe(releaseDirs, TE.traverseArray(fetchDatasetSplits(locale)))
    }),
    TE.map(({ languageDataset, datasetSplits }) => {
      const allSplits = datasetSplits.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      )
      return languageDataset.map(ld => ({
        ...ld,
        splits: allSplits[ld.release_dir],
      }))
    }),
    TE.mapLeft(err =>
      createDatasetError('Could not retrieve dataset statistics', err)
    )
  )

export const getDatasetStatisticsQueryHandler = (
  query: GetDatasetStatisticsQuery
) => getDatasetStatisticsFile(query.locale)
