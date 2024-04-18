import { Request, Response } from 'express'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as O from 'fp-ts/Option'
import * as I from 'fp-ts/Identity'
import { pipe } from 'fp-ts/function'
import { AddSentenceCommandHandler } from '../../../application/sentences/use-case/command-handler/add-sentence-command-handler'
import { AddSentenceCommand } from '../../../application/sentences/use-case/command-handler/command/add-sentence-command'
import {
  SentenceRepositoryErrorKind,
  SentenceValidationErrorKind,
} from '../../../application/types/error'
import { createPresentableError } from '../../../application/helper/error-helper'
import { StatusCodes } from 'http-status-codes'
import { validateSentence } from '../../../core/sentences'
import {
  findDomainIdByNameInDb,
  saveSentenceInDb,
} from '../../../application/sentences/repository/sentences-repository'
import { findVariantByTagInDb } from '../../../application/sentences/repository/variant-repository'
import { getAllLocales } from '../../../application/sentences/repository/locale-repository'

export default async (req: Request, res: Response) => {
  const { sentence, localeName, source, domains, variant } = req.body

  const command: AddSentenceCommand = {
    clientId: req.client_id,
    sentence: sentence,
    localeName: localeName,
    source: source,
    domains: domains,
    variant: O.fromNullable(variant),
  }

  const cmdHandler = pipe(
    AddSentenceCommandHandler,
    I.ap(validateSentence),
    I.ap(findDomainIdByNameInDb),
    I.ap(findVariantByTagInDb),
    I.ap(getAllLocales),
    I.ap(saveSentenceInDb)
  )

  return pipe(
    command,
    cmdHandler,
    TE.mapLeft(createPresentableError),
    TE.match(
      err => {
        switch (err.kind) {
          case SentenceRepositoryErrorKind: {
            return T.of(res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err))
          }
          case SentenceValidationErrorKind:
            return T.of(res.status(StatusCodes.BAD_REQUEST).json(err))
        }
      },
      () =>
        T.of(
          res.json({
            message: 'Sentence added successfully',
          })
        )
    )
  )()
}
