import { Request, Response } from 'express'
import { pipe } from 'fp-ts/function'
import { taskEither as TE, task as T } from 'fp-ts'
import { StatusCodes } from 'http-status-codes'
import { createPresentableError } from '../../../application/helper/error-helper'
import { GetDatasetStatisticsQuery } from '../../../application/datasets/use-case/query-handler/query/get-dataset-statistics-query'
import { getDatasetStatisticsQueryHandler } from '../../../application/datasets/use-case/query-handler/get-dataset-statistics-query-handler'

export const getDatasetStatisticsHandler = async (
  req: Request,
  res: Response
) => {
  const query: GetDatasetStatisticsQuery = {
    locale: req.params.languageCode,
  }

  return pipe(
    query,
    getDatasetStatisticsQueryHandler,
    TE.mapLeft(createPresentableError),
    TE.fold(
      err => T.of(res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)),
      datasetStatistics => T.of(res.json(datasetStatistics))
    )
  )()
}
