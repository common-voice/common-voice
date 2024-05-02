import { Request, Response } from 'express'
import { pipe } from 'fp-ts/lib/function'
import * as Id from 'fp-ts/Identity'
import { StatusCodes } from 'http-status-codes'
import { GetSentencesForReviewQueryHandler } from '../../../application/sentences/use-case/query-handler/get-sentences-for-review-query-handler'
import { GetSentencesForReviewQuery } from '../../../application/sentences/use-case/query-handler/query/get-sentences-for-review-query'
import { fetchUserClientVariants } from '../../../application/sentences/variants/repository/user-client-variants-repository'
import { findSentencesForReviewInDb } from '../../../application/sentences/repository/sentences-repository'

export default async (req: Request, res: Response) => {
  const query: GetSentencesForReviewQuery = {
    localeId: +req.query.localeId,
    clientId: req.client_id || '',
  }

  const getSentencesForReview = pipe(
    GetSentencesForReviewQueryHandler,
    Id.ap(fetchUserClientVariants),
    Id.ap(findSentencesForReviewInDb)
  )

  const result = await getSentencesForReview(query)()

  return res.status(StatusCodes.OK).json({ pendingSentences: result })
}
