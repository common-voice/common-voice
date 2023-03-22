import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { GetPendingSentenceQueryHandler } from '../../../application/sentences/use-case/query-handler/get-pending-sentence-query-handler'
import { GetPendingSentencesQuery } from '../../../application/sentences/use-case/query-handler/query/get-pending-sentences-query'

export default async (req: Request, res: Response) => {
  const query: GetPendingSentencesQuery = {
    localeId: +req.query.localeId,
    clientId: req.client_id || '',
  }

  const result = await GetPendingSentenceQueryHandler(query)()

  res.status(StatusCodes.OK).json({ pendingSentences: result })
}
