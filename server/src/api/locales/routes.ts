import PromiseRouter from 'express-promise-router'
import { getLocaleMessagesHandler } from './handler/get-locale-messages-handler'

export const localeRouter = PromiseRouter({ mergeParams: true }).get(
  '/:locale/messages',
  getLocaleMessagesHandler
)
