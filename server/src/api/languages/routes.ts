import PromiseRouter from 'express-promise-router'
import { getTranslationsHandler } from './handler/get-translations-handler'
import { validateStrict } from '../../lib/validation'
import { GetTranslationsRequest } from './validation/get-translations-requests'

export const languagesRouter = PromiseRouter({ mergeParams: true }).get(
  '/translations',
  validateStrict({ query: GetTranslationsRequest }),
  getTranslationsHandler
)
