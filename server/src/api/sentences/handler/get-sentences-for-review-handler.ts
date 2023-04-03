import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { GetPendingSentenceQueryHandler } from '../../../application/sentences/use-case/query-handler/get-sentences-for-review-query-handler'
import { GetSentencesForReviewQuery } from '../../../application/sentences/use-case/query-handler/query/get-sentences-for-review-query'

export default async (req: Request, res: Response) => {
  const query: GetSentencesForReviewQuery = {
    localeId: +req.query.localeId,
    clientId: req.client_id || '',
  }

  const result = await GetPendingSentenceQueryHandler(query)()

  res.status(StatusCodes.OK).json({ pendingSentences: result })
}
