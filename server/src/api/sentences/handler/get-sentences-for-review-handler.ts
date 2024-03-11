import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { GetSentencesForReviewQueryHandler } from '../../../application/sentences/use-case/query-handler/get-sentences-for-review-query-handler'
import { GetSentencesForReviewQuery } from '../../../application/sentences/use-case/query-handler/query/get-sentences-for-review-query'
import lazyCache from '../../../lib/lazy-cache'
import { createHash } from '../../../core/crypto/crypto'

export default async (req: Request, res: Response) => {
  const query: GetSentencesForReviewQuery = {
    localeId: +req.query.localeId,
    clientId: req.client_id || '',
  }

  const clientIdHash = createHash('sha256')(query.clientId)

  const result = await lazyCache(
    `get-sentences-for-review-${clientIdHash}`,
    GetSentencesForReviewQueryHandler(query),
    60 * 1000
  )()

  return res.status(StatusCodes.OK).json({ pendingSentences: result })
}
