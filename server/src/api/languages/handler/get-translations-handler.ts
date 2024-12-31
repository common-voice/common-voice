import { Request, Response } from 'express'
import { pipe } from 'fp-ts/function'
import { GetLocaleMessagesQuery as GetTranslationsQuery } from '../../../application/locales/use-case/query/get-locale-messages-query'
import { getLocaleMessagesQueryHandler as getTranslationsQueryHandler } from '../../../application/locales/use-case/query-handler/get-locale-messages-query-handler'
import { isProject } from '../../../core/types/project'

export const getTranslationsHandler = async (req: Request, res: Response) => {
  const project = isProject(req.query?.project)
    ? req.query.project
    : 'common-voice'

  const query: GetTranslationsQuery = {
    locale: req.params.locale,
    project,
  }

  const result = pipe(query, getTranslationsQueryHandler)
  return res.send(result)
}
