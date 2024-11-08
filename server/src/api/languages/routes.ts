import PromiseRouter from 'express-promise-router'
import { getTranslationsHandler } from './handler/get-translations-handler'
import { validateStrict } from '../../lib/validation'
import { projectSchema } from './validation/project-schema'

export const languagesRouter = PromiseRouter({ mergeParams: true }).get(
  '/translations',
  validateStrict({ query: projectSchema }),
  getTranslationsHandler
)
