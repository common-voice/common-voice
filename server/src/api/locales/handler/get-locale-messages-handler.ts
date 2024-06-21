import { Request, Response } from 'express'
import { pipe } from 'fp-ts/function'
import { GetLocaleMessagesQuery } from '../../../application/locales/use-case/query/get-locale-messages-query'
import { getLocaleMessagesQueryHandler } from '../../../application/locales/use-case/query-handler/get-locale-messages-query-handler'

export const getLocaleMessagesHandler = async (req: Request, res: Response) => {
  const query: GetLocaleMessagesQuery = {
    locale: req.params.locale,
  }

  console.log('Im here')
  const result = pipe(query, getLocaleMessagesQueryHandler)
  return res.send(result)
}
