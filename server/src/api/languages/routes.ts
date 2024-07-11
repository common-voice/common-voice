import PromiseRouter from 'express-promise-router'
import { getTranslationsHandler } from './handler/get-translations-handler'

export const languagesRouter = PromiseRouter({ mergeParams: true }).get(
  '/translations',
  getTranslationsHandler
)
