import { Request, Response } from 'express'
import { pipe } from 'fp-ts/function'
import { GetLocaleMessagesQuery as GetTranslationsQuery } from '../../../application/locales/use-case/query/get-locale-messages-query'
import { getLocaleMessagesQueryHandler as getTranslationsQueryHandler } from '../../../application/locales/use-case/query-handler/get-locale-messages-query-handler'

export const getTranslationsHandler = async (req: Request, res: Response) => {
  const query: GetTranslationsQuery = {
    locale: req.params.locale,
  }

  const result = pipe(query, getTranslationsQueryHandler)
  return res.send(result)
}
