import PromiseRouter from 'express-promise-router'
import { validateStrict } from '../../lib/validation'
import { createReportHandler } from './handler/create-report-handler'
import { CreateReportRequest } from './validation/create-report-request'

export const reportsRouter = PromiseRouter({ mergeParams: true })
  .post(
    '/',
    validateStrict({ body: CreateReportRequest }),
    createReportHandler
  )