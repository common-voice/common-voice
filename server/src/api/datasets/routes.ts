import PromiseRouter from 'express-promise-router'
import { getDatasetStatisticsHandler } from './handler/get-dataset-statistics-handler'

export const datasetRouter = PromiseRouter({ mergeParams: true }).get(
  '/:languageCode',
  getDatasetStatisticsHandler
)
